import { render, screen, waitFor } from '@testing-library/react'

const mockRouter = { replace: jest.fn(), push: jest.fn() }
jest.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
}))

import { ChatPanel } from '@/components/chat/ChatPanel'

const ID = '3f1c2b4a-0000-4000-8000-000000000001'
const fetchMock = jest.fn()
globalThis.fetch = fetchMock

beforeEach(() => {
  Element.prototype.scrollIntoView = jest.fn()
})

afterEach(() => fetchMock.mockReset())

describe('ChatPanel', () => {
  it('renders the greeting and composer without a chat', () => {
    render(<ChatPanel chatId={null} />)
    expect(screen.getByText(/I’m glad you reached out/i)).toBeTruthy()
    expect(screen.getByLabelText('Message')).toBeTruthy()
  })

  it('loads messages and progress for a chat id', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ status: 'intake', progress: { collected: 4, total: 20 }, messages: [{ id: 'm1', role: 'user', text: 'knee' }] }),
    })
    render(<ChatPanel chatId={ID} />)
    await waitFor(() => expect(screen.getByText('knee')).toBeTruthy())
    expect(screen.getByRole('progressbar')).toBeTruthy()
  })

  it('shows the upload box when the chat has a pending request and says the AI cannot read files', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ status: 'intake', progress: { collected: 1, total: 7 }, messages: [], attachmentRequest: { label: 'your lab results' } }),
    })
    render(<ChatPanel chatId={ID} />)
    await waitFor(() => expect(screen.getByText(/upload your lab results/i)).toBeTruthy())
    expect(screen.getByText(/does not read your files/i)).toBeTruthy()
  })

  it('does not show the upload box without a pending request', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ status: 'intake', progress: { collected: 1, total: 7 }, messages: [], attachmentRequest: null }),
    })
    render(<ChatPanel chatId={ID} />)
    await waitFor(() => expect(screen.getByRole('progressbar')).toBeTruthy())
    expect(screen.queryByText(/does not read your files/i)).toBeNull()
  })

  it('scrolls to the bottom when its pane becomes visible', () => {
    let height = 0
    let notify: () => void = () => {}
    const original = globalThis.ResizeObserver
    globalThis.ResizeObserver = class {
      constructor(cb: () => void) {
        notify = cb
      }
      observe() {}
      disconnect() {}
      unobserve() {}
    } as unknown as typeof ResizeObserver
    const spy = jest.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockImplementation(() => height)
    render(<ChatPanel chatId={null} />)
    const scroll = Element.prototype.scrollIntoView as jest.Mock
    scroll.mockClear()
    height = 120
    notify()
    expect(scroll).toHaveBeenCalledWith({ block: 'end', behavior: 'auto' })
    scroll.mockClear()
    notify()
    expect(scroll).not.toHaveBeenCalled()
    spy.mockRestore()
    globalThis.ResizeObserver = original
  })
})
