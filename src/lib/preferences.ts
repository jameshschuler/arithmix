export type Preferences = {
  soundEffects: boolean
  music: boolean
  vibration: boolean
}

export const PREFERENCES_STORAGE_KEY = 'arithmix-preferences'

const DEFAULT_PREFERENCES: Preferences = { soundEffects: true, music: true, vibration: true }

const listeners = new Set<() => void>()
let cached: Preferences | null = null

function readStored(value: string | null): Record<string, unknown> {
  try {
    const parsed: unknown = JSON.parse(value ?? '{}')

    return typeof parsed === 'object' && parsed !== null ? (parsed as Record<string, unknown>) : {}
  } catch {
    return {}
  }
}

function readFlag(value: unknown, fallback: boolean): boolean {
  return typeof value === 'boolean' ? value : fallback
}

export function parsePreferences(value: string | null): Preferences {
  const stored = readStored(value)

  return {
    soundEffects: readFlag(stored.soundEffects, DEFAULT_PREFERENCES.soundEffects),
    music: readFlag(stored.music, DEFAULT_PREFERENCES.music),
    vibration: readFlag(stored.vibration, DEFAULT_PREFERENCES.vibration),
  }
}

export function getPreferences(): Preferences {
  cached ??= parsePreferences(localStorage.getItem(PREFERENCES_STORAGE_KEY))

  return cached
}

export function setPreference(key: keyof Preferences, value: boolean) {
  cached = { ...getPreferences(), [key]: value }
  try {
    localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(cached))
  } catch {
    // Storage can be full or blocked; the choice still applies for this session.
  }

  listeners.forEach((listener) => listener())
}

export function subscribeToPreferences(listener: () => void): () => void {
  listeners.add(listener)

  return () => listeners.delete(listener)
}
