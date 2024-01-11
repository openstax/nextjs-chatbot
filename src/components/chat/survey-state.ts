import { useEffect, useState, useCallback, useMemo } from '@/lib/common'
import { isBrowser } from '@/lib/util'
import { useAlertTimer, UseAlertTimerCallback } from "@/lib/hooks"
import type { ChatbotUser } from '@/lib/types'

export type CheckPoint = {
    seconds: number, messages: number, surveyId: string
}

export type UseSurveyVisibleReturn = {
    open: boolean
    onClose(): void
    currentSeconds: number
    surveyId: string
}

const CHECKPOINTS: Record<string, CheckPoint> = {
    first: {
        seconds: 60 * 30,
        messages: 15,
        surveyId: 'SV_bKM7QsMAw9HfeVU',
     },
    second: {
        seconds: 60 * 150,
        messages: 75,
        surveyId: 'SV_bBGPTv2fJw9qPoW',
    }
}

type CheckPointId = keyof typeof CHECKPOINTS

type SurveyStateArgs = {
    user: ChatbotUser
    msgCount: number
    onComplete(surveyId: string): Promise<void>
}

export const useSurveyState = ({ user, msgCount, onComplete }: SurveyStateArgs ): UseSurveyVisibleReturn => {

    const checkpointId:CheckPointId = user.secondsActive >= CHECKPOINTS.first.seconds && msgCount >= CHECKPOINTS.first.messages ? 'second' : 'first'

    const checkpoint:CheckPoint = CHECKPOINTS[checkpointId]

    const [open, setOpen] = useState(false)

    const checkConditions = useCallback((elapsedSeconds: number) => {
        if (user.surveysGiven?.includes(checkpoint.surveyId)) {
            setOpen(false)
        } else if ((elapsedSeconds >= checkpoint.seconds) && (((msgCount + user.messageCount) / 2) >= checkpoint.messages )) {
            setOpen(true)
        }
    }, [setOpen, checkpoint, msgCount, user, checkpointId])

    const onTimerFired = useCallback<UseAlertTimerCallback>((elapsedSeconds: number) => {
        if (!isBrowser()) return

        const body = JSON.stringify({
            seconds: elapsedSeconds,
            userId: user.id
        })

        const blob = new Blob([body], {
            type: 'application/json',
        })
        window?.navigator?.sendBeacon?.("/api/user/time", blob)

        // only show if we've reached the time
        // otherwise the callback was fired due to unmount
        checkConditions(elapsedSeconds)
    }, [user.id, checkConditions, setOpen])

    const currentSeconds = useAlertTimer({
        previousSeconds: user.secondsActive || 0, // from earlier BE fetch
        alertAtSeconds: checkpoint.seconds,
        callBack: onTimerFired,
    })

    const onClose = () => {
        onComplete(checkpoint.surveyId)
        setOpen(false)
    }

    useEffect(() => {
        checkConditions(currentSeconds)
    }, [checkConditions, currentSeconds])

    return {
        open,
        surveyId: checkpoint.surveyId,
        onClose,
        currentSeconds,
    }
}
