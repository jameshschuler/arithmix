import { describe, expect, it } from 'vitest'

import { accuracy, rankFor } from '@/lib/scoring'

describe('accuracy', () => {
  it.each([
    { correct: 0, misses: 0, expected: 0 },
    { correct: 9, misses: 1, expected: 0.9 },
    { correct: 5, misses: 0, expected: 1 },
  ])('is $expected for $correct correct and $misses misses', ({ correct, misses, expected }) => {
    expect(accuracy({ correct, misses })).toBe(expected)
  })
})

describe('rankFor', () => {
  it.each([
    { correct: 4, elapsedMs: 60_000, expected: null },
    { correct: 5, elapsedMs: 60_000, expected: { tier: 'bronze', stars: 1 } },
    { correct: 15, elapsedMs: 60_000, expected: { tier: 'bronze', stars: 3 } },
    { correct: 20, elapsedMs: 60_000, expected: { tier: 'silver', stars: 1 } },
    { correct: 35, elapsedMs: 60_000, expected: { tier: 'gold', stars: 1 } },
    { correct: 50, elapsedMs: 60_000, expected: { tier: 'gold', stars: 3 } },
    { correct: 25, elapsedMs: 30_000, expected: { tier: 'gold', stars: 3 } },
    { correct: 50, elapsedMs: 70_000, expected: { tier: 'gold', stars: 2 } },
  ])('ranks $correct correct in $elapsedMs ms as $expected', ({ correct, elapsedMs, expected }) => {
    expect(rankFor({ mode: 'multiply', correct, misses: 0, elapsedMs })).toEqual(expected)
  })

  it('scales thresholds down for division', () => {
    expect(rankFor({ mode: 'divide', correct: 17, misses: 0, elapsedMs: 60_000 })).toEqual({
      tier: 'silver',
      stars: 1,
    })
  })

  it('caps rank at silver when accuracy is below 90%', () => {
    expect(rankFor({ mode: 'multiply', correct: 50, misses: 10, elapsedMs: 60_000 })).toEqual({
      tier: 'silver',
      stars: 3,
    })
  })

  it('returns null when no time has elapsed', () => {
    expect(rankFor({ mode: 'multiply', correct: 0, misses: 0, elapsedMs: 0 })).toBeNull()
  })
})
