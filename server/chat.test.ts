import { InvalidChat, parseMessages } from './chat.ts'

const user = (text: string) => ({ role: 'user', text })
const assistant = (text: string) => ({ role: 'assistant', text })

describe('parseMessages', () => {
  it('accepts a conversation that ends with a visitor message', () => {
    expect(parseMessages({ messages: [assistant('Hi'), user('Knee pain')] })).toEqual([
      { role: 'assistant', text: 'Hi' },
      { role: 'user', text: 'Knee pain' },
    ])
  })

  it('keeps only role and text', () => {
    const out = parseMessages({ messages: [{ ...user('hi'), extra: 1, __proto__: { x: 1 } }] })
    expect(out).toEqual([{ role: 'user', text: 'hi' }])
  })

  it('accepts exactly 20 messages and 4000 characters', () => {
    const many = Array.from({ length: 19 }, () => assistant('a')).concat(user('b'.repeat(4000)))
    expect(parseMessages({ messages: many })).toHaveLength(20)
  })

  it.each([
    ['null input', null],
    ['a string input', 'hi'],
    ['an array input', []],
    ['missing messages', {}],
    ['messages that is not an array', { messages: 'hi' }],
    ['no messages', { messages: [] }],
    ['more than 20 messages', { messages: Array.from({ length: 21 }, () => user('a')) }],
    ['a last message from the assistant', { messages: [user('a'), assistant('b')] }],
    ['a non-object message', { messages: ['hi'] }],
    ['an unknown role', { messages: [{ role: 'system', text: 'a' }] }],
    ['non-string text', { messages: [{ role: 'user', text: 5 }] }],
    ['empty text', { messages: [user('')] }],
    ['whitespace-only text', { messages: [user('  \n ')] }],
    ['text over 4000 characters', { messages: [user('a'.repeat(4001))] }],
    ['a NUL character', { messages: [user('a\u0000b')] }],
    ['an escape character', { messages: [user('a\u001bb')] }],
    ['a bidi override', { messages: [user('a‮b')] }],
    ['a zero-width space', { messages: [user('a​b')] }],
    ['a lone surrogate', { messages: [user('a\ud800b')] }],
  ])('rejects %s', (_label, input) => {
    expect(() => parseMessages(input)).toThrow(InvalidChat)
  })

  it('allows newlines, tabs and emoji joiners in message text', () => {
    const text = 'line one\r\nline\ttwo \u{1f468}‍\u{1f469}'
    expect(parseMessages({ messages: [user(text)] })).toEqual([{ role: 'user', text }])
  })
})
