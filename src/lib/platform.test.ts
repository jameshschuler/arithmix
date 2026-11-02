import { describe, expect, it, vi } from 'vitest'

import { canAddToHomeScreen, isStandalone } from '@/lib/platform'

const IPHONE =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1'
const MAC =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15'
const IPHONE_IN_APP =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 350.0'
const ANDROID =
  'Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Mobile Safari/537.36'

describe('canAddToHomeScreen', () => {
  it.each([
    { device: 'iPhone Safari', userAgent: IPHONE, maxTouchPoints: 5, expected: true },
    {
      device: 'iPhone in-app browser',
      userAgent: IPHONE_IN_APP,
      maxTouchPoints: 5,
      expected: false,
    },
    { device: 'iPad reporting as a Mac', userAgent: MAC, maxTouchPoints: 5, expected: true },
    { device: 'Mac', userAgent: MAC, maxTouchPoints: 0, expected: false },
    { device: 'Android', userAgent: ANDROID, maxTouchPoints: 5, expected: false },
  ])('is $expected for $device', ({ userAgent, maxTouchPoints, expected }) => {
    expect(canAddToHomeScreen(userAgent, maxTouchPoints)).toBe(expected)
  })
})

describe('isStandalone', () => {
  it('is true when launched from the home screen', () => {
    vi.stubGlobal('matchMedia', () => ({ matches: true }))

    expect(isStandalone()).toBe(true)
  })

  it('is false in a browser tab', () => {
    vi.stubGlobal('matchMedia', () => ({ matches: false }))

    expect(isStandalone()).toBe(false)
  })
})
