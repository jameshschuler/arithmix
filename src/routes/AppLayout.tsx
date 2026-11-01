import { Outlet } from 'react-router'

export function AppLayout() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-4">
      <Outlet />
    </main>
  )
}
