export type Theme = 'system' | 'light' | 'dark'

export const THEMES: { id: Theme; label: string }[] = [
  { id: 'system', label: 'System' },
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
]

export const THEME_STORAGE_KEY = 'arithmix-theme'

export const THEME_COLORS = { light: '#ffffff', dark: '#0a0a0a' }

export function parseTheme(value: string | null): Theme {
  return value === 'light' || value === 'dark' ? value : 'system'
}

export function isDarkTheme(theme: Theme, systemPrefersDark: boolean): boolean {
  return theme === 'dark' || (theme === 'system' && systemPrefersDark)
}
