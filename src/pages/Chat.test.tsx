import { render, screen } from '@testing-library/react'
import Chat from '@/pages/Chat'

describe('Chat', () => {
  it('says chat is unavailable and locks the composer', () => {
    render(<Chat />)
    expect(screen.getByRole('status').textContent).toMatch(/temporarily unavailable/i)
    expect(screen.getByLabelText('Message').hasAttribute('readonly')).toBe(true)
    expect(screen.getByRole('log', { name: 'Conversation' })).toBeTruthy()
  })
})
