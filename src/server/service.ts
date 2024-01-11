import { InferenceContext } from '@/lib/types'
import { messagesForChatId, SavedChatModel, SavedMessageModel, Message } from './data'
import { RequestContext } from './request-context'

export const requestInference = async (ctx: InferenceContext) => {
    let requestInference: null | ((ctx: InferenceContext) => Promise<AbortController | void>) = null

    if (ctx.model == 'self-hosted' || ctx.model == 'quiz') {
        requestInference = (await import('./service.fastchat')).requestInference
    } else if (ctx.model.match(/^openai/)) {
        requestInference = (await import('./service.openai')).requestInference
    } else if (ctx.model.match(/^together/)) {
        requestInference = (await import('./service.together')).requestInference
    }
    if (!requestInference) {
        throw new Error(`unknown model ${ctx.model} requested`)
    }
    return await requestInference(ctx)
}


export type PromiseifiedInferenceContext = Omit<InferenceContext, 'onProgress' | 'onComplete'>

export const infer = async (ctx: PromiseifiedInferenceContext): Promise<string> => {
    return new Promise(onComplete => {
        requestInference({
            ...ctx,
            onProgress() {  }, // eslint-disable-line
            onComplete(msg) {
                onComplete(msg.content || '')
            },
        })
    })
}


export async function inferenceForChat(
     chat: SavedChatModel, botMessage: SavedMessageModel, ctx: RequestContext,
) {
    const transcript = (await messagesForChatId(chat.id)).slice(0, -2)

    return requestInference({
        ...ctx,
        transcript,
        onComplete(msg) {
            if (msg.content) {
                botMessage.content = msg.content
                Message.update(botMessage)
            }
            ctx.onComplete()
        },
        onProgress(content) {
            botMessage.content = content
            Message.update(botMessage)
            ctx.onProgress({ msgId: botMessage.id, content, isPending: true })
        }
    })

}
