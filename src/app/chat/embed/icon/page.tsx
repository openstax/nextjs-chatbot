import { currentUserEligibility } from '@/server/eligibility'
import { Icon } from './launch'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Staxly Launch Icon',
  description: 'launch Staxly chatbot',
}


export default async function Page() {

    const user = await currentUserEligibility()

    return <Icon user={user} />
}
