import { useState } from "@/lib/common";
import { EmbedContext } from "../../embed/api";
import Staxly from "@/components/assets/staxly.svg";
import { matches, useForm, UseFormReturnType } from "@mantine/form";
import { Anchor, Button, Checkbox, Drawer, Group, Image, Radio, Stack, Text, TextInput, NumberInput } from "@mantine/core";

import { ChatbotUser, UserLocation } from "@/lib/types";
import { getUserAge } from "@/lib/util";
import { useEmbedCommunicationContext } from '@/lib/embed-communication'
import { IconExternalLink } from "@tabler/icons-react"
import { onUserVerification } from "@/server/api.telefunc";
import { FC } from "react";

interface IntroFormValues {
    monthOfBirth: number | null
    yearOfBirth: number | null
    acceptedTOU: boolean
}

const CURRENT_YEAR = (new Date()).getFullYear()

export const Introduction: FC<{
    context: EmbedContext,
    exit: () => void,
}> = ({ context, exit }) => {
    const [open, setOpen] = useState(true)
    const [user, setUser] = useState<ChatbotUser | undefined>(undefined)
    const [userLocation, setUserLocation] = useState<UserLocation | undefined>(undefined)


    const form = useForm<IntroFormValues>({
        initialValues: {
            monthOfBirth: null,
            yearOfBirth: null,
            acceptedTOU: false
        },
        validate: {
            monthOfBirth: (v) => v && v >= 1 && v <= 12 ? null : 'Invalid month',
            yearOfBirth: (v) => v && v >= 1900 && v <= CURRENT_YEAR ? null : 'Invalid year',
            acceptedTOU: (value) => value ? null : 'must accept terms',
        },
        validateInputOnBlur: true
    });

    const submitVerification = (formValues: IntroFormValues) => {
        onUserVerification({
            monthYearOfBirth: `${formValues.monthOfBirth}/${formValues.yearOfBirth}`,
            acceptedTOU: formValues.acceptedTOU
        }).then((response) => {
            setUser(response.user)
            setUserLocation(response.userLocation)
        })
    }

    if (user && userLocation) {
        return <Results exit={() => {
            refetch().then(() => exit())
        }} user={user} userLocation={userLocation} />
    }

    return (
        <Drawer.Root
            closeOnEscape={false}
            closeOnClickOutside={false}
            size='100%'
            position='bottom'
            opened={open} onClose={() => setOpen(false)}
        >
            <Drawer.Overlay />
            <Drawer.Content>
                <Drawer.Header bg='#FFF' style={{ padding: 0, justifyContent: 'flex-end' }}>
                    <Drawer.Title>
                        <Button c='#848484'
                                size='sm'
                                variant='transparent'
                                style={{ textUnderlineOffset: '.25rem' }}
                                td='underline'
                                onClick={() => exit()}
                        >
                            Exit
                        </Button>
                    </Drawer.Title>
                </Drawer.Header>
                <Drawer.Body>
                    <Stack mt='md' align='center' gap='sm'>
                        <Image src={Staxly} h={50} w={50} alt='Staxly Logo' />
                        <Stack gap='xs' mb='lg' ta='center'>
                            <Text size='sm'>Welcome to the Staxly Beta Program!</Text>
                            <Text size='sm'>You’ve been granted exclusive access to OpenStax Staxly, your new AI study coach designed to help you in your Economics learning journey.</Text>
                            <Text size='sm'>As this is brand new, we’d appreciate all of your insight on what’s working and what could be improved. You will find many feedback points along the way to help you share your experience - don’t hesitate to be honest, we don’t take it personally!</Text>
                            <Text size='sm'>Before we begin, please confirm the following for us:</Text>
                        </Stack>
                        <form onSubmit={form.onSubmit((values) => submitVerification(values))}>
                            <Stack gap='xs'>
                                <Text fw="500" size="sm">What is your month and year of birth?</Text>
                                <Group  gap="xs" grow align="start">
                                    <NumberInput min={1} max={12} allowDecimal={false} hideControls {...form.getInputProps('monthOfBirth')} placeholder="MM" />
                                    <NumberInput min={1900} max={CURRENT_YEAR} allowDecimal={false} hideControls {...form.getInputProps('yearOfBirth')} placeholder="YYYY" />
                                </Group>
                                <Group gap="xs">
                                    <Checkbox {...form.getInputProps('acceptedTOU')} label="I accept"/>
                                    <Anchor href='https://help.openstax.org/s/article/Chatbot-Terms-of-Use' target='_blank'>
                                        <Group gap='xs'>
                                            <span>Terms of Use</span>
                                            <IconExternalLink />
                                        </Group>
                                    </Anchor>
                                </Group>
                                <Button color='orange' type='submit' disabled={!form.isValid()}>
                                    Submit
                                </Button>
                            </Stack>
                        </form>
                    </Stack>
                </Drawer.Body>
            </Drawer.Content>
        </Drawer.Root>
    )
}


const Results: FC<{
    exit: () => void,
    user: ChatbotUser,
    userLocation: UserLocation
}> = ({ exit, user, userLocation }) => {
    return (
        <Drawer.Root
            closeOnEscape={false}
            closeOnClickOutside={false}
            size='100%'
            position='bottom'
            opened={true}
            onClose={() => exit()}
        >
            <Drawer.Overlay />
            <Drawer.Content>
                <Drawer.Header bg='#FFF' style={{ padding: 0, justifyContent: 'flex-end' }}>
                    <Drawer.Title>
                        <Button c='#848484'
                                size='sm'
                                variant='transparent'
                                style={{ textUnderlineOffset: '.25rem' }}
                                td='underline'
                                onClick={() => exit()}>
                            Exit
                        </Button>
                    </Drawer.Title>
                </Drawer.Header>
                <Drawer.Body>
                    <Stack mt='md' align='center' gap='sm'>
                        <Image src={Staxly} h={50} w={50} alt='Staxly Logo' />
                        <ResultsText user={user} exit={exit} userLocation={userLocation}/>
                    </Stack>
                </Drawer.Body>
            </Drawer.Content>
        </Drawer.Root>
    )
}

const ResultsText: FC<{
    user: ChatbotUser,
    exit: () => void,
    userLocation: UserLocation
}> = ({ user, exit, userLocation }) => {
    const age = getUserAge(user.monthYearOfBirth)
    const isDelaware = userLocation.region === 'Delaware'
    if (age < 16 || (isDelaware && age < 18)) return <Underage user={user} />
    if (age == 16 || age == 17) return <UnderageWithPrivacy user={user} />
    if (age >= 18) return <ThanksAndConfirm user={user}/>
}

const ThanksAndConfirm: FC<{user: ChatbotUser}> = ({ user }) => {
    const { refetch } = useFetchUser(user.id)

    return (
        <Stack gap='md' justify='space-between'>
            <Stack gap='xs' mb='lg' ta='center'>
                <Text size='sm'>Thank you for confirming!</Text>
            </Stack>
            <Button onClick={() => refetch()}>
                Continue
            </Button>
        </Stack>
    )
}

const Underage: FC<{ user: ChatbotUser }> = ({ user }) => {
    const { api } = useEmbedCommunicationContext();

    const closeWindow = () => {
        api?.onClose(true)
    }

    return (
        <Stack gap='md'>
            <Stack gap='xs' mb='lg' ta='center'>
                <Text size='sm'>Thank you for confirming your age!</Text>
                <Text size='sm'>We’re sorry, but Staxly is only available to students over the age of 15 (or over 17 for Delaware residents).</Text>
                <Text size='sm'>We do look forward to seeing you again in the future!</Text>
            </Stack>
            <Button onClick={closeWindow}>
                Continue
            </Button>
        </Stack>
    )
}

const UnderageWithPrivacy: FC<{ user: ChatbotUser }> = ({ user }) => {
    const { refetch } = useFetchUser(user.id)

    return (
        <Stack gap='md'>
            <Stack gap='xs' mb='lg' ta='center'>
                <Text size='sm'>Thank you for confirming your age! Since you’re below the age of consent, let’s take a moment to review your privacy rights.</Text>
                <Text size='sm'>While you will be able to use Staxly as your study coach, it’s important that you know that your interaction data will not be kept until you turn 18yo, unless for any issues you may report with your experience.</Text>
                <Text size='sm'>More information available on our&nbsp;
                    <Anchor href='https://openstax.org/privacy' target='_blank'>
                        Privacy Notice
                    </Anchor>
                </Text>
            </Stack>
            <Button onClick={() => refetch()}>
                Continue
            </Button>
        </Stack>
    )
}
