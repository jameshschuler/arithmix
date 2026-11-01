import { describe, expect, it } from 'vitest'

import { playPath } from '@/lib/routes'

describe('playPath', () => {
  it('encodes mode and duration as query params', () => {
    expect(playPath('divide', 90)).toBe('/play?mode=divide&duration=90')
  })
})
