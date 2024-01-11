"use client"

import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { styled, useEffect, useState } from '@/lib/common'
import { ChatContainer, MainContainer, Message as ChatMessage, MessageInput, MessageList, MessageSeparator } from '@chatscope/chat-ui-kit-react'
import { ChatbotUser, ChatMessageReply, DEFAULT_MODEL } from '@/lib/types'
import { getUserId } from '@/lib/util'
import { initialMessage } from '@/lib/chat'
import { sendMsgAndListen } from '@/lib/send-and-listen'
import { Anchor, Center, Group, Stack, Text } from '@mantine/core'
import { ChatHeader } from "@/components/chat/chat-header"
import { OXColoredStripe } from "@/components/ox-colored-stripe"
import "./chat-styles.scss"
import { useLocalStorage } from "@mantine/hooks"
import { ExternalLink } from "tabler-icons-react"
import { onFetchChatWithTranscript, onSurveyComplete as apiOnSurveyComplete } from '@/server/api.telefunc'
import { TimedSurvey, useSurveyState } from './survey'
import { makeMessage } from './transcript'


const Wrapper = styled(Stack)({
    border: '1px solid',
    background: 'white',
    filter: 'drop-shadow(1px 1px 4px #000)',
})

function newBlankChat(user: ChatbotUser, chatId?: string) {
    return { id: chatId || '', userId: user.id || '', transcript: [] }
}

export type ChatPanelProps = {
    subject: string
    topic: string
    orn: string
    onClose: () => void
    isOpen: boolean
    height?: string
    width?: string
    reloadUser?: () => void
    className?: string
    onMessage?: (messageId: string) => void
    user: ChatbotUser
}

function cloneChatWhenSending(chat:ChatMessageReply, message: string) {
    const cc = { ...chat, transcript: [...chat.transcript] }
    cc.transcript.push({
        id: 'temp',
        chatId: "",
        content: message,
        isBot: false,
        occurred: '',
    }, {
        id: 'temp-reply',
        chatId: "",
        content: '',
        isBot: true,
        occurred: '',
    })
    return cc
}

export const ChatPanel = ({
    onClose, isOpen, topic, subject, className,
    height = '100%', width = '100%', user, orn, reloadUser,
}: ChatPanelProps) => {
    const [chatId, setChatId] = useLocalStorage({ key: 'chatId', defaultValue: '' })
    const [chat, setChat] = useState<ChatMessageReply>(newBlankChat(user, chatId))
    const [transmitting, setTransmitting] = useState(false)
    const [initialMessageCount, setInitialMessageCount] = useState(0)

    const onSurveyComplete = async (surveyId: string) => {
        await apiOnSurveyComplete(surveyId)
        reloadUser?.()
    }

    const { currentSeconds, ...surveyState } = useSurveyState({ user, msgCount: chat.transcript.length - initialMessageCount, onComplete: onSurveyComplete  })

    useEffect(() => {
        if (chatId) {
            onFetchChatWithTranscript(chatId).then((reply) => {
                setInitialMessageCount(user.messageCount - reply.transcript.length)
                setChat(reply)
            })
        }
    }, [chatId, user])

    useEffect(() => {
        if (!isOpen) setChat(newBlankChat(user))
    }, [isOpen, user])

    if (!isOpen) return null

    const clearChat = () => {
        setChat(newBlankChat(user))
        setChatId('')
    }

    const onSend = async (_:string, message: string) => {
        // create a local copy and use that, otherwise methods below will act on stale state
        const cc = cloneChatWhenSending(chat, message)
        setChat(cc)
        setTransmitting(true)

        await sendMsgAndListen({ chatId: cc.id, message, model: DEFAULT_MODEL, topic, subject, orn, secondsActive: currentSeconds }, {
            initial: (newChat) => {
                if (!cc.id) {
                    setChatId(newChat.id)
                }
                Object.assign(cc, newChat)
                setChat(newChat)
            },
            message: (update) => {
                const transcript = cc.transcript.map(msg => msg.id == update.msgId ? { ...msg, content: update.content } : msg)
                setChat({ ...cc, transcript })
            },
            error: (errorMsg) => {
                console.warn(errorMsg)
                (window as any)?.Sentry.captureException(errorMsg)
                setTransmitting(false)
            },
            close: (finished) => {
                finished && setTransmitting(false)
            }
        })
    }

    const lastChat = chat.transcript.at(-1)

    return (
        <Wrapper w={width} h={height} gap={0} className={className}>

            <ChatHeader clearChat={clearChat} onClose={onClose}/>
            <OXColoredStripe />

            <TimedSurvey {...surveyState} />

            <MainContainer style={{ height: '100%', border: 'none' }}>
                <ChatContainer>
                    <MessageList>
                        {chat.transcript[0]?.occurred && <MessageSeparator style={{marginTop: '1rem'}}>
                            {dayjs(chat.transcript[0].occurred).format('MMM D, YYYY h:ss A')}
                        </MessageSeparator>}

                        <ChatMessage model={{
                            position: 'single',
                            direction: 'incoming',
                            message: initialMessage({ topic, subject }),
                            sender: 'Staxly',
                        }} />

                        {chat.transcript.map((msg, i) => makeMessage({
                            index: i,
                            isFirst: i == 0,
                            isLast: (i == chat.transcript.length - 1),
                            message: msg,
                            transmitting,
                            setChat: setChat
                        }))}

                        {lastChat?.disliked && <MessageSeparator>
                            I’m sorry I wasn’t able to respond to your question properly. I want to help, but as an AI chatbot I can make mistakes sometimes. Could you please try re-framing your question for me so I can try again?
                        </MessageSeparator>}
                    </MessageList>

                    <MessageInput
                        placeholder="(please do not share personal information)"
                        attachButton={false}
                        autoFocus
                        sendButton
                        sendDisabled={transmitting}
                        sendOnReturnDisabled={transmitting}
                        onSend={onSend}
                    />
                </ChatContainer>
            </MainContainer>

            <Group bg='#DBF3F8' p='.5em 1em' justify='space-between'>
                <Text size='xs'>
                    <Anchor c='#0208a1' href='https://help.openstax.org/s/article/Chatbot-Terms-of-Use' target='_blank'>
                        Terms of Use
                    </Anchor>
                    <span> | </span>
                    <Anchor c='#0208a1' href='https://openstax.org/privacy' target='_blank'>
                        Privacy
                    </Anchor>
                    <span> | </span>
                    <Anchor c='#0208a1' href='https://help.openstax.org/s/article/Staxly-the-AI-Study-Coach' target='_blank'>
                        FAQs
                    </Anchor>
                </Text>
                <Text size='xs' display='flex' c='#282828'>
                    Powered by&nbsp;
                    <Anchor href='https://together.ai/about' target='_blank' display='flex' underline='always' c='#282828' size='xs'>
                        together.ai&nbsp;<ExternalLink  height={14} width={14} />
                    </Anchor>
                </Text>
            </Group>
        </Wrapper>
    )
}

