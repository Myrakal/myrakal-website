import { render, screen } from '@testing-library/react'

import InternalTool from './InternalTool'

describe('InternalTool', () => {
  it('shows the POC error state', () => {
    render(<InternalTool error="boom" />)
    expect(screen.getByText(/could not load data: boom/i)).toBeTruthy()
  })
})
