'use client'

import type { Session, User } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

import { getSupabase } from '@/lib/supabase'

export function useSession() {
  const [supabase] = useState(getSupabase)
  const [state, setState] = useState<{ user: User | null; loading: boolean }>({
    user: null,
    loading: supabase !== null,
  })

  useEffect(() => {
    if (!supabase) return
    let active = true
    supabase.auth
      .getSession()
      .then(({ data }: { data: { session: Session | null } }) => data.session?.user ?? null)
      .catch(() => null)
      .then((user: User | null) => {
        if (active) setState({ user, loading: false })
      })
    const { data } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
      setState({ user: session?.user ?? null, loading: false })
    })
    return () => {
      active = false
      data.subscription.unsubscribe()
    }
  }, [supabase])

  return state
}
