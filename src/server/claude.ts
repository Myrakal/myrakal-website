import Anthropic from '@anthropic-ai/sdk'
import { UPDATE_INTAKE_TOOL, pickIntakeFields } from './intake'
import { buildSystemPrompt } from './prompt'

const MAX_ROUNDS = 3
const MAX_TOKENS = 1024

export class ClaudeNotConfigured extends Error {
  constructor() {
    super('ANTHROPIC_API_KEY or ANTHROPIC_MODEL is not set')
    this.name = 'ClaudeNotConfigured'
  }
}

export type HistoryMessage = { role: 'user' | 'assistant'; text: string }

let client: Anthropic | undefined

function configured() {
  const apiKey = process.env.ANTHROPIC_API_KEY
  const model = process.env.ANTHROPIC_MODEL
  if (!apiKey || !model) throw new ClaudeNotConfigured()
  client ??= new Anthropic({ apiKey })
  return { client, model }
}

export async function runTurn({ history, intake }: { history: HistoryMessage[]; intake: unknown }) {
  const { client, model } = configured()
  const system = buildSystemPrompt(intake)
  const messages: Anthropic.MessageParam[] = history.map((m) => ({ role: m.role, content: m.text }))
  const updates: Record<string, string | boolean> = {}
  let reply = ''

  for (let round = 0; round <= MAX_ROUNDS; round++) {
    const response = await client.messages.create({
      model,
      max_tokens: MAX_TOKENS,
      system,
      tools: [UPDATE_INTAKE_TOOL],
      messages,
    })
    reply = response.content
      .flatMap((block) => (block.type === 'text' ? [block.text] : []))
      .join('\n')
      .trim()
    const calls = response.content.filter((block) => block.type === 'tool_use')
    if (response.stop_reason !== 'tool_use' || calls.length === 0) return { reply, updates }

    messages.push({ role: 'assistant', content: response.content })
    messages.push({
      role: 'user',
      content: calls.map((call) => {
        Object.assign(updates, pickIntakeFields(call.input))
        return { type: 'tool_result' as const, tool_use_id: call.id, content: 'saved' }
      }),
    })
  }
  return { reply: '', updates }
}
