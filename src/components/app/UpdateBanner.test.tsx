import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { UpdateBanner } from '@/components/app/UpdateBanner'

describe('UpdateBanner', () => {
  it('updates when tapped', () => {
    const onUpdate = vi.fn()
    render(<UpdateBanner onUpdate={onUpdate} />)

    fireEvent.click(screen.getByRole('button', { name: 'Update' }))

    expect(onUpdate).toHaveBeenCalledOnce()
  })
})
