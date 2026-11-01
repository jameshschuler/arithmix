import { OPERATION_SYMBOLS } from '@/lib/modes'
import type { Problem } from '@/types/quiz'

export function formatProblem(problem: Problem): string {
  return `${problem.left} ${OPERATION_SYMBOLS[problem.operation]} ${problem.right}`
}

export function formatPercent(ratio: number): string {
  return `${Math.round(ratio * 100)}%`
}

export function formatSeconds(milliseconds: number): string {
  return String(Math.max(0, Math.ceil(milliseconds / 1000)))
}

export function formatElapsed(milliseconds: number): string {
  return `${(milliseconds / 1000).toFixed(1)}s`
}
