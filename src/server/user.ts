import { SavedUserModel, User } from '@/server/data';
import { getUserAge } from '@/lib/util';
import type { ChatbotUserRecord } from '@/lib/types'
import * as Sentry from '@sentry/node'

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


export async function setUsageTime(userId: string, seconds: number) {
    try {
        await User.update({ id: userId }, {
            set: { secondsActive: seconds }
        })
    } catch(err) {
        Sentry.captureException(err)
    }
}


