import { describe, expect, it } from 'vitest'

import { formatElapsed, formatPercent, formatProblem, formatSeconds } from '@/lib/format'

describe('formatProblem', () => {
  it.each([
    { problem: { id: 0, left: 7, right: 8, operation: 'multiply', answer: 56 }, expected: '7 × 8' },
    { problem: { id: 0, left: 56, right: 8, operation: 'divide', answer: 7 }, expected: '56 ÷ 8' },
  ] as const)('formats $expected', ({ problem, expected }) => {
    expect(formatProblem(problem)).toBe(expected)
  })
})

describe('formatPercent', () => {
  it.each([
    { ratio: 0, expected: '0%' },
    { ratio: 0.926, expected: '93%' },
    { ratio: 1, expected: '100%' },
  ])('formats $ratio as $expected', ({ ratio, expected }) => {
    expect(formatPercent(ratio)).toBe(expected)
  })
})

describe('formatSeconds', () => {
  it.each([
    { milliseconds: 60_000, expected: '60' },
    { milliseconds: 59_001, expected: '60' },
    { milliseconds: 59_000, expected: '59' },
    { milliseconds: 1, expected: '1' },
    { milliseconds: 0, expected: '0' },
    { milliseconds: -50, expected: '0' },
  ])('shows $milliseconds ms as $expected', ({ milliseconds, expected }) => {
    expect(formatSeconds(milliseconds)).toBe(expected)
  })
})

describe('formatElapsed', () => {
  it('shows tenths of a second', () => {
    expect(formatElapsed(47_260)).toBe('47.3s')
  })
})
