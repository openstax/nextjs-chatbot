import React from 'react'
import { useState } from '@/lib/common'
import { ThumbDown, ThumbUp } from "tabler-icons-react";
import Staxly from "@/components/assets/staxly.svg";
import { useForm } from "@mantine/form";
import { onDislikeMessage, onLeaveFeedback, onLikeMessage } from '@/server/api.telefunc'
import type { ChatMessageReply, TranscriptMessage } from '@/lib/types'
import { Button, Drawer, Image, Stack, Text, Textarea } from '@mantine/core'

type MessageFeedbackProps = {
    message: TranscriptMessage,
    like: boolean,
    setChat: (chat: ChatMessageReply) => void
}

export const MessageFeedback: React.FC<MessageFeedbackProps> = ({ message, like, setChat }) => {
    const form = useForm({
        initialValues: {
            feedback: ''
        },
        validate: {
            feedback: (value) => value.length < 1
        }
    });

    const likeOrDislike = (like: boolean) => {
        const func = like ? onLikeMessage : onDislikeMessage
        func({
            chatId: message.chatId,
            messageId: message.id,
        }).then((reply) => {
            message.liked = like
            message.disliked = !like
            setChat(reply)
        })
    }

    const [open, setOpen] = useState(false);
    const submitFeedback = (feedback: string) => {
        onLeaveFeedback({
            chatId: message.chatId,
            messageId: message.id,
            feedback,
        }).then((reply) => {
            setChat(reply)
        })
        form.reset()
        setOpen(false)
    }
    return (
        <>
            <Drawer.Root size='md' position='bottom' opened={open} onClose={() => setOpen(false)}>
                <Drawer.Overlay />
                <Drawer.Content style={{ overflow: 'hidden' }}>
                    <Drawer.Header bg='#FFF' style={{ padding: 0, justifyContent: 'flex-end' }}>
                        <Drawer.Title>
                            <Button c='#848484'
                                    size='sm'
                                    variant='transparent'
                                    style={{ textUnderlineOffset: '.25rem' }}
                                    td='underline'
                                    onClick={() => setOpen(false)}
                            >
                                Return to chat
                            </Button>
                        </Drawer.Title>
                    </Drawer.Header>

                    <Drawer.Body>
                        <form onSubmit={form.onSubmit((values) => {
                            submitFeedback(values.feedback)
                        })}>
                            <Stack justify='space-between' gap='xl' mt='lg'>
                                <Stack align='center' gap='xl'>
                                    {like && <Image src={Staxly} h={50} w={50} alt='Staxly Logo' />}
                                    <Text size='sm' ta='center'>
                                        {like ?
                                            `Share your thoughts with us (e.g., what you liked, and any creative suggestions!)` :
                                            `We're sorry to hear that! Please tell us more about the issue (e.g., this is harmful/unsafe, this is inaccurate, this is unhelpful, etc.) to help us improve your experience`
                                        }
                                    </Text>
                                </Stack>

                                <Stack justify='space-between' gap='xl'>
                                    <Textarea rows={5} {...form.getInputProps('feedback')} placeholder='Type message (do not share personal information)' />
                                    <Button color='orange' type='submit' disabled={!form.isValid()}>
                                        Submit & Continue chat
                                    </Button>
                                </Stack>
                            </Stack>
                        </form>
                    </Drawer.Body>
                </Drawer.Content>
            </Drawer.Root>
            {like ? <ThumbUp cursor='pointer'
                     onClick={() => {
                         if (message.liked) return
                         likeOrDislike(true)
                         setOpen(true)
                     }}
                     color={message.liked ? '#63A524' : '#DBDBDB'}
            /> :
                <ThumbDown cursor='pointer'
                           onClick={() => {
                               if (message.disliked) return
                               likeOrDislike(false)
                               setOpen(true)
                           }}
                           color={message.disliked ? '#CA2026' : '#DBDBDB'}
                />
            }

        </>
    )
}
