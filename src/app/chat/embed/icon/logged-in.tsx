'use client'

import { Providers } from '@/components/providers';
import { LaunchIcon } from '@/components/launch-icon'
import './styles.scss';
import { useMediaQuery } from "@mantine/hooks"

import { useEmbedCommunicationContext } from '../communication'

export const LoggedInIcon = () => {
    const {api, context} = useEmbedCommunicationContext();

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
        <Providers>
            <LaunchIcon onClick={onClick} isOpen={false} />
        </Providers>

    )
}
