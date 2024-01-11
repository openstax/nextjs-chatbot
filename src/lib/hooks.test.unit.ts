import { vi, describe, afterEach, beforeEach, expect, test } from 'vitest'
import { renderHook } from '@testing-library/react-hooks'
import { useAlertTimer } from './hooks'


describe('timer hooks', () => {


    beforeEach(() => {
        vi.useFakeTimers({ shouldAdvanceTime: true })
    })
    afterEach(() => {
        vi.useRealTimers();
    })

    test('fires at unmount with updated elapsed time', () => {
        const callBack = vi.fn()
        const { unmount } = renderHook(() => {
            useAlertTimer({
                previousSeconds: 10,
                alertAtSeconds: 42,
                callBack,
            })
        })
        expect(callBack).not.toHaveBeenCalled()
        vi.advanceTimersByTime(30_990)
        expect(callBack).not.toHaveBeenCalled()
        unmount()
        expect(callBack).toHaveBeenCalledWith(41, false)
    })

    test('fires when timeout is reached', () => {
        const callBack = vi.fn()

        renderHook(() => {
            useAlertTimer({
                previousSeconds: 10,
                alertAtSeconds: 42,
                callBack,
            })
        })

        vi.advanceTimersByTime(30_000)
        expect(callBack).not.toHaveBeenCalled()
        vi.advanceTimersByTime(2_001)

        expect(callBack).toHaveBeenCalledWith(42, true)

    })

})
