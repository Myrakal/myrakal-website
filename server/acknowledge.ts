import type Anthropic from '@anthropic-ai/sdk'

import type { ChatMessage } from './chat.ts'
import { INTAKE_SYSTEM_PROMPT } from './prompts/intake.ts'
import { guardReply } from './reply.ts'

export async function acknowledge(client: Pick<Anthropic, 'messages'>, messages: ChatMessage[], model: string) {
  const start = messages.findIndex((m) => m.role === 'user')
  const response = await client.messages.create(
    {
      model,
      max_tokens: 160,
      thinking: { type: 'disabled' },
      system: INTAKE_SYSTEM_PROMPT,
      messages: messages.slice(start).map((m) => ({ role: m.role, content: m.text })),
    },
    { timeout: 8000 },
  )
  if (response.stop_reason !== 'end_turn') return ''
  return guardReply(response.content.flatMap((b) => (b.type === 'text' ? [b.text] : [])).join(''))
}
