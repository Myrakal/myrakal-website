import { render, screen } from '@testing-library/react'

const isAuthed = jest.fn()
jest.mock('@/lib/internal-auth', () => ({ isAuthed: () => isAuthed() }))
const loadGraph = jest.fn()
jest.mock('@/lib/internal/graph', () => ({ loadGraph: () => loadGraph() }))
jest.mock('@/components/internal/InternalTool', () => ({
  __esModule: true,
  default: ({ error, raw }: { error?: string; raw?: unknown }) => <div>{error ? `error:${error}` : raw ? 'tool' : 'empty'}</div>,
}))
jest.mock('./actions', () => ({ login: jest.fn(), logout: jest.fn() }))

describe('/internal page', () => {
  it('shows the password form when not authed', async () => {
    isAuthed.mockResolvedValue(false)
    const { default: Page } = await import('./page')
    render(await Page())
    expect(screen.getByLabelText(/password/i)).toBeTruthy()
    expect(screen.queryByRole('button', { name: /sign out/i })).toBeNull()
  })

  it('does not load data when not authed', async () => {
    isAuthed.mockResolvedValue(false)
    loadGraph.mockClear()
    const { default: Page } = await import('./page')
    render(await Page())
    expect(loadGraph).not.toHaveBeenCalled()
  })

  it('shows the error state when loading fails', async () => {
    isAuthed.mockResolvedValue(true)
    loadGraph.mockRejectedValue(new Error('db down'))
    const { default: Page } = await import('./page')
    render(await Page())
    expect(screen.getByText('error:db down')).toBeTruthy()
  })

  it('shows the tool when authed', async () => {
    isAuthed.mockResolvedValue(true)
    loadGraph.mockResolvedValue({ providers: [] })
    const { default: Page } = await import('./page')
    render(await Page())
    expect(screen.queryByLabelText(/password/i)).toBeNull()
    expect(screen.getByText('tool')).toBeTruthy()
    expect(screen.getByRole('button', { name: /sign out/i })).toBeTruthy()
  })

  it('is not indexable', async () => {
    const { metadata } = await import('./page')
    expect(metadata.robots).toEqual({ index: false })
  })
})
