import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import Case from '@/pages/Case'

const ID = '11111111-1111-1111-1111-111111111111'
const base = { status: 'awaiting_payment', name: 'Ada', paid: false, note: null, reviewedAt: null }
const reply = (status: number, body: unknown) => ({ ok: status < 400, status, json: async () => body })

describe('Case page', () => {
  const assign = vi.fn()
  beforeEach(() => {
    assign.mockReset()
    vi.stubGlobal('location', { ...window.location, assign, search: '' })
  })
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.useRealTimers()
  })

  const setup = (search: string, fetchImpl: ReturnType<typeof vi.fn>) => {
    vi.stubGlobal('location', { ...window.location, assign, search })
    vi.stubGlobal('fetch', fetchImpl)
    return render(<Case />)
  }

  it('shows not found without an id', async () => {
    const f = vi.fn()
    setup('', f)
    expect(await screen.findByText(/couldn.t find that case/i)).toBeTruthy()
    expect(f).not.toHaveBeenCalled()
  })

  it('shows not found on 404', async () => {
    setup(`?id=${ID}`, vi.fn().mockResolvedValue(reply(404, {})))
    expect(await screen.findByText(/couldn.t find that case/i)).toBeTruthy()
  })

  it('shows loading first', () => {
    setup(`?id=${ID}`, vi.fn().mockReturnValue(new Promise(() => {})))
    expect(screen.getByRole('status').textContent).toMatch(/loading/i)
  })

  it('explains the fee and redirects to checkout on pay', async () => {
    const f = vi.fn()
      .mockResolvedValueOnce(reply(200, base))
      .mockResolvedValueOnce(reply(200, { url: 'https://stripe.test/c' }))
    setup(`?id=${ID}`, f)
    expect(await screen.findByText(/\$150/)).toBeTruthy()
    await userEvent.click(screen.getByRole('button', { name: 'Pay for consult' }))
    await waitFor(() => expect(assign).toHaveBeenCalledWith('https://stripe.test/c'))
    const [url, init] = f.mock.calls[1]
    expect(url).toBe('/api/checkout')
    expect(JSON.parse(init.body)).toEqual({ intakeId: ID })
  })

  it('shows a friendly message when payments are not configured', async () => {
    const f = vi.fn()
      .mockResolvedValueOnce(reply(200, base))
      .mockResolvedValueOnce(reply(503, { error: 'Payments are not configured' }))
    setup(`?id=${ID}`, f)
    await userEvent.click(await screen.findByRole('button', { name: 'Pay for consult' }))
    expect((await screen.findByRole('alert')).textContent).toBe('Payments are not available yet. Please email eshaansood@myrakal.com.')
  })

  it('shows a generic error on other checkout failures', async () => {
    const f = vi.fn()
      .mockResolvedValueOnce(reply(200, base))
      .mockResolvedValueOnce(reply(500, {}))
    setup(`?id=${ID}`, f)
    await userEvent.click(await screen.findByRole('button', { name: 'Pay for consult' }))
    expect((await screen.findByRole('alert')).textContent).toMatch(/something went wrong/i)
  })

  it('shows in review', async () => {
    setup(`?id=${ID}`, vi.fn().mockResolvedValue(reply(200, { ...base, status: 'in_review', paid: true })))
    expect(await screen.findByText('Payment received. A licensed doctor is reviewing your case.')).toBeTruthy()
  })

  it('shows approval with note', async () => {
    setup(`?id=${ID}`, vi.fn().mockResolvedValue(reply(200, { ...base, status: 'approved', paid: true, note: 'Looks good', reviewedAt: '2026-10-20T15:00:00.000Z' })))
    expect(await screen.findByRole('heading', { name: /approved/i })).toBeTruthy()
    expect(screen.getByText('Looks good')).toBeTruthy()
  })

  it('shows changes requested with note and support link', async () => {
    setup(`?id=${ID}`, vi.fn().mockResolvedValue(reply(200, { ...base, status: 'changes_requested', paid: true, note: 'Try a lower dose' })))
    expect(await screen.findByText('Try a lower dose')).toBeTruthy()
    expect(screen.getByRole('link', { name: /email support/i }).getAttribute('href')).toMatch(/^mailto:eshaansood@myrakal\.com/)
  })

  it('polls after payment until in review', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    const f = vi.fn()
      .mockResolvedValueOnce(reply(200, base))
      .mockResolvedValueOnce(reply(200, base))
      .mockResolvedValue(reply(200, { ...base, status: 'in_review', paid: true }))
    setup(`?id=${ID}&paid=1`, f)
    expect(await screen.findByText('Confirming your payment...')).toBeTruthy()
    await act(() => vi.advanceTimersByTimeAsync(3000))
    await act(() => vi.advanceTimersByTimeAsync(3000))
    expect(await screen.findByText('Payment received. A licensed doctor is reviewing your case.')).toBeTruthy()
  })

  it('stops polling after 10 attempts', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    const f = vi.fn().mockResolvedValue(reply(200, base))
    setup(`?id=${ID}&paid=1`, f)
    await act(() => vi.advanceTimersByTimeAsync(60000))
    expect(f).toHaveBeenCalledTimes(11)
  })

  it('does not offer payment when polling is exhausted', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    setup(`?id=${ID}&paid=1`, vi.fn().mockResolvedValue(reply(200, base)))
    await act(() => vi.advanceTimersByTimeAsync(60000))
    expect(screen.getByText("We're still confirming your payment. Check back in a few minutes or email eshaansood@myrakal.com.")).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'Pay for consult' })).toBeNull()
  })

  it('keeps the last good state through a transient polling failure', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    const f = vi.fn()
      .mockResolvedValueOnce(reply(200, base))
      .mockResolvedValueOnce(reply(500, {}))
      .mockResolvedValue(reply(200, { ...base, status: 'in_review', paid: true }))
    setup(`?id=${ID}&paid=1`, f)
    expect(await screen.findByText('Confirming your payment...')).toBeTruthy()
    await act(() => vi.advanceTimersByTimeAsync(3000))
    expect(screen.getByText('Confirming your payment...')).toBeTruthy()
    expect(screen.queryByText(/something went wrong/i)).toBeNull()
    await act(() => vi.advanceTimersByTimeAsync(3000))
    expect(await screen.findByText('Payment received. A licensed doctor is reviewing your case.')).toBeTruthy()
  })

  it('marks only earlier steps as done and the current one as current', async () => {
    setup(`?id=${ID}`, vi.fn().mockResolvedValue(reply(200, { ...base, status: 'in_review', paid: true })))
    await screen.findByText(/in review/i)
    expect(screen.getByText('Intake').getAttribute('data-step')).toBe('done')
    expect(screen.getByText('Payment').getAttribute('data-step')).toBe('done')
    expect(screen.getByText('Doctor review').getAttribute('data-step')).toBe('current')
    expect(screen.getByText('Decision').getAttribute('data-step')).toBe('upcoming')
  })

  it('marks every step done once decided', async () => {
    setup(`?id=${ID}`, vi.fn().mockResolvedValue(reply(200, { ...base, status: 'approved', paid: true })))
    await screen.findByRole('heading', { name: /approved/i })
    for (const s of ['Intake', 'Payment', 'Doctor review', 'Decision']) expect(screen.getByText(s).getAttribute('data-step')).toBe('done')
  })

  it('keeps the pay button disabled after redirecting and shows Redirecting', async () => {
    const f = vi.fn()
      .mockResolvedValueOnce(reply(200, base))
      .mockResolvedValueOnce(reply(200, { url: 'https://stripe.test/c' }))
    setup(`?id=${ID}`, f)
    await userEvent.click(await screen.findByRole('button', { name: 'Pay for consult' }))
    await waitFor(() => expect(assign).toHaveBeenCalled())
    const btn = screen.getByRole('button', { name: 'Redirecting...' }) as HTMLButtonElement
    expect(btn.disabled).toBe(true)
  })

  it('re-enables the pay button after a failure', async () => {
    const f = vi.fn().mockResolvedValueOnce(reply(200, base)).mockResolvedValueOnce(reply(500, {}))
    setup(`?id=${ID}`, f)
    await userEvent.click(await screen.findByRole('button', { name: 'Pay for consult' }))
    await screen.findByRole('alert')
    expect((screen.getByRole('button', { name: 'Pay for consult' }) as HTMLButtonElement).disabled).toBe(false)
  })

  it('gives loading and error states a heading', async () => {
    setup(`?id=${ID}`, vi.fn().mockRejectedValue(new Error('x')))
    expect(screen.getByRole('heading', { level: 1 })).toBeTruthy()
    await screen.findByRole('alert')
    expect(screen.getByRole('heading', { level: 1 })).toBeTruthy()
  })

  it('shows the four progress steps', async () => {
    setup(`?id=${ID}`, vi.fn().mockResolvedValue(reply(200, base)))
    await screen.findByText(/\$150/)
    for (const s of ['Intake', 'Payment', 'Doctor review', 'Decision']) expect(screen.getByText(s)).toBeTruthy()
  })
})
