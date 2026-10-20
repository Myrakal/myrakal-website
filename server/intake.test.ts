import { vi } from 'vitest'
import { InvalidIntake, saveIntake } from './intake'

const store = () => {
  const create = vi.fn(async (_args: { data: Record<string, unknown>; select: unknown }) => ({ id: 'abc-123' }))
  return { create, db: { intake: { create } } as never }
}

const valid = {
  name: 'Ada',
  email: 'ada@example.com',
  transcript: [
    { role: 'assistant', text: 'Hi' },
    { role: 'user', text: 'Knee pain' },
  ],
}

describe('saveIntake', () => {
  it('stores a valid intake and returns its id', async () => {
    const { create, db } = store()
    await expect(saveIntake(valid, db)).resolves.toEqual({ id: 'abc-123' })
    expect(create).toHaveBeenCalledWith({
      data: { name: 'Ada', email: 'ada@example.com', transcript: valid.transcript },
      select: { id: true },
    })
  })

  it('allows a missing name', async () => {
    const { create, db } = store()
    await saveIntake({ email: 'a@b.co', transcript: valid.transcript }, db)
    expect(create.mock.calls[0][0].data.name).toBeNull()
  })

  it('trims name and email', async () => {
    const { create, db } = store()
    await saveIntake({ ...valid, name: '  Ada  ', email: '  ada@example.com ' }, db)
    expect(create.mock.calls[0][0].data).toMatchObject({ name: 'Ada', email: 'ada@example.com' })
  })

  it('silently skips saving when the honeypot is filled', async () => {
    const { create, db } = store()
    await expect(saveIntake({ ...valid, website: 'http://spam.example' }, db)).resolves.toEqual({ id: 'ok' })
    expect(create).not.toHaveBeenCalled()
  })

  it.each([
    ['not an object', 'nope'],
    ['null', null],
    ['missing email', { transcript: valid.transcript }],
    ['malformed email', { ...valid, email: 'not-an-email' }],
    ['email too long', { ...valid, email: `${'a'.repeat(250)}@b.co` }],
    ['name too long', { ...valid, name: 'a'.repeat(201) }],
    ['name not a string', { ...valid, name: 5 }],
    ['transcript missing', { email: 'a@b.co' }],
    ['transcript empty', { ...valid, transcript: [] }],
    ['transcript not an array', { ...valid, transcript: 'hi' }],
    ['too many messages', { ...valid, transcript: Array.from({ length: 101 }, () => ({ role: 'user', text: 'x' })) }],
    ['bad role', { ...valid, transcript: [{ role: 'system', text: 'x' }] }],
    ['empty text', { ...valid, transcript: [{ role: 'user', text: '' }] }],
    ['text too long', { ...valid, transcript: [{ role: 'user', text: 'x'.repeat(4001) }] }],
    ['text not a string', { ...valid, transcript: [{ role: 'user', text: 5 }] }],
    ['message not an object', { ...valid, transcript: ['hi'] }],
    ['NUL in name', { ...valid, name: 'Ad\u0000a' }],
    ['NUL in email', { ...valid, email: 'ada\u0000@example.com' }],
    ['NUL in message text', { ...valid, transcript: [{ role: 'user', text: 'hi\u0000there' }] }],
    ['whitespace-only message text', { ...valid, transcript: [{ role: 'user', text: '   \n ' }] }],
    ['consecutive dots in email', { ...valid, email: 'a..b@example.com' }],
    ['consecutive dots in domain', { ...valid, email: 'a@exa..mple.com' }],
    ['leading dot in domain', { ...valid, email: 'a@.example.com' }],
    ['trailing dot in domain', { ...valid, email: 'a@example.com.' }],
    ['control character in email', { ...valid, email: 'a\u0001b@example.com' }],
    ['transcript over the total cap', { ...valid, transcript: Array.from({ length: 14 }, () => ({ role: 'user', text: 'x'.repeat(4000) })) }],
  ])('rejects %s', async (_label, input) => {
    const { create, db } = store()
    await expect(saveIntake(input, db)).rejects.toBeInstanceOf(InvalidIntake)
    expect(create).not.toHaveBeenCalled()
  })

  it('lowercases the email before storing', async () => {
    const { create, db } = store()
    await saveIntake({ ...valid, email: '  Ada@Example.COM ' }, db)
    expect(create.mock.calls[0][0].data.email).toBe('ada@example.com')
  })

  it('trims message text before storing', async () => {
    const { create, db } = store()
    await saveIntake({ ...valid, transcript: [{ role: 'user', text: '  hello  ' }] }, db)
    expect(create.mock.calls[0][0].data.transcript).toEqual([{ role: 'user', text: 'hello' }])
  })

  it('drops unexpected fields from stored messages', async () => {
    const { create, db } = store()
    await saveIntake({ ...valid, transcript: [{ role: 'user', text: 'hi', extra: 'x' }], admin: true }, db)
    expect(create.mock.calls[0][0].data.transcript).toEqual([{ role: 'user', text: 'hi' }])
  })
})
