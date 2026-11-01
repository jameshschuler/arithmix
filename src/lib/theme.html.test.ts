import { describe, expect, it } from 'vitest'

import { THEME_COLORS, THEME_STORAGE_KEY } from '@/lib/theme'

import html from '../../index.html?raw'

describe('index.html theme bootstrap', () => {
  it('reads the same storage key as the app', () => {
    expect(html).toContain(`localStorage.getItem('${THEME_STORAGE_KEY}')`)
  })

  it('uses the same theme colors as the app', () => {
    expect(html).toContain(`content="${THEME_COLORS.light}"`)
    expect(html).toContain(`.content = '${THEME_COLORS.dark}'`)
  })
})
