export const EMERGENCY_REPLY =
  "I'm so sorry you're dealing with this. If you or someone else may be in danger or having a medical emergency, please contact your local emergency services right away. In the US, you can also call or text 988 for suicide and crisis support."

const NASAL = String.raw`(?!(?: well| properly| normally| easily| freely| at all)? (?:through|out of|from|via) (?:my |the |either )?(?:left |right |one )?(?:nose|nostrils?|nasal))`
const FEAR = String.raw`(?<!\b(?:afraid of|fear of|scared of|terrified of|fear is) )`
const UNIT = String.raw`(?! ?(?:mg|mcg|ml|g|units?|iu|minutes?|hours?|days?|weeks?|months?|years?|times|percent|lbs?|pounds?|%))`
const ROUTINE = String.raw`(?!(?: [\w']+){0,4} (?:over|during|throughout|per|each|every|daily|weekly|monthly|yearly|a day|a week|a month|in the (?:last|past)|the (?:last|past)|last (?:week|month|year)))`
const PAST = String.raw`(?!(?: [\w']+){0,3} (?:ago|last (?:year|month|decade)|in (?:19|20)\d\d|as a (?:child|kid)|when i was))`
const BIG = 'eight|nine|ten|eleven|twelve|fifteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred'
const GENERIC = 'pills?|tablets?|capsules?|meds|medication|medications|advil|ibuprofen|aspirin|vitamins?|insulin'
const NAMED =
  'tylenol|acetaminophen|paracetamol|xanax|valium|ambien|percocet|vicodin|fentanyl|opioids?|oxy\\w*|sleeping(?: pills| tablets)?'
const ALL_DRUGS = `${GENERIC}|${NAMED}`
const TOOK = '(?:took|swallowed|ate|downed|popped|chugged)'
const MANY =
  '(?:too|to) many|too much|lots of|a lot of|a (?:whole )?bunch of|a handful of|a ton of|way too (?:many|much)|all (?:of )?(?:the|my)|(?:the )?(?:whole|entire|full)'
const PEOPLE =
  "myself|someone|somebody|him|her|them|people|everyone|my (?:kids?|children|baby|son|daughter|wife|husband|boss|family|mom|dad|mother|father|partner|ex|neighbou?rs?)"

const SOURCES = [
  String.raw`\b(?:don'?t|dont|do not|no longer) want to (?:live|be alive|be here)\b(?! (?:long|for long|too long)\b)`,
  String.raw`\b(?:don'?t|dont) wanna (?:live|be here|be alive)\b`,
  String.raw`\b(?:don'?t|dont|do not) want to go on\b(?! (?:a|an|the|my|any|this|that|medication|meds|insulin|statins)\b)`,
  String.raw`\b(?:cannot|can not) go on\b|\bcan'?t go on(?: anymore| any more| any longer| like this)?(?= *(?:\||$))`,
  String.raw`\b(?:can'?t|cant|cannot|can not|couldn'?t|couldnt|unable to|not able to) (?:seem to |to )?(?:breathe|breath|catch (?:my|his|her|their) breath)\b${NASAL}`,
  String.raw`\bcan'?t (?:take|get) (?:a |any )?(?:deep )?breaths?\b|\b(?:don'?t|dont) think (?:i|he|she|they) can breathe\b`,
  String.raw`\b(?:can|could) (?:barely|hardly) breathe\b${NASAL}|\bbarely breathing\b|\bhardly (?:breathe|breathing|breath)\b${NASAL}`,
  String.raw`\b(?:hard|difficult|tough|rough) time breathing\b${NASAL}`,
  String.raw`\b(?:trouble|difficulty|hard|struggling|struggle) (?:to )?breath(?:e|ing)?\b${NASAL}|\bshort(?:ness)? of breath\b`,
  String.raw`\b(?:can'?t|cant|cannot|can not|unable to) get (?:any |enough )?air\b|\bbreathing (?:is |was |feels )?(?:really |very |so |too )?(?:shallow|labou?red|rapid|raspy|noisy)\b`,
  String.raw`\bsuffocating\b(?! in\b)|\bdrowning\b(?! in\b)|\bchoked\b|${FEAR}\bchoking\b(?! me\b)(?! fear\b)|\bseizing\b|\bgasping\b`,
  String.raw`\bdying\b(?! (?:to|for|springs|someday)\b)(?<!\b(?:phone|battery|laptop|car|computer|tablet|plant|fire)(?: is| was|'s)? dying)(?<!\b(?:afraid of|fear of|scared of|fear is) dying)`,
  String.raw`\bwon'?t breathe\b|\bwont breathe\b|\bnot conscious\b|\bno pulse\b|\b(?:stopped|not|isn'?t|wasn'?t) breathing\b`,
  String.raw`\bunconscious\b(?! (?:bias|biases|mind|thoughts?|processes|training)\b)|\bunresponsive\b|\bpassed out\b(?! of\b)|\bblacked out\b|\bcollaps(?:ed|ing)\b`,
  String.raw`(?<!\b(?:a|the|very|slightly) )\bfaint\b(?! (?:spots?|hearted|smell|line|lines|glow|sound|hint|memory|tremor|pulse)\b)|\bfaint(?:ed|ing)\b|\b(?:might|may|could|going to|about to|gonna) (?:pass out|faint|black out|collapse)\b`,
  String.raw`\b(?:not|isn'?t|aren'?t) responding\b|\bwake(?: up)?\b(?<=\b(?:won'?t|wont|can'?t|cant) wake(?: up)?)(?! (?:up )?(?:early|before|until|at|on time|by|in the morning)\b)|\bnot waking\b|\bnever wake up\b`,
  String.raw`\b(?:isn'?t|is not|not|stopped|aren'?t|wasn'?t) moving\b(?! (?:forward|on|fast|much|well|enough|properly|freely)\b)|\bslumped over\b|\b(?:is|was|went|goes|gone|feels|looks|became|getting) limp\b`,
  String.raw`\b(?:fell|jumped|thrown|ejected|fallen) (?:off|from|out of) (?:the |a |our |his |her )?(?:roof|balcony|window|building|bridge|tree|ladder|horse|motorcycle|bike)\b`,
  String.raw`\bcan'?t stop (?:the )?(?:bleeding|blood)\b|\b(?:won'?t|wont|can'?t|cant|doesn'?t|does not|will not) stop bleeding\b|\bbleeding (?:that |and (?:it |that )?)?(?:won'?t|wont|will not|doesn'?t|does not) (?:stop|slow)\b|\bblood (?:won'?t|wont|will not|doesn'?t|does not) stop\b`,
  String.raw`\blost a lot of blood\b|\bblood everywhere\b|\bso much blood\b|\bblood (?:is |was )?(?:pouring|gushing|spurting|streaming)\b|\b(?:pouring|gushing|spurting) blood\b|\bblood in (?:my |his |her |the )?vomit\b|\bblood when i cough\b|\bhemorrhag|\bblack (?:tarry )?stools?\b|\btarry stools?\b`,
  String.raw`\bbleeding through (?:my |a |the )?(?:pad|pads|tampon|clothes|bandage)\b|\bsoaking (?:through )?(?:a |my |the )?(?:pads?|tampons?)\b|\bstabbed\b|\bgunshot\b|\b(?:been|got|was|am|is) shot\b`,
  String.raw`\b(?:severe|heavy|massive|uncontrolled|uncontrollable) bleeding\b(?! (?:during|with|in|from|on|after) (?:my |the )?(?:periods?|menstrua\w*|cycles?|menses|menopause))|\bbleeding (?:a lot|heavily|badly|profusely|out)\b`,
  String.raw`\b(?:cough(?:ed|ing)|vomit(?:ed|ing)|threw|throwing|spit(?:ting)?|spat) (?:up )?blood\b`,
  String.raw`\btook too (?:many|much)\b|\btook (?:[\w']+ ){0,3}too much\b|\btook (?:extra|double|triple)\b|\btook more than (?:prescribed|i should|the prescribed|my prescribed|recommended|directed)\b|\b(?:took|swallowed|ate) all (?:of )?them\b`,
  String.raw`\b${TOOK} (?:${MANY}) (?:of )?(?:my |the )?(?:[\w']+ ){0,2}(?:${ALL_DRUGS})\b`,
  String.raw`\b${TOOK} (?:(?:[89]|[1-9][0-9]+)${UNIT}|${BIG}) (?:of )?(?:my |the )?(?:[\w']+ ){0,2}(?:${ALL_DRUGS})\b${ROUTINE}`,
  String.raw`\b${TOOK} (?:(?:[5-9]|[1-9][0-9]+)${UNIT}|five|six|seven|${BIG}) (?:of )?(?:my |the )?(?:[\w']+ ){0,2}(?:${NAMED})\b${ROUTINE}`,
  String.raw`\bswallowed (?:my |the |some |a few |all )?(?:pills|tablets|capsules|meds|medication|tylenol|advil|ibuprofen|aspirin|insulin|acetaminophen|paracetamol|sleeping (?:pills|tablets))\b|\bswallowed (?:a (?:bunch|handful)|too many)\b`,
  String.raw`\b(?:swallowed|took|ate|drank|downed) (?:a |an |the |my )?(?:whole|entire|full) (?:bottle|prescription|box|pack|strip|container|tube|packet)\b|\b(?:swallowed|took|downed) (?:a |the )bottle of (?:my )?(?:${ALL_DRUGS})\b`,
  String.raw`\b(?:son|daughter|toddler|baby|child|kid|infant|little one)\b(?: [\w']+){0,2} (?:took|ate|swallowed|drank|got into|found) (?:(?:a handful of |a bunch of |some |the )?(?:my )?)(?:pills?|medicine|medication|meds|cleaner|bleach|something|handful|battery|batteries|poison|detergent|vitamins)\b`,
  String.raw`\b(?:drank|drink|drinking|drunk|swallowed|swallow|ingested|ate|eaten|took) (?:some |a |an |a lot of |a bit of |the |my )?(?:bleach|poison|antifreeze|chemicals?|batter(?:y|ies)|rat poison|detergent|gasoline|drain cleaner|paint thinner)\b|\bpoison(?:ing|ed)\b`,
  String.raw`\bchest ([\w']+ ){0,2}(?:hurts|hurting|aching|aches|ache)\b|\bchest (?:pain|pains|pressure|tightness|tight|heavy|heaviness|crushing)\b|\btight chest\b`,
  String.raw`\bchest (?:is |feels |feeling )?(?:tight|heavy|crushing|weird|funny|strange|odd|wrong)\b|\bcrushing (?:[\w']+ ){0,4}chest\b|\bchest (?:[\w']+ ){0,6}crush(?:ing|ed)\b|\bchest (?:[\w']+ ){0,5}explod\w*`,
  String.raw`\b(?:pain|pressure|tightness|ache|aching|discomfort|burning|squeezing) (?:in|across|on|at|near|under) (?:[\w']+ ){0,4}chest\b|\bhurts? (?:in|on|near|around|across|under) (?:[\w']+ ){0,4}chest\b`,
  String.raw`\bclutching (?:his|her|their|my) chest\b|\b(?:behind|under) (?:my |his |her )?(?:breastbone|sternum)\b|\bmy heart hurts\b|\bheart (?:[\w']+ ){0,4}(?:stopping|stopped)\b`,
  String.raw`\b(?:elephant|weight|something|someone) (?:is )?(?:sitting |standing |pressing )?(?:on|in) (?:my |the )?chest\b|\bheart attacks?\b|\bheartattack\b|\bchestpain\b`,
  String.raw`\bpain (?:down|in|radiating (?:down|to)|spreading to|going to|shooting (?:to|down)|moving to) (?:my |his |her |their )?(?:left |right )?(?:arm|jaw|shoulder)\b`,
  String.raw`\bsweating\b(?: [\w']+){0,8} (?:chest|jaw|arm)\b|\b(?:chest|jaw|arm)\b(?: [\w']+){0,8} sweating\b|\b(?:gray|grey|pale|ashen|clammy)(?: and)? (?:sweaty|clammy|cold)\b|\bsweaty and (?:gray|grey|pale)\b`,
  String.raw`\b(?:lightheaded|light headed|dizzy)\b(?: [\w']+){0,6} heart (?:is )?(?:racing|pounding)\b|\bheart (?:is )?(?:racing|pounding)\b(?: [\w']+){0,6} (?:lightheaded|light headed|dizzy|faint)\b`,
  String.raw`\b(?:throat|tongue|lips|face|eyes) ([\w']+ ){0,3}(?:closing|swelling|tightening|swollen)\b|\bturning (?:purple|blue|grey|gray)\b|\bblue lips\b`,
  String.raw`anaphyla|\bsevere allergic reaction\b|\bepi ?pen\b|\bgoing into shock\b|\bin shock\b`,
  String.raw`\bface ([\w']+ ){0,3}(?:drooping|droop|sagging)\b|\bdrooping face\b|\bslurr(?:ing|ed)\b|\bspeech is slurred\b|\bface (?:is |feels |went |has gone |gone )?numb\b`,
  String.raw`\bsudden(?:ly)? (?:\w+ )?(?:weakness|numbness|confusion)\b|\ba stroke\b(?! of\b)|\bstroke symptoms\b|\bsuddenly (?:i |he |she )?(?:can'?t|cannot|couldn'?t) (?:feel|move|see|speak|talk|walk|stand|swallow)\b`,
  String.raw`\bcan'?t move (?:my |his |her |the )?(?:(?:left|right) )?(?:side|arm|leg|hand|foot|face)\b|\bhalf (?:of )?(?:my|his|her) (?:body|face)\b|\b(?:arm|leg|hand) went (?:limp|numb|weak|dead)\b`,
  String.raw`\bcan'?t (?:speak|talk)(?= *(?:\||$)| and\b| at all\b| properly\b| clearly\b| normally\b)|\bcan hardly talk\b|\bcan'?t see (?:out of|from) (?:one|my left|my right|either|my) eyes?\b|\blost (?:my )?vision\b|\bvision loss\b`,
  String.raw`\bconfused\b(?: [\w']+){0,4} (?:don'?t know where|where i am|who i am|what day)\b|\bdon'?t know where (?:i am|he is|she is)\b|\bstiff neck\b(?: [\w']+){0,6} (?:fever|headache)\b|\b(?:fever|headache)\b(?: [\w']+){0,6} stiff neck\b`,
  String.raw`\bblood sugar\b(?: [\w']+){0,8} (?:confused|shaking|sweating|unresponsive|passed out|passing out|seizure)\b|\basthma attack\b|\binhaler (?:isn'?t|is not|won'?t|doesn'?t|does not|not) (?:working|helping)\b|\bwheezing badly\b`,
  String.raw`\bworst headache of my life\b|\bthunderclap\b|\bseizure|\bconvuls|\bappendix (?:burst|ruptured)\b|\b(?:burst|ruptured) appendix\b`,
  String.raw`\bunbearable pain\b|\bpain (?:is )?(?:unbearable|excruciating|agonizing)\b|\bworst pain (?:of|in) my life\b|\bworst pain i'?ve ever (?:felt|had)\b|\bsudden (?:severe |sharp |intense )?(?:abdominal|stomach|belly|chest|back|head) pain\b|\bsevere abdominal pain\b|\b(?:can'?t|cannot) stop vomiting\b|\bvomiting\b(?: [\w']+){0,3} (?:can'?t|cannot|won'?t) stop\b`,
  String.raw`\bmy water broke\b|\bbaby is coming\b|\bcontractions every (?:[\w']+ ){0,2}minutes?\b|\bin labou?r\b`,
  String.raw`\b(?:car|auto|vehicle|bike|motorcycle|traffic) (?:accident|crash|wreck)\b${PAST}(?: [\w']+){0,6} (?:hurt|injured|injury|bleeding|unconscious)\b|\b(?:hurt|injured|injury|bleeding|unconscious)\b(?: [\w']+){0,6} (?:car|auto|vehicle|bike|motorcycle|traffic) (?:accident|crash|wreck)\b${PAST}`,
  String.raw`\bsevere (?:head )?injury\b|\bhead injury\b(?! history)(?<!history of head injury)|\bhit (?:my|his|her|their) head\b(?: [\w']+){0,8} (?:confus\w*|vomit\w*|throwing up|dizzy|unconscious|passed out|blacked out)\b|\b(?:confus\w*|vomit\w*|throwing up)\b(?: [\w']+){0,8} hit (?:my|his|her|their) head\b`,
  String.raw`\belectrocuted\b|\belectric shock\b|\b(?:burned|burnt) badly\b|\b(?:major|severe|third degree) burns?\b|\b(?:there'?s|there is) a fire\b`,
  String.raw`suicid|\bkill(?:ing)? my ?self\b|\bkill me\b|\bunalive\b|\bkms\b|\bend(?:ing)? (?:it all|my (?:own )?life)\b|\bgoing to end it\b`,
  String.raw`\btak(?:e|ing) my (?:own )?life\b|\bbetter off dead\b|\bno reason to (?:live|go on)\b|\bwant(?:ed)? to die\b(?! laughing\b)|\bwann?a die\b|\bwant to unalive\b`,
  String.raw`\bwish (?:i|he|she) (?:was|were) (?:dead|never born)\b|\blife(?:'s| is| isn'?t| is not)? (?:not )?worth living\b|\bwithout help i will die\b|\bfeel like (?:i|he|she) (?:might|will|am going to) die\b|\bgoing to die\b(?! laughing\b)`,
  String.raw`\bbetter (?:off )?without me\b|\b(?:i'?m|i am) a burden\b|\bnobody would miss me\b|\bno one would miss me\b|\bdone with life\b|\b(?:wann?a|will|gonna|going to|want to) end it\b|\bend(?:ing)? (?:things|everything)\b(?! with)|\bnever wake up\b`,
  String.raw`\bno point in living\b|\b(?:don'?t|dont|can'?t) see (?:the )?point (?:in|of) (?:living|going on|life|anything)\b|\bgoing to jump\b|\bjump (?:off|from) (?:a |the )?(?:bridge|building|roof|cliff)\b|\bstanding on (?:the |a )?(?:bridge|roof|ledge|edge)\b`,
  String.raw`\bi wrote (?:a |my )?(?:\w+ )?note(?= *(?:\||$)| (?:to|for) (?:my|everyone|family|them|you|him|her)\b)`,
  String.raw`\bcan'?t (?:do this|take (?:it|this)|handle (?:it|this)|keep going) (?:anymore|any more|any longer)\b`,
  String.raw`\bwant(?:ed)? to disappear\b|\b(?:don'?t|dont) want to exist\b|\bwish i (?:could )?disappear`,
  String.raw`\b(?:use it on|hung|hanged) my ?self\b|\b(?:cut|cutting|slit|slitting|slash|slashed|slashing) (?:my|both my) wrists?\b|\ba plan to (?:hurt|kill|end|harm)\b|homicid`,
  String.raw`\b(?:to|gonna|going to|wanna|want to|will|might|could|should|would|about to|plan to|planning to|thinking of|thinking about|considering) (?:hurt|harm|cut|kill|shoot|stab|hang|poison|drown|burn|hurting|harming|cutting|killing|shooting|stabbing|hanging|poisoning|drowning|burning) my ?self\b`,
  String.raw`\b(?:hurt|harm|cut) my ?self (?:on purpose|deliberately|intentionally)\b|\b(?:hurting|harming|cutting) my ?self\b|\bharm my ?self\b|\bself ?harm`,
  String.raw`\b(?:going|gonna|about) to (?:hurt|kill|harm|shoot|stab) (?:${PEOPLE})\b|\bwant to (?:hurt|kill|harm|shoot|stab) (?:${PEOPLE})\b`,
  String.raw`\b(?:has|have|got|with|holding|pulled|pointing) (?:a |the )?(?:gun|knife|weapon)\b|\bgun\b(?: [\w']+){0,6} (?:use it|shoot)\b`,
  String.raw`\b(?:hitting|beating|attacking|strangling|stabbing|threatening|assaulting|abusing) me\b|\bbeing (?:strangled|attacked|abused|assaulted|raped|followed|stalked|threatened|held)\b|\bbroke into my (?:house|home|apartment)\b`,
  String.raw`\b(?:i'?m|i am|we are|we're) (?:in danger|not safe|unsafe)\b|\bi was raped\b|\braped\b|\bsexually assaulted\b|\b(?:scared|afraid) for my life\b|\bhouse is on fire\b`,
  String.raw`overdos|\bself ?harm|\bfeel like (?:i|he|she) am going to die\b`,
  String.raw`\b(?:take|took|taking) (?:me|him|her) to (?:the )?(?:hospital|er|emergency room)\b|\b(?:need to )?go to (?:the )?(?:hospital|er|emergency room) (?:right now|now|immediately|asap)\b|\bneed to go to (?:the )?(?:hospital|er|emergency room)\b`,
  String.raw`\bneed (?:a )?(?:doctor|nurse|paramedic) (?:now|right now|immediately)\b|\bi need an? er\b`,
]
const PATTERN = new RegExp(SOURCES.join('|'))

const HELP = new RegExp(
  [
    String.raw`(?:^|\|) ?(?:(?:please|pls|plz|just|oh|god|someone|somebody|anyone) )*(?:send help|help)(?: (?:me|us))?(?: (?:please|pls|now|right now|asap|immediately|quickly))* ?(?=\||$)`,
    String.raw`(?:^|\|) ?(?:can|could|would) (?:someone|somebody|anyone) please help(?: (?:me|us))?(?: (?:please|now|right now|asap))* ?(?=\||$)`,
    String.raw`(?:^|\|) ?need help(?: (?:now|right now|please|asap|immediately))* ?(?=\||$)`,
    String.raw`(?:^|\|) ?(?:(?:this is|it'?s|its|a|an|real|medical|my|our) )*emergency ?(?=\||$)`,
    String.raw`(?:^|\|) ?(?:911|999|112|988|sos)(?: (?:now|please))* ?(?=\||$)`,
    String.raw`(?:^|\|) ?(?:get|call|find) (?:me )?(?:a|an) (?:doctor|nurse|paramedic)(?: (?:now|please|right now|immediately))* ?(?=\||$)`,
    String.raw`\bmedical emergency\b(?! (?:fund|savings|contact|room|insurance|coverage|expenses?|bills?|costs?|care|department|services?|transport\w*|evacuation)\b)`,
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
const NOT_TYPOS = new Set(['overdone', 'overdoes', 'chess', 'cheat', 'chests', 'crest', 'chert', 'breach', 'breathy', 'breadth'])
const TYPOS: Record<string, string> = {
  cnat: 'cant', canot: 'cannot', cannnot: 'cannot', cannt: 'cannot', cannit: 'cannot', wnat: 'want', hart: 'heart',
}
const KILL_TYPOS = new Set(['kil', 'kll', 'killl', 'kiill'])
const LEET: Record<string, string> = { 1: 'i', 0: 'o', 3: 'e', 4: 'a', 5: 's', 7: 't', '@': 'a', $: 's' }

const prepare = (s: string) =>
  s
    .replace(/[‘’ʼʹ′´`]/g, "'")
    .normalize('NFKC')
    .replace(/([.!?;])\s+(?=\p{Lu})/gu, '$1 | ')
    .toLowerCase()
    .replace(/\p{Cf}/gu, '')
const words = (s: string) =>
  s
    .replace(/[^a-z0-9'|\s]/g, ' ')
    .replace(/(^|\s)'+|'+(?=\s|$)/g, ' ')
    .replace(/([a-z])\1{2,}/g, '$1$1')
    .replace(/\s+/g, ' ')
const segments = (s: string) =>
  s
    .replace(/[.!?,;\n]+/g, ' | ')
    .replace(/[^a-z0-9'|\s]/g, ' ')
    .replace(/(^|\s)'+|'+(?=\s|$)/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

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

function fixTypos(t: string) {
  const tokens = t.split(' ')
  return tokens
    .map((w, i) => {
      if (TYPOS[w]) return TYPOS[w]
      if (KILL_TYPOS.has(w)) return /^my/.test(tokens[i + 1] ?? '') ? 'kill' : w
      if (tokens[i - 1] === 'chest' && w[0] === 'p' && w !== 'pain' && nearby(w, 'pain')) return 'pain'
      if (tokens[i - 1] === 'chest' && w[0] === 'h' && w !== 'hurts' && nearby(w, 'hurts')) return 'hurts'
      if (w.length < 4 || w.length > 9 || NOT_TYPOS.has(w)) return w
      return TARGETS.find((x) => x !== w && nearby(w, x)) ?? w
    })
    .join(' ')
}

function despace(t: string) {
  const out: string[] = []
  const runs: string[] = []
  let run: string[] = []
  const flush = () => {
    if (run.length >= 4) {
      runs.push(run.join(''))
      out.push(run.join(''))
    } else out.push(...run)
    run = []
  }
  for (const w of t.split(' ')) {
    if (w.length === 1 && /[a-z0-9]/.test(w)) run.push(w)
    else {
      flush()
      out.push(w)
    }
  }
  flush()
  return { text: out.join(' '), runs }
}

function scanWindow(w: string) {
  const spaced = despace(w)
  for (const t of spaced.runs.length ? [w, spaced.text] : [w]) if (PATTERN.test(t) || PATTERN.test(fixTypos(t))) return true
  return spaced.runs.some((r) => LETTERS.some((x) => r.includes(x)))
}

const scan = (t: string) => {
  for (let i = 0; i < t.length; i += 3500) if (scanWindow(t.slice(i, i + 4000))) return true
  return false
}

export function detectEmergency(text: string) {
  const base = prepare(text.slice(0, 300000))
  const spoken = base.replace(/[0-9@$]/g, (c) => LEET[c] ?? c)
  return scan(words(base)) || scan(words(spoken)) || HELP.test(segments(base))
}

export const mentionsEmergency = (text: string) =>
  /\b(911|988|112|999)\b|\bemergency (services?|rooms?|departments?|numbers?|help|care|medical)\b|\b(call|dial|phone) (an |for an )?(ambulance|emergency)\b|\bambulance\b|\b(crisis|suicide) (line|hotline)\b/i.test(
    text,
  )
