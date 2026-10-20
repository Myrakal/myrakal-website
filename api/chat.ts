import Anthropic from '@anthropic-ai/sdk'

import { acknowledge } from '../server/acknowledge.ts'
import { InvalidChat, parseLatestMessage } from '../server/chat.ts'
import { EMERGENCY_REPLY, detectEmergency } from '../server/emergency.ts'
import { MAX_BODY_BYTES, checkRequest, json, logFailure, methodNotAllowed, readJsonBody } from '../server/http.ts'

export { methodNotAllowed as DELETE, methodNotAllowed as GET, methodNotAllowed as PATCH, methodNotAllowed as PUT }

export async function POST(request: Request) {
  const rejected = checkRequest(request, MAX_BODY_BYTES)
  if (rejected) return rejected
  const body = await readJsonBody(request, MAX_BODY_BYTES, 'chat')
  if ('response' in body) return body.response
  try {
    const text = parseLatestMessage(body.value)
    if (detectEmergency(text)) return json({ reply: EMERGENCY_REPLY, emergency: true }, 200)
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) return json({ error: 'AI replies are not configured' }, 503)
    const client = new Anthropic({ apiKey, maxRetries: 0 })
    const reply = await acknowledge(client, text, process.env.ANTHROPIC_MODEL || 'claude-haiku-5-5')
    return json({ reply, emergency: false }, 200)
  } catch (err) {
    if (err instanceof InvalidChat) return json({ error: err.message }, 400)
    logFailure('chat reply failed', err)
    return json({ error: 'Could not generate a reply' }, 502)
  }
}
