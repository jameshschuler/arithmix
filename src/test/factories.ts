import type { Problem, QuizEvent, QuizResult, Run } from '@/types/quiz'

export function makeResult(overrides: Partial<QuizResult> = {}): QuizResult {
  return {
    mode: 'multiply',
    duration: 60,
    seed: 1,
    problems: [],
    events: [],
    correct: 10,
    misses: 0,
    skips: 0,
    elapsedMs: 60_000,
    finishedEarly: false,
    ...overrides,
  }
}

export function makeRun(overrides: Partial<Run> = {}): Run {
  return { id: 1, playedAt: 0, rank: null, ...makeResult(), ...overrides }
}

export function multiplication(id: number, left: number, right: number): Problem {
  return { id, left, right, operation: 'multiply', answer: left * right }
}

export function correctEvents(problems: Problem[]): QuizEvent[] {
  return problems.map((problem) => ({ time: 0, kind: 'correct', problemId: problem.id }))
}
