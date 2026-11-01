import { describe, expect, it } from 'vitest'

import {
  createQuiz,
  missedProblems,
  quizReducer,
  toResult,
  type QuizAction,
  type QuizState,
} from '@/lib/quiz'
import type { Problem } from '@/types/quiz'

const PROBLEMS: Problem[] = [
  { id: 0, left: 7, right: 8, operation: 'multiply', answer: 56 },
  { id: 1, left: 2, right: 3, operation: 'multiply', answer: 6 },
  { id: 2, left: 0, right: 4, operation: 'divide', answer: 0 },
]

function playing(problems = PROBLEMS): QuizState {
  return quizReducer(createQuiz('mixed', 30, 1, problems), { type: 'start', time: 1000 })
}

function apply(state: QuizState, actions: QuizAction[]): QuizState {
  return actions.reduce(quizReducer, state)
}

function typeDigits(digits: string, time = 2000): QuizAction[] {
  return [...digits].map((digit) => ({ type: 'digit', digit: Number(digit), time }))
}

describe('quizReducer', () => {
  it('starts the clock at the given time', () => {
    const state = playing()

    expect(state.status).toBe('playing')
    expect(state.startedAt).toBe(1000)
    expect(state.endsAt).toBe(31_000)
  })

  it('ignores input before the quiz starts', () => {
    const ready = createQuiz('mixed', 30, 1, PROBLEMS)

    expect(quizReducer(ready, { type: 'digit', digit: 5, time: 0 })).toBe(ready)
  })

  it('keeps a partial answer without judging it', () => {
    const state = apply(playing(), typeDigits('5'))

    expect(state.input).toBe('5')
    expect(state.queue[0].id).toBe(0)
  })

  it('auto-advances when the input equals the answer', () => {
    const state = apply(playing(), typeDigits('56'))

    expect(state.correct).toBe(1)
    expect(state.input).toBe('')
    expect(state.queue[0].id).toBe(1)
  })

  it('accepts a single-digit answer on the first keystroke', () => {
    const state = apply(playing(), [{ type: 'skip', time: 1500 }, ...typeDigits('6')])

    expect(state.correct).toBe(1)
  })

  it('counts a miss, clears input, and stays on the problem when the answer is wrong', () => {
    const state = apply(playing(), typeDigits('57'))

    expect(state.misses).toBe(1)
    expect(state.input).toBe('')
    expect(state.queue[0].id).toBe(0)
  })

  it('removes the last digit on backspace', () => {
    const state = apply(playing(), [...typeDigits('5'), { type: 'backspace', time: 2100 }])

    expect(state.input).toBe('')
    expect(state.events.at(-1)?.kind).toBe('backspace')
  })

  it('ignores backspace on empty input', () => {
    const state = playing()

    expect(quizReducer(state, { type: 'backspace', time: 2000 })).toBe(state)
  })

  it('moves a skipped problem to the back of the queue', () => {
    const state = apply(playing(), [...typeDigits('5'), { type: 'skip', time: 2100 }])

    expect(state.queue.map((problem) => problem.id)).toEqual([1, 2, 0])
    expect(state.input).toBe('')
    expect(state.skips).toBe(1)
  })

  it('does nothing when skipping the only remaining problem', () => {
    const state = playing([PROBLEMS[1]])

    expect(quizReducer(state, { type: 'skip', time: 2000 })).toBe(state)
  })

  it('finishes early when every problem is answered', () => {
    const state = apply(playing(), [
      ...typeDigits('56'),
      ...typeDigits('6'),
      ...typeDigits('0', 9000),
    ])

    expect(state.status).toBe('finished')
    expect(state.finishedAt).toBe(9000)
  })

  it('rejects input stamped at or after the end time', () => {
    const state = playing()

    expect(quizReducer(state, { type: 'digit', digit: 5, time: 31_000 })).toBe(state)
  })

  it('accepts input stamped just before the end time', () => {
    const state = apply(playing(), typeDigits('56', 30_999))

    expect(state.correct).toBe(1)
  })

  it('finishes at the scheduled end time on expire', () => {
    const state = quizReducer(playing(), { type: 'expire' })

    expect(state.status).toBe('finished')
    expect(state.finishedAt).toBe(31_000)
  })

  it('voids a quiz in progress', () => {
    expect(quizReducer(playing(), { type: 'void' }).status).toBe('voided')
  })

  it('does not void a finished quiz', () => {
    const finished = quizReducer(playing(), { type: 'expire' })

    expect(quizReducer(finished, { type: 'void' })).toBe(finished)
  })
})

describe('toResult', () => {
  it('reports the full duration when time runs out', () => {
    const state = apply(playing(), [...typeDigits('56'), { type: 'expire' }])

    expect(toResult(state)).toMatchObject({ correct: 1, elapsedMs: 30_000, finishedEarly: false })
  })

  it('reports actual time when finished early', () => {
    const state = apply(playing(), [
      ...typeDigits('56'),
      ...typeDigits('6'),
      ...typeDigits('0', 9000),
    ])

    expect(toResult(state)).toMatchObject({ correct: 3, elapsedMs: 8000, finishedEarly: true })
  })
})

describe('missedProblems', () => {
  it('lists each missed problem once', () => {
    const state = apply(playing(), [...typeDigits('11'), ...typeDigits('22'), ...typeDigits('56')])

    expect(missedProblems(toResult(state))).toEqual([PROBLEMS[0]])
  })

  it('is empty when nothing was missed', () => {
    expect(missedProblems(toResult(playing()))).toEqual([])
  })
})
