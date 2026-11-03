import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { SoundSettings } from '@/components/settings/SoundSettings'
import { getPreferences } from '@/lib/preferences'

describe('SoundSettings', () => {
  it('turns music off and back on', () => {
    render(<SoundSettings />)
    const music = screen.getByRole('switch', { name: 'Music' })

    fireEvent.click(music)

    expect(getPreferences().music).toBe(false)
    expect(music).not.toBeChecked()

    fireEvent.click(music)

    expect(getPreferences().music).toBe(true)
  })

  it('shows all three settings', () => {
    render(<SoundSettings />)

    expect(screen.getAllByRole('switch')).toHaveLength(3)
  })
})
