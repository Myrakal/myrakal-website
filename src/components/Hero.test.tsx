import { TALK_WITH_US_HREF } from '@/lib/contact'
import { render, screen } from '@testing-library/react'
import { Hero } from '@/components/Hero'

describe('Hero', () => {
  it('keeps the headline as the page heading', () => {
    render(<Hero />)
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Healthcare, as it should be')
  })

  it('has a short call to action that emails us a prefilled message', () => {
    render(<Hero />)
    expect(screen.getByRole('link', { name: /^Talk with us/ }).getAttribute('href')).toBe(TALK_WITH_US_HREF)
  })

  it('shows the ampoule photograph with a description', () => {
    render(<Hero />)
    const photo = screen.getByRole('img', { name: /ampoule/i })
    expect(photo.getAttribute('src')).toMatch(/hero-ampoule/)
  })

  it('sets the wordmark across the photograph as decoration', () => {
    const { container } = render(<Hero />)
    const wordmark = container.querySelector('img[src*="myrakal-wordmark"]')
    expect(wordmark).not.toBeNull()
    expect(wordmark!.getAttribute('alt')).toBe('')
  })

  it('no longer embeds the demo video', () => {
    const { container } = render(<Hero />)
    expect(container.querySelector('video')).toBeNull()
  })
})
