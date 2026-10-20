import { vi } from 'vitest'
import { acknowledge } from './acknowledge.ts'
import { INTAKE_SYSTEM_PROMPT } from './prompts/intake.ts'

const reply = (text: string, stop_reason = 'end_turn') => ({
  stop_reason,
  content: [{ type: 'text', text }],
})

const fake = (result: unknown) => {
  const create = vi.fn().mockResolvedValue(result)
  return { create, client: { messages: { create } } as never }
}

describe('acknowledge', () => {
  it('asks the model for a short acknowledgement with the system prompt', async () => {
    const { create, client } = fake(reply('Thank you for sharing that.'))
    await acknowledge(client, 'Knee pain for two months', 'claude-haiku-5-5')
    const [params, options] = create.mock.calls[0]
    expect(params.model).toBe('claude-haiku-5-5')
    expect(params.system).toBe(INTAKE_SYSTEM_PROMPT)
    expect(params.max_tokens).toBeLessThanOrEqual(200)
    expect(params.thinking).toEqual({ type: 'disabled' })
    expect(params).not.toHaveProperty('temperature')
    expect(options).toEqual({ timeout: 8000 })
  })

  it('sends only the single latest visitor message', async () => {
    const { create, client } = fake(reply('Thanks.'))
    await acknowledge(client, 'Knee pain for two months', 'm')
    expect(create.mock.calls[0][0].messages).toEqual([{ role: 'user', content: 'Knee pain for two months' }])
  })

  it('returns the guarded reply text', async () => {
    const { client } = fake(reply('  That sounds hard. Thank you for telling me.  '))
    expect(await acknowledge(client, 'x', 'm')).toBe('That sounds hard. Thank you for telling me.')
  })

  it('joins several text blocks and ignores other block types', async () => {
    const { client } = fake({
      stop_reason: 'end_turn',
      content: [{ type: 'thinking', thinking: 'x' }, { type: 'text', text: 'Thank you.' }, { type: 'text', text: ' I hear you.' }],
    })
    expect(await acknowledge(client, 'x', 'm')).toBe('Thank you. I hear you.')
  })

  it('returns an empty reply when the guard rejects the text', async () => {
    const { client } = fake(reply('You should see a specialist.'))
    expect(await acknowledge(client, 'x', 'm')).toBe('')
  })

  it('returns an empty reply on a refusal or a truncated reply', async () => {
    expect(await acknowledge(fake(reply('Thank you.', 'refusal')).client, 'x', 'm')).toBe('')
    expect(await acknowledge(fake(reply('Thank you.', 'max_tokens')).client, 'x', 'm')).toBe('')
  })

  it('lets upstream errors propagate to the caller', async () => {
    const create = vi.fn().mockRejectedValue(new Error('boom'))
    await expect(acknowledge({ messages: { create } } as never, 'x', 'm')).rejects.toThrow('boom')
  })
})
