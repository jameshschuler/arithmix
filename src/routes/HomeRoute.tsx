import { useLiveQuery } from 'dexie-react-hooks'

import { HomeNav } from '@/components/home/HomeNav'
import { QuizSetup } from '@/components/home/QuizSetup'
import { getNickname } from '@/lib/storage'

export function HomeRoute() {
  const nickname = useLiveQuery(getNickname)

  return (
    <>
      <HomeNav />
      <header className="flex flex-col gap-1 pb-6">
        <h1 className="text-4xl font-semibold text-primary">Arithmix</h1>
        <p className="text-muted-foreground">
          {nickname ? `Ready, ${nickname}? ` : ''}How many can you get before time runs out?
        </p>
      </header>
      <QuizSetup />
    </>
  )
}
