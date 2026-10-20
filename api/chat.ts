import Anthropic from '@anthropic-ai/sdk'

import { acknowledge } from '../server/acknowledge.ts'
import { InvalidChat, parseMessages } from '../server/chat.ts'
import { checkRequest, json, logFailure, methodNotAllowed, readJsonBody } from '../server/http.ts'

const MAX_BYTES = 100000

export { methodNotAllowed as DELETE, methodNotAllowed as GET, methodNotAllowed as PATCH, methodNotAllowed as PUT }

export async function POST(request: Request) {
  const rejected = checkRequest(request, MAX_BYTES)
  if (rejected) return rejected
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return json({ error: 'AI replies are not configured' }, 503)
  const body = await readJsonBody(request, MAX_BYTES, 'chat')
  if ('response' in body) return body.response
  try {
    const messages = parseMessages(body.value)
    const client = new Anthropic({ apiKey, maxRetries: 0 })
    const reply = await acknowledge(client, messages, process.env.ANTHROPIC_MODEL || 'claude-haiku-5-5')
    return json({ reply }, 200)
  } catch (err) {
    if (err instanceof InvalidChat) return json({ error: err.message }, 400)
    logFailure('chat reply failed', err)
    return json({ error: 'Could not generate a reply' }, 502)
  }
}
