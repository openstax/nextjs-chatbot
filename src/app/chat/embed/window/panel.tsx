'use client'

import 'iframe-resizer'

import { UserEligibility } from '@/lib/types';
import { ChatPanel } from '@/components/chat/panel'
import { useEmbedCommunication } from '@/lib/embed-communication'
import { LoadingOverlay } from "@mantine/core";
import { Introduction } from "@/components/chat/introduction-form";


export const ContentPanel:React.FC<{ user: UserEligibility }> = ({ user }) => {

    const [api, context] = useEmbedCommunication();

    if (!context || !api) {
        return null
    }

    if (user.eligibility === "INELIGIBLE") return null

    if (user.eligibility === "NEEDS_VERIFICATION") {
        return <Introduction context={context} exit={() => api.onClose(false)} />
    }

    return (
        <ChatPanel
            height="100vh"
            subject={context.book.subject}
            topic={context.book.title}

            orn={context.book.orn}
            isOpen={true}
            onClose={() => api.onClose(false)}
            user={user}
        />
    )
}
