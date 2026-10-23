import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'

import { PayPlan } from './PayPlan'

const fetchMock = jest.fn()
const realFetch = globalThis.fetch
globalThis.fetch = fetchMock
const assign = jest.fn()

const respond = (status: number, body: unknown = {}) =>
  fetchMock.mockResolvedValue({ ok: status >= 200 && status < 300, status, json: async () => body })

const setup = (props: Partial<Parameters<typeof PayPlan>[0]> = {}) => {
  const onStatus = jest.fn()
  render(<PayPlan chatId="c1" status="awaiting_payment" priceCents={15000} returned={false} onStatus={onStatus} onRedirect={assign} {...props} />)
  return { onStatus }
}

const pay = () => fireEvent.click(screen.getByRole('button', { name: /^pay/i }))

afterEach(() => {
  fetchMock.mockReset()
  assign.mockReset()
})
afterAll(() => {
  globalThis.fetch = realFetch
})

describe('PayPlan', () => {
  it('shows the price on the pay button', () => {
    setup()
    expect(screen.getByRole('button', { name: 'Pay $150.00' })).toBeTruthy()
  })

  it('falls back to a plain label without a price', () => {
    setup({ priceCents: null })
    expect(screen.getByRole('button', { name: 'Pay now' })).toBeTruthy()
  })

  it.each(['intake', 'doctor_review', 'plan_ready', 'clarification_review', 'reservations', 'booked'])('renders nothing in %s', (status) => {
    setup({ status })
    expect(screen.queryByRole('button')).toBeNull()
    expect(screen.queryByRole('status')).toBeNull()
  })

  it('creates a checkout session and sends the patient to Stripe', async () => {
    respond(200, { url: 'https://checkout.stripe.com/c/pay/cs_1' })
    setup()
    pay()
    await waitFor(() => expect(assign).toHaveBeenCalledWith('https://checkout.stripe.com/c/pay/cs_1'))
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('/api/chats/c1/checkout')
    expect(init.method).toBe('POST')
  })

  it('disables the button while redirecting and ignores a second click', async () => {
    respond(200, { url: 'https://checkout.stripe.com/c/pay/cs_1' })
    setup()
    const button = screen.getByRole('button', { name: /^pay/i })
    fireEvent.click(button)
    fireEvent.click(button)
    await waitFor(() => expect(assign).toHaveBeenCalledTimes(1))
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect((screen.getByRole('button', { name: /redirecting/i }) as HTMLButtonElement).disabled).toBe(true)
  })

  it.each([
    [409, /refresh/i],
    [401, /sign in again/i],
    [500, /could not start/i],
  ])('shows an alert on %s and lets the patient retry where it helps', async (status, text) => {
    respond(status, {})
    setup()
    pay()
    expect((await screen.findByRole('alert')).textContent).toMatch(text)
    expect(assign).not.toHaveBeenCalled()
  })

  it('shows an alert on a network failure and re-enables the button', async () => {
    fetchMock.mockRejectedValue(new Error('offline'))
    setup()
    pay()
    expect((await screen.findByRole('alert')).textContent).toMatch(/could not start/i)
    expect((screen.getByRole('button', { name: /^pay/i }) as HTMLButtonElement).disabled).toBe(false)
  })

  it('rejects a response without a url', async () => {
    respond(200, {})
    setup()
    pay()
    expect((await screen.findByRole('alert')).textContent).toMatch(/could not start/i)
    expect(assign).not.toHaveBeenCalled()
  })
})

describe('PayPlan page restore', () => {
  it('re-enables the button when restored from the back-forward cache', async () => {
    respond(200, { url: 'https://checkout.stripe.com/c/pay/cs_1' })
    setup()
    pay()
    await waitFor(() => expect(assign).toHaveBeenCalled())
    expect((screen.getByRole('button', { name: /redirecting/i }) as HTMLButtonElement).disabled).toBe(true)
    act(() => {
      window.dispatchEvent(Object.assign(new Event('pageshow'), { persisted: true }))
    })
    expect((screen.getByRole('button', { name: 'Pay $150.00' }) as HTMLButtonElement).disabled).toBe(false)
  })
})

describe('PayPlan after returning from Stripe', () => {
  beforeEach(() => jest.useFakeTimers())
  afterEach(() => jest.useRealTimers())

  it('confirms the payment instead of offering to pay again', () => {
    fetchMock.mockReturnValue(new Promise(() => {}))
    setup({ returned: true })
    expect(screen.queryByRole('button', { name: /^pay/i })).toBeNull()
    expect(screen.getByRole('status').textContent).toMatch(/confirming your payment/i)
  })

  it('polls the case until the status moves on', async () => {
    fetchMock
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({ status: 'awaiting_payment' }) })
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({ status: 'reservations' }) })
    const { onStatus } = setup({ returned: true })
    await act(async () => {
      jest.advanceTimersByTime(3000)
    })
    expect(onStatus).not.toHaveBeenCalled()
    await act(async () => {
      jest.advanceTimersByTime(3000)
    })
    expect(fetchMock.mock.calls[0][0]).toBe('/api/chats/c1')
    expect(onStatus).toHaveBeenCalledWith('reservations')
  })

  it('stops polling and says it is taking longer after about a minute', async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 200, json: async () => ({ status: 'awaiting_payment' }) })
    setup({ returned: true })
    for (let i = 0; i < 25; i++) {
      await act(async () => {
        jest.advanceTimersByTime(3000)
      })
    }
    expect(screen.getByRole('status').textContent).toMatch(/taking longer/i)
    const calls = fetchMock.mock.calls.length
    await act(async () => {
      jest.advanceTimersByTime(30000)
    })
    expect(fetchMock.mock.calls.length).toBe(calls)
  })

  it('keeps polling through a failed request', async () => {
    fetchMock
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({ status: 'reservations' }) })
    const { onStatus } = setup({ returned: true })
    await act(async () => {
      jest.advanceTimersByTime(3000)
    })
    await act(async () => {
      jest.advanceTimersByTime(3000)
    })
    expect(onStatus).toHaveBeenCalledWith('reservations')
  })

  it('does not stack requests while one is slow and does not restart on re-render', async () => {
    fetchMock.mockReturnValue(new Promise(() => {}))
    const onStatus = jest.fn()
    const view = render(<PayPlan chatId="c1" status="awaiting_payment" priceCents={1} returned onStatus={onStatus} />)
    await act(async () => {
      jest.advanceTimersByTime(30000)
    })
    expect(fetchMock).toHaveBeenCalledTimes(1)
    view.rerender(<PayPlan chatId="c1" status="awaiting_payment" priceCents={1} returned onStatus={() => undefined} />)
    await act(async () => {
      jest.advanceTimersByTime(30000)
    })
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('offers a way back to the pay button after giving up', async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 200, json: async () => ({ status: 'awaiting_payment' }) })
    setup({ returned: true })
    for (let i = 0; i < 25; i++) {
      await act(async () => {
        jest.advanceTimersByTime(3000)
      })
    }
    fireEvent.click(screen.getByRole('button', { name: /did not finish paying/i }))
    expect(screen.getByRole('button', { name: /^pay/i })).toBeTruthy()
  })
})
