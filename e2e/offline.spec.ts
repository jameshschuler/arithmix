import { expect, test } from '@playwright/test'

import { answerCorrectly, startQuiz } from './helpers'

test('plays a quiz with no network after the first visit', async ({ page, context }) => {
  await page.goto('/leaderboard')
  await page.evaluate(() => navigator.serviceWorker.ready)
  await page.reload()

  await context.setOffline(true)

  await startQuiz(page, 'multiply', 30)
  await answerCorrectly(page)
  await expect(page.getByLabel('Correct answers')).toHaveText('1/50')
})
