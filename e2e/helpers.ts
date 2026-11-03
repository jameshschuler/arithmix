import { expect, type Page } from '@playwright/test'

const COUNTDOWN_MS = 3000

export async function startQuiz(page: Page, mode: string, duration: number) {
  await page.goto(`/play?mode=${mode}&duration=${duration}`)
  await expect(page.getByLabel('Problem')).toBeVisible({ timeout: COUNTDOWN_MS + 2000 })
}

export async function currentAnswer(page: Page): Promise<number> {
  const problem = await page.getByLabel('Problem').innerText()
  const [left, operator, right] = problem.split(' ')

  return operator === '×' ? Number(left) * Number(right) : Number(left) / Number(right)
}

export async function tapDigits(page: Page, digits: string) {
  for (const digit of digits) {
    await page.getByRole('button', { name: digit, exact: true }).dispatchEvent('pointerdown')
  }
}

export async function answerCorrectly(page: Page) {
  const answer = await currentAnswer(page)
  await tapDigits(page, String(answer))
}

export async function answerWrong(page: Page) {
  const answer = await currentAnswer(page)
  const wrong = [...String(answer)].map((digit) => String((Number(digit) + 1) % 10)).join('')
  await tapDigits(page, wrong)
}
