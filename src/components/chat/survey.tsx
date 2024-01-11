import React from 'react'
import styled from '@emotion/styled'
import { Button, Drawer } from '@mantine/core'
import type { UseSurveyVisibleReturn } from './survey-state'

export * from './survey-state'

const QualtricsFeedback = styled.iframe({
    height: '100%',
    width: '100%',
})


type TimedSurveyProps = Omit<UseSurveyVisibleReturn, 'currentSeconds'>

export const TimedSurvey: React.FC<TimedSurveyProps> = ({ open, onClose, surveyId }) => {

    return (
        <Drawer.Root size='md' position='bottom' opened={open} onClose={onClose}>
            <Drawer.Overlay />
            <Drawer.Content style={{ overflow: 'hidden' }}>
                <Drawer.Header bg='#FFF' style={{ padding: 0, justifyContent: 'flex-end' }}>
                    <Drawer.Title>
                        <Button c='#848484'
                                size='sm'
                                variant='transparent'
                                style={{ textUnderlineOffset: '.25rem' }}
                                td='underline'
                                onClick={onClose}
                        >
                            Return to chat
                        </Button>
                    </Drawer.Title>
                </Drawer.Header>
                <Drawer.Body p={0} h='100%' style={{ overflow: 'hidden' }}>
                    <QualtricsFeedback src={`https://riceuniversity.co1.qualtrics.com/jfe/form/${surveyId}`} />
                </Drawer.Body>
            </Drawer.Content>
        </Drawer.Root>
    )
}
