import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FAQ } from '@/components/FAQ'

const openAll = async () => {
  const user = userEvent.setup()
  const { container } = render(<FAQ />)
  let text = ''
  for (const trigger of screen.getAllByRole('button')) {
    await user.click(trigger)
    text += container.textContent
  }
  return text
}

describe('FAQ', () => {
  it('asks the intake and consult questions', () => {
    render(<FAQ />)
    for (const q of [
      'How does it work?',
      'Do I need a diagnosis to start?',
      'Does AI make medical decisions?',
    ])
      expect(screen.getByRole('button', { name: q })).toBeTruthy()
  })

  it('answers the cost question with the flat consult fee credited toward treatment', async () => {
    render(<FAQ />)
    expect(screen.getByRole('button', { name: 'How much does it cost?' })).toBeTruthy()
    const t = await openAll()
    expect(t).toMatch(/\$150/)
    expect(t).toMatch(/credited toward any treatment/i)
  })

  it('explains intake, AI and the licensed doctor consult', async () => {
    const t = await openAll()
    for (const term of [/intake/i, /lab results|labs/i, /imaging/i, /insurance plan/i, /licensed doctor/i, /approv/i])
      expect(t).toMatch(term)
  })

  it('no longer tells visitors not to submit medical information', async () => {
    const t = await openAll()
    expect(t).not.toMatch(/do not submit medical information/i)
    expect(t).not.toMatch(/waitlist/i)
  })

  it('tells visitors not to send health information by email or the contact form', async () => {
    const t = await openAll()
    expect(t).toMatch(/not by general email or the website contact form/i)
  })

  it('says AI only gathers information and never suggests anything', async () => {
    const t = await openAll()
    expect(t).not.toMatch(/suggest/i)
    expect(t).toMatch(/only gathers/i)
    expect(t).toMatch(/lets you know when (it|intake) is done|when intake is complete|once intake is complete/i)
  })

  it('says the licensed doctor reviews the case before anything is recommended', async () => {
    const t = await openAll()
    expect(t).toMatch(/before (we|anything is|any) (recommend|suggest)/i)
  })

  it('says intake is self-serve rather than invite only', async () => {
    const t = await openAll()
    expect(t).toMatch(/self-serve/i)
    expect(t).not.toMatch(/invite/i)
  })
})
