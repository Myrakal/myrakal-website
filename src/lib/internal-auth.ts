import { createHash, createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'

export const SESSION_COOKIE = 'internal_session'
export const SESSION_MAX_AGE = 60 * 60 * 12

const digest = (value: string) => createHash('sha256').update(value).digest()
const same = (a: string, b: string) => timingSafeEqual(digest(a), digest(b))

export function sessionToken() {
  const password = process.env.INTERNAL_PASSWORD
  if (!password) return null
  return createHmac('sha256', password).update('internal-session').digest('hex')
}

export function verifyPassword(input: string) {
  const password = process.env.INTERNAL_PASSWORD
  if (!password) return false
  return same(input, password)
}

export async function isAuthed() {
  const jar = await cookies()
  const token = sessionToken()
  if (!token) return false
  const value = jar.get(SESSION_COOKIE)?.value
  return value !== undefined && same(value, token)
}
