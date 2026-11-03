import { beforeEach, describe, expect, it, vi } from 'vitest'

import { parsePreferences, PREFERENCES_STORAGE_KEY } from '@/lib/preferences'

describe('parsePreferences', () => {
  it.each([
    { value: null, expected: { soundEffects: true, music: true, vibration: true } },
    { value: 'not json', expected: { soundEffects: true, music: true, vibration: true } },
    { value: '[1]', expected: { soundEffects: true, music: true, vibration: true } },
    {
      value: '{"music":false,"vibration":"no"}',
      expected: { soundEffects: true, music: false, vibration: true },
    },
  ])('reads $value', ({ value, expected }) => {
    expect(parsePreferences(value)).toEqual(expected)
  })
})

describe('setPreference', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.resetModules()
  })

  it('saves the change and notifies subscribers', async () => {
    const preferences = await import('@/lib/preferences')
    const listener = vi.fn()
    preferences.subscribeToPreferences(listener)

    preferences.setPreference('music', false)

    expect(preferences.getPreferences().music).toBe(false)
    expect(JSON.parse(localStorage.getItem(PREFERENCES_STORAGE_KEY) ?? '{}')).toMatchObject({
      music: false,
    })
    expect(listener).toHaveBeenCalledOnce()
  })
})
