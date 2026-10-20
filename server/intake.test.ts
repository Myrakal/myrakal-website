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
    const { id } = await saveIntake({ ...valid, website: 'http://spam.example' }, db)
    expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)
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
    ['lone high surrogate in name', { ...valid, name: 'Ad\ud800a' }],
    ['lone low surrogate in email', { ...valid, email: 'ada\udc00@example.com' }],
    ['lone surrogate in message text', { ...valid, transcript: [{ role: 'user', text: 'hi \ud83d' }] }],
    ['tab in name', { ...valid, name: 'Ad\ta' }],
    ['newline in name', { ...valid, name: 'Ad\na' }],
    ['C1 control in name', { ...valid, name: 'Ad\u0085a' }],
    ['DEL in name', { ...valid, name: 'Ad\u007fa' }],
    ['bell in message text', { ...valid, transcript: [{ role: 'user', text: 'hi\u0007' }] }],
    ['escape in message text', { ...valid, transcript: [{ role: 'user', text: 'hi\u001b[0m' }] }],
    ['DEL in message text', { ...valid, transcript: [{ role: 'user', text: 'hi\u007f' }] }],
    ['C1 control in message text', { ...valid, transcript: [{ role: 'user', text: 'hi\u009f' }] }],
    ['bidi override in name', { ...valid, name: 'Ada\u202e' }],
    ['bidi override in message text', { ...valid, transcript: [{ role: 'user', text: 'a\u202db' }] }],
    ['bidi isolate in message text', { ...valid, transcript: [{ role: 'user', text: 'a\u2066b' }] }],
    ['bidi isolate in email', { ...valid, email: 'a\u2069@example.com' }],
    ['zero-width space in name', { ...valid, name: 'Ad\u200ba' }],
    ['byte order mark in name', { ...valid, name: '\ufeffAda' }],
    ['line separator in name', { ...valid, name: 'Ad\u2028a' }],
    ['paragraph separator in name', { ...valid, name: 'Ad\u2029a' }],
    ['tag character in name', { ...valid, name: 'Ada\u{e0067}' }],
    ['zero-width non-joiner in email', { ...valid, email: 'ada\u200c@example.com' }],
    ['zero-width joiner in email', { ...valid, email: 'ada\u200d@example.com' }],
    ['zero-width space in email', { ...valid, email: 'ada\u200b@example.com' }],
    ['byte order mark in email', { ...valid, email: '\ufeffada@example.com' }],
    ['line separator in email', { ...valid, email: 'ada\u2028@example.com' }],
    ['tag character in email', { ...valid, email: 'ada\u{e0067}@example.com' }],
    ['zero-width space in message text', { ...valid, transcript: [{ role: 'user', text: 'a\u200bb' }] }],
    ['byte order mark in message text', { ...valid, transcript: [{ role: 'user', text: 'a\ufeffb' }] }],
    ['soft hyphen in message text', { ...valid, transcript: [{ role: 'user', text: 'a\u00adb' }] }],
    ['tag character in message text', { ...valid, transcript: [{ role: 'user', text: 'a\u{e0067}b' }] }],
    ['line separator in message text', { ...valid, transcript: [{ role: 'user', text: 'a\u2028b' }] }],
    ['paragraph separator in message text', { ...valid, transcript: [{ role: 'user', text: 'a\u2029b' }] }],
    ['leading byte order mark in message text', { ...valid, transcript: [{ role: 'user', text: '\ufeffhello' }] }],
    ['trailing line separator in message text', { ...valid, transcript: [{ role: 'user', text: 'hello\u2028' }] }],
    ['local part over 64 characters', { ...valid, email: `${'a'.repeat(65)}@example.com` }],
    ['leading dot in local part', { ...valid, email: '.ada@example.com' }],
    ['trailing dot in local part', { ...valid, email: 'ada.@example.com' }],
    ['domain label starting with a hyphen', { ...valid, email: 'ada@-example.com' }],
    ['domain label ending with a hyphen', { ...valid, email: 'ada@example-.com' }],
    ['tld starting with a hyphen', { ...valid, email: 'ada@example.-com' }],
    ['domain ending with a hyphen', { ...valid, email: 'ada@example.com-' }],
    ['transcript over the total cap', { ...valid, transcript: Array.from({ length: 14 }, () => ({ role: 'user', text: 'x'.repeat(4000) })) }],
  ])('rejects %s', async (_label, input) => {
    const { create, db } = store()
    await expect(saveIntake(input, db)).rejects.toBeInstanceOf(InvalidIntake)
    expect(create).not.toHaveBeenCalled()
  })

  it('accepts newlines, tabs, carriage returns, emoji and accents in message text', async () => {
    const { create, db } = store()
    const text = 'line one\r\nline\ttwo \ud83d\ude42 café'
    await saveIntake({ ...valid, transcript: [{ role: 'user', text }] }, db)
    expect(create.mock.calls[0][0].data.transcript).toEqual([{ role: 'user', text }])
  })

  it('accepts zero-width joiner and variation selectors in message text, as emoji sequences need them', async () => {
    const { create, db } = store()
    const text = '\u{1f468}\u200d\u{1f469}\u200d\u{1f467} \u2764\ufe0f \u2764\ufe0e'
    await saveIntake({ ...valid, transcript: [{ role: 'user', text }] }, db)
    expect(create.mock.calls[0][0].data.transcript).toEqual([{ role: 'user', text }])
  })

  it('accepts the zero-width non-joiner in names and message text, as Persian and other scripts need it', async () => {
    const { create, db } = store()
    const name = '\u0645\u06cc\u200c\u062e\u0648\u0627\u0647\u0645'
    const text = '\u0645\u06cc\u200c\u062e\u0648\u0627\u0647\u0645 \u062f\u06a9\u062a\u0631'
    await saveIntake({ ...valid, name, transcript: [{ role: 'user', text }] }, db)
    expect(create.mock.calls[0][0].data.name).toBe(name)
    expect(create.mock.calls[0][0].data.transcript).toEqual([{ role: 'user', text }])
  })

  it('accepts accents and emoji in the name', async () => {
    const { create, db } = store()
    await saveIntake({ ...valid, name: 'José \ud83d\ude42' }, db)
    expect(create.mock.calls[0][0].data.name).toBe('José \ud83d\ude42')
  })

  it('accepts a 64 character local part and hyphens inside domain labels', async () => {
    const { create, db } = store()
    const email = `${'a'.repeat(64)}@my-example.co.uk`
    await saveIntake({ ...valid, email }, db)
    expect(create.mock.calls[0][0].data.email).toBe(email)
  })

  it('accepts dots inside the local part', async () => {
    const { create, db } = store()
    await saveIntake({ ...valid, email: 'ada.lovelace@example.com' }, db)
    expect(create.mock.calls[0][0].data.email).toBe('ada.lovelace@example.com')
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
