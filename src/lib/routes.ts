import type { Duration, Mode } from '@/types/quiz'

export function playPath(mode: Mode, duration: Duration): string {
  return `/play?${new URLSearchParams({ mode, duration: String(duration) })}`
}
