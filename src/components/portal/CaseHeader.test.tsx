import { render, screen } from '@testing-library/react'

import { CaseHeader } from './CaseHeader'
import { caseTitle } from './caseTitle'

const msg = (role: string, text: string) => ({ id: text, role, text, createdAt: '2026-10-20T10:01:00.000Z' }) as never

describe('caseTitle', () => {
  it('uses the first user message', () => {
    expect(caseTitle([msg('assistant', 'Hello'), msg('user', 'I need a knee replacement')])).toBe('I need a knee replacement')
  })

  it('truncates long messages', () => {
    expect(caseTitle([msg('user', 'a'.repeat(200))]).length).toBeLessThanOrEqual(61)
  })

  it('falls back when there is no user message', () => {
    expect(caseTitle([msg('assistant', 'Hello')])).toBe('Your case')
  })
})

describe('CaseHeader', () => {
  it('shows the eyebrow, title and start date', () => {
    render(<CaseHeader id="3f1c2b4a-0000" createdAt="2026-10-20T10:00:00.000Z" messages={[msg('user', 'Knee')]} />)
    expect(screen.getByText('Your care · Case 3F1C')).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Knee' })).toBeTruthy()
    expect(screen.getByText(/Started Oct 20, 2026/)).toBeTruthy()
  })

  it('omits the date when missing', () => {
    render(<CaseHeader id="abcd" messages={[]} />)
    expect(screen.queryByText(/Started/)).toBeNull()
    expect(screen.getByRole('heading', { name: 'Your case' })).toBeTruthy()
  })
})
