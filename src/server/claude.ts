import Anthropic from '@anthropic-ai/sdk'
import { REQUEST_ATTACHMENT_TOOL } from './attachments'
import { UPDATE_INTAKE_TOOL, pickIntakeFields } from './intake'
import { buildSystemPrompt } from './prompt'

const MAX_ROUNDS = 3
const MAX_TOKENS = 1024
const MAX_HISTORY = 60
const TIMEOUT_MS = 25_000

export class ClaudeNotConfigured extends Error {
  constructor() {
    super('ANTHROPIC_API_KEY or ANTHROPIC_MODEL is not set')
    this.name = 'ClaudeNotConfigured'
  }
}

export type HistoryMessage = { role: 'user' | 'assistant'; text: string }

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

let client: Anthropic | undefined

function configured() {
  const apiKey = process.env.ANTHROPIC_API_KEY
  const model = process.env.ANTHROPIC_MODEL
  if (!apiKey || !model) throw new ClaudeNotConfigured()
  client ??= new Anthropic({ apiKey, timeout: TIMEOUT_MS, maxRetries: 1 })
  return { client, model }
}

export async function runTurn({ history, intake }: { history: HistoryMessage[]; intake: unknown }) {
  const { client, model } = configured()
  const system = buildSystemPrompt(intake)
  const turns = history.filter((m) => m.text.trim() !== '').slice(-MAX_HISTORY)
  const firstUser = turns.findIndex((m) => m.role === 'user')
  const messages: Anthropic.MessageParam[] = (firstUser < 0 ? [] : turns.slice(firstUser)).map((m) => ({
    role: m.role,
    content: m.text,
  }))
  const updates: Record<string, string | boolean> = {}
  let reply = ''
  let attachmentRequest: { label: string } | undefined

  for (let round = 0; round <= MAX_ROUNDS; round++) {
    const response = await client.messages.create({
      model,
      max_tokens: MAX_TOKENS,
      system,
      tools: [UPDATE_INTAKE_TOOL, REQUEST_ATTACHMENT_TOOL],
      messages,
    })
    const text = response.content
      .flatMap((block) => (block.type === 'text' ? [block.text] : []))
      .join('\n')
      .trim()
    if (text) reply = text
    const calls = response.content.filter((block) => block.type === 'tool_use')
    const results = calls.map((call) => {
      if (call.name === REQUEST_ATTACHMENT_TOOL.name) {
        const label = isRecord(call.input) && typeof call.input.label === 'string' ? call.input.label.trim().slice(0, 200) : ''
        attachmentRequest = { label: label || 'a file' }
        return { type: 'tool_result' as const, tool_use_id: call.id, content: 'shown' }
      }
      const accepted = pickIntakeFields(call.input)
      Object.assign(updates, accepted)
      const rejected = Object.keys(isRecord(call.input) ? call.input : {}).filter((key) => !(key in accepted))
      const content = rejected.length
        ? `saved: ${Object.keys(accepted).join(', ') || 'none'}; not saved (unknown, blank or not confirmed): ${rejected.join(', ')}`
        : 'saved'
      return { type: 'tool_result' as const, tool_use_id: call.id, content }
    })
    if (response.stop_reason !== 'tool_use' || calls.length === 0) return { reply, updates, attachmentRequest }

    messages.push({ role: 'assistant', content: response.content })
    messages.push({ role: 'user', content: results })
  }
  return { reply, updates, attachmentRequest }
}
