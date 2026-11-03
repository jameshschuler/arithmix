import { describe, expect, it } from 'vitest'

import { achievementRevealDelay, easeOutCubic, starRevealDelay } from '@/lib/celebration'

describe('starRevealDelay', () => {
  it('spaces stars out evenly', () => {
    expect(starRevealDelay(1) - starRevealDelay(0)).toBeCloseTo(
      starRevealDelay(2) - starRevealDelay(1),
    )
  })
})

describe('achievementRevealDelay', () => {
  it('comes after the last star', () => {
    expect(achievementRevealDelay(3)).toBeGreaterThan(starRevealDelay(2))
  })

  it('comes first when there are no stars', () => {
    expect(achievementRevealDelay(0)).toBeLessThan(starRevealDelay(1))
  })
})

describe('easeOutCubic', () => {
  it.each([
    { progress: -1, expected: 0 },
    { progress: 0, expected: 0 },
    { progress: 0.5, expected: 0.875 },
    { progress: 1, expected: 1 },
    { progress: 2, expected: 1 },
  ])('maps $progress to $expected', ({ progress, expected }) => {
    expect(easeOutCubic(progress)).toBeCloseTo(expected)
  })
})
