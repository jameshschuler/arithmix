import { QuizSetup } from '@/components/home/QuizSetup'

export function HomeRoute() {
  return (
    <>
      <header className="flex flex-col gap-1 py-6">
        <h1 className="text-4xl font-semibold text-primary">Arithmix</h1>
        <p className="text-muted-foreground">How many can you get before time runs out?</p>
      </header>
      <QuizSetup />
    </>
  )
}
