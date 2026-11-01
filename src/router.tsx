import { createBrowserRouter } from 'react-router'

import { AppLayout } from '@/routes/AppLayout'
import { HomeRoute } from '@/routes/HomeRoute'
import { PlayRoute } from '@/routes/PlayRoute'
import { ResultsRoute } from '@/routes/ResultsRoute'

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <HomeRoute /> },
      { path: '/play', element: <PlayRoute /> },
      { path: '/results', element: <ResultsRoute /> },
      { path: '*', element: <HomeRoute /> },
    ],
  },
])
