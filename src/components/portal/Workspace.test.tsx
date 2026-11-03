import { act, fireEvent, render, screen, within } from '@testing-library/react'

let panelProps: { chatId: string | null; onCreated?: (id: string) => void; onStatusChange?: (s: string, id: string, replace: boolean) => void; onLocked?: (id: string) => void }
let loadedStatus = 'plan_ready'
let mounts = { details: 0, panel: 0 }

jest.mock('@/components/portal/ChatSidebar', () => ({
  ChatSidebar: ({ activeId }: { activeId?: string | null }) => <nav aria-label="Your chats" data-active={activeId ?? ''} />,
}))
jest.mock('@/components/portal/CaseDetails', () => {
  const { useEffect, useRef } = jest.requireActual('react')
  return {
    CaseDetails: ({ chatId, refreshKey, onLoaded }: { chatId: string; refreshKey?: number; onLoaded?: (m: unknown[], status?: string) => void }) => {
      const cb = useRef(onLoaded)
      cb.current = onLoaded
      useEffect(() => {
        mounts.details += 1
        cb.current?.([{ id: 'm1', role: 'user', text: 'hello there' }], loadedStatus)
      }, [refreshKey])
      return <section aria-label="Case details">{chatId}</section>
    },
  }
})
jest.mock('@/components/chat/ChatPanel', () => {
  const { useEffect } = jest.requireActual('react')
  return {
    ChatPanel: (props: typeof panelProps) => {
      panelProps = props
      useEffect(() => {
        mounts.panel += 1
      }, [])
      return <div role="log" aria-label="Conversation" />
    },
  }
})

import { Workspace } from './Workspace'

const ID = '3f1c2b4a-0000-4000-8000-000000000001'

beforeEach(() => {
  window.history.replaceState(null, '', '/dashboard')
  mounts = { details: 0, panel: 0 }
  loadedStatus = 'plan_ready'
})

describe('Workspace', () => {
  it('shows an empty state and a new-chat panel without a chat id', () => {
    render(<Workspace chatId={null} />)
    expect(screen.getByText('Start a conversation to open your case')).toBeTruthy()
    expect(screen.queryByRole('region', { name: 'Case details' })).toBeNull()
    expect(panelProps.chatId).toBeNull()
  })

  it('renders sidebar, case details and chat for a chat id', () => {
    render(<Workspace chatId={ID} />)
    expect(screen.getByRole('navigation', { name: 'Your chats' }).getAttribute('data-active')).toBe(ID)
    expect(screen.getByRole('region', { name: 'Case details' }).textContent).toBe(ID)
    expect(panelProps.chatId).toBe(ID)
    expect(screen.queryByText('Start a conversation to open your case')).toBeNull()
  })

  it('replaces the URL when a chat is created without remounting the panel', () => {
    render(<Workspace chatId={null} />)
    act(() => panelProps.onCreated?.(ID))
    expect(window.location.pathname).toBe(`/dashboard/${ID}`)
    expect(screen.getByRole('region', { name: 'Case details' }).textContent).toBe(ID)
    expect(mounts.panel).toBe(1)
  })

  it('refreshes the case details when the status changes live', () => {
    render(<Workspace chatId={ID} />)
    expect(mounts.details).toBe(1)
    act(() => panelProps.onStatusChange?.('doctor_review', ID, false))
    expect(mounts.details).toBe(2)
    expect(screen.getByText(/conversation is closed/)).toBeTruthy()
    expect(within(screen.getByRole('log', { name: 'Conversation' })).getByText('hello there')).toBeTruthy()
  })

  it('refreshes the case details when the chat is locked', () => {
    render(<Workspace chatId={ID} />)
    act(() => panelProps.onLocked?.(ID))
    expect(mounts.details).toBe(2)
    expect(screen.getByText(/conversation is closed/)).toBeTruthy()
  })

  it('closes the panel instead of loading forever for a non-intake chat', () => {
    render(<Workspace chatId={ID} />)
    act(() => panelProps.onStatusChange?.('plan_ready', ID, true))
    expect(mounts.details).toBe(1)
    expect(screen.getByText(/conversation is closed/)).toBeTruthy()
    expect(screen.getByRole('log', { name: 'Conversation' })).toBeTruthy()
  })

  it('names the page with a heading', () => {
    render(<Workspace chatId={ID} />)
    expect(screen.getByRole('heading', { level: 1, name: 'Your case' })).toBeTruthy()
  })

  it('resets the panels when switching to another chat', () => {
    const { rerender } = render(<Workspace chatId={ID} />)
    rerender(<Workspace chatId="other" />)
    expect(mounts.panel).toBe(2)
  })
  it('opens on the Chat tab for a new chat', () => {
    render(<Workspace chatId={null} />)
    expect(screen.getByRole('tab', { name: 'Chat' }).getAttribute('aria-selected')).toBe('true')
  })

  it('opens on the Case tab for an existing chat', () => {
    render(<Workspace chatId={ID} />)
    expect(screen.getByRole('tab', { name: 'Case' }).getAttribute('aria-selected')).toBe('true')
  })

  it('keeps the chat panel mounted while another tab is active', () => {
    render(<Workspace chatId={ID} />)
    fireEvent.click(screen.getByRole('tab', { name: 'Chats' }))
    fireEvent.click(screen.getByRole('tab', { name: 'Chat' }))
    expect(mounts.panel).toBe(1)
  })

  it('opens an existing intake chat on the Chat tab', () => {
    loadedStatus = 'intake'
    render(<Workspace chatId={ID} />)
    expect(screen.getByRole('tab', { name: 'Chat' }).getAttribute('aria-selected')).toBe('true')
  })

  it('keeps an existing non-intake chat on the Case tab', () => {
    render(<Workspace chatId={ID} />)
    expect(screen.getByRole('tab', { name: 'Case' }).getAttribute('aria-selected')).toBe('true')
  })
})
