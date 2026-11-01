import type { Mode, QuizResult, Rank } from '@/types/quiz'

const MIN_ACCURACY_FOR_GOLD = 0.9

const RANKS_BY_CORRECT_PER_MINUTE: { rank: Rank; perMinute: number }[] = [
  { rank: { tier: 'gold', stars: 3 }, perMinute: 50 },
  { rank: { tier: 'gold', stars: 2 }, perMinute: 42 },
  { rank: { tier: 'gold', stars: 1 }, perMinute: 35 },
  { rank: { tier: 'silver', stars: 3 }, perMinute: 30 },
  { rank: { tier: 'silver', stars: 2 }, perMinute: 25 },
  { rank: { tier: 'silver', stars: 1 }, perMinute: 20 },
  { rank: { tier: 'bronze', stars: 3 }, perMinute: 15 },
  { rank: { tier: 'bronze', stars: 2 }, perMinute: 10 },
  { rank: { tier: 'bronze', stars: 1 }, perMinute: 5 },
]

const MODE_DIFFICULTY: Record<Mode, number> = {
  multiply: 1,
  divide: 0.85,
  mixed: 0.9,
}

export function accuracy({ correct, misses }: Pick<QuizResult, 'correct' | 'misses'>): number {
  const attempts = correct + misses

  return attempts === 0 ? 0 : correct / attempts
}

export function rankFor(
  result: Pick<QuizResult, 'mode' | 'correct' | 'misses' | 'elapsedMs'>,
): Rank | null {
  if (result.elapsedMs <= 0) {
    return null
  }

  const correctPerMinute = (result.correct * 60_000) / result.elapsedMs
  const goldAllowed = accuracy(result) >= MIN_ACCURACY_FOR_GOLD
  const earned = RANKS_BY_CORRECT_PER_MINUTE.find(
    ({ rank, perMinute }) =>
      (goldAllowed || rank.tier !== 'gold') &&
      correctPerMinute >= perMinute * MODE_DIFFICULTY[result.mode],
  )

  return earned?.rank ?? null
}
