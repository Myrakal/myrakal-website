import { render, screen, waitFor } from '@testing-library/react'

import { AttachmentsCard } from './AttachmentsCard'

const fetchMock = jest.fn()
const realFetch = globalThis.fetch
globalThis.fetch = fetchMock

afterEach(() => fetchMock.mockReset())
afterAll(() => {
  globalThis.fetch = realFetch
})

const ok = (body: unknown) => fetchMock.mockResolvedValue({ ok: true, status: 200, json: async () => body })

test('lists documents with a view link only when a url exists', async () => {
  ok([
    { name: 'xray.pdf', path: 'a/xray.pdf', size: 2048, createdAt: '2026-10-20T10:00:00.000Z', url: 'https://files.test/xray' },
    { name: 'notes.txt', path: 'a/notes.txt', size: 12, createdAt: '2026-10-19T10:00:00.000Z', url: null },
  ])
  render(<AttachmentsCard chatId="c1" version={0} />)
  expect(await screen.findByText('xray.pdf')).toBeInTheDocument()
  expect(screen.getByText('notes.txt')).toBeInTheDocument()
  expect(screen.getByText(/2\.0 KB/)).toBeInTheDocument()
  const links = screen.getAllByRole('link', { name: /view/i })
  expect(links).toHaveLength(1)
  expect(links[0]).toHaveAttribute('href', 'https://files.test/xray')
  expect(links[0]).toHaveAttribute('target', '_blank')
  expect(links[0]).toHaveAttribute('rel', expect.stringContaining('noopener'))
})

test('shows an empty state', async () => {
  ok([])
  render(<AttachmentsCard chatId="c1" version={0} />)
  expect(await screen.findByText('No documents yet')).toBeInTheDocument()
})

test('shows an error state', async () => {
  fetchMock.mockResolvedValue({ ok: false, status: 500, json: async () => ({}) })
  render(<AttachmentsCard chatId="c1" version={0} />)
  expect(await screen.findByRole('alert')).toHaveTextContent(/could not load/i)
})

test('refetches when version changes', async () => {
  ok([])
  const { rerender } = render(<AttachmentsCard chatId="c1" version={0} />)
  await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1))
  rerender(<AttachmentsCard chatId="c1" version={1} />)
  await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2))
})
