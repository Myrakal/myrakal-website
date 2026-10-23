import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const PROTECTED = [/^\/dashboard(\/|$)/, /^\/chat(\/|$)/, /^\/chats(\/|$)/]

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request })
  const redirectToLogin = () => {
    const redirect = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie))
    return redirect
  }
  const isProtected = PROTECTED.some((pattern) => pattern.test(request.nextUrl.pathname))

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anonKey) return isProtected ? redirectToLogin() : response

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookies) => {
        cookies.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({ request })
        cookies.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
      },
    },
  })
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return !user && isProtected ? redirectToLogin() : response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|api/stripe-webhook|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)'],
}
