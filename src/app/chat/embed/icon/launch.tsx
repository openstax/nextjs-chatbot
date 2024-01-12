'use client'

import 'iframe-resizer'
import styled from '@emotion/styled'
import { UserEligibility } from '@/lib/types';
import { LaunchIcon } from '@/components/launch-icon'
import './styles.scss';
import { useMediaQuery } from "@mantine/hooks"
import { useEmbedCommunication, EmbedCommunicationProvider } from '@/lib/embed-communication'


export const LoggedIn = () => {

    const [api] = useEmbedCommunication();
    console.log(api)
    const isMobile = useMediaQuery('(max-device-width: 480px)', false, { getInitialValueInEffect: false });

    const onClick = () => {

        const windowPosition = {
            bottom: isMobile ? '0' : '20px',
            right: isMobile ? '0' : '20px',
            height: isMobile ? '100%' : '680px',
            width: isMobile ? '100%' : '400px',
        }
        api?.openNewFrame({
            id: 'chatbot-window',
            title: 'Staxly ChatBot Messages',
            srcURL: `${window.location.origin}/chat/embed/window`,
            embedLocation: 'body',
            isResizable: true,
            isDraggable: true,
            fitContent: false,
            position: windowPosition
        })
    }

    return (
        <LaunchIcon onClick={onClick} isOpen={false} />
    )
}


const Wrapper = styled.div({
    width: 150,
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
})


export const Icon:React.FC<{ user: UserEligibility }> = ({ user }) => {
    if (user.eligibility == 'INELIGIBLE') {
        return null
    }

    const icon = user.eligibility == 'NEEDS_LOGIN' ? <LaunchIcon isOpen={false} /> : <LoggedIn />

    return (
        <EmbedCommunicationProvider><Wrapper>{icon}</Wrapper></EmbedCommunicationProvider>
    )
}
