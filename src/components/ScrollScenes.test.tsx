import { fireEvent, render, screen } from '@testing-library/react'
import { ScrollScenes } from '@/components/ScrollScenes'

const renderScenes = () =>
  render(
    <ScrollScenes>
      <p>first</p>
      <p>second</p>
      <p>third</p>
    </ScrollScenes>,
  )

describe('ScrollScenes', () => {
  it('keeps every slide in the document', () => {
    renderScenes()
    for (const name of ['first', 'second', 'third']) expect(screen.getByText(name)).toBeTruthy()
  })

  it('reserves one screen of scroll per slide while the stage is pinned', () => {
    const { container } = renderScenes()
    expect((container.firstElementChild as HTMLElement).style.height).toBe('300svh')
    expect(container.querySelector('.sticky')).toBeTruthy()
  })

  it('keeps every slide reachable by keyboard and screen readers', () => {
    const { container } = renderScenes()
    expect(container.querySelector('[inert]')).toBeNull()
  })

  it('scrolls a slide into view when focus lands on it', () => {
    const scrollTo = jest.fn()
    window.scrollTo = scrollTo
    renderScenes()
    fireEvent.focus(screen.getByText('third'))
    expect(scrollTo).toHaveBeenCalledTimes(1)
  })
})
