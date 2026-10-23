import { render, screen } from '@testing-library/react'
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

  it('shows the first slide and holds the later ones back until they slide in', () => {
    renderScenes()
    expect(screen.getByText('first').parentElement?.hasAttribute('inert')).toBe(false)
    expect(screen.getByText('second').parentElement?.hasAttribute('inert')).toBe(true)
    expect(screen.getByText('third').parentElement?.hasAttribute('inert')).toBe(true)
  })
})
