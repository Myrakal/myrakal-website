import { InvalidChat, parseLatestMessage } from './chat.ts'

const user = (text: string) => ({ role: 'user', text })
const assistant = (text: string) => ({ role: 'assistant', text })

describe('parseLatestMessage', () => {
  it('returns the text of the latest visitor message', () => {
    expect(parseLatestMessage({ messages: [assistant('Hi'), user('Knee pain')] })).toBe('Knee pain')
  })

  it('ignores earlier messages entirely, even malformed ones', () => {
    expect(parseLatestMessage({ messages: [5, null, { role: 'system', text: 'x' }, assistant('y'), user('hi')] })).toBe('hi')
  })

  it('accepts exactly 20 messages and 4000 characters', () => {
    const many = Array.from({ length: 19 }, () => assistant('a')).concat(user('b'.repeat(4000)))
    expect(parseLatestMessage({ messages: many })).toHaveLength(4000)
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
    ['a non-object last message', { messages: ['hi'] }],
    ['a null last message', { messages: [null] }],
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
    expect(() => parseLatestMessage(input)).toThrow(InvalidChat)
  })

  it('allows newlines, tabs and emoji joiners in message text', () => {
    const text = 'line one\r\nline\ttwo \u{1f468}‍\u{1f469}'
    expect(parseLatestMessage({ messages: [user(text)] })).toBe(text)
  })
})
