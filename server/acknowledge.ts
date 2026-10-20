import type Anthropic from '@anthropic-ai/sdk'

import { INTAKE_SYSTEM_PROMPT } from './prompts/intake.ts'
import { guardReply } from './reply.ts'

export async function acknowledge(client: Pick<Anthropic, 'messages'>, text: string, model: string) {
  const response = await client.messages.create(
    {
      model,
      max_tokens: 160,
      thinking: { type: 'disabled' },
      system: INTAKE_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: text }],
    },
    { timeout: 8000 },
  )
  if (response.stop_reason !== 'end_turn') return { reply: '', raw: '' }
  const raw = response.content.flatMap((b) => (b.type === 'text' ? [b.text] : [])).join('')
  return { reply: guardReply(raw), raw }
}
