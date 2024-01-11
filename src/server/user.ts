import { SavedUserModel, User, Chat, Message } from '@/server/data';
import { getUserAge } from '@/lib/util';
import { getCookieUser } from './authentication'
import type { UserEligibilityReply, ChatbotUser, UserLocation, ChatbotUserRecord } from '@/lib/types'
import {  BETA_AUTHORIZED_USERS } from '../lib/beta-authorized-users'
import * as Sentry from '@sentry/serverless'

export async function findUser(id: string): Promise<ChatbotUserRecord | null> {
    const foundUser = await User.get({ id })
    if (foundUser?.id) {
        return {
            secondsActive: 0,
            acceptedTOU: false,
            monthYearOfBirth: '',
            created: new Date,
            ...foundUser,
        } satisfies ChatbotUserRecord
    }
    return null
}

export type createUserArgs = {
    id: string,
    monthYearOfBirth?: string,
    acceptedTOU?: boolean,
}
export async function createUser(args: createUserArgs): Promise<SavedUserModel> {
    return await User.create(args) as SavedUserModel
}

export function isUserOldEnough(user: SavedUserModel, isDelaware: boolean) {
    if (!user.monthYearOfBirth) return 0
    const yearsOld = getUserAge(user.monthYearOfBirth)
    if (isDelaware) return yearsOld >= 18
    return yearsOld >= 16
}

export async function userEligibility(userId: string, userLocation: UserLocation): Promise<UserEligibilityReply> {
    const isDelaware = userLocation.region === 'Delaware'
    const isUsResident = userLocation.country === 'US'

    if (!BETA_AUTHORIZED_USERS.has(userId) || !isUsResident) {
        return {
            eligibility: 'INELIGIBLE'
        }
    }

    const userRecord = await findUser(userId)

    if (!userRecord) {
        return {
            eligibility: 'NEEDS_VERIFICATION',
        }
    }
    const chats = await Chat.find({ userId }, { index: 'gs1' })
    const chatIds = chats.map(c => c.id)
    let messageCount = 0
    if (chatIds.length) {
        const msgs = await Message.scan({},  { // n.b. the count: true means that msgs will ONLY have the count attribute
            where: '${chatId} IN (@{...chatId})',
            substitutions: { chatId: chatIds },
            index: 'gs1', count: true
        })
        messageCount = msgs.count || 0
    }

    const user: ChatbotUser = {
        ...userRecord,
        messageCount,
    } 

    if (!isUserOldEnough(user, isDelaware)) {
        return  {
            user,
            eligibility: 'INELIGIBLE',
            userLocation
        }
    }

    return {
        user,
        eligibility: 'ELIGIBLE',
        userLocation
    }
}

export async function setUsageTime(userId: string, seconds: number) {
    try {
        await User.update({ id: userId }, {
            set: { secondsActive: seconds }
        })
    } catch(err) {
        Sentry.captureException(err)
    }
}


export async function getCurrentUser() {
    const oxUser = await getCookieUser()
    if (!oxUser) return null

    const cbUser = findUser(oxUser.uuid)
    if (cbUser) return cbUser

    return createUser({
        id: oxUser.uuid
    })
}
