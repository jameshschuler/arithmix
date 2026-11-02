import { Outlet, useLocation } from 'react-router'
import { useRegisterSW } from 'virtual:pwa-register/react'

import { UpdateBanner } from '@/components/app/UpdateBanner'

export function AppLayout() {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW()
  const inQuiz = useLocation().pathname === '/play'

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-2 px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-4">
      {needRefresh && !inQuiz && <UpdateBanner onUpdate={() => updateServiceWorker()} />}
      <Outlet />
    </main>
  )
}
