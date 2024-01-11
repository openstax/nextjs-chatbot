import 'iframe-resizer'
import { PropsWithChildren } from 'react'
import { ChatPanel } from '@/components/chat/chat-panel'
import { useEmbedCommunicationContext } from './communication'
import { LoadingOverlay } from "@mantine/core";
import { useFetchUser } from "@/lib/hooks";
import { Introduction } from "@/components/chat/introduction-form";

export { Layout } from './layout'

export const Page = () => {
    const {api, context} = useEmbedCommunicationContext();
    const { data, isLoading, refetch } = useFetchUser(context?.user?.uuid)

    if (isLoading) {
        return <LoadingOverlay
            visible={isLoading}
            overlayProps={{ radius: 'sm', blur: 2 }}
            loaderProps={{ color: 'pink', type: 'bars' }}
        />
    }

    if (!context || !api) {
        return null
    }

    if (data?.eligibility === "INELIGIBLE") return null

    if (!data?.user || data?.eligibility === "NEEDS_VERIFICATION") {
        return <Introduction context={context} exit={() => api.onClose(false)} />
    }

    return (
        <ChatPanel
            height="100vh"
            subject={context.book.subject}
            topic={context.book.title}
            reloadUser={refetch}
            orn={context.book.orn}
            isOpen={true}
            onClose={() => api.onClose(false)}
            user={data.user}
        />
    )
}
