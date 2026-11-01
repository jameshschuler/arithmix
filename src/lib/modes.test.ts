import { describe, expect, it } from 'vitest'

import { isDuration, isMode } from '@/lib/modes'

describe('isMode', () => {
  it.each([
    { value: 'multiply', expected: true },
    { value: 'mixed', expected: true },
    { value: 'add', expected: false },
    { value: null, expected: false },
  ])('is $expected for $value', ({ value, expected }) => {
    expect(isMode(value)).toBe(expected)
  })
})

describe('isDuration', () => {
  it.each([
    { value: 30, expected: true },
    { value: 90, expected: true },
    { value: 45, expected: false },
    { value: Number.NaN, expected: false },
  ])('is $expected for $value', ({ value, expected }) => {
    expect(isDuration(value)).toBe(expected)
  })
})
