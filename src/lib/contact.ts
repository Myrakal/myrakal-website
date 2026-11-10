export const CONTACT_PHONE = '+14152265827'
export const CONTACT_EMAIL = 'eshaansood@myrakal.com'

const MESSAGE = encodeURIComponent('Hi Myra!')
const QUOTE_MESSAGE = encodeURIComponent("Hi Myra! Here's my quote:")
const SUBJECT = encodeURIComponent('My quote')

export const SMS_HREF = `sms:${CONTACT_PHONE}?body=${MESSAGE}`
export const EMAIL_HREF = `mailto:${CONTACT_EMAIL}?subject=${SUBJECT}&body=${QUOTE_MESSAGE}`
