import { ACHIEVEMENTS_BY_ID, newlyEarnedAchievements } from '@/lib/achievements'
import { db } from '@/lib/db'
import { isNewPersonalBest, topRuns } from '@/lib/leaderboard'
import { rankFor } from '@/lib/scoring'
import type { Duration, Mode, Profile, QuizResult, Run, UnlockedAchievement } from '@/types/quiz'

const PROFILE_ID = 'me'

export const NICKNAME_MAX_LENGTH = 20

export async function saveRun(result: QuizResult, playedAt = Date.now()): Promise<number> {
  return db.transaction('rw', db.runs, db.achievements, db.profile, async () => {
    const profile = await db.profile.get(PROFILE_ID)
    const newRun = { ...result, playedAt, rank: rankFor(result), nickname: profile?.nickname }
    const id = await db.runs.add(newRun)
    const history = await db.runs.toArray()
    const unlockedIds = await db.achievements.toCollection().primaryKeys()
    const earned = newlyEarnedAchievements({ ...newRun, id }, history, new Set(unlockedIds))

    await db.achievements.bulkAdd(
      earned.map((achievement) => ({ id: achievement.id, runId: id, unlockedAt: playedAt })),
    )

    return id
  })
}

export type RunDetails = {
  run: Run
  newPersonalBest: boolean
  unlocked: UnlockedAchievement[]
}

export async function getRunDetails(id: number): Promise<RunDetails | null> {
  const run = await db.runs.get(id)

  if (!run) {
    return null
  }

  const sameQuiz = await runsFor(run.mode, run.duration)
  const unlocked = await db.achievements.where('runId').equals(id).toArray()

  return { run, newPersonalBest: isNewPersonalBest(run, sameQuiz), unlocked }
}

function runsFor(mode: Mode, duration: Duration): Promise<Run[]> {
  return db.runs.where('[mode+duration]').equals([mode, duration]).toArray()
}

export async function getTopRuns(mode: Mode, duration: Duration): Promise<Run[]> {
  const runs = await runsFor(mode, duration)

  return topRuns(runs)
}

export async function getPersonalBest(mode: Mode, duration: Duration): Promise<Run | null> {
  const runs = await runsFor(mode, duration)

  return topRuns(runs, 1)[0] ?? null
}

export function getUnlockedAchievements(): Promise<UnlockedAchievement[]> {
  return db.achievements.filter((achievement) => ACHIEVEMENTS_BY_ID.has(achievement.id)).toArray()
}

export async function getNickname(): Promise<string> {
  const profile = await db.profile.get(PROFILE_ID)

  return profile?.nickname ?? ''
}

export async function saveNickname(nickname: string): Promise<void> {
  const trimmed = nickname.trim().slice(0, NICKNAME_MAX_LENGTH)
  const profile: Profile = { id: PROFILE_ID, ...(trimmed && { nickname: trimmed }) }

  await db.profile.put(profile)
}
