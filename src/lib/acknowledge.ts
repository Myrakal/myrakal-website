const TIMEOUT_MS = 4_000
const MAX_SENT = 1000
const MAX_REPLY = 240
const MAX_FAILURES = 2
const UNAVAILABLE = new Set([404, 501, 503])
const NONE = { reply: '', emergency: false }

let unavailable = false
let failures = 0

const hasAddressMarker = (text: string) =>
  /[@＠]/.test(text) || /\bat\b.{0,40}\bdot\b/i.test(text)

const shapedReply = (reply: string) => {
  const text = reply.trim()
  if (!text || text.length > MAX_REPLY) return ''
  if (/[\r\n*#`_[\]()]/.test(text) || /https?:|www\./i.test(text)) return ''
  if ((text.match(/\d/g)?.length ?? 0) > text.length * 0.15) return ''
  return /[.!?]$/.test(text) ? text : `${text}.`
}

export function resetAcknowledge() {
  unavailable = false
  failures = 0
}

const fail = () => {
  if (++failures >= MAX_FAILURES) unavailable = true
  return NONE
}

export async function acknowledge(text: string, signal?: AbortSignal) {
  const message = text.slice(0, MAX_SENT)
  if (unavailable || signal?.aborted || hasAddressMarker(message)) return NONE
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS)
  const onAbort = () => controller.abort()
  signal?.addEventListener('abort', onAbort)
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [{ role: 'user', text: message }] }),
      signal: controller.signal,
    })
    if (UNAVAILABLE.has(res.status)) unavailable = true
    if (!res.ok) return fail()
    failures = 0
    const { reply, emergency } = await res.json()
    if (typeof reply !== 'string') return NONE
    if (emergency === true && reply.trim()) return { reply: reply.trim(), emergency: true }
    return { reply: shapedReply(reply), emergency: false }
  } catch {
    return fail()
  } finally {
    clearTimeout(timeout)
    signal?.removeEventListener('abort', onAbort)
  }
}
