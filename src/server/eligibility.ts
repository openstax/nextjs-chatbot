'use server'

import type { UserEligibility, ChatbotUser } from '@/lib/types'
import { getCookieUser } from './authentication'
import { headers as headerValues } from 'next/headers'
import { ENV } from '@/lib/env'
import { Chat, Message } from '@/server/data';

import { isUserOldEnough, findUser } from './user'

export async function currentUserEligibility(): Promise<UserEligibility> {

    const headers = headerValues()

    const location = {
        region: headers.get('cloudfront-viewer-country-region-name') || 'Unknown',
        country: headers.get('cloudfront-viewer-country') || 'Unknown',
    }

    const isDelaware = location.region === 'Delaware'

    if (ENV.IS_PROD && location.country !== 'US') {
        return { eligibility: 'INELIGIBLE' }
    }

    const oxUser = await getCookieUser()
    if (!oxUser) {
        return { eligibility: 'NEEDS_LOGIN' }
    }

    const userRecord = await findUser(oxUser.uuid)

    if (!userRecord) {
        return {
            eligibility: 'NEEDS_VERIFICATION',
        }
    }
    const chats = await Chat.find({ id: oxUser.uuid }, { index: 'gs1' })
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
            location,
        }
    }

    return {
        user,
        eligibility: 'ELIGIBLE',
        location
    }
}
