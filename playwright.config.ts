import { defineConfig, devices } from '@playwright/test'

const PORT = 4300

export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  fullyParallel: true,
  reporter: 'list',
  use: {
    ...devices['Pixel 7'],
    channel: 'chrome',
    baseURL: `http://localhost:${PORT}`,
  },
  webServer: {
    command: `pnpm build && pnpm preview --port ${PORT} --strictPort`,
    port: PORT,
    reuseExistingServer: false,
  },
})
