import type { Tier } from '@/types/quiz'

export const TIER_LABELS: Record<Tier, string> = {
  bronze: 'Bronze',
  silver: 'Silver',
  gold: 'Gold',
}

export const TIER_STAR_CLASSES: Record<Tier, string> = {
  bronze: 'fill-bronze text-bronze',
  silver: 'fill-silver text-silver',
  gold: 'fill-gold text-gold',
}
