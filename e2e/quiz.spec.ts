import { expect, test } from '@playwright/test'

import { answerCorrectly, answerWrong, startQuiz } from './helpers'

test('a 30 second quiz ends on time and scores every answer', async ({ page }) => {
  await startQuiz(page, 'mixed', 30)
  const startedAt = Date.now()

  await answerCorrectly(page)
  await answerWrong(page)
  await answerCorrectly(page)
  await page.getByRole('button', { name: 'Skip' }).dispatchEvent('pointerdown')
  await answerCorrectly(page)
  await expect(page.getByLabel('Correct answers')).toHaveText('3/50')

  await page.waitForURL(/\/results\/\d+$/, { timeout: 35_000 })
  const elapsed = Date.now() - startedAt

  expect(elapsed).toBeGreaterThanOrEqual(29_500)
  expect(elapsed).toBeLessThan(33_000)
  await expect(page.getByText('correct', { exact: true })).toBeVisible()
  await expect(page.locator('span.text-7xl')).toHaveText('3')
  await expect(page.getByText('30.0s')).toBeVisible()
  await expect(page.getByText('Misses').locator('..')).toContainText('1')
  await expect(page.getByText('Skips').locator('..')).toContainText('1')
})

test('results survive a reload and show on the leaderboard', async ({ page }) => {
  await startQuiz(page, 'multiply', 30)
  await answerCorrectly(page)
  await answerCorrectly(page)
  await page.waitForURL(/\/results\/\d+$/, { timeout: 35_000 })

  await page.reload()
  await expect(page.locator('span.text-7xl')).toHaveText('2')

  await page.goto('/leaderboard')
  await page.getByRole('button', { name: '30s' }).click()
  await expect(page.getByText('2 correct')).toBeVisible()
})

test('leaving the app mid-quiz voids the run', async ({ page }) => {
  await startQuiz(page, 'divide', 60)
  await answerCorrectly(page)

  await page.evaluate(() => {
    Object.defineProperty(document, 'visibilityState', { value: 'hidden', configurable: true })
    document.dispatchEvent(new Event('visibilitychange'))
  })

  await expect(page.getByText('Quiz stopped')).toBeVisible()
})
