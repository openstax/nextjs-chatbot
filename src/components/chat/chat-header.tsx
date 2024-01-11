import { Button, Group, Image, Title } from "@mantine/core";
import Staxly from '../assets/staxly.svg'
import { Eraser, Minus } from "tabler-icons-react";
import { FC } from "react";

export const ChatHeader: FC<{
    clearChat: () => void,
    onClose: () => void
}> = ({ clearChat, onClose }) => {
    return (
        <Group px='xs' bg='#D4450C' justify='space-between'>
            <Group gap='xs'>
                <Image src={Staxly} height={40} width={40} mt={10} alt='Staxly Logo' />
                <Title c='#ffffff' order={6}>Ask Staxly</Title>
            </Group>

            <Group gap='lg'>
                <Button c='#FFF'
                        size='sm'
                        p={0}
                        variant='transparent'
                        leftSection={<Eraser height={24} width={24} />}
                        onClick={clearChat}
                >
                    Clear chat
                </Button>
                <Minus cursor='pointer' color='#FFF' onClick={() => onClose()} />
            </Group>
        </Group>
    )
}
