import type { Run } from '@/types/quiz'

export const LEADERBOARD_SIZE = 10

export function compareRuns(left: Run, right: Run): number {
  return (
    right.correct - left.correct ||
    left.elapsedMs - right.elapsedMs ||
    left.playedAt - right.playedAt
  )
}

export function topRuns(runs: Run[], limit = LEADERBOARD_SIZE): Run[] {
  return [...runs].sort(compareRuns).slice(0, limit)
}

export function isNewPersonalBest(run: Run, runs: Run[]): boolean {
  const earlier = runs.filter(
    (other) =>
      other.mode === run.mode && other.duration === run.duration && other.playedAt < run.playedAt,
  )

  return run.correct > 0 && earlier.every((other) => compareRuns(run, other) < 0)
}
