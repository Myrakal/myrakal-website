import { TALK_WITH_US_HREF } from '@/lib/contact'
import { render, screen } from '@testing-library/react'
import { Hero } from '@/components/Hero'

const setMotion = (allowed: boolean) => {
  window.matchMedia = ((query: string) => ({
    matches: allowed,
    media: query,
    addEventListener() {},
    removeEventListener() {},
  })) as unknown as typeof window.matchMedia
}

describe('Hero', () => {
  beforeEach(() => setMotion(false))

  it('keeps the headline as the page heading', () => {
    render(<Hero />)
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Healthcare, as it should be')
  })

  it('has a short call to action that emails us a prefilled message', () => {
    render(<Hero />)
    expect(screen.getByRole('link', { name: /^Talk with us/ }).getAttribute('href')).toBe(TALK_WITH_US_HREF)
  })

  it('states both pillars: coordinated care and lower cost', () => {
    render(<Hero />)
    expect(screen.getByText('Fully coordinated')).toBeInTheDocument()
    expect(screen.getByText('For far less')).toBeInTheDocument()
    expect(screen.getByText(/all handled for you/)).toBeInTheDocument()
    expect(screen.getByText(/in the U\.S\. or abroad/)).toBeInTheDocument()
  })

  it('shows the liquid still with a description', () => {
    render(<Hero />)
    const still = screen.getByRole('img', { name: /claret liquid/i })
    expect(still.getAttribute('src')).toMatch(/hero-liquid/)
  })

  it('no longer shows the ampoule', () => {
    const { container } = render(<Hero />)
    expect(container.querySelector('img[src*="ampoule"]')).toBeNull()
  })

  it('sets the wordmark across the hero as decoration', () => {
    const { container } = render(<Hero />)
    const wordmark = container.querySelector('img[src*="myrakal-wordmark"]')
    expect(wordmark).not.toBeNull()
    expect(wordmark!.getAttribute('alt')).toBe('')
  })

  it('plays a muted looping liquid video when motion is allowed', () => {
    setMotion(true)
    const { container } = render(<Hero />)
    const video = container.querySelector('video')
    expect(video).not.toBeNull()
    expect(video!.getAttribute('src')).toBe('/hero-liquid.mp4')
    expect(video!.muted).toBe(true)
    expect(video!.loop).toBe(true)
    expect(video!.hasAttribute('playsinline')).toBe(true)
  })

  it('skips the video on small screens or reduced motion', () => {
    const { container } = render(<Hero />)
    expect(container.querySelector('video')).toBeNull()
  })
})
