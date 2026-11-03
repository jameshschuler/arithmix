import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useCountUp } from '@/hooks/useCountUp'

function mockReducedMotion(matches: boolean) {
  vi.stubGlobal('matchMedia', () => ({ matches }))
}

describe('useCountUp', () => {
  it('shows the target right away when disabled', () => {
    mockReducedMotion(false)
    const { result } = renderHook(() => useCountUp(42, 700, false))

    expect(result.current).toBe(42)
  })

  it('shows the target right away when the player prefers reduced motion', () => {
    mockReducedMotion(true)
    const { result } = renderHook(() => useCountUp(42, 700, true))

    expect(result.current).toBe(42)
  })

  it('counts up from zero to the target', () => {
    mockReducedMotion(false)
    vi.useFakeTimers({ toFake: ['performance', 'requestAnimationFrame', 'cancelAnimationFrame'] })
    const { result } = renderHook(() => useCountUp(42, 700, true))

    expect(result.current).toBe(0)

    act(() => {
      vi.advanceTimersByTime(800)
    })

    expect(result.current).toBe(42)
    vi.useRealTimers()
  })
})
