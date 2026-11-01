import type { Duration, Mode, Operation } from '@/types/quiz'

export const MODES: { id: Mode; label: string }[] = [
  { id: 'multiply', label: 'Multiply' },
  { id: 'divide', label: 'Divide' },
  { id: 'mixed', label: 'Mixed' },
]

export const DURATIONS: Duration[] = [30, 60, 90]

export const OPERATION_SYMBOLS: Record<Operation, string> = {
  multiply: '×',
  divide: '÷',
}

export function isMode(value: string | null): value is Mode {
  return MODES.some((mode) => mode.id === value)
}

export function isDuration(value: number): value is Duration {
  return DURATIONS.includes(value as Duration)
}
