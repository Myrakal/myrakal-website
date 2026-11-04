export const CONTACT_PHONE = '+12025550143'
export const CONTACT_EMAIL = 'hello@example.com'

const MESSAGE = encodeURIComponent('Hi Myra!')
const SUBJECT = encodeURIComponent('Myrakal inquiry')

export const SMS_HREF = `sms:${CONTACT_PHONE}?body=${MESSAGE}`
export const EMAIL_HREF = `mailto:${CONTACT_EMAIL}?subject=${SUBJECT}&body=${MESSAGE}`
