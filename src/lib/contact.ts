export const TALK_EMAIL = 'anikuppili@myrakal.com'

const SUBJECT = 'Talking with Myrakal'
const BODY = "Hey, I'm looking to "

export const TALK_WITH_US_HREF = `mailto:${TALK_EMAIL}?subject=${encodeURIComponent(SUBJECT)}&body=${encodeURIComponent(BODY)}`
