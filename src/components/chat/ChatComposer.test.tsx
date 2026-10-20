import { render, screen } from '@testing-library/react'
import { ChatComposer } from '@/components/chat/ChatComposer'

describe('ChatComposer', () => {
  it('limits a message to the 4000 characters the intake record accepts', () => {
    render(<ChatComposer onSend={() => {}} />)
    const box = screen.getByRole('textbox', { name: 'Message' }) as HTMLTextAreaElement
    expect(box.maxLength).toBe(4000)
  })
})
