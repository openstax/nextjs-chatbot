import { useCallback, useEffect, useState } from "./common"
import { useEventListener } from '@nathanstitt/sundry/base'
import { isBrowser } from './util'
import { UserEligibilityReply } from "@/lib/types";
import { onUserEligibility } from '@/server/api.telefunc'


export const useOnUnMount = (cb: (elapsedSeconds: number) => void) => {
    const [mountDate] = useState<Date>(() => new Date())

    const fire = useCallback(() => {
        const now = new Date()
        const elapsed = now.getTime() - mountDate.getTime()
        if (elapsed > 5000) { // 5secs, only log if there's "significant time"
            cb(elapsed / 1000)
        }
    }, [mountDate, cb])

    // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon#sending_analytics_at_the_end_of_a_session
    // suggests document.visibilitychange vs window.unload
    useEventListener('visibilitychange', fire, { target: isBrowser() ? document : null })

    useEffect(() => {
        return fire // called on component unmount
    }, [fire])

    return mountDate
}

export type UseAlertTimerCallback = (totalTime: number, isMounted: boolean) => void

type UseAlertTimerArgs = {
    previousSeconds: number,
    alertAtSeconds: number,
    callBack: UseAlertTimerCallback
}

export const useAlertTimer = ({ alertAtSeconds, previousSeconds, callBack }: UseAlertTimerArgs): number => {
    // unmounted before fired
    const onUnmount = useCallback((elapsedSeconds: number) => {
        callBack(Math.round(previousSeconds + elapsedSeconds), false)
    }, [previousSeconds, callBack])

    const mountDate = useOnUnMount(onUnmount)

    const fireAtSeconds = alertAtSeconds - previousSeconds

    useEffect(() => {
        if (fireAtSeconds <= 0) return

        const timer = setTimeout(() => {
            callBack(alertAtSeconds, true)
        }, fireAtSeconds * 1000)

        return () => {
            clearTimeout(timer)
        }

    }, [fireAtSeconds, alertAtSeconds, callBack])

    const secondsActive = (((new Date().getTime()) - mountDate.getTime()) / 1000) + previousSeconds

    return secondsActive
}

// export const useFetchUser = (userId = '') => {
//     return useQuery<UserEligibilityReply>({
//         staleTime: Infinity,
//         enabled: !!userId,
//         queryKey: ['fetchUser'],
//         queryFn: async () => onUserEligibility(),
//     })
// }
