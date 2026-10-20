export const EMERGENCY_REPLY =
  "I'm so sorry you're dealing with this. If you or someone else may be in danger or having a medical emergency, please contact your local emergency services right away. In the US, you can also call or text 988 for suicide and crisis support."

const DRUGS =
  "pills?|tablets?|capsules?|meds|medication|medications|tylenol|advil|ibuprofen|aspirin|acetaminophen|paracetamol|insulin|sleeping|xanax|valium|ambien|percocet|vicodin|fentanyl|opioids?|oxy\\w*"
const COUNT =
  "too many|lots of|a lot of|a bunch of|a handful of|all (?:of )?(?:the|my)|(?:the )?(?:whole|entire|full)|[89]|[1-9][0-9]+|eight|nine|ten|eleven|twelve|fifteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred"

const SOURCES = [
  String.raw`\b(?:don'?t|dont|do not|no longer) want to (?:live|be alive|be here)\b`,
  String.raw`\b(?:don'?t|dont) wanna (?:live|be here|be alive)\b`,
  String.raw`\b(?:don'?t|dont|do not) want to go on\b|\b(?:cannot|can not) go on\b|\bcan'?t go on (?:anymore|any more|any longer|like this)\b`,
  String.raw`\b(?:can'?t|cant|cannot|can not|couldn'?t|couldnt|unable to|not able to) (?:seem to |to )?(?:breathe|breath|catch (?:my|his|her|their) breath)\b`,
  String.raw`\b(?:don'?t|dont) think (?:i|he|she|they) can breathe\b`,
  String.raw`\b(?:can|could) (?:barely|hardly) breathe\b|\bbarely breathing\b|\bhardly (?:breathe|breathing|breath)\b`,
  String.raw`\b(?:hard|difficult|tough|rough) time breathing\b`,
  String.raw`\b(?:can'?t|cant|cannot|can not|unable to) get (?:any |enough )?air\b`,
  String.raw`\bsuffocating\b|\bdrowning\b|\bchoked\b|\bchoking\b|\bseizing\b|\bgasping\b|\bdying\b`,
  String.raw`\bwon'?t breathe\b|\bwont breathe\b|\bnot conscious\b|\bno pulse\b`,
  String.raw`\b(?:stopped|not|isn'?t|wasn'?t) breathing\b`,
  String.raw`\bunconscious\b|\bunresponsive\b|\bpassed out\b|\bcollaps(?:ed|ing)\b|\bfaint(?:ed|ing)\b`,
  String.raw`\b(?:not|isn'?t|aren'?t) responding\b|\b(?:won'?t|wont|can'?t|cant) wake(?: up)?\b|\bnot waking\b`,
  String.raw`\bcan'?t stop the bleeding\b|\bbleeding (?:won'?t|wont|will not|doesn'?t|does not) (?:stop|slow)\b|\bblood (?:won'?t|wont|will not|doesn'?t|does not) stop\b`,
  String.raw`\blost a lot of blood\b|\bstabbed\b|\bgunshot\b|\b(?:been|got|was|am|is) shot\b`,
  String.raw`\btook too many\b|\b(?:took|swallowed) (?:${COUNT}) (?:of )?(?:my |the )?(?:[\w']+ ){0,2}(?:${DRUGS})\b`,
  String.raw`\bswallowed (?:my |the |some |a few |all )?(?:${DRUGS})\b|\bswallowed (?:a (?:bunch|handful)|too many)\b`,
  String.raw`\b(?:swallowed|took|ate|drank) (?:a |an |the )?(?:whole|entire|full) bottle\b`,
  String.raw`\bchest ([\w']+ ){0,2}(?:hurts|hurting|aching|aches|ache)\b|\bchest (?:pain|pains|pressure|tightness|tight|heavy|heaviness|crushing)\b`,
  String.raw`\bchest (?:is |feels |feeling )?(?:tight|heavy|crushing)\b|\bcrushing (?:[\w']+ ){0,4}chest\b|\bchest (?:[\w']+ ){0,6}crush(?:ing|ed)\b`,
  String.raw`\b(?:pain|pressure|tightness|ache|aching|discomfort) (?:in|across|on) (?:my |the |his |her |their )?chest\b`,
  String.raw`\b(?:behind|under) (?:my |his |her )?(?:breastbone|sternum)\b|\bmy heart hurts\b`,
  String.raw`\b(?:elephant|weight|something|someone) (?:is )?(?:sitting |standing |pressing )?(?:on|in) (?:my |the )?chest\b`,
  String.raw`\bheart attack\b|\bpain (?:down|in|radiating (?:down|to)) (?:my |his |her |their )?(?:left )?(?:arm|jaw)\b`,
  String.raw`\b(?:trouble|difficulty|hard|struggling|struggle) (?:to )?breath(?:e|ing)?\b|\bshort(?:ness)? of breath\b`,
  String.raw`\b(?:throat|tongue|lips) ([\w']+ ){0,3}(?:closing|swelling|tightening)\b|\bturning (?:purple|blue|grey|gray)\b|\bblue lips\b`,
  String.raw`anaphyla|\bsevere allergic reaction\b`,
  String.raw`\bface ([\w']+ ){0,3}(?:drooping|droop|sagging)\b|\bdrooping face\b|\bslurred speech\b|\bspeech is slurred\b`,
  String.raw`\bsudden(?:ly)? (?:\w+ )?(?:weakness|numbness|confusion)\b|\ba stroke\b(?! of\b)|\bstroke symptoms\b`,
  String.raw`\bworst headache of my life\b|\bthunderclap\b|\bseizure`,
  String.raw`suicid|\bkill(?:ing)? (?:my ?self|me)\b|\bend(?:ing)? (?:it all|my (?:own )?life)\b|\bgoing to end it\b`,
  String.raw`\btak(?:e|ing) my own life\b|\bbetter off dead\b|\bno reason to (?:live|go on)\b|\bwant(?:ed)? to die\b`,
  String.raw`\bwish (?:i|he|she) (?:was|were) (?:dead|never born)\b|\blife isn'?t worth living\b|\bwithout help i will die\b`,
  String.raw`\bfeel like (?:i|he|she) (?:might|will|am going to) die\b`,
  String.raw`\b(?:hurt|hurting|cut|cutting|harm|harming) my ?self\b|\bself ?harm`,
  String.raw`overdos`,
  String.raw`\bcan'?t (?:do this|take (?:it|this)|handle (?:it|this)|keep going) (?:anymore|any more|any longer)\b`,
  String.raw`\bwant(?:ed)? to disappear\b|\b(?:don'?t|dont) want to exist\b|\bwish i (?:could )?disappear`,
  String.raw`\b(?:use|shoot(?:ing)?|stab(?:bing)?|hang(?:ing)?|poison(?:ing)?|drown(?:ing)?|burn(?:ing)?|cut(?:ting)?) (?:it on )?myself\b|\ba plan to (?:hurt|kill|end|harm)\b|homicid`,
  String.raw`\b(?:going|gonna|about) to (?:hurt|kill|harm|shoot|stab) (?:myself|someone|somebody|him|her|them|people|everyone)\b`,
  String.raw`\bwant to (?:hurt|kill|harm|shoot|stab) (?:someone|somebody|him|her|them|people|everyone|my (?:wife|husband|boss|kids?|children|mom|dad|partner|ex))\b`,
  String.raw`\bconvuls|\bfaint\b|\babout to pass out\b|\bgoing to pass out\b|\bgoing to faint\b`,
  String.raw`\b(?:drank|drink|drinking|drunk|swallowed|swallow|ingested|ate|eaten|took) (?:some |a |an |a lot of |a bit of |the |my )?(?:bleach|poison|antifreeze|chemicals?|batter(?:y|ies)|rat poison|detergent|gasoline|drain cleaner|paint thinner)\b|\bpoison(?:ing|ed)\b`,
  String.raw`\belectrocuted\b|\belectric shock\b|\b(?:burned|burnt) badly\b|\b(?:major|severe|third degree) burns?\b`,
  String.raw`\b(?:car|auto|vehicle|bike|motorcycle|traffic) (?:accident|crash|wreck)\b(?: [\w']+){0,6} (?:hurt|injured|injury|bleeding|unconscious)\b|\b(?:hurt|injured|injury|bleeding|unconscious)\b(?: [\w']+){0,6} (?:car|auto|vehicle|bike|motorcycle|traffic) (?:accident|crash|wreck)\b`,
  String.raw`\bsevere (?:head )?injury\b|\bhead injury\b|\bhit (?:my|his|her|their) head\b(?: [\w']+){0,8} (?:confus\w*|vomit\w*|throwing up|dizzy|unconscious|passed out|blacked out)\b|\b(?:confus\w*|vomit\w*|throwing up)\b(?: [\w']+){0,8} hit (?:my|his|her|their) head\b`,
  String.raw`\b(?:severe|heavy|massive|uncontrolled|uncontrollable) bleeding\b|\bbleeding (?:a lot|heavily|badly|profusely|out)\b`,
  String.raw`\b(?:coughing|vomiting|throwing up|spitting) (?:up )?blood\b`,
]
const PATTERN = new RegExp(SOURCES.join('|'))

const HELP = new RegExp(
  [
    String.raw`(?:^|\|) ?(?:(?:please|pls|plz|just|oh|god|hey|hello|hi|sorry|someone|somebody|anyone) )*(?:send help|help)(?: (?:me|us))?(?: (?:please|pls|now|right now|asap|immediately|quickly))* ?(?=\||$)`,
    String.raw`(?:^|\|) ?(?:(?:this is|it'?s|its|a|an|real|medical|my|our) )*emergency ?(?=\||$)`,
    String.raw`\bmedical emergency\b`,
    String.raw`\bi need (?:urgent |immediate |emergency |medical )help\b|\bi need help (?:right now|now|immediately|asap|urgently)\b`,
    String.raw`\b(?:i|we) need an? (?:ambulance|paramedics?)\b|\bcall(?:ed|ing)? (?:an? )?(?:ambulance|911|999|112|988)\b`,
  ].join('|'),
)

const LETTERS = [
  'suicide', 'suicidal', 'killmyself', 'killingmyself', 'takemyownlife', 'overdose', 'anaphylaxis', 'heartattack',
  'unresponsive', 'unconscious', 'chestpain', 'betteroffdead', 'selfharm', 'cantbreathe', 'cannotbreathe',
  'couldntbreathe', 'notbreathing', 'stoppedbreathing', 'cantcatchmybreath', 'hardlybreathe',
]
const TARGETS = ['breathe', 'breathing', 'breath', 'suicide', 'suicidal', 'overdose', 'chest', 'myself']
const TYPOS: Record<string, string> = {
  cnat: 'cant', canot: 'cannot', cannnot: 'cannot', cannt: 'cannot', cannit: 'cannot', kil: 'kill', kll: 'kill', killl: 'kill', kiill: 'kill',
}
const NOT_TYPOS = new Set(['overdone', 'chess', 'cheat', 'chests', 'crest', 'chert', 'breach', 'breathy'])
const LEET: Record<string, string> = { 1: 'i', 0: 'o', 3: 'e', 4: 'a', 5: 's', 7: 't', '@': 'a', $: 's' }

const prepare = (s: string) =>
  s.normalize('NFKC').toLowerCase().replace(/\p{Cf}/gu, '').replace(/[‘’]/g, "'")
const segments = (s: string) =>
  s
    .replace(/[.!?,;\n]+/g, ' | ')
    .replace(/[^a-z0-9'|\s]/g, ' ')
    .replace(/(^|\s)'+|'+(?=\s|$)/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
const words = (s: string) =>
  s.replace(/[^a-z0-9'\s]/g, ' ').replace(/(^|\s)'+|'+(?=\s|$)/g, ' ').replace(/\s+/g, ' ')

function nearby(a: string, b: string) {
  if (Math.abs(a.length - b.length) > 1) return false
  let i = 0
  while (i < a.length && i < b.length && a[i] === b[i]) i++
  if (a.length === b.length) {
    return a.slice(i + 1) === b.slice(i + 1) || (a[i] === b[i + 1] && a[i + 1] === b[i] && a.slice(i + 2) === b.slice(i + 2))
  }
  const [short, long] = a.length < b.length ? [a, b] : [b, a]
  return short.slice(i) === long.slice(i + 1)
}

const fixTypos = (t: string) =>
  t
    .split(' ')
    .map((w) =>
      TYPOS[w] ?? (w.length < 4 || w.length > 9 || NOT_TYPOS.has(w) ? w : (TARGETS.find((x) => x !== w && nearby(w, x)) ?? w)),
    )
    .join(' ')

function check(raw: string) {
  const base = prepare(raw)
  const leet = base.replace(/[10345 7@$]/g, (c) => LEET[c] ?? c)
  for (const t of [words(base), words(leet)]) if (PATTERN.test(t) || PATTERN.test(fixTypos(t))) return true
  if (HELP.test(segments(base))) return true
  const letters = leet.replace(/[^a-z]/g, '')
  return LETTERS.some((w) => letters.includes(w))
}

export function detectEmergency(text: string) {
  const s = text.slice(0, 300000)
  for (let i = 0; i < s.length; i += 3500) if (check(s.slice(i, i + 4000))) return true
  return false
}

export const mentionsEmergency = (text: string) =>
  /\b(911|988|112|999)\b|\bemergency (services?|rooms?|departments?|numbers?|help|care|medical)\b|\b(call|dial|phone) (an |for an )?(ambulance|emergency)\b|\bambulance\b|\b(crisis|suicide) (line|hotline)\b/i.test(
    text,
  )
