import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { NicknameForm } from '@/components/settings/NicknameForm'
import { db } from '@/lib/db'
import { getNickname, saveNickname } from '@/lib/storage'

beforeEach(async () => {
  await db.delete()
  await db.open()
})

describe('NicknameForm', () => {
  it('shows the saved nickname', async () => {
    await saveNickname('Ada')
    render(<NicknameForm />)

    await waitFor(() => expect(screen.getByLabelText(/nickname/i)).toHaveValue('Ada'))
  })

  it('saves a new nickname and disables save until it changes again', async () => {
    render(<NicknameForm />)
    const input = await screen.findByLabelText(/nickname/i)
    const save = screen.getByRole('button', { name: 'Save' })

    await waitFor(() => expect(input).toBeEnabled())
    expect(save).toBeDisabled()

    fireEvent.change(input, { target: { value: 'Grace' } })
    fireEvent.click(save)

    await waitFor(() => expect(save).toBeDisabled())
    await expect(getNickname()).resolves.toBe('Grace')
  })
})
