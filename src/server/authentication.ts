'use server'


import 'server-only'

import { compactDecrypt, compactVerify, importSPKI } from 'jose'
import { cookies as cookieValues } from 'next/headers'

import { OpenStaxUser, DUMMY_OX_USER, BLANK_UUID as ZERO_UUID, UserLocation } from '@/lib/types'

import { ssoCookieConfig } from './config'
import { ENV } from '@/lib/env'

const DEV_UUID = process.env.CURRENT_USER_UUID || ZERO_UUID

const DEV_USER = {
    ...DUMMY_OX_USER,
    uuid: DEV_UUID,
}

export async function getCookieUser(): Promise<OpenStaxUser | null> {
    const cookieStore = cookieValues()

    if (!ENV.IS_PROD) return DEV_USER

    const ssoConfig = await ssoCookieConfig()

    const cookie = cookieStore.get(ssoConfig.name)
    if (!cookie) {
        console.warn(`No cookie value found for ${ssoConfig.name}`)
        return null
    }

    const { plaintext } = await compactDecrypt(cookie.value,
        Buffer.from(ssoConfig.private_key),
        { contentEncryptionAlgorithms: ['A256GCM'], keyManagementAlgorithms: ['dir'] },
    )
    const { payload } = await compactVerify(
        plaintext,
        await importSPKI(ssoConfig.public_key, 'RS256'),
        { algorithms: ['RS256'] },
    )

    try {
        const user = JSON.parse(payload.toString())['sub'] as OpenStaxUser

        return user
    } catch(err) {
        console.warn(`invalid json ${payload.toString()}: ${err}`)
        return null
    }
}
