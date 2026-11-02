import { beforeEach, describe, expect, it } from 'vitest'

import { db } from '@/lib/db'
import {
  getNickname,
  getPersonalBest,
  getRunDetails,
  getTopRuns,
  getUnlockedAchievements,
  saveNickname,
  saveRun,
} from '@/lib/storage'
import { makeResult } from '@/test/factories'

beforeEach(async () => {
  await db.delete()
  await db.open()
})

describe('saveRun', () => {
  it('stores the run with its rank and the current nickname', async () => {
    await saveNickname('Ada')
    const id = await saveRun(makeResult({ correct: 20 }), 1000)
    const details = await getRunDetails(id)

    expect(details?.run).toMatchObject({
      id,
      correct: 20,
      playedAt: 1000,
      nickname: 'Ada',
      rank: { tier: 'silver', stars: 1 },
    })
  })

  it('unlocks achievements once, tied to the run that earned them', async () => {
    const first = await saveRun(makeResult(), 1000)
    const second = await saveRun(makeResult(), 2000)

    const firstDetails = await getRunDetails(first)
    const secondDetails = await getRunDetails(second)
    const unlocked = await getUnlockedAchievements()

    expect(firstDetails?.unlocked.map((achievement) => achievement.id)).toEqual(['first-steps'])
    expect(secondDetails?.unlocked).toEqual([])
    expect(unlocked).toEqual([{ id: 'first-steps', runId: first, unlockedAt: 1000 }])
  })
})

describe('getRunDetails', () => {
  it('returns null for an unknown run', async () => {
    await expect(getRunDetails(999)).resolves.toBeNull()
  })

  it('flags a new personal best only when it beats earlier runs', async () => {
    await saveRun(makeResult({ correct: 20 }), 1000)
    const worse = await saveRun(makeResult({ correct: 15 }), 2000)
    const better = await saveRun(makeResult({ correct: 25 }), 3000)

    const worseDetails = await getRunDetails(worse)
    const betterDetails = await getRunDetails(better)

    expect(worseDetails?.newPersonalBest).toBe(false)
    expect(betterDetails?.newPersonalBest).toBe(true)
  })
})

describe('getTopRuns and getPersonalBest', () => {
  it('only include runs for the requested mode and duration', async () => {
    await saveRun(makeResult({ correct: 20 }), 1000)
    await saveRun(makeResult({ correct: 30 }), 2000)
    await saveRun(makeResult({ correct: 45, mode: 'divide' }), 3000)
    await saveRun(makeResult({ correct: 45, duration: 30 }), 4000)

    const top = await getTopRuns('multiply', 60)
    const best = await getPersonalBest('multiply', 60)

    expect(top.map((run) => run.correct)).toEqual([30, 20])
    expect(best?.correct).toBe(30)
  })

  it('return empty results when nothing was played', async () => {
    await expect(getTopRuns('mixed', 90)).resolves.toEqual([])
    await expect(getPersonalBest('mixed', 90)).resolves.toBeNull()
  })
})

describe('nickname', () => {
  it('is empty by default', async () => {
    await expect(getNickname()).resolves.toBe('')
  })

  it('is trimmed and capped at 20 characters', async () => {
    await saveNickname('   Captain Multiplication Pants  ')

    await expect(getNickname()).resolves.toBe('Captain Multiplicati')
  })

  it('can be cleared', async () => {
    await saveNickname('Ada')
    await saveNickname('  ')

    await expect(getNickname()).resolves.toBe('')
  })
})

describe('getUnlockedAchievements', () => {
  it('ignores stored achievements that no longer exist', async () => {
    await db.achievements.bulkAdd([
      { id: 'first-steps', runId: 1, unlockedAt: 1 },
      { id: 'retired-achievement', runId: 1, unlockedAt: 1 },
    ])

    const unlocked = await getUnlockedAchievements()

    expect(unlocked.map((achievement) => achievement.id)).toEqual(['first-steps'])
  })
})
