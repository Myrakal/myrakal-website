import { ClaudeNotConfigured, runTurn } from './claude'
import { INTAKE_FIELDS } from './intake'
import { buildSystemPrompt } from './prompt'

const create = jest.fn()

jest.mock('@anthropic-ai/sdk', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({ messages: { create } })),
}))

const textReply = (text: string) => ({ stop_reason: 'end_turn', content: [{ type: 'text', text }] })
const toolReply = (input: unknown, text = '') => ({
  stop_reason: 'tool_use',
  content: [
    ...(text ? [{ type: 'text', text }] : []),
    { type: 'tool_use', id: 'tu_1', name: 'update_intake', input },
  ],
})

describe('runTurn', () => {
  beforeEach(() => {
    create.mockReset()
    process.env.ANTHROPIC_API_KEY = 'sk-test'
    process.env.ANTHROPIC_MODEL = 'claude-test'
  })

  afterEach(() => {
    delete process.env.ANTHROPIC_API_KEY
    delete process.env.ANTHROPIC_MODEL
  })

  it('throws ClaudeNotConfigured without a key', async () => {
    delete process.env.ANTHROPIC_API_KEY
    await expect(runTurn({ history: [{ role: 'user', text: 'hi' }], intake: {} })).rejects.toThrow(ClaudeNotConfigured)
  })

  it('throws ClaudeNotConfigured without a model', async () => {
    delete process.env.ANTHROPIC_MODEL
    await expect(runTurn({ history: [{ role: 'user', text: 'hi' }], intake: {} })).rejects.toThrow(ClaudeNotConfigured)
  })

  it('returns the text reply with no updates', async () => {
    create.mockResolvedValueOnce(textReply('Hello, what is your name?'))
    const result = await runTurn({ history: [{ role: 'user', text: 'hi' }], intake: {} })
    expect(result).toEqual({ reply: 'Hello, what is your name?', updates: {} })
    const args = create.mock.calls[0][0]
    expect(args.model).toBe('claude-test')
    expect(args.messages).toEqual([{ role: 'user', content: 'hi' }])
    expect(args.tools[0].name).toBe('update_intake')
    expect(args.system).toContain('911')
  })

  it('applies update_intake, sends a tool_result and returns the follow-up text', async () => {
    create
      .mockResolvedValueOnce(toolReply({ name: ' Ada ', bogus: 'x' }))
      .mockResolvedValueOnce(textReply('Thanks Ada. When were you born?'))
    const result = await runTurn({ history: [{ role: 'user', text: 'I am Ada' }], intake: {} })
    expect(result).toEqual({ reply: 'Thanks Ada. When were you born?', updates: { name: 'Ada' } })
    const second = create.mock.calls[1][0].messages
    expect(second[1].role).toBe('assistant')
    expect(second[2]).toEqual({
      role: 'user',
      content: [{ type: 'tool_result', tool_use_id: 'tu_1', content: expect.any(String) }],
    })
  })

  it('merges updates across tool rounds, later values winning', async () => {
    create
      .mockResolvedValueOnce(toolReply({ name: 'Ada' }))
      .mockResolvedValueOnce(toolReply({ name: 'Ada L', phone: '123' }))
      .mockResolvedValueOnce(textReply('ok'))
    const result = await runTurn({ history: [{ role: 'user', text: 'x' }], intake: {} })
    expect(result.updates).toEqual({ name: 'Ada L', phone: '123' })
  })

  it('stops after a bounded number of tool rounds', async () => {
    create.mockResolvedValue(toolReply({ name: 'Ada' }))
    const result = await runTurn({ history: [{ role: 'user', text: 'x' }], intake: {} })
    expect(create.mock.calls.length).toBeLessThanOrEqual(4)
    expect(result.reply).toBe('')
  })

  it('maps assistant history to assistant messages', async () => {
    create.mockResolvedValueOnce(textReply('ok'))
    await runTurn({
      history: [
        { role: 'user', text: 'a' },
        { role: 'assistant', text: 'b' },
        { role: 'user', text: 'c' },
      ],
      intake: {},
    })
    expect(create.mock.calls[0][0].messages.map((m: { role: string }) => m.role)).toEqual(['user', 'assistant', 'user'])
  })
})

describe('buildSystemPrompt', () => {
  it('forbids diagnosis, mentions 911 and lists every field', () => {
    const prompt = buildSystemPrompt({})
    expect(prompt).toMatch(/diagnos/i)
    expect(prompt).toContain('911')
    for (const f of INTAKE_FIELDS) expect(prompt).toContain(f.key)
  })

  it('shows what is already collected and what is missing', () => {
    const prompt = buildSystemPrompt({ name: 'Ada' })
    expect(prompt).toContain('Collected')
    expect(prompt).toContain('Ada')
    expect(prompt).toContain('Still needed')
  })
})
