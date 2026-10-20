const ADVICE =
  /recommend|suggest|advis|you should|you could|\btry(ing)?\b|consider|diagnos|\btreat|therap|medicat|medicine|\bmeds?\b|\bdrugs?\b|prescri|\bdos(e|es|age)\b|surgery|supplement|ibuprofen|antibiotic|\bcur(e|es|ed)\b/i
const CONTACT = /https?:\/\/|www\.|\S+@\S+|\b[a-z0-9-]+\.(com|org|net|io|gov|edu|co|us|uk|health|info)\b/i
const NUMBERS = /(\d[\s().+-]*){7,}|\b(911|988|112|999)\b/

export function guardReply(text: string) {
  const reply = text.trim()
  if (!reply || reply.length > 240 || reply.includes('?')) return ''
  return ADVICE.test(reply) || CONTACT.test(reply) || NUMBERS.test(reply) ? '' : reply
}
