import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useQuizSounds } from '@/hooks/useQuizSounds'
import { sounds, vibrate } from '@/lib/audio'
import { createQuiz, type QuizState } from '@/lib/quiz'

vi.mock('@/lib/audio', () => ({
  sounds: { correct: vi.fn(), miss: vi.fn(), skip: vi.fn() },
  vibrate: vi.fn(),
}))

const START = createQuiz('multiply', 30, 1, [])

function renderSounds() {
  return renderHook((state: QuizState) => useQuizSounds(state), { initialProps: START })
}

describe('useQuizSounds', () => {
  it('stays quiet when the quiz starts', () => {
    renderSounds()

    expect(sounds.correct).not.toHaveBeenCalled()
    expect(sounds.miss).not.toHaveBeenCalled()
    expect(sounds.skip).not.toHaveBeenCalled()
  })

  it('plays the correct sound for each right answer', () => {
    const { rerender } = renderSounds()

    rerender({ ...START, correct: 1 })
    rerender({ ...START, correct: 2 })

    expect(sounds.correct).toHaveBeenCalledTimes(2)
  })

  it('buzzes and vibrates on a miss', () => {
    const { rerender } = renderSounds()

    rerender({ ...START, misses: 1 })

    expect(sounds.miss).toHaveBeenCalledOnce()
    expect(vibrate).toHaveBeenCalledOnce()
  })

  it('plays the skip sound on a skip', () => {
    const { rerender } = renderSounds()

    rerender({ ...START, skips: 1 })

    expect(sounds.skip).toHaveBeenCalledOnce()
  })
})
