import { db } from '../server/db.ts'
import { MAX_BODY_BYTES, checkRequest, json, logFailure, methodNotAllowed, readJsonBody } from '../server/http.ts'
import { InvalidIntake, saveIntake } from '../server/intake.ts'

export { methodNotAllowed as DELETE, methodNotAllowed as GET, methodNotAllowed as PATCH, methodNotAllowed as PUT }

export async function POST(request: Request) {
  const rejected = checkRequest(request, MAX_BODY_BYTES)
  if (rejected) return rejected
  const body = await readJsonBody(request, MAX_BODY_BYTES, 'intake')
  if ('response' in body) return body.response
  try {
    const { id } = await saveIntake(body.value, db())
    return json({ id }, 201)
  } catch (err) {
    if (err instanceof InvalidIntake) return json({ error: err.message }, 400)
    logFailure('intake save failed', err)
    return json({ error: 'Could not save intake' }, 500)
  }
}
