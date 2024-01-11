import { vi, describe, afterEach, beforeEach, expect, test } from 'vitest'
import { renderHook } from '@testing-library/react-hooks'
import { DUMMY_CB_USER  } from '@/lib/types'
import { useSurveyState } from './survey-state'

describe('survey state hook', () => {

    beforeEach(() => {
        vi.useFakeTimers({ shouldAdvanceTime: true })
    })
    afterEach(() => {
        vi.useRealTimers();
    })

    test('becoming active as messages are sent', () => {
        const props = {
            onComplete: async () => {  },
            user: DUMMY_CB_USER,
            msgCount: 10
        }

        const { result, rerender } = renderHook(useSurveyState, {
            initialProps: props
        })

        expect(result.current.open).toBe(false)

        vi.advanceTimersByTime(40 * 1000 * 1000)
        rerender(props)


        expect(result.current.open).toBe(false)
        props.msgCount = 32
        rerender(props)
        expect(result.current.open).toBe(true)
    })


    test('becoming active when timer is reached', () => {
        const props = {
            user: { ...DUMMY_CB_USER, messageCount: 32 },
            onComplete: async () => {  },
            msgCount: 0,
        }
        const { result } = renderHook(useSurveyState, {
            initialProps: props
        })

        expect(result.current.open).toBe(false)
        vi.advanceTimersByTime(40 * 1000 * 1000)
        expect(result.current.open).toBe(true)
    })

})
