import { fireEvent, render, screen } from '@testing-library/react'

import { WorkspaceTabs } from './WorkspaceTabs'

function setup(initial: 'chats' | 'case' | 'chat' = 'case', preferred?: 'chats' | 'case' | 'chat') {
  return render(
    <WorkspaceTabs
      initial={initial}
      preferred={preferred}
      chats={<input aria-label="chats-draft" />}
      details={<p>details body</p>}
      chat={<input aria-label="chat-draft" />}
    />,
  )
}

const panel = (name: string) => screen.getByRole('tabpanel', { name, hidden: true })

describe('WorkspaceTabs', () => {
  it('renders three tabs with the initial one selected', () => {
    setup('chat')
    const tabs = screen.getAllByRole('tab')
    expect(tabs.map((t) => t.textContent)).toEqual(['Chats', 'Case', 'Chat'])
    expect(screen.getByRole('tab', { name: 'Chat' }).getAttribute('aria-selected')).toBe('true')
    expect(screen.getByRole('tab', { name: 'Case' }).getAttribute('aria-selected')).toBe('false')
  })

  it('shows only the active pane below lg but keeps every pane mounted', () => {
    setup('case')
    expect(panel('Case').className).not.toContain('max-lg:hidden')
    expect(panel('Chats').className).toContain('max-lg:hidden')
    expect(panel('Chat').className).toContain('max-lg:hidden')
    expect(screen.getByLabelText('chat-draft')).toBeTruthy()
  })

  it('shows every pane at lg and up', () => {
    setup('case')
    for (const name of ['Chats', 'Case', 'Chat']) expect(panel(name).className).toContain('lg:contents')
    expect(screen.getByRole('tablist').className).toContain('lg:hidden')
  })

  it('switches panes on click and preserves drafts', () => {
    setup('chat')
    fireEvent.change(screen.getByLabelText('chat-draft'), { target: { value: 'half typed' } })
    fireEvent.click(screen.getByRole('tab', { name: 'Case' }))
    expect(panel('Chat').className).toContain('max-lg:hidden')
    expect(panel('Case').className).not.toContain('max-lg:hidden')
    fireEvent.click(screen.getByRole('tab', { name: 'Chat' }))
    expect((screen.getByLabelText('chat-draft') as HTMLInputElement).value).toBe('half typed')
  })

  it('links tabs and panels with aria-controls and aria-labelledby', () => {
    setup('case')
    for (const tab of screen.getAllByRole('tab')) {
      const target = document.getElementById(tab.getAttribute('aria-controls') ?? '')
      expect(target?.getAttribute('role')).toBe('tabpanel')
      expect(target?.getAttribute('aria-labelledby')).toBe(tab.id)
    }
  })

  it('moves with arrow keys, wrapping, plus Home and End', () => {
    setup('case')
    const tablist = screen.getByRole('tablist')
    fireEvent.keyDown(screen.getByRole('tab', { name: 'Case' }), { key: 'ArrowRight' })
    expect(screen.getByRole('tab', { name: 'Chat' }).getAttribute('aria-selected')).toBe('true')
    expect(document.activeElement).toBe(screen.getByRole('tab', { name: 'Chat' }))
    fireEvent.keyDown(tablist, { key: 'ArrowRight' })
    expect(screen.getByRole('tab', { name: 'Chats' }).getAttribute('aria-selected')).toBe('true')
    fireEvent.keyDown(tablist, { key: 'ArrowLeft' })
    expect(screen.getByRole('tab', { name: 'Chat' }).getAttribute('aria-selected')).toBe('true')
    fireEvent.keyDown(tablist, { key: 'Home' })
    expect(screen.getByRole('tab', { name: 'Chats' }).getAttribute('aria-selected')).toBe('true')
    fireEvent.keyDown(tablist, { key: 'End' })
    expect(screen.getByRole('tab', { name: 'Chat' }).getAttribute('aria-selected')).toBe('true')
  })

  it('uses a roving tabindex and 44px targets', () => {
    setup('case')
    expect(screen.getByRole('tab', { name: 'Case' }).getAttribute('tabindex')).toBe('0')
    expect(screen.getByRole('tab', { name: 'Chat' }).getAttribute('tabindex')).toBe('-1')
    expect(screen.getByRole('tab', { name: 'Case' }).className).toContain('min-h-11')
  })

  it('switches once to the preferred tab when the user has not chosen one', () => {
    const view = setup('case')
    expect(screen.getByRole('tab', { name: 'Case' }).getAttribute('aria-selected')).toBe('true')
    view.rerender(
      <WorkspaceTabs initial="case" preferred="chat" chats={<p>c</p>} details={<p>d</p>} chat={<p>x</p>} />,
    )
    expect(screen.getByRole('tab', { name: 'Chat' }).getAttribute('aria-selected')).toBe('true')
  })

  it('ignores the preferred tab after the user picked one', () => {
    const view = setup('case')
    fireEvent.click(screen.getByRole('tab', { name: 'Chats' }))
    view.rerender(
      <WorkspaceTabs initial="case" preferred="chat" chats={<p>c</p>} details={<p>d</p>} chat={<p>x</p>} />,
    )
    expect(screen.getByRole('tab', { name: 'Chats' }).getAttribute('aria-selected')).toBe('true')
  })

  it('drops tabpanel semantics at lg and up', () => {
    const original = window.matchMedia
    window.matchMedia = ((query: string) => ({ matches: true, media: query, addEventListener: jest.fn(), removeEventListener: jest.fn() })) as unknown as typeof window.matchMedia
    setup('case')
    expect(screen.queryAllByRole('tabpanel', { hidden: true })).toHaveLength(0)
    window.matchMedia = original
  })
})
