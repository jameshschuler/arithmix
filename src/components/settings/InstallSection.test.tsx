import { act, fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { InstallSection } from '@/components/settings/InstallSection'
import { listenForInstallPrompt } from '@/lib/install-prompt'

const IPHONE_SAFARI =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1'
const DESKTOP_CHROME =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36'

listenForInstallPrompt()

function setup({ userAgent, standalone = false }: { userAgent: string; standalone?: boolean }) {
  vi.stubGlobal('matchMedia', () => ({ matches: standalone }))
  vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue(userAgent)
  render(<InstallSection />)
}

function offerInstall() {
  const prompt = vi.fn().mockResolvedValue(undefined)
  act(() => {
    window.dispatchEvent(Object.assign(new Event('beforeinstallprompt'), { prompt }))
  })

  return prompt
}

beforeEach(() => {
  window.dispatchEvent(new Event('appinstalled'))
})

describe('InstallSection', () => {
  it('shows an install button when the browser offers it', () => {
    setup({ userAgent: DESKTOP_CHROME })
    const prompt = offerInstall()

    fireEvent.click(screen.getByRole('button', { name: 'Install Arithmix' }))

    expect(prompt).toHaveBeenCalledOnce()
  })

  it('explains Add to Home Screen in iPhone Safari', () => {
    setup({ userAgent: IPHONE_SAFARI })

    expect(screen.getByText('Add to Home Screen')).toBeInTheDocument()
  })

  it('renders nothing when the browser cannot install', () => {
    setup({ userAgent: DESKTOP_CHROME })

    expect(screen.queryByText(/works without internet/)).not.toBeInTheDocument()
  })

  it('renders nothing inside the installed app', () => {
    setup({ userAgent: IPHONE_SAFARI, standalone: true })

    expect(screen.queryByText('Add to Home Screen')).not.toBeInTheDocument()
  })
})
