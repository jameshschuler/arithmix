import { describe, expect, it } from 'vitest'

import { isNewPersonalBest, topRuns } from '@/lib/leaderboard'
import { makeRun } from '@/test/factories'

describe('topRuns', () => {
  it('orders by correct, then faster time, then earlier play', () => {
    const runs = [
      makeRun({ id: 1, correct: 20, elapsedMs: 60_000, playedAt: 3 }),
      makeRun({ id: 2, correct: 30, elapsedMs: 60_000, playedAt: 2 }),
      makeRun({ id: 3, correct: 20, elapsedMs: 50_000, playedAt: 4 }),
      makeRun({ id: 4, correct: 20, elapsedMs: 60_000, playedAt: 1 }),
    ]

    expect(topRuns(runs).map((run) => run.id)).toEqual([2, 3, 4, 1])
  })

  it('limits the list', () => {
    const runs = Array.from({ length: 15 }, (_, index) => makeRun({ id: index }))

    expect(topRuns(runs)).toHaveLength(10)
  })

  it('returns an empty list for no runs', () => {
    expect(topRuns([])).toEqual([])
  })
})

describe('isNewPersonalBest', () => {
  const earlier = makeRun({ id: 1, correct: 20, playedAt: 1 })

  it('is true for a first run with a score', () => {
    const run = makeRun({ id: 1, correct: 5, playedAt: 1 })

    expect(isNewPersonalBest(run, [run])).toBe(true)
  })

  it('is false for a first run with no correct answers', () => {
    const run = makeRun({ id: 1, correct: 0, playedAt: 1 })

    expect(isNewPersonalBest(run, [run])).toBe(false)
  })

  it('is true when beating every earlier run', () => {
    const run = makeRun({ id: 2, correct: 21, playedAt: 2 })

    expect(isNewPersonalBest(run, [earlier, run])).toBe(true)
  })

  it('is false when only tying an earlier run', () => {
    const run = makeRun({ id: 2, correct: 20, playedAt: 2 })

    expect(isNewPersonalBest(run, [earlier, run])).toBe(false)
  })

  it('ignores runs from other modes and durations', () => {
    const otherMode = makeRun({ id: 3, mode: 'divide', correct: 40, playedAt: 1 })
    const otherDuration = makeRun({ id: 4, duration: 90, correct: 40, playedAt: 1 })
    const run = makeRun({ id: 2, correct: 21, playedAt: 2 })

    expect(isNewPersonalBest(run, [earlier, otherMode, otherDuration, run])).toBe(true)
  })
})
