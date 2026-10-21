import { db } from '../server/db.ts'

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const REVIEWED = ['approved', 'changes_requested']

const json = (body: unknown, status: number, headers?: Record<string, string>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store', ...headers },
  })

export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get('id')
  if (!id || !UUID.test(id)) return json({ error: 'Invalid id' }, 400)
  try {
    const intake = await db().intake.findUnique({
      where: { id },
      select: { consultStatus: true, name: true, paidAt: true, consultNote: true, reviewedAt: true },
    })
    if (!intake) return json({ error: 'Not found' }, 404)
    return json(
      {
        status: intake.consultStatus,
        name: intake.name,
        paid: intake.paidAt != null,
        note: REVIEWED.includes(intake.consultStatus) ? intake.consultNote : null,
        reviewedAt: intake.reviewedAt?.toISOString() ?? null,
      },
      200,
    )
  } catch (err) {
    console.error('case lookup failed', err instanceof Error ? err.name : 'UnknownError')
    return json({ error: 'Could not load case' }, 500)
  }
}

export const POST = () => json({ error: 'Method not allowed' }, 405, { allow: 'GET' })
