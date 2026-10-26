import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import { AttachmentUpload } from './AttachmentUpload'

const setup = (onUpload = jest.fn().mockResolvedValue(true)) => {
  const onSkip = jest.fn()
  render(<AttachmentUpload label="your lab results" onUpload={onUpload} onSkip={onSkip} />)
  return { onUpload, onSkip }
}

describe('AttachmentUpload', () => {
  it('shows the label and says the AI does not read files', () => {
    setup()
    expect(screen.getByText(/your lab results/i)).toBeTruthy()
    expect(screen.getByText(/our ai does not read your files/i)).toBeTruthy()
  })

  it('uploads each chosen file', async () => {
    const { onUpload } = setup()
    const file = new File(['x'], 'labs.pdf', { type: 'application/pdf' })
    fireEvent.change(screen.getByLabelText(/choose files/i), { target: { files: [file] } })
    await waitFor(() => expect(onUpload).toHaveBeenCalledWith(file))
  })

  it('lets the patient skip', () => {
    const { onSkip } = setup()
    fireEvent.click(screen.getByRole('button', { name: /skip, i don't have this/i }))
    expect(onSkip).toHaveBeenCalled()
  })
})
