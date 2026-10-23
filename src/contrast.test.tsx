import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { render, screen } from '@testing-library/react'

jest.mock('next/navigation', () => ({ useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }) }))
jest.mock('@/lib/supabase', () => ({ getSupabase: () => ({ auth: {} }) }))
jest.mock('@/hooks/useSession', () => ({ useSession: () => ({ user: null, loading: false }) }))

import { AuthField } from '@/components/auth/AuthField'
import { LoginForm } from '@/components/auth/LoginForm'

const read = (path: string) => readFileSync(join(__dirname, path), 'utf8')

describe('text contrast on cream surfaces', () => {
  it('sets a dark text colour on every form control by default', () => {
    const css = read('index.css')
    const rule = css.match(/input,\s*textarea,\s*select\s*\{[^}]*\}/)?.[0] ?? ''
    expect(rule).toMatch(/color:\s*var\(--card-foreground\)/)
  })

  it('styles placeholders with the dark text colour', () => {
    expect(read('index.css')).toMatch(/::placeholder\s*\{[^}]*--card-foreground/)
  })

  it('gives AuthField inputs dark text on the cream background', () => {
    render(<AuthField label="Email" />)
    expect(screen.getByLabelText('Email').className).toMatch(/\btext-card-foreground\b/)
  })

  it('gives the login form inputs dark text on the cream background', () => {
    render(<LoginForm />)
    for (const field of [screen.getByLabelText('Email'), screen.getByLabelText('Password')]) {
      expect(field.className).toMatch(/\btext-card-foreground\b/)
    }
  })
})
