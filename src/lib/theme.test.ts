import { describe, expect, it } from 'vitest'

import { isDarkTheme, parseTheme } from '@/lib/theme'

describe('parseTheme', () => {
  it.each([
    { value: 'light', expected: 'light' },
    { value: 'dark', expected: 'dark' },
    { value: 'system', expected: 'system' },
    { value: 'purple', expected: 'system' },
    { value: null, expected: 'system' },
  ])('reads $value as $expected', ({ value, expected }) => {
    expect(parseTheme(value)).toBe(expected)
  })
})

describe('isDarkTheme', () => {
  it.each([
    { theme: 'dark', systemPrefersDark: false, expected: true },
    { theme: 'light', systemPrefersDark: true, expected: false },
    { theme: 'system', systemPrefersDark: true, expected: true },
    { theme: 'system', systemPrefersDark: false, expected: false },
  ] as const)(
    '$theme with system dark=$systemPrefersDark is $expected',
    ({ theme, systemPrefersDark, expected }) => {
      expect(isDarkTheme(theme, systemPrefersDark)).toBe(expected)
    },
  )
})
