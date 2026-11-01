const MS_PER_DAY = 86_400_000

export function localDayNumber(timestamp: number): number {
  const date = new Date(timestamp)

  return Math.round(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / MS_PER_DAY)
}

export function consecutiveDaysEndingOn(timestamps: number[], endTimestamp: number): number {
  const days = new Set(timestamps.map(localDayNumber))
  let day = localDayNumber(endTimestamp)
  let count = 0

  while (days.has(day)) {
    count++
    day--
  }

  return count
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}
