import { createClient } from '@supabase/supabase-js'
import type { RawGraph } from './types'

const PAGE = 1000
const TABLES = ['providers', 'doctors', 'affiliations', 'procedures', 'prices'] as const

export async function loadGraph(): Promise<RawGraph> {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set')
  }
  const sb = createClient(url, key, { auth: { persistSession: false } })
  const entries = await Promise.all(
    TABLES.map(async (table) => {
      const rows: unknown[] = []
      for (let from = 0; ; from += PAGE) {
        const { data, error } = await sb.from(table).select('*').order('id').range(from, from + PAGE - 1)
        if (error) throw new Error(`${table}: ${error.message}`)
        rows.push(...(data ?? []))
        if (!data || data.length === 0) break
      }
      return [table, rows] as const
    }),
  )
  return Object.fromEntries(entries) as unknown as RawGraph
}
