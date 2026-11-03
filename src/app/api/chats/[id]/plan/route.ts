import { createClient } from '@supabase/supabase-js'
import { requireUser } from '@/server/auth'
import { db } from '@/server/db'
import { json, UUID } from '@/server/http'

const VISIBLE = ['plan_ready', 'clarification_review', 'awaiting_payment', 'reservations', 'booked']

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser()
  if (!user) return json({ error: 'unauthorized' }, 401)
  const { id } = await params
  if (!UUID.test(id)) return json({ error: 'not found' }, 404)
  const chat = await db().chat.findFirst({ where: { id, userId: user.id }, select: { status: true } })
  if (!chat || !VISIBLE.includes(chat.status)) return json({ error: 'not found' }, 404)
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) throw new Error('NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set')
  const supabase = createClient(url, serviceKey, { auth: { persistSession: false } })
  const { data, error } = await supabase.storage.from(process.env.PLAN_BUCKET || 'plans').createSignedUrl(`${id}_plan.pdf`, 300)
  if (error && !/not found/i.test(error.message)) throw error
  if (error || !data) return json({ error: 'not found' }, 404)
  return json({ url: data.signedUrl })
}
