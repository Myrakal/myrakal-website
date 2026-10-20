import { EMERGENCY_REPLY, detectEmergency, mentionsEmergency } from './emergency.ts'

describe('detectEmergency: coverage', () => {
  it.each([
    'I have chest pain',
    "I've got chest pressure and it's getting worse",
    'chest tightness since this morning',
    'my chest hurts',
    'my chest is hurting so much',
    'my chest keeps aching',
    'I have a pain in my chest',
    'pain across my chest',
    'there is pressure on my chest',
    'my chest feels tight',
    'my chest feels heavy',
    'a crushing feeling, my chest is crushing',
    'I think it is a heart attack',
    'pain down my left arm',
    'pain in my jaw and pain down my jaw',
    "I'm having trouble breathing",
    "I can't breathe",
    'cant breathe',
    'I cannot breathe',
    "I couldn't breathe last night",
    'i can not breathe',
    "I can't breath",
    "I can't catch my breath",
    'I can hardly breathe',
    'he is gasping for air',
    'she is choking',
    'it is hard to breathe',
    'sudden shortness of breath',
    'my throat is closing up',
    'my throat is swelling',
    "my throat feels like it's closing",
    'I think this is anaphylaxis',
    'a severe allergic reaction to peanuts',
    'my face is drooping on one side',
    'my face has started drooping',
    'his speech is slurred, slurred speech since an hour',
    'sudden weakness in my left arm',
    'I feel sudden numbness down one side',
    'I think I am having a stroke',
    'I want to kill myself',
    'I am thinking of killing myself',
    'I will kill my self',
    "I'm going to end it all",
    'I want to end my life',
    'I am ending it all tonight',
    'I want to take my own life',
    'everyone would be better off dead without me',
    'there is no reason to live',
    "I don't want to live anymore",
    'i just want to die',
    'I keep hurting myself',
    'I have been cutting myself',
    'I am harming myself',
    "I've been having suicidal thoughts",
    'thinking about suicide',
    'self-harm',
    'self harm',
    'I took a bunch of pills',
    'I took a handful of pills',
    'I took a whole bottle of tablets',
    'I took all my pills',
    'I took 30 pills',
    'I took thirty pills',
    'I took too many pills',
    'I took too many sleeping pills tonight',
    'I think I took an overdose',
    'she overdosed',
    'I swallowed too many',
    'my dad collapsed',
    'he fainted and is not waking',
    'she passed out',
    'he is having a seizure',
    "she won't wake up",
    'he is unresponsive',
    'she is not responding',
    'he is not breathing',
    'he is unconscious',
    "I can't stop the bleeding",
    "the bleeding won't stop",
    'he is coughing blood',
    'she is vomiting blood',
    'there is severe bleeding from the cut',
    'she is bleeding a lot',
    'I wish I was dead',
    "I can't go on anymore",
    'I feel like I might die',
    'my husband is turning blue',
    'pain behind my breastbone',
    'I took an entire bottle of Tylenol',
  ])('detects: %s', (text) => {
    expect(detectEmergency(text)).toBe(true)
  })
})

describe('detectEmergency: normalization', () => {
  it.each([
    ["CAN'T BREATHE!!! HELP!!!"],
    ['I can’t breathe'],
    ['chest    \n  pain'],
    ['su​icide'],
    ['sui‌cide and ‍kill myself'],
    ['﻿chest pain'],
    ['suic­ide'],
    ['ｃｈｅｓｔ ｐａｉｎ'],
    ['s.u.i.c.i.d.e'],
    ['s u i c i d e'],
    ['k-i-l-l m-y-s-e-l-f'],
    ['su1c1de'],
    ['k1ll myself'],
    ['ch3st p4in'],
    ['0verd0se'],
    ['I want to d1e'],
    ['I $hould end my l1fe'],
    ['c h e s t p a i n'],
    ['SUICIDE'],
  ])('detects obfuscated or decorated: %s', (text) => {
    expect(detectEmergency(text)).toBe(true)
  })

  it('detects an emergency in the first or last 4000 characters of a very long message', () => {
    const filler = 'a'.repeat(5000)
    expect(detectEmergency(`I took too many pills ${filler}`)).toBe(true)
    expect(detectEmergency(`${filler} I took too many pills`)).toBe(true)
    expect(detectEmergency(filler)).toBe(false)
  })
})

describe('detectEmergency: no negation handling, by design', () => {
  it.each([
    'no chest pain',
    "I don't have chest pain",
    "I don't have any chest pain",
    'denies chest pain',
    'without trouble breathing',
    'not suicidal',
    'I am not suicidal',
    'no suicidal thoughts',
    'I do not have any chest pain or trouble breathing',
    'denies shortness of breath',
    'without chest pressure',
    'no history of seizure',
    "I don't want to die",
    'I would never kill myself',
    'no one is helping me, I have chest pain',
    "I'm not sure what to do, I have chest pain",
    'I have not slept and now I have chest pain',
    'never felt like this, severe bleeding',
    "I can't stop thinking about suicide",
    'I had a heart attack five years ago',
    'my mom had a stroke last year',
    'chest pain last year',
  ])('triggers on the symptom phrase in any context: %s', (text) => {
    expect(detectEmergency(text)).toBe(true)
  })

  it.each([
    'my knee hurts when climbing stairs',
    'I had chest surgery last year',
    'I would like to understand the cost of a hip replacement',
    'The pain started two months ago and is worse on stairs',
    'My back hurts and I have a stroke of bad luck',
    'I take pills for my blood pressure every morning',
    'I bled a little after the dentist',
    'I am allergic to penicillin',
    'I passed my driving test',
    'Blue Shield PPO',
    'I live in the country and my knee hurts',
    "I can't go on vacation this year",
    'I wish I was taller',
    'I took a bottle of water to the clinic',
    'I like to play chess and check my email',
    'I want to diet before my surgery',
    'My insurance is Aetna and I am 52 years old',
    '',
  ])('still does not trigger on ordinary text with no symptom phrase: %s', (text) => {
    expect(detectEmergency(text)).toBe(false)
  })
})

describe('detectEmergency: punctuation and spacing', () => {
  it.each([
    'cant. breathe',
    "can't, breathe",
    "I can't... breathe",
    "I can't - breathe",
    "I can't\nbreathe",
    'no fever\nchest pain',
    'chest, pain',
    'chest... pain',
    'chest_pain',
    '"chest pain"',
    "'chest pain'",
    '(chest pain)',
    'kill-myself',
    "c a n ' t b r e a t h e",
    'c.a.n.t b.r.e.a.t.h.e',
    'k i l l m y s e l f',
    'o v e r d o s e',
    'h e a r t a t t a c k',
  ])('detects: %s', (text) => {
    expect(detectEmergency(text)).toBe(true)
  })
})

describe('detectEmergency: more phrases', () => {
  it.each([
    "I'm dying",
    'I am dying',
    "I feel like I'm dying",
    "I think I'm dying",
    'he is dying',
    'took too many',
    'I took 2 pills',
    'I took 30 tylenol',
    'I took a lot of ibuprofen',
    'I took all the pills in the cabinet',
    'I took all of my insulin',
    'she swallowed pills',
    'he swallowed a handful of aspirin',
    'I swallowed my sleeping tablets',
    'I took twenty xanax',
    'took a lot of oxy',
    'swallowed acetaminophen',
    'swallowed some paracetamol',
    'worst headache of my life',
    'a thunderclap headache',
    'she is not conscious',
    'there is no pulse',
    "he won't breathe",
    "I can't seem to breathe",
    "cant seem to breathe",
    "I don't think I can breathe",
    'I can barely breathe',
    'he is barely breathing',
    "I'm having a hard time breathing",
    "I can't get air",
    "can't get enough air",
    'I am suffocating',
    'she is drowning',
    'he choked on food',
    'she is seizing',
    "the blood won't stop",
    'I lost a lot of blood',
    'he was stabbed',
    'she was shot',
    'a gunshot wound',
    'I am going to end it',
    "I don't wanna live",
    'dont wanna be here anymore',
    "I don't want to go on",
    'I cannot go on',
    "life isn't worth living",
    'I wish I was never born',
    'without help I will die',
    'my heart hurts',
    'it feels like an elephant sitting on my chest',
    'like a weight on my chest',
    'something is sitting on my chest',
  ])('detects: %s', (text) => {
    expect(detectEmergency(text)).toBe(true)
  })
})

describe('detectEmergency: typos of the highest-risk words', () => {
  it.each([
    'cant brethe',
    "I can't breth",
    'cant breath',
    "can't braethe",
    'i feel like suicde',
    'thinking of sucide',
    'I took an overdoes',
    'overdosse',
    'chst pain',
    'ches pain',
    'cheat pain is bad but my chsst pain is worse',
    'hard time breathng',
  ])('detects a near miss: %s', (text) => {
    expect(detectEmergency(text)).toBe(true)
  })

  it.each([
    'I like to play chess and check my email',
    'a security breach at my workplace',
    'the steak was overdone',
    'I was out of breathing room at work',
    'I want a cheaper clinic',
  ])('does not map unrelated words: %s', (text) => {
    expect(detectEmergency(text)).toBe(false)
  })
})

describe('detectEmergency: long text', () => {
  const filler = 'knee pain on the stairs. '.repeat(500)

  it('finds an emergency phrase in the middle of a 10000 character paste', () => {
    const text = `${filler.slice(0, 5000)} I took too many pills ${filler.slice(0, 5000)}`
    expect(text.length).toBeGreaterThan(10000)
    expect(detectEmergency(text)).toBe(true)
  })

  it('finds a phrase that straddles a window boundary', () => {
    for (const offset of [3490, 3500, 3510, 3990, 4000]) {
      const text = `${'a'.repeat(offset)} I can't breathe ${'a'.repeat(2000)}`
      expect(detectEmergency(text)).toBe(true)
    }
  })

  it('finds an emergency anywhere in a very long paste', () => {
    const big = 'a'.repeat(250000)
    expect(detectEmergency(`${big} suicide ${big}`.slice(0, 262144))).toBe(true)
    expect(detectEmergency(big)).toBe(false)
  })
})

describe('detectEmergency: pathological input stays fast', () => {
  const cases: [string, string][] = [
    ['one long word', 'a'.repeat(262144)],
    ['repeated can\'t', "can't ".repeat(43000)],
    ['repeated chest', 'chest '.repeat(43000)],
    ['repeated chest a', 'chest a '.repeat(32000)],
    ['repeated took', 'took '.repeat(52000)],
    ['repeated face a', 'face a a a '.repeat(23000)],
    ['digits', '1 '.repeat(131000)],
    ['typo tokens', 'chst '.repeat(52000)],
    ['apostrophes', "'".repeat(262144)],
    ['punctuation', '.,;:!?'.repeat(43000)],
    ['spaced letters', 'c a n t '.repeat(32000)],
    ['almost phrases', "i can't breath e ".repeat(15000)],
    ['unicode', '​'.repeat(131000) + 'é'.repeat(65000)],
  ]
  it.each(cases)('%s', (_label, text) => {
    const start = performance.now()
    detectEmergency(text)
    expect(performance.now() - start).toBeLessThan(4000)
  })
})

describe('mentionsEmergency', () => {
  it.each([
    'Please call 911 right away.',
    'Call or text 988.',
    'dial 112',
    'Phone 999 now.',
    'Contact your local emergency services.',
    'Go to the emergency room.',
    'Call emergency help.',
    'Please call an ambulance.',
  ])('flags emergency wording in model output: %s', (text) => {
    expect(mentionsEmergency(text)).toBe(true)
  })

  it.each(['Thank you for sharing that.', 'That sounds really uncomfortable.', 'I have 1988 pages', ''])(
    'does not flag ordinary acknowledgements: %s',
    (text) => {
      expect(mentionsEmergency(text)).toBe(false)
    },
  )
})

describe('EMERGENCY_REPLY', () => {
  it('is a brief caring message pointing to emergency services and 988', () => {
    expect(EMERGENCY_REPLY).toMatch(/emergency services/i)
    expect(EMERGENCY_REPLY).toMatch(/988/)
    expect(EMERGENCY_REPLY).toMatch(/call or text/i)
    expect(EMERGENCY_REPLY.length).toBeLessThanOrEqual(400)
  })

  it('gives no clinical advice and asks no question', () => {
    expect(EMERGENCY_REPLY).not.toMatch(/\?|diagnos|treatment|medication|dose|prescri/i)
  })
})
