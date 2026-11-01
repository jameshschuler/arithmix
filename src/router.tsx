import { createBrowserRouter } from 'react-router'

import { AchievementsRoute } from '@/routes/AchievementsRoute'
import { AppLayout } from '@/routes/AppLayout'
import { HomeRoute } from '@/routes/HomeRoute'
import { LeaderboardRoute } from '@/routes/LeaderboardRoute'
import { PlayRoute } from '@/routes/PlayRoute'
import { ResultsRoute } from '@/routes/ResultsRoute'
import { SettingsRoute } from '@/routes/SettingsRoute'

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <HomeRoute /> },
      { path: '/play', element: <PlayRoute /> },
      { path: '/results/:runId', element: <ResultsRoute /> },
      { path: '/leaderboard', element: <LeaderboardRoute /> },
      { path: '/achievements', element: <AchievementsRoute /> },
      { path: '/settings', element: <SettingsRoute /> },
      { path: '*', element: <HomeRoute /> },
    ],
  },
])
