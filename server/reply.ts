const ADVICE =
  /recommend|suggest|advis|avoid|you should|you could|you need to|need to see|sounds like|stop taking|\btry(ing)?\b|consider|diagnos|\btreat|therap|medicat|medicine|\bmeds?\b|\bdrugs?\b|prescri|\bdos(e|es|age)\b|surgery|supplement|ibuprofen|antibiotic|\bcur(e|es|ed)\b|\brest\b|\bdrink|migraine|\bdiet\b|exercise/i
const CONTACT =
  /https?:\/\/|www\.|\S+@\S+|\b[a-z0-9][a-z0-9-]*(\.[a-z0-9-]+)*\.[a-z]{2,}\b|\bat\b[\s)\]]*\w+[\s([]*\bdot\b/i
const NUMBERS = /(\d[\s().+-]*){5,}|\b(911|988|112|999)\b/

export function guardReply(text: string) {
  const reply = text.trim()
  if (!reply || reply.length > 240 || reply.includes('?')) return ''
  return ADVICE.test(reply) || CONTACT.test(reply) || NUMBERS.test(reply) ? '' : reply
}
