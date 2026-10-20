const HARD = /diagnos|treatment|medication|prescri|dose/i
const SOFT = /recommend|suggest|you should/i
const EMERGENCY = /emergency services|\b988\b/i

export function guardReply(text: string) {
  const reply = text.trim()
  if (!reply || reply.length > 240 || reply.includes('?') || HARD.test(reply)) return ''
  if (SOFT.test(reply) && !EMERGENCY.test(reply)) return ''
  return reply
}
