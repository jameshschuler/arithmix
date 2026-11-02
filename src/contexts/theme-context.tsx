import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

import { useSystemPrefersDark } from '@/hooks/useSystemPrefersDark'
import { isDarkTheme, parseTheme, THEME_COLORS, THEME_STORAGE_KEY, type Theme } from '@/lib/theme'

export type ThemeContextValue = { theme: Theme; setTheme: (theme: Theme) => void }

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState(() => parseTheme(localStorage.getItem(THEME_STORAGE_KEY)))
  const dark = isDarkTheme(theme, useSystemPrefersDark())

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', dark ? THEME_COLORS.dark : THEME_COLORS.light)
  }, [dark])

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

export function useThemeContext(): ThemeContextValue {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useThemeContext must be used inside ThemeProvider')
  }

  return context
}
