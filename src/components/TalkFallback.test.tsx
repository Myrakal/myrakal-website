import { fireEvent, render, screen } from '@testing-library/react'
import { TalkFallback } from '@/components/TalkFallback'
import { GMAIL_HREF, OUTLOOK_HREF, TALK_EMAIL } from '@/lib/contact'

describe('TalkFallback', () => {
  const writeText = jest.fn().mockResolvedValue(undefined)

  beforeEach(() => {
    writeText.mockClear()
    Object.assign(navigator, { clipboard: { writeText } })
  })

  it('shows the address as plain text, not only as a link', () => {
    render(<TalkFallback />)
    expect(screen.getByText(TALK_EMAIL).closest('a')).toBeNull()
  })

  it('copies the address and confirms with Copied', async () => {
    render(<TalkFallback />)
    fireEvent.click(screen.getByRole('button', { name: 'Copy address' }))
    expect(writeText).toHaveBeenCalledWith(TALK_EMAIL)
    expect((await screen.findByText('Copied')).getAttribute('role')).toBe('status')
  })

  it('offers Gmail and Outlook compose links in a new tab', () => {
    render(<TalkFallback />)
    const gmail = screen.getByRole('link', { name: /Open in Gmail/ })
    const outlook = screen.getByRole('link', { name: /Open in Outlook/ })
    expect(gmail.getAttribute('href')).toBe(GMAIL_HREF)
    expect(outlook.getAttribute('href')).toBe(OUTLOOK_HREF)
    for (const a of [gmail, outlook]) {
      expect(a.getAttribute('target')).toBe('_blank')
      expect(a.getAttribute('rel')).toBe('noopener noreferrer')
    }
  })

  it('says so when the clipboard is unavailable', async () => {
    writeText.mockRejectedValueOnce(new Error('denied'))
    render(<TalkFallback />)
    fireEvent.click(screen.getByRole('button', { name: 'Copy address' }))
    expect((await screen.findByText(/Copy failed/)).getAttribute('role')).toBe('status')
  })
})
