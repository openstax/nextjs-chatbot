import {
    leaveFeedbackForMessage, likeMessage, dislikeMessage, findChat, chatTranscript, chatsBetweenDates,
} from "./conversation"
import { getUserAndLocationFromContext, UnAuthorized, getUserUUIDFromContext } from './authentication'
import { User, SavedChatModel } from './data'
import { userEligibility, createUser, setUsageTime } from './user'

async function getAuthorizedChat(chatId: string) {
    const { user: authUser } = getUserAndLocationFromContext()
    const chat = await findChat(chatId)
    if (authUser.uuid != chat.userId) {
        throw UnAuthorized('invalid chat')
    }
    return chat
}

async function chatWithTranscript(chat: SavedChatModel) {
    return {
        ...chat,
        transcript: await chatTranscript(chat.id)
    }
}


// exported function for use with telefunc
export async function onAdminFetchChatWithTranscript(chatId: string) {
    return chatWithTranscript(
        await findChat(chatId)
    )
}

export async function onFetchChatWithTranscript(chatId: string) {
    return chatWithTranscript(
        await getAuthorizedChat(chatId)
    )
}

export async function onLeaveFeedback({ chatId, messageId, feedback }: { chatId: string, messageId: string, feedback: string }) {
    const chat = await getAuthorizedChat(chatId)
    await leaveFeedbackForMessage(messageId, feedback)
    return chatWithTranscript(chat)
}

export async function onSurveyComplete(surveyId: string) {
    const userId = getUserUUIDFromContext()
    if (userId) {
        await User.update({id: userId}, {
            set: { surveysGiven: 'list_append(if_not_exists(surveysGiven, @{emptyList}), @{surveyId})' },
            substitutions: { surveyId: [surveyId], emptyList: [] }
        })
    }
}

export async function onLikeMessage({ chatId, messageId }: { chatId: string, messageId: string }) {
    const chat = await getAuthorizedChat(chatId)
    await likeMessage(messageId)
    return chatWithTranscript(chat)
}

export async function onDislikeMessage({ chatId, messageId }: { chatId: string, messageId: string }) {
    const chat = await getAuthorizedChat(chatId)
    await dislikeMessage(messageId)
    return chatWithTranscript(chat)
}

export async function onUserEligibility() {
    const { user: authUser, userLocation } = getUserAndLocationFromContext()
    return await userEligibility(authUser.uuid, userLocation)
}

export async function onUserVerification({
    monthYearOfBirth, acceptedTOU,
}: {
    monthYearOfBirth: string, acceptedTOU: boolean,
}) {
    const { user: authUser, userLocation } = getUserAndLocationFromContext()

    const dbUser = await createUser({
        id: authUser.uuid,
        monthYearOfBirth,
        acceptedTOU
    })
    return await userEligibility(dbUser.id, userLocation)
}

export async function onAdminChatsBetween({ startDate, endDate }: { startDate: Date, endDate: Date }) {
    return {
        chats: await chatsBetweenDates(startDate, endDate),
    }
}
