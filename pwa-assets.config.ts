import { defineConfig, minimal2023Preset } from '@vite-pwa/assets-generator/config'

import { BRAND_COLOR } from './src/lib/theme.ts'

export default defineConfig({
  headLinkOptions: { preset: '2023' },
  preset: {
    ...minimal2023Preset,
    maskable: { ...minimal2023Preset.maskable, resizeOptions: { background: BRAND_COLOR } },
    apple: { ...minimal2023Preset.apple, resizeOptions: { background: BRAND_COLOR } },
  },
  images: ['public/favicon.svg'],
})
