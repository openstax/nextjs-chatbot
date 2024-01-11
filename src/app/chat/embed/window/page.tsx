import Counter from './counter'
import { getCurrentUser } from '@/server/user'
import { ChatPanel  } from '@/components/chat/chat-panel'

export const metadata: Metadata = {
  title: 'Staxly ChatBot',
  description: 'Staxly chatbot panel',
}

export default async function Page() {

  const user = await getCurrentUser()


  if (!user) return null

  return (
    <div>
      <h1>Hello, {user.first_name}!</h1>
      <Counter />
      <ChatPanel user={user} />
    </div>
  )
}
