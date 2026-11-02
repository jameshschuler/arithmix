import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router/dom'

import '@/index.css'
import { ThemeProvider } from '@/contexts/theme-context'
import { listenForInstallPrompt } from '@/lib/install-prompt'
import { router } from '@/router'

listenForInstallPrompt()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
)
