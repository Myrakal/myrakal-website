import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

afterEach(cleanup)

// jsdom has no canvas/WebGL or layout APIs; stub what the app touches.
vi.mock('cobe', () => ({
  default: () => ({ destroy: () => {} }),
}))
globalThis.ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.IntersectionObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() { return [] }
} as unknown as typeof IntersectionObserver
window.matchMedia ??= vi.fn().mockImplementation((media: string) => ({
  matches: false, media, addEventListener: vi.fn(), removeEventListener: vi.fn(),
}))
