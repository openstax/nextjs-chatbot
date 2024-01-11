import { getCurrentUser } from '@/server/user'
import { LoggedInIcon } from './logged-in'
import { AnonIcon } from './anon'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Staxly Launch Icon',
  description: 'launch Staxly chatbot',
}

export default async function Page() {

    const user = await getCurrentUser()

    if (user) {
        return <LoggedInIcon />
    }

    return <AnonIcon />
}
