export const IS_DEV=process.env.NODE_ENV !== "production"
import type { EmbedContext, PageState, BookState  } from './api'
import { BLANK_UUID as ZERO_BLANK_UUID,  DUMMY_OX_USER, OpenStaxUser } from '../lib/types'
import { BETA_AUTHORIZED_USERS } from '../lib/beta-authorized-users'

const DEV_UUID = process.env.CURRENT_USER_UUID || ZERO_BLANK_UUID

const DEV_USER: OpenStaxUser = {
    ...DUMMY_OX_USER,
    uuid: DEV_UUID,
}

type TagConfig = {
    stubUserUuid?: string
}

type Context = EmbedContext & { isAuthorized: boolean }

type EmbedState = {
    auth?: { established: boolean, user?: OpenStaxUser }
    content?: { book: BookState, page: PageState }
}

export function getTagConfig(): TagConfig {
    const tag = document.querySelector<HTMLScriptElement>('script[data-embed="true"]')
    if (!tag) return {}
    return Object.assign({}, tag.dataset)
}

function getState(): EmbedState {
    return (window as any).__APP_STORE?.getState() || {}
}

const BOOK_PREFIXES = [
    '/books/principles-economics-3e',
]

function isValidBookPrefix(prefix: string) {
    return window.location.pathname.startsWith(prefix);
}

export function isAuthorized(): boolean {
    if (IS_DEV) { return true; }

    const validBook = Boolean(BOOK_PREFIXES.find(isValidBookPrefix))

    const { auth } = getState()
    return Boolean(validBook && auth?.user && BETA_AUTHORIZED_USERS.has(auth?.user?.uuid))
}

export function getContext(): Context {
    const { content, auth } = getState()

    const title = (IS_DEV ? document.querySelector('[data-type=title]')?.textContent : content?.page?.title) || ''
    const subject = (IS_DEV ? 'economics' : content?.book?.categories?.[0]?.subject_category) || ''
    const orn = IS_DEV ? `${DEV_UUID}:${DEV_UUID}` : `${content?.book?.id}:${content?.page?.id}`
    let user: OpenStaxUser | null = (IS_DEV ? DEV_USER : auth?.user) || null

    const tagConfig = getTagConfig()
    if (!user && tagConfig.stubUserUuid) {
        user = Object.assign(DEV_USER, { uuid: tagConfig.stubUserUuid }) as OpenStaxUser
    }

    return {
        user,
        book: { title, subject, orn },
        isAuthorized: isAuthorized()
    }
}

