import { EMERGENCY_REPLY, detectEmergency } from './emergency.ts'

describe('detectEmergency', () => {
  it.each([
    ['chest pain', 'I have chest pain'],
    ['chest pressure phrase', "I've got chest pressure and it's getting worse"],
    ['chest tightness', 'chest tightness since this morning'],
    ['trouble breathing', "I'm having trouble breathing"],
    ['cannot breathe', "I can't breathe"],
    ['cant breathe without apostrophe', 'cant breathe'],
    ['hard to breathe', 'it is hard to breathe'],
    ['shortness of breath', 'sudden shortness of breath'],
    ['face drooping', 'my face is drooping on one side'],
    ['slurred speech', 'his speech is slurred, slurred speech since an hour'],
    ['sudden weakness', 'sudden weakness in my left arm'],
    ['sudden numbness', 'I feel sudden numbness down one side'],
    ['stroke', 'I think I am having a stroke'],
    ['suicidal thoughts', "I've been having suicidal thoughts"],
    ['suicide', 'thinking about suicide'],
    ['kill myself', 'I want to kill myself'],
    ['end my life', 'I want to end my life'],
    ['want to die', 'i just want to die'],
    ['self-harm', 'I have been engaging in self-harm'],
    ['self harm without hyphen', 'self harm'],
    ['hurt myself', 'I want to hurt myself'],
    ['overdose', 'I think I took an overdose'],
    ['too many pills', 'I took too many pills'],
    ['too many sleeping pills', 'i took too many sleeping pills tonight'],
    ['whole bottle', 'I swallowed a whole bottle of tablets'],
    ['severe bleeding', 'there is severe bleeding from the cut'],
    ['bleeding will not stop', "the bleeding won't stop"],
    ['bleeding a lot', 'she is bleeding a lot'],
    ['unconscious', 'my dad is unconscious'],
    ['unresponsive', 'she is unresponsive'],
    ['not breathing', 'he is not breathing'],
    ['anaphylaxis', 'I think this is anaphylaxis'],
    ['severe allergic reaction', 'a severe allergic reaction to peanuts'],
    ['throat closing', 'my throat is closing up'],
    ['uppercase with punctuation', "CAN'T BREATHE!!! HELP!!!"],
    ['curly apostrophe', 'I can’t breathe'],
    ['extra whitespace', 'chest    \n  pain'],
  ] as [string, string, boolean?][])('detects %s', (_label, text, expected = true) => {
    expect(detectEmergency(text)).toBe(expected)
  })

  it.each([
    'my knee hurts when climbing stairs',
    'I had chest surgery last year',
    'I would like to understand the cost of a hip replacement',
    'The pain started two months ago and is worse on stairs',
    'no chest pain',
    'I do not have any chest pain or trouble breathing',
    'without chest pressure',
    'denies shortness of breath',
    'My back hurts and I have a stroke of bad luck',
    'I take pills for my blood pressure every morning',
    'I bled a little after the dentist',
    'I am allergic to penicillin',
    'I passed my driving test',
    'Blue Shield PPO',
    '',
  ])('does not treat "%s" as an emergency', (text) => {
    expect(detectEmergency(text)).toBe(false)
  })
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
