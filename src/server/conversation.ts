import { inferenceForChat } from './service'
import { Chat, Message, createdAtCompare, messagesForChatId } from './data'
import type { SavedChatModel, MessageModel, SavedMessageModel } from './data'
import type { TranscriptMessage, ChatWithFirstMessage, ChatMessageReply } from '@/lib/types'
import { setUsageTime } from './user'
import { RequestContext } from './request-context'


export async function addMessageToChat(ctx: RequestContext)  {
    const chat = await( ctx.chatId ?
        Chat.get({ id: ctx.chatId }) :
        Chat.create({ model: ctx.model, userId: ctx.user.uuid }) )

    if (!chat?.id) throw new Error(`Conversation for ${ctx.chatId} was not found`)

    setUsageTime(ctx.user.uuid, ctx.secondsActive)

    const c = chat as SavedChatModel

    const metadata = { chatId: c.id, topic: ctx.topic, subject: ctx.subject, orn: ctx.orn, secondsActive: ctx.secondsActive }
    await Message.create({ content: ctx.message, ...metadata })
    const botMsg = await Message.create({ content: '', isBot: true, ...metadata }) as SavedMessageModel

    await inferenceForChat(c, botMsg, ctx)
    return c
}

export async function leaveFeedbackForMessage(messageId: string, feedback: string) {
    return await Message.update({ id: messageId }, {
        set: { feedback: feedback }
    })
}

export async function likeMessage(messageId: string) {
    return await Message.update({ id: messageId }, {
        set: { liked: true }
    })
}

export async function dislikeMessage(messageId: string) {
    return await Message.update({ id: messageId }, {
        set: { disliked: true }
    })
}

export function messageForTranscript(msg: MessageModel): TranscriptMessage {
    return {
        chatId: msg.chatId,
        id: msg.id || '',
        content: msg.content,
        isBot: !!msg.isBot,
        occurred: msg.created?.toISOString() || '',
        feedback: msg.feedback,
        liked: !!msg.liked,
        disliked: !!msg.disliked
    }
}

export async function findChat(chatId: string) {
    const chat = await Chat.get({ id: chatId })
    if (!chat?.id) throw new Error(`Conversation for ${chatId} was not found`)

    return chat as SavedChatModel
}

export async function chatTranscript(chatId: string) {
    const messages = await messagesForChatId(chatId)
    return messages.map(messageForTranscript)
}


export async function chatWithTranscript(chatId: string) {
    const chat = await findChat(chatId)
    return {
        ...chat,

        transcript: await chatTranscript(chat.id)
    } as ChatMessageReply
}

export async function chatsBetweenDates(start: Date, end: Date) {

    let next: any = null
    const chats: ChatWithFirstMessage[] = []

    do {
        const allChats = await Chat.scan({}, { fields: ['id', 'created'] })
        for (const chat of allChats) {
            if (chat.created && chat.created >= start && chat.created <= end) {
                const c: SavedChatModel = chat as any
                const msgs = await Message.find({ chatId: c.id }, { index: 'gs1', fields: ['content', 'created'] })
                msgs.sort(createdAtCompare)
                chats.push({
                    id: c.id,
                    occurred: c.created?.toISOString() || '',
                    message: msgs[0]?.content || '',
                })
            }
        }
        next = allChats.next
    } while (next)
//    chats.sort(createdAtCompare)
    return chats

}
