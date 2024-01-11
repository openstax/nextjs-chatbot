import styled from '@emotion/styled'
import { ChatWindow } from './chat-window';
import { useToggle, useDidMount } from '@nathanstitt/sundry/base'
import { LaunchIcon } from '../launch-icon';
import { FC } from "react";
import { BLANK_UUID, DUMMY_CB_USER, DUMMY_ORN } from '@/lib/types'


const Wrapper = styled.div({
    float: 'right',
    overflow: 'visible',
    width: 200,
    height: 150,
    margin: 10,
    marginLeft: 0,
})

type ChatProps = {
    topic: string
    subject: string
}

export const Chat: FC<ChatProps> = (chatProps) => {
    const { setEnabled, setDisabled, isEnabled } = useToggle(false)

    const onClose = () => {
        setDisabled()
    }

    return (
        <Wrapper>
            <LaunchIcon onClick={setEnabled} isOpen={isEnabled} />
            <ChatWindow onClose={onClose} isOpen={isEnabled} {...chatProps} user={DUMMY_CB_USER} orn={DUMMY_ORN} />
        </Wrapper>
    )
}

export const EmbeddedChat: FC = () => {
    useDidMount(() => {
        const script = document.createElement('script')
        script.src = import.meta.env.PROD ? '/assets/static/loader.js' : 'http://localhost:8233/chatbot-embed.js'
        script.setAttribute('data-chatbot-embed', 'true')
        script.setAttribute('data-stub-user-uuid', BLANK_UUID )
        script.async = true
        document.head.appendChild(script)
    })
    return null
}
