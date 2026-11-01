import { describe, expect, it } from 'vitest'

import {
  ACHIEVEMENTS,
  correctMultiplicationFacts,
  longestCorrectStreak,
  newlyEarnedAchievements,
} from '@/lib/achievements'
import { correctEvents, makeRun, multiplication } from '@/test/factories'
import type { QuizEvent, Run } from '@/types/quiz'

function earnedIds(run: Run, history: Run[] = [run], unlocked: string[] = []): string[] {
  return newlyEarnedAchievements(run, history, new Set(unlocked)).map(
    (achievement) => achievement.id,
  )
}

function events(kinds: QuizEvent['kind'][]): QuizEvent[] {
  return kinds.map((kind) => ({ time: 0, kind, problemId: 0 }))
}

describe('ACHIEVEMENTS', () => {
  it('has unique ids', () => {
    const ids = ACHIEVEMENTS.map((achievement) => achievement.id)

    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('newlyEarnedAchievements', () => {
  it('awards First Steps for any finished quiz', () => {
    expect(earnedIds(makeRun({ correct: 0 }))).toContain('first-steps')
  })

  it('skips achievements already unlocked', () => {
    expect(earnedIds(makeRun(), undefined, ['first-steps'])).not.toContain('first-steps')
  })

  it.each([
    { name: 'perfect', run: makeRun({ correct: 20, misses: 0 }), earned: true },
    { name: 'perfect', run: makeRun({ correct: 19, misses: 0 }), earned: false },
    { name: 'perfect', run: makeRun({ correct: 40, misses: 1 }), earned: false },
    { name: 'clean-sweep', run: makeRun({ finishedEarly: true }), earned: true },
    { name: 'clean-sweep', run: makeRun({ finishedEarly: false }), earned: false },
    { name: 'gold-rush', run: makeRun({ rank: { tier: 'gold', stars: 1 } }), earned: true },
    { name: 'gold-rush', run: makeRun({ rank: { tier: 'silver', stars: 3 } }), earned: false },
    { name: 'steady-hand', run: makeRun({ duration: 90, skips: 0, correct: 30 }), earned: true },
    { name: 'steady-hand', run: makeRun({ duration: 90, skips: 1, correct: 30 }), earned: false },
    { name: 'steady-hand', run: makeRun({ duration: 60, skips: 0, correct: 30 }), earned: false },
  ])('$name earned=$earned', ({ name, run, earned }) => {
    expect(earnedIds(run).includes(name)).toBe(earned)
  })

  it('awards Triple Crown once every mode has 3 gold stars', () => {
    const gold3 = { tier: 'gold', stars: 3 } as const
    const history = [
      makeRun({ id: 1, mode: 'multiply', rank: gold3 }),
      makeRun({ id: 2, mode: 'divide', rank: gold3 }),
    ]
    const run = makeRun({ id: 3, mode: 'mixed', rank: gold3 })

    expect(earnedIds(run, history)).not.toContain('triple-crown')
    expect(earnedIds(run, [...history, run])).toContain('triple-crown')
  })

  it('awards Daily Habit after 7 days in a row', () => {
    const days = Array.from({ length: 7 }, (_, index) =>
      makeRun({ id: index, playedAt: new Date(2026, 9, 1 + index, 12).getTime() }),
    )

    expect(earnedIds(days[6], days)).toContain('daily-habit')
    expect(earnedIds(days[6], days.slice(1))).not.toContain('daily-habit')
  })

  it('awards a table once every fact in it was answered across runs', () => {
    const firstHalf = Array.from({ length: 7 }, (_, factor) => multiplication(factor, 7, factor))
    const secondHalf = Array.from({ length: 6 }, (_, offset) =>
      multiplication(offset, 7 + offset, 7),
    )
    const first = makeRun({ id: 1, problems: firstHalf, events: correctEvents(firstHalf) })
    const second = makeRun({ id: 2, problems: secondHalf, events: correctEvents(secondHalf) })

    expect(earnedIds(first, [first])).not.toContain('table-7')
    expect(earnedIds(second, [first, second])).toContain('table-7')
  })
})

describe('longestCorrectStreak', () => {
  it('resets on a miss but not on a skip', () => {
    const run = {
      events: events(['correct', 'correct', 'miss', 'correct', 'skip', 'correct', 'digit']),
    }

    expect(longestCorrectStreak(run)).toBe(2)
  })

  it('is zero with no events', () => {
    expect(longestCorrectStreak({ events: [] })).toBe(0)
  })
})

describe('correctMultiplicationFacts', () => {
  it('treats 3×4 and 4×3 as one fact and ignores misses and division', () => {
    const problems = [
      multiplication(0, 3, 4),
      multiplication(1, 4, 3),
      multiplication(2, 5, 5),
      { id: 3, left: 12, right: 3, operation: 'divide', answer: 4 } as const,
    ]
    const run = makeRun({
      problems,
      events: [
        ...correctEvents([problems[0], problems[1], problems[3]]),
        { time: 0, kind: 'miss', problemId: 2 },
      ],
    })

    expect(correctMultiplicationFacts([run])).toEqual(new Set(['3x4']))
  })
})
