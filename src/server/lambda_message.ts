import { APIGatewayProxyEventV2 } from 'aws-lambda'
import type {Writable}  from 'node:stream'
import { addMessageToChat, chatTranscript } from './conversation.js'
import { RequestContext } from './request-context.js'
import type { MessageSendContext } from '@/lib/types'
import cookie from 'cookie'
import { getUserFromCookie } from './authentication'
import { sentryLambdaWrapper } from './sentry'

const { awslambda } = (global as any)

async function lambdaHandler(
  event: APIGatewayProxyEventV2,
  responseStream: Writable
): Promise<void> {

    const ctx = JSON.parse(event.body || '') as MessageSendContext
    const metadata = {
        statusCode: 200,
        headers: {
            "Connection": "keep-alive",
            "Cache-Control": "no-cache",
            "Content-Type": "text/event-stream",
        }
    };

    responseStream = awslambda.HttpResponseStream.from(responseStream, metadata);

    const stream = (json: any) => {
        responseStream.write('data: ' + JSON.stringify(json) + '\n\n')
    }

    const user = await getUserFromCookie(cookie.parse(event.headers.cookie || ''))
    if (!user) {
        throw new Error('unauthorized, invalid user')
    }

    const chat = await addMessageToChat(new RequestContext(
        (updated) => stream(updated),
        (content) => {
            if (content) stream (content)
            responseStream.end()
        },
        { ...ctx, user }
    ))

    stream({
        id: chat.id,
        transcript: await chatTranscript(chat.id)
    })

}

export const handler = awslambda.streamifyResponse(sentryLambdaWrapper(lambdaHandler as any))
