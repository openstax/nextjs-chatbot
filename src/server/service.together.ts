import { getConfigValue } from './config'
import { InferenceMessage, InferenceContext } from '@/lib/types'
import { countWords } from '@/lib/string'
import { buildPrompt, cleanMessageContent, PROMPT_INST_SUFFIX } from './prompts'
class CompletedError extends Error {  }

// using vs @microsoft/fetch-event-source' until https://github.com/Azure/fetch-event-source/pull/28#issuecomment-1421976714
import { fetchEventSource } from 'fetch-event-source-hperrin'

const MAX_ATTEMPTS = 3

type Chunk = {
    choices: { text: string }[]
    error?: string
    generated_text?: string
    token: {
        id: string
        logprob: number
        special?: boolean
    }
}

const MAX_PROMPT_WORD_LENGTH = 3000

function messageForPrompt<M extends InferenceMessage>(m: M) {
    if (m.isBot) {
        return m.content
    }
    return `[INST] ${m.content}\n [/INST]`
}

function promptForTranscript(ctx: InferenceContext) {
    const messages = [...ctx.transcript]
    let prompt = ''
    do {
        prompt = buildPrompt(ctx, ctx.transcript.length == 0) + messages.map(messageForPrompt).join('\n\n') + PROMPT_INST_SUFFIX
        messages.splice(0, 2);  // Remove the first two messages
    } while (countWords(prompt) > MAX_PROMPT_WORD_LENGTH)
    return prompt
}

const inputOnOpen: any = () => null // eslint-disable-line

export async function requestInference(ctx: InferenceContext) {

    const prompt = promptForTranscript(ctx)

    const token = await getConfigValue('together-ai-api-token')
    const controller = new AbortController()
    let content = ''
    let attempts = 0
    fetchEventSource('https://api.together.xyz/api/inference', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        inputOnOpen, // needed bc sometimes together sends invalid content-type header of application/json vs streaming
        signal: controller.signal,
        body: JSON.stringify({
            prompt: ctx.message,
            model: ctx.model,
            prompt_format_string: prompt,
            max_tokens: 768,
            temperature: 0.7,
            top_p: 0.7,
            type: 'chat',
            stop: ['</s>:', '[INST'],
            top_k: 50,
            repetition_penalty: 1,
            stream_tokens: true,
        }),
        onmessage(chunk) {
            console.log(chunk)

            if (chunk.data == '[DONE]') {
                ctx.onComplete({ content: content.trim() })
                controller.abort()
                throw new CompletedError()
            }

            const msg = JSON.parse(chunk.data) as Chunk
            if (msg.error) {
                ctx.onComplete({ error: msg.error })
                return
            }
            const chunkTxt = msg.choices[0]?.text || ''

            if (msg.token.special && msg.generated_text) { // "special" is an end of message chunk that may contain the complete message
                content = msg.generated_text
            } else {
                content += content.length ? chunkTxt : chunkTxt.trimStart()
            }
            content = cleanMessageContent(content)

            ctx.onProgress(content)
        },
        onerror(err) {
            if (attempts > MAX_ATTEMPTS || err instanceof CompletedError) {
                throw err // do not retry
            } else {
                attempts += 1
            }
        },
        onclose() {
            if (content.length) { // we've got at least some content
                ctx.onComplete({ content })
            }
        }
    }).catch(err => {
        if (err instanceof CompletedError) {
            return
        } else {
            console.warn("ERROR", err)
        }
    })

    return controller
}

