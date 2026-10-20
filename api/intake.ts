import { db } from '../server/db.ts'
import { InvalidIntake, saveIntake } from '../server/intake.ts'

const json = (body: unknown, status: number, headers?: Record<string, string>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', ...headers },
  })

const methodNotAllowed = () => json({ error: 'Method not allowed' }, 405, { allow: 'POST' })

export const GET = methodNotAllowed
export const PUT = methodNotAllowed
export const PATCH = methodNotAllowed
export const DELETE = methodNotAllowed

export async function POST(request: Request) {
  let input: unknown
  try {
    input = await request.json()
  } catch {
    return json({ error: 'Invalid JSON' }, 400)
  }
  try {
    const { id } = await saveIntake(input, db())
    return json({ id }, 201)
  } catch (err) {
    if (err instanceof InvalidIntake) return json({ error: err.message }, 400)
    console.error(err)
    return json({ error: 'Could not save intake' }, 500)
  }
}
