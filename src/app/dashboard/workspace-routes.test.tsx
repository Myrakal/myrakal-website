import { render, screen } from '@testing-library/react'

jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace: jest.fn() }),
}))
jest.mock('@/components/portal/Workspace', () => ({
  Workspace: ({ chatId }: { chatId: string | null }) => <p>workspace:{String(chatId)}</p>,
}))

describe('dashboard routes', () => {
  it('renders the workspace without a chat', async () => {
    const page = await import('./page')
    expect(page.metadata.robots).toEqual({ index: false })
    render(<page.default />)
    expect(screen.getByText('workspace:null')).toBeTruthy()
  })

  it('renders the workspace for the chat in the route params', async () => {
    const page = await import('./[id]/page')
    expect(page.metadata.robots).toEqual({ index: false })
    render(await page.default({ params: Promise.resolve({ id: 'abc' }) }))
    expect(screen.getByText('workspace:abc')).toBeTruthy()
  })
})
