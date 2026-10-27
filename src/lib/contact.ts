export const TALK_EMAIL = 'anikuppili@myrakal.com'

const SUBJECT = 'Talking with Myrakal'
const BODY = "Hey, I'm looking to "

const query = (params: Record<string, string>) =>
  Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&')

export const TALK_WITH_US_HREF = `mailto:${TALK_EMAIL}?${query({ subject: SUBJECT, body: BODY })}`

export const GMAIL_HREF = `https://mail.google.com/mail/?${query({ view: 'cm', fs: '1', to: TALK_EMAIL, su: SUBJECT, body: BODY })}`

export const OUTLOOK_HREF = `https://outlook.live.com/mail/0/deeplink/compose?${query({ to: TALK_EMAIL, subject: SUBJECT, body: BODY })}`
