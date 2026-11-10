import { render, screen } from '@testing-library/react'
import { existsSync } from 'node:fs'

describe('app routes', () => {
  it.each(['api', 'care', 'individual', 'business', 'contact', 'login', 'dashboard', 'forgot-password', 'reset-password'])(
    '/%s no longer exists',
    (route) => expect(existsSync(`${__dirname}/${route}`)).toBe(false),
  )

  it('has no server code left', () => {
    for (const path of ['../server', '../proxy.ts', '../hooks', '../lib/supabase.ts']) expect(existsSync(`${__dirname}/${path}`)).toBe(false)
  })

  it('not-found renders a heading and a way home', async () => {
    const { default: NotFound } = await import('./not-found')
    render(<NotFound />)
    expect(screen.getByRole('heading', { level: 1 })).toBeTruthy()
    expect(screen.getByRole('link', { name: /home/i }).getAttribute('href')).toBe('/')
  })
})
