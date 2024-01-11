import { MessageFeedback } from './feedback'
import { ChatMessageReply, TranscriptMessage } from '@/lib/types'
import { Flex, Group, Tooltip } from '@mantine/core'
import { Message as ChatMessage } from '@chatscope/chat-ui-kit-react'

export function makeMessage({ isFirst, isLast, message, transmitting, setChat }: {
    index: number,
    isFirst: boolean,
    isLast: boolean,
    message: TranscriptMessage,
    transmitting: boolean,
    setChat: (chat: ChatMessageReply) => void
}) {
    return (
        <ChatMessage key={message.id} model={{
            position: isFirst ? 'single' : isLast ? 'last' : 'normal',
            direction: message.isBot ? 'incoming' : 'outgoing',
            message: message.content || '…',
        }}>
            <ChatMessage.Header>
                <Flex justify={message.isBot ? 'start' : 'end'} w='100%'>
                    <Tooltip label={message.occurred}>
                        <span>{message.isBot ? 'Staxly' : 'Me'}</span>
                    </Tooltip>
                </Flex>
            </ChatMessage.Header>

            {(message.isBot && (!transmitting || !isLast)) &&
                <ChatMessage.Footer>
                    <Group justify='end' w='100%'>
                        <Group>
                            {!message.disliked && <MessageFeedback message={message} like={true} setChat={setChat}/>}
                            {!message.liked && <MessageFeedback message={message} like={false} setChat={setChat} />}
                        </Group>
                    </Group>
                </ChatMessage.Footer>
            }
        </ChatMessage>
    )
}

