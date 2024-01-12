import Counter from './counter'
import { currentUserEligibility } from '@/server/eligibility'
import { ContentPanel  } from './panel'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Staxly ChatBot',
  description: 'Staxly chatbot panel',
}

export default async function Page() {

    const user = await currentUserEligibility()



    return (
        <div>
            <h1>Hello, {user.first_name}!</h1>
            <Counter />
            <ContentPanel user={user} />
        </div>
    )
}
