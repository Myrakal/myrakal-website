import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, vi } from 'vitest'
import { Hero } from '@/components/Hero'

describe('Hero', () => {
  const original = window.matchMedia
  afterEach(() => {
    window.matchMedia = original
  })

  it('shows the headline and subtitle', () => {
    render(<Hero />)
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Healthcare, but way cheaper')
    expect(
      screen.getByText('Made for people who want to understand their healthcare costs and explore options'),
    ).toBeTruthy()
  })

  it('has a short call to action linking to the contact page', () => {
    render(<Hero />)
    expect(screen.getByRole('link', { name: 'Talk with us' }).getAttribute('href')).toBe('/contact/')
  })

  it('renders a muted, looping, inline autoplay demo video', () => {
    const { container } = render(<Hero />)
    const video = container.querySelector('video')!
    expect(video.autoplay).toBe(true)
    expect(video.muted).toBe(true)
    expect(video.loop).toBe(true)
    expect(video.playsInline).toBe(true)
    expect(video.getAttribute('aria-label')).toBeTruthy()
  })

  it('has no globe canvas', () => {
    const { container } = render(<Hero />)
    expect(container.querySelector('canvas')).toBeNull()
  })

  it('toggles the play button label when the video pauses', async () => {
    const user = userEvent.setup()
    const { container } = render(<Hero />)
    const video = container.querySelector('video')!
    const pause = vi.fn(() => video.dispatchEvent(new Event('pause')))
    Object.defineProperty(video, 'paused', { value: false, configurable: true })
    video.pause = pause
    await user.click(screen.getByRole('button', { name: 'Pause demo video' }))
    expect(pause).toHaveBeenCalled()
    expect(screen.getByRole('button', { name: 'Play demo video' })).toBeTruthy()
  })

  it('starts paused when the visitor prefers reduced motion', () => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: true, addEventListener() {}, removeEventListener() {} })
    const { container } = render(<Hero />)
    expect(container.querySelector('video')!.autoplay).toBe(false)
    expect(screen.getByRole('button', { name: 'Play demo video' })).toBeTruthy()
  })
})
