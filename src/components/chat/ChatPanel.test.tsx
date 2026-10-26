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
    expect(screen.getByText(/welcome to Myrakal/i)).toBeTruthy()
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
})
