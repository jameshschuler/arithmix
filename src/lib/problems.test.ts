import { describe, expect, it } from 'vitest'

import { generateProblems, PROBLEMS_PER_QUIZ } from '@/lib/problems'

describe('generateProblems', () => {
  it('returns 50 problems with sequential ids', () => {
    const problems = generateProblems('multiply', 1)

    expect(problems).toHaveLength(PROBLEMS_PER_QUIZ)
    expect(problems.map((problem) => problem.id)).toEqual([...Array(PROBLEMS_PER_QUIZ).keys()])
  })

  it('is deterministic for a seed', () => {
    expect(generateProblems('mixed', 99)).toEqual(generateProblems('mixed', 99))
  })

  it('never repeats a fact within a quiz', () => {
    const problems = generateProblems('mixed', 5)
    const facts = new Set(
      problems.map((problem) => `${problem.left}${problem.operation}${problem.right}`),
    )

    expect(facts.size).toBe(problems.length)
  })

  it('keeps multiplication factors within 0–12', () => {
    const problems = generateProblems('multiply', 11, 169)

    expect(problems).toHaveLength(169)
    expect(
      problems.every(
        (problem) =>
          problem.operation === 'multiply' &&
          problem.left >= 0 &&
          problem.left <= 12 &&
          problem.right >= 0 &&
          problem.right <= 12 &&
          problem.answer === problem.left * problem.right,
      ),
    ).toBe(true)
  })

  it('makes division problems with whole answers and no zero divisor', () => {
    const problems = generateProblems('divide', 3, 156)

    expect(problems).toHaveLength(156)
    expect(
      problems.every(
        (problem) =>
          problem.operation === 'divide' &&
          problem.right >= 1 &&
          problem.right <= 12 &&
          problem.answer >= 0 &&
          problem.answer <= 12 &&
          problem.answer * problem.right === problem.left,
      ),
    ).toBe(true)
  })

  it('mixes both operations in mixed mode', () => {
    const operations = new Set(generateProblems('mixed', 8).map((problem) => problem.operation))

    expect(operations).toEqual(new Set(['multiply', 'divide']))
  })
})
