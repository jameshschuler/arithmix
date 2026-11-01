import { describe, expect, it } from 'vitest'

import { createRandom, shuffle } from '@/lib/random'

describe('createRandom', () => {
  it('returns the same sequence for the same seed', () => {
    const first = createRandom(42)
    const second = createRandom(42)

    expect([first(), first(), first()]).toEqual([second(), second(), second()])
  })

  it('returns different sequences for different seeds', () => {
    expect(createRandom(1)()).not.toBe(createRandom(2)())
  })

  it('returns values in [0, 1)', () => {
    const random = createRandom(7)
    const values = Array.from({ length: 1000 }, random)

    expect(values.every((value) => value >= 0 && value < 1)).toBe(true)
  })
})

describe('shuffle', () => {
  it('keeps every item and does not mutate the input', () => {
    const items = [1, 2, 3, 4, 5, 6, 7, 8]
    const shuffled = shuffle(items, createRandom(3))

    expect(items).toEqual([1, 2, 3, 4, 5, 6, 7, 8])
    expect([...shuffled].sort((left, right) => left - right)).toEqual(items)
  })

  it('handles an empty list', () => {
    expect(shuffle([], createRandom(1))).toEqual([])
  })
})
