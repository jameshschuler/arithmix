import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ThemePicker } from '@/components/settings/ThemePicker'
import { ThemeProvider } from '@/contexts/theme-context'
import { THEME_STORAGE_KEY } from '@/lib/theme'

function mockSystemDark(matches: boolean) {
  vi.stubGlobal('matchMedia', () => ({
    matches,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }))
}

function renderPicker() {
  render(
    <ThemeProvider>
      <ThemePicker />
    </ThemeProvider>,
  )
}

beforeEach(() => {
  localStorage.clear()
  document.documentElement.classList.remove('dark')
})

describe('ThemePicker', () => {
  it('follows the system preference by default', () => {
    mockSystemDark(true)
    renderPicker()

    expect(screen.getByRole('button', { name: 'System' })).toHaveAttribute('aria-pressed', 'true')
    expect(document.documentElement).toHaveClass('dark')
  })

  it('switches to dark and remembers the choice', () => {
    mockSystemDark(false)
    renderPicker()

    fireEvent.click(screen.getByRole('button', { name: 'Dark' }))

    expect(document.documentElement).toHaveClass('dark')
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark')
  })

  it('restores a saved light theme even when the system is dark', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'light')
    mockSystemDark(true)
    renderPicker()

    expect(screen.getByRole('button', { name: 'Light' })).toHaveAttribute('aria-pressed', 'true')
    expect(document.documentElement).not.toHaveClass('dark')
  })
})
