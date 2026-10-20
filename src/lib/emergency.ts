export const EMERGENCY_REPLY =
  "I'm so sorry you're dealing with this. If you or someone else may be in danger or having a medical emergency, please contact your local emergency services right away. In the US, you can also call or text 988 for suicide and crisis support."

const ALWAYS = [
  /\b(don'?t|dont|do not|no longer) want to (live|be alive|be here)\b/,
  /\b(can'?t|cant|cannot|can not|couldn'?t|couldnt|unable to|not able to) (to )?(breathe|breath|catch (my|his|her|their) breath)\b/,
  /\bhardly (breathe|breathing|breath)\b/,
  /\b(stopped|not|isn'?t|wasn'?t) breathing\b/,
  /\bunconscious\b|\bunresponsive\b|\bpassed out\b|\bcollaps(ed|ing)\b|\bfaint(ed|ing)\b/,
  /\b(not|isn'?t|aren'?t) responding\b|\b(won'?t|wont|can'?t|cant) wake( up)?\b|\bnot waking\b/,
  /\bcan'?t stop the bleeding\b|\bbleeding (won'?t|wont|will not|doesn'?t|does not) (stop|slow)\b/,
  /\btook (a bunch|a handful|too many|all (of )?my) (of )?(my )?(\w+ ){0,2}(pills|tablets|capsules|meds|medication|medications)\b/,
  /\b(swallowed|took|ate|drank) (a |the )?(whole|entire|full) bottle\b/,
  /\bswallowed (a (bunch|handful)|too many)\b/,
  /\btook (\d{2,}|five|six|seven|eight|nine|ten|twenty|thirty|forty|fifty|sixty|hundred) (\w+ )?(pills|tablets|capsules)\b/,
]

const NEGATABLE = [
  /\bchest ([\w']+ ){0,2}(hurts|hurting|aching|aches|ache)\b|\bchest (pain|pains|pressure|tightness|tight|heavy|heaviness|crushing)\b/g,
  /\bchest (is |feels |feeling )?(tight|heavy|crushing)\b/g,
  /\b(pain|pressure|tightness|ache|aching|discomfort) (in|across|on) (my |the |his |her |their )?chest\b/g,
  /\bheart attack\b/g,
  /\bpain (down|in|radiating (down|to)) (my |his |her |their )?(left )?(arm|jaw)\b/g,
  /\b(trouble|difficulty|hard|struggling|struggle) (to )?breath(e|ing)?\b/g,
  /\bgasping\b|\bchoking\b|\bshort(ness)? of breath\b/g,
  /\b(throat|tongue|lips) ([\w']+ ){0,3}(closing|swelling|tightening)\b/g,
  /anaphyla|\bsevere allergic reaction\b/g,
  /\bface ([\w']+ ){0,3}(drooping|droop|sagging)\b|\bdrooping face\b/g,
  /\bslurred speech\b|\bspeech is slurred\b/g,
  /\bsudden(ly)? (\w+ )?(weakness|numbness|confusion)\b/g,
  /\ba stroke\b(?! of\b)|\bstroke symptoms\b/g,
  /\bseizure/g,
  /suicid/g,
  /\bkill(ing)? (my ?self|me)\b/g,
  /\bend(ing)? (it all|my (own )?life)\b/g,
  /\btak(e|ing) my own life\b|\bbetter off dead\b|\bno reason to (live|go on)\b/g,
  /\bwant(ed)? to die\b/g,
  /\b(hurt|hurting|cut|cutting|harm|harming) my ?self\b|\bself ?harm/g,
  /overdos/g,
  /\b(severe|heavy|massive|uncontrolled|uncontrollable) bleeding\b/g,
  /\bbleeding (a lot|heavily|badly|profusely|out)\b/g,
  /\b(coughing|vomiting|throwing up|spitting) (up )?blood\b/g,
]

const NEGATOR =
  /^(no|not|never|without|denies|denied|denying|none|nor|negative|don'?t|dont|doesn'?t|doesnt|didn'?t|didnt|haven'?t|havent|hasn'?t|hasnt|isn'?t|isnt|wasn'?t|wasnt)$/
const FILLER =
  /^(any|a|an|the|have|has|had|having|history|of|experienced|experiencing|feel|feeling|felt|symptoms|signs|or|nor|my|your|their|his|her|been)$/
const FUZZY = [
  'suicide', 'suicidal', 'killmyself', 'killingmyself', 'takemyownlife', 'overdose', 'anaphylaxis', 'heartattack',
  'unresponsive', 'unconscious', 'chestpain', 'betteroffdead', 'selfharm',
]
const LEET: Record<string, string> = { 1: 'i', 0: 'o', 3: 'e', 4: 'a', 5: 's', 7: 't', '@': 'a', $: 's' }

const prepare = (s: string) =>
  s.normalize('NFKC').toLowerCase().replace(/\p{Cf}/gu, '').replace(/[‘’]/g, "'")
const clauses = (s: string) =>
  s.replace(/[,.;:!?()[\]{}"]+/g, ' | ').replace(/[^a-z0-9'|\s]/g, ' ').replace(/\s+/g, ' ')

function negated(t: string, index: number) {
  const clause = t.slice(0, index).split(/\||\b(?:but|and|however|although|though|yet)\b/).pop() ?? ''
  const words = clause.split(' ').filter(Boolean)
  const at = words.findLastIndex((w) => NEGATOR.test(w))
  return at >= 0 && words.slice(at + 1).filter((w) => !FILLER.test(w)).length <= 3
}

function scan(t: string) {
  if (ALWAYS.some((re) => re.test(t))) return 'hit'
  let seen = false
  for (const re of NEGATABLE)
    for (const m of t.matchAll(re)) {
      if (!negated(t, m.index)) return 'hit'
      seen = true
    }
  return seen ? 'negated' : 'none'
}

function check(raw: string) {
  const base = prepare(raw)
  const plain = scan(clauses(base))
  if (plain === 'hit') return true
  const leet = base.replace(/[10345 7@$]/g, (c) => LEET[c] ?? c)
  const spoken = scan(clauses(leet))
  if (spoken === 'hit') return true
  if (plain === 'negated' || spoken === 'negated') return false
  const letters = leet.replace(/[^a-z]/g, '')
  return FUZZY.some((w) => letters.includes(w))
}

export function detectEmergency(text: string) {
  return (text.length > 4000 ? [text.slice(0, 4000), text.slice(-4000)] : [text]).some(check)
}

export const mentionsEmergency = (text: string) =>
  /\b(911|988|112|999)\b|\bemergency (services?|rooms?|departments?|numbers?|help|care|medical)\b|\b(call|dial|phone) (an |for an )?(ambulance|emergency)\b|\bambulance\b|\b(crisis|suicide) (line|hotline)\b/i.test(
    text,
  )
