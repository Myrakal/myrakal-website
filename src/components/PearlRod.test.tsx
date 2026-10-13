import '@testing-library/jest-dom/vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { PearlRod } from './PearlRod'

vi.mock('three', () => ({ WebGLRenderer: class { constructor() { throw new Error('WebGL unavailable') } } }))
vi.mock('three/addons/environments/RoomEnvironment.js', () => ({ RoomEnvironment: class {} }))

it('preserves the jewelry poster and disables spin when WebGL is unavailable', async () => {
  const { container, unmount } = render(<PearlRod />)
  await waitFor(() => expect(screen.getByRole('button', { name: 'Rotate sculpture' })).toBeDisabled())
  expect(container.querySelector('.rod-fallback')).toHaveAttribute('src', '/images/pearl-rod.webp')
  expect(container.querySelector('canvas')).toBeNull()
  expect(screen.getByRole('group', { name: /Pearl Rod of Asclepius sculpture/ })).toHaveAttribute('tabindex', '-1')
  unmount()
})
