import { Dexie, type EntityTable } from 'dexie'

import type { Profile, Run, UnlockedAchievement } from '@/types/quiz'

export const db = new Dexie('arithmix') as Dexie & {
  runs: EntityTable<Run, 'id'>
  achievements: EntityTable<UnlockedAchievement, 'id'>
  profile: EntityTable<Profile, 'id'>
}

db.version(1).stores({
  runs: '++id, [mode+duration], playedAt',
  achievements: 'id, runId',
  profile: 'id',
})
