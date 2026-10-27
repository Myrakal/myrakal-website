import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'

import { MailFallback } from './MailFallback'

const writeText = jest.fn()

beforeEach(() => {
  writeText.mockReset().mockResolvedValue(undefined)
  Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
})

describe('MailFallback', () => {
  it('shows the address as plain text', () => {
    render(<MailFallback subject="Myrakal inquiry" />)
    expect(screen.getByText('eshaansood@myrakal.com').tagName).not.toBe('A')
  })

  it('copies the address and confirms', async () => {
    render(<MailFallback subject="Myrakal inquiry" />)
    fireEvent.click(screen.getByRole('button', { name: 'Copy address' }))
    expect(writeText).toHaveBeenCalledWith('eshaansood@myrakal.com')
    await waitFor(() => expect(screen.getByRole('status').textContent).toBe('Copied'))
  })

  it('tells the user to copy by hand when the clipboard is refused', async () => {
    writeText.mockRejectedValue(new Error('denied'))
    render(<MailFallback subject="Myrakal inquiry" />)
    fireEvent.click(screen.getByRole('button', { name: 'Copy address' }))
    await waitFor(() => expect(screen.getByRole('status').textContent).toMatch(/copy it manually/i))
  })

  it('links to Gmail and Outlook compose with the subject prefilled', () => {
    render(<MailFallback subject="Privacy request" />)
    const gmail = screen.getByRole('link', { name: 'Open in Gmail' })
    const outlook = screen.getByRole('link', { name: 'Open in Outlook' })
    const g = new URL(gmail.getAttribute('href')!)
    const o = new URL(outlook.getAttribute('href')!)
    expect(g.origin).toBe('https://mail.google.com')
    expect(g.searchParams.get('to')).toBe('eshaansood@myrakal.com')
    expect(g.searchParams.get('su')).toBe('Privacy request')
    expect(o.origin).toBe('https://outlook.live.com')
    expect(o.searchParams.get('to')).toBe('eshaansood@myrakal.com')
    expect(o.searchParams.get('subject')).toBe('Privacy request')
    for (const a of [gmail, outlook]) {
      expect(a.getAttribute('target')).toBe('_blank')
      expect(a.getAttribute('rel')).toContain('noopener')
    }
  })

  it('clears the confirmation after a few seconds', async () => {
    jest.useFakeTimers()
    render(<MailFallback subject="Myrakal inquiry" />)
    fireEvent.click(screen.getByRole('button', { name: 'Copy address' }))
    await act(async () => {})
    expect(screen.getByRole('status').textContent).toBe('Copied')
    act(() => {
      jest.advanceTimersByTime(3000)
    })
    expect(screen.getByRole('status').textContent).toBe('')
    jest.useRealTimers()
  })
})
