import { act, render, screen } from '@testing-library/react'

const mockReplace = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace }),
}))

let panelProps: { chatId: string | null; onCreated?: (id: string) => void; onStatusChange?: (s: string, id: string, replace: boolean) => void; onLocked?: (id: string) => void }
let mounts = { details: 0, panel: 0 }

jest.mock('@/components/portal/ChatSidebar', () => ({
  ChatSidebar: ({ activeId }: { activeId?: string | null }) => <nav aria-label="Your chats" data-active={activeId ?? ''} />,
}))
jest.mock('@/components/portal/CaseDetails', () => {
  const { useEffect } = jest.requireActual('react')
  return {
    CaseDetails: ({ chatId }: { chatId: string }) => {
      useEffect(() => {
        mounts.details += 1
      }, [])
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
  mockReplace.mockReset()
  mounts = { details: 0, panel: 0 }
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

  it('replaces the route when a chat is created without remounting the panel', () => {
    render(<Workspace chatId={null} />)
    act(() => panelProps.onCreated?.(ID))
    expect(mockReplace).toHaveBeenCalledWith(`/dashboard/${ID}`)
    expect(screen.getByRole('region', { name: 'Case details' }).textContent).toBe(ID)
    expect(mounts.panel).toBe(1)
  })

  it('refreshes the case details when the status changes live', () => {
    render(<Workspace chatId={ID} />)
    expect(mounts.details).toBe(1)
    act(() => panelProps.onStatusChange?.('doctor_review', ID, false))
    expect(mounts.details).toBe(2)
    expect(mockReplace).not.toHaveBeenCalled()
  })

  it('refreshes the case details when the chat is locked', () => {
    render(<Workspace chatId={ID} />)
    act(() => panelProps.onLocked?.(ID))
    expect(mounts.details).toBe(2)
  })

  it('resets the panels when switching to another chat', () => {
    const { rerender } = render(<Workspace chatId={ID} />)
    rerender(<Workspace chatId="other" />)
    expect(mounts.panel).toBe(2)
  })
})
