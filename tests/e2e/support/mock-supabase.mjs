import { createServer } from 'node:http'

const encode = (value) => Buffer.from(JSON.stringify(value)).toString('base64url')
const user = {
  id: '22222222-2222-4222-8222-222222222222',
  aud: 'authenticated',
  role: 'authenticated',
  email: 'patient@example.com',
  app_metadata: {},
  user_metadata: {},
  created_at: '2026-01-01T00:00:00Z',
}
const expiresIn = 60 * 60 * 24
const session = () => {
  const exp = Math.floor(Date.now() / 1000) + expiresIn
  const accessToken = [encode({ alg: 'HS256', typ: 'JWT' }), encode({ sub: user.id, role: 'authenticated', exp }), 'signature'].join('.')
  return { access_token: accessToken, refresh_token: 'refresh', token_type: 'bearer', expires_in: expiresIn, expires_at: exp, user }
}

const send = (res, status, body) => {
  res.writeHead(status, {
    'content-type': 'application/json',
    'access-control-allow-origin': '*',
    'access-control-allow-headers': '*',
    'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  })
  res.end(JSON.stringify(body))
}

createServer((req, res) => {
  const { pathname } = new URL(req.url, 'http://localhost')
  if (req.method === 'OPTIONS') return send(res, 204, {})
  if (pathname === '/health') return send(res, 200, { ok: true })
  if (pathname === '/auth/v1/user') {
    return req.headers.authorization?.startsWith('Bearer ') ? send(res, 200, user) : send(res, 401, { msg: 'no session' })
  }
  if (pathname === '/auth/v1/signup' || pathname === '/auth/v1/token') return send(res, 200, session())
  if (pathname === '/auth/v1/logout') return send(res, 204, {})
  return send(res, 404, { msg: 'not mocked' })
}).listen(Number(process.env.MOCK_SUPABASE_PORT ?? 54321), '127.0.0.1')
