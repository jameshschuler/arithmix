const STAR_REVEAL_START_SECONDS = 0.4
const STAR_REVEAL_GAP_SECONDS = 0.35

export const SCORE_COUNT_UP_MS = 700

export function starRevealDelay(index: number): number {
  return STAR_REVEAL_START_SECONDS + index * STAR_REVEAL_GAP_SECONDS
}

export function achievementRevealDelay(stars: number): number {
  return starRevealDelay(stars) + 0.2
}

export function easeOutCubic(progress: number): number {
  return 1 - (1 - Math.min(1, Math.max(0, progress))) ** 3
}
