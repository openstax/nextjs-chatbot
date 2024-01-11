import { ChatbotUser, BLANK_UUID } from '@/lib/types'

export function isBrowser() {
    // Using `typeof window !== 'undefined'` alone is not enough because some users use https://www.npmjs.com/package/ssr-window
    return typeof window !== 'undefined' && typeof window.scrollY === 'number'
}

export const parseDate = (dt?: string) => {
    if (!dt) return new Date
    return new Date(Date.parse(dt))
}


export function searchParam(key: string): string {
    if (!isBrowser()) {
        return ''
    }

    const params = new URLSearchParams(window.location.search)
    return params.get(key) || ''
}

export function pushNewSearchParam(key: string, value: string | null) {
    const params = new URLSearchParams(window.location.search)
    if (!value) {
        params.delete(key)
    } else {
        params.set(key, value);
    }
    history.pushState(null, '', window.location.pathname + '?' + params.toString());
}

export function getUserAge(monthYear: string) {
    const now = new Date()
    const [month, year] = monthYear.split('/')
    const yearsOld = now.getUTCFullYear() - Number(year)

    if (Number(month) >= now.getUTCMonth()) {
        return yearsOld - 1;
    }

    return yearsOld
}

export function getUserId(user: ChatbotUser | null): string {
    if (!user) return BLANK_UUID
    return user.id || BLANK_UUID
}

