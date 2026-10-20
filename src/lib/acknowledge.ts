const TIMEOUT_MS = 4_000
const MAX_SENT = 1000
const MAX_REPLY = 240
const MAX_FAILURES = 2
const UNAVAILABLE = new Set([404, 501, 503])
const NONE = { reply: '', emergency: false }

let unavailable = false
let failures = 0

const MONTH = /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+\d{1,2}(st|nd|rd|th)?,?\s+(19|20)?\d{2}\b/i

const hasAddressMarker = (t: string) =>
  /@/.test(t) || /\bat\b[\s\S]{0,40}\bdot\b/i.test(t) || /\bat\s+[\w-]{1,63}(\.[\w-]{1,63})+/i.test(t)

const hasPersonalNumber = (t: string) =>
  /\d{6,}/.test(t.replace(/(?<=\d)[\s.\-/()]+(?=\d)/g, '')) ||
  /\b\d{1,2}[/.-]\d{1,2}[/.-]\d{2,4}\b/.test(t) ||
  /\b(19|20)\d{2}[/.-]\d{1,2}[/.-]\d{1,2}\b/.test(t) ||
  MONTH.test(t) ||
  /\b\d{1,2}(st|nd|rd|th)?\s+(of\s+)?(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?,?\s+(19|20)?\d{2}\b/i.test(t)

const shapedReply = (reply: string) => {
  const text = reply.trim()
  if (!text || text.length > MAX_REPLY) return ''
  if (/[@?\r\n*#`_[\]()]/.test(text) || /https?:|www\./i.test(text)) return ''
  if (/\b[a-z0-9-]+\.[a-z]{2,}\b/i.test(text) || /\d{5,}/.test(text)) return ''
  if ((text.match(/\d/g)?.length ?? 0) > text.length * 0.15) return ''
  return /[.!?]$/.test(text) ? text : `${text}.`
}

const fail = () => {
  if (++failures >= MAX_FAILURES) unavailable = true
  return NONE
}

export async function acknowledge(text: string, signal?: AbortSignal) {
  const full = text.normalize('NFKC')
  if (unavailable || signal?.aborted || hasAddressMarker(full) || hasPersonalNumber(full)) return NONE
  const message = text.slice(0, MAX_SENT)
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
    if (res.status === 400 || res.status === 429) return NONE
    if (!res.ok) return fail()
    failures = 0
    const { reply, emergency } = await res.json()
    if (emergency === true) return { reply: '', emergency: true }
    if (typeof reply !== 'string') return NONE
    return { reply: shapedReply(reply), emergency: false }
  } catch {
    return signal?.aborted ? NONE : fail()
  } finally {
    clearTimeout(timeout)
    signal?.removeEventListener('abort', onAbort)
  }
}
