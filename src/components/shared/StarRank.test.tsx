import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { StarRank } from '@/components/shared/StarRank'

describe('StarRank', () => {
  it('keeps the tier color on earned stars while revealing them', () => {
    render(<StarRank rank={{ tier: 'silver', stars: 2 }} reveal />)
    const stars = screen.getByRole('img', { name: 'Silver, 2 of 3 stars' }).querySelectorAll('svg')

    expect(stars[0]).toHaveClass('fill-silver')
    expect(stars[1]).toHaveClass('fill-silver')
    expect(stars[2]).not.toHaveClass('fill-silver')
  })

  it('labels a run with no stars', () => {
    render(<StarRank rank={null} />)

    expect(screen.getByRole('img', { name: 'No stars' })).toBeInTheDocument()
  })
})
