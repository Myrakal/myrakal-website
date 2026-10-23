import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function requireUser() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anonKey) throw new Error('NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is not set')
  const store = await cookies()
  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try {
          list.forEach(({ name, value, options }) => store.set(name, value, options))
        } catch {
          return
        }
      },
    },
  })
  const { data, error } = await supabase.auth.getUser()
  if (error && !(error.status && error.status < 500) && error.name !== 'AuthSessionMissingError') throw error
  if (!data.user) return null
  return { id: data.user.id, email: data.user.email }
}
