import { render, screen } from '@testing-library/react'

import { OnFileCard } from './OnFileCard'

const intake = { name: 'Ada', dob: '1815-12-10', condition: 'Knee replacement', passportValid: true, insurance: false }

test('groups values into sections and renders booleans as Yes/No', () => {
  render(<OnFileCard intake={intake} status="doctor_review" progress={{ collected: 3, total: 7 }} />)
  expect(screen.getByRole('heading', { name: 'About you' })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: 'Your health' })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: 'Travel' })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: 'Budget & coverage' })).toBeInTheDocument()
  expect(screen.getByText('Ada')).toBeInTheDocument()
  expect(screen.getByText('Passport valid').nextSibling).toHaveTextContent('Yes')
  expect(screen.getByText('Insurance').nextSibling).toHaveTextContent('No')
})

test('skips empty sections', () => {
  render(<OnFileCard intake={{ name: 'Ada' }} status="doctor_review" progress={{ collected: 1, total: 7 }} />)
  expect(screen.queryByRole('heading', { name: 'Your health' })).not.toBeInTheDocument()
  expect(screen.queryByRole('heading', { name: 'Records' })).not.toBeInTheDocument()
})

test('shows collected count only during intake', () => {
  const { rerender } = render(<OnFileCard intake={intake} status="intake" progress={{ collected: 3, total: 7 }} />)
  expect(screen.getByText('3 of 7 collected')).toBeInTheDocument()
  rerender(<OnFileCard intake={intake} status="doctor_review" progress={{ collected: 3, total: 7 }} />)
  expect(screen.queryByText('3 of 7 collected')).not.toBeInTheDocument()
})

test('uses the hairline square card style', () => {
  render(<OnFileCard intake={intake} status="doctor_review" />)
  const card = screen.getByRole('region', { name: 'On file' })
  expect(card.className).toContain('border-rule')
  expect(card.className).not.toContain('rounded')
})
