export const EMERGENCY_REPLY =
  "I'm so sorry you're dealing with this. If you or someone else may be in danger or having a medical emergency, please contact your local emergency services right away. In the US, you can also call or text 988 for suicide and crisis support."

const ALWAYS = [
  /suicid/,
  /\bkill (myself|me)\b/,
  /\bend (my life|it all)\b/,
  /\bwant(ed)? to die\b/,
  /\bdon'?t want to (live|be alive)\b/,
  /\bself ?harm/,
  /\b(hurt|harm|cut) myself\b/,
  /overdos/,
  /\btook too many (\w+ )?(pills|tablets|capsules|meds|medication)\b/,
  /\b(swallowed|took|ate|drank) (a |the )?(whole|entire|full) bottle\b/,
  /\bunconscious\b|\bunresponsive\b|\bpassed out\b/,
  /\b(stopped|not|isn'?t|wasn'?t) breathing\b/,
  /\b(can'?t|cannot|can not|unable to|not able to) (to )?breathe\b/,
  /anaphyla|\bsevere allergic reaction\b/,
  /\b(throat|tongue|lips) (is |are )?(closing|swelling|tightening)\b/,
]

const NEGATABLE = [
  /\bchest (pain|pains|pressure|tightness|tight)\b/g,
  /\b(trouble|difficulty|hard|struggling|struggle) (to )?breath(e|ing)\b/g,
  /\bshortness of breath\b|\bshort of breath\b/g,
  /\bface (is )?(drooping|droop|sagging)\b|\bdrooping face\b/g,
  /\bslurred speech\b|\bspeech is slurred\b/g,
  /\bsudden(ly)? (\w+ )?(weakness|numbness|confusion)\b/g,
  /\ba stroke\b(?! of\b)|\bstroke symptoms\b/g,
  /\b(severe|heavy|massive|uncontrolled|uncontrollable) bleeding\b/g,
  /\bbleeding (a lot|heavily|badly|profusely|out)\b|\bbleeding (won'?t|will not|doesn'?t|does not) (stop|slow)\b/g,
]

const NEGATION = /\b(no|not|without|denies|denied|never|negative for)\b/

export function detectEmergency(text: string) {
  const t = text
    .toLowerCase()
    .replace(/[‘’]/g, "'")
    .replace(/[^a-z0-9'\s]/g, ' ')
    .replace(/\s+/g, ' ')
  if (ALWAYS.some((re) => re.test(t))) return true
  return NEGATABLE.some((re) =>
    [...t.matchAll(re)].some((m) => !NEGATION.test(t.slice(Math.max(0, m.index - 30), m.index))),
  )
}
