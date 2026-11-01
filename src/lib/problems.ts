import { createRandom, shuffle } from '@/lib/random'
import type { Mode, Operation, Problem } from '@/types/quiz'

export const PROBLEMS_PER_QUIZ = 50

const FACT_MIN = 0
const FACT_MAX = 12

type Fact = Omit<Problem, 'id'>

function factorRange(min: number): number[] {
  return Array.from({ length: FACT_MAX - min + 1 }, (_, offset) => min + offset)
}

function multiplicationFacts(): Fact[] {
  return factorRange(FACT_MIN).flatMap((left) =>
    factorRange(FACT_MIN).map((right) => ({
      left,
      right,
      operation: 'multiply' as const,
      answer: left * right,
    })),
  )
}

function divisionFacts(): Fact[] {
  return factorRange(FACT_MIN).flatMap((quotient) =>
    factorRange(1).map((divisor) => ({
      left: quotient * divisor,
      right: divisor,
      operation: 'divide' as const,
      answer: quotient,
    })),
  )
}

const FACTS_BY_OPERATION: Record<Operation, Fact[]> = {
  multiply: multiplicationFacts(),
  divide: divisionFacts(),
}

const OPERATIONS_BY_MODE: Record<Mode, Operation[]> = {
  multiply: ['multiply'],
  divide: ['divide'],
  mixed: ['multiply', 'divide'],
}

export function generateProblems(mode: Mode, seed: number, count = PROBLEMS_PER_QUIZ): Problem[] {
  const facts = OPERATIONS_BY_MODE[mode].flatMap((operation) => FACTS_BY_OPERATION[operation])

  return shuffle(facts, createRandom(seed))
    .slice(0, count)
    .map((fact, id) => ({ id, ...fact }))
}
