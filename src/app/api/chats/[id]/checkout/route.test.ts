const findFirst = jest.fn()
const updateMany = jest.fn()
const requireUser = jest.fn()
const sessionsCreate = jest.fn()
const sessionsRetrieve = jest.fn()
jest.mock('@/server/db', () => ({ db: () => ({ chat: { findFirst, updateMany } }) }))
jest.mock('@/server/auth', () => ({ requireUser: () => requireUser() }))
jest.mock('@/server/stripe', () => ({ stripe: () => ({ checkout: { sessions: { create: sessionsCreate, retrieve: sessionsRetrieve } } }) }))

import { POST } from './route'

const ID = '3f2b8c1e-9d4a-4e6b-8a1f-2c7d5e9b0a13'
const headers = { host: 'myrakal.com', origin: 'https://myrakal.com' }
const call = (opts: { id?: string; headers?: Record<string, string> } = {}) => {
  const id = opts.id ?? ID
  return POST(new Request(`https://myrakal.com/api/chats/${id}/checkout`, { method: 'POST', headers: opts.headers ?? headers }), {
    params: Promise.resolve({ id }),
  })
}

beforeEach(() => {
  jest.clearAllMocks()
  delete process.env.PLAN_PRICE_CENTS
  requireUser.mockResolvedValue({ id: 'u1' })
  findFirst.mockResolvedValue({ status: 'awaiting_payment', priceCents: null, stripeSessionId: null })
  sessionsCreate.mockResolvedValue({ id: 'cs_new', url: 'https://checkout.stripe.com/new' })
})

describe('POST /api/chats/:id/checkout', () => {
  it('returns 403 on a cross-site request', async () => {
    expect((await call({ headers: { ...headers, origin: 'https://evil.com' } })).status).toBe(403)
    expect(sessionsCreate).not.toHaveBeenCalled()
  })

  it('returns 401 without a session', async () => {
    requireUser.mockResolvedValue(null)
    expect((await call()).status).toBe(401)
  })

  it('returns 404 for a malformed id', async () => {
    expect((await call({ id: 'nope' })).status).toBe(404)
  })

  it('returns 404 when the chat is not owned by the caller', async () => {
    findFirst.mockResolvedValue(null)
    expect((await call()).status).toBe(404)
    expect(findFirst).toHaveBeenCalledWith(expect.objectContaining({ where: { id: ID, userId: 'u1' } }))
  })

  it.each(['intake', 'plan_ready', 'reservations', 'booked'])('returns 409 in %s', async (status) => {
    findFirst.mockResolvedValue({ status, priceCents: null, stripeSessionId: null })
    expect((await call()).status).toBe(409)
    expect(sessionsCreate).not.toHaveBeenCalled()
  })

  it('creates a session with the default price, chat metadata and return urls, and stores its id', async () => {
    const res = await call()
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ url: 'https://checkout.stripe.com/new' })
    expect(sessionsCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: 'payment',
        client_reference_id: ID,
        metadata: { chatId: ID },
        success_url: `https://myrakal.com/dashboard/${ID}?paid=1`,
        cancel_url: `https://myrakal.com/dashboard/${ID}`,
        line_items: [expect.objectContaining({ quantity: 1, price_data: expect.objectContaining({ currency: 'usd', unit_amount: 5000 }) })],
      }),
      expect.any(Object),
    )
    expect(updateMany).toHaveBeenCalledWith({ where: { id: ID, status: 'awaiting_payment' }, data: { stripeSessionId: 'cs_new' } })
    expect(sessionsCreate).toHaveBeenCalledWith(expect.anything(), { idempotencyKey: `checkout-${ID}-first` })
  })

  it('prefers the chat price over PLAN_PRICE_CENTS, which beats the default', async () => {
    process.env.PLAN_PRICE_CENTS = '20000'
    await call()
    expect(sessionsCreate.mock.calls[0][0].line_items[0].price_data.unit_amount).toBe(20000)
    findFirst.mockResolvedValue({ status: 'awaiting_payment', priceCents: 9900, stripeSessionId: null })
    await call()
    expect(sessionsCreate.mock.calls[1][0].line_items[0].price_data.unit_amount).toBe(9900)
  })

  it('reuses an open session', async () => {
    findFirst.mockResolvedValue({ status: 'awaiting_payment', priceCents: null, stripeSessionId: 'cs_old' })
    sessionsRetrieve.mockResolvedValue({ id: 'cs_old', status: 'open', url: 'https://checkout.stripe.com/old' })
    const res = await call()
    expect(await res.json()).toEqual({ url: 'https://checkout.stripe.com/old' })
    expect(sessionsCreate).not.toHaveBeenCalled()
  })

  it('creates a fresh session when the stored one is expired or missing', async () => {
    findFirst.mockResolvedValue({ status: 'awaiting_payment', priceCents: null, stripeSessionId: 'cs_old' })
    sessionsRetrieve.mockResolvedValue({ id: 'cs_old', status: 'expired', url: null })
    expect((await (await call()).json()).url).toBe('https://checkout.stripe.com/new')
    sessionsRetrieve.mockRejectedValue(Object.assign(new Error('No such session'), { code: 'resource_missing' }))
    expect((await (await call()).json()).url).toBe('https://checkout.stripe.com/new')
  })

  it('keys the idempotency on the previous session so retries after expiry get a new one', async () => {
    findFirst.mockResolvedValue({ status: 'awaiting_payment', priceCents: null, stripeSessionId: 'cs_old' })
    sessionsRetrieve.mockResolvedValue({ id: 'cs_old', status: 'expired', url: null })
    await call()
    expect(sessionsCreate).toHaveBeenCalledWith(expect.anything(), { idempotencyKey: `checkout-${ID}-cs_old` })
  })

  it('throws on stripe errors other than a missing session instead of orphaning the old one', async () => {
    findFirst.mockResolvedValue({ status: 'awaiting_payment', priceCents: null, stripeSessionId: 'cs_old' })
    sessionsRetrieve.mockRejectedValue(Object.assign(new Error('rate limited'), { code: 'rate_limit' }))
    await expect(call()).rejects.toThrow(/rate limited/)
    expect(sessionsCreate).not.toHaveBeenCalled()
  })

  it('throws when stripe returns no url', async () => {
    sessionsCreate.mockResolvedValue({ id: 'cs_new', url: null })
    await expect(call()).rejects.toThrow(/url/)
  })

  it('ignores an invalid PLAN_PRICE_CENTS', async () => {
    process.env.PLAN_PRICE_CENTS = '150.5'
    await call()
    expect(sessionsCreate.mock.calls[0][0].line_items[0].price_data.unit_amount).toBe(5000)
  })
})
