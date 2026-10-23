import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'

afterEach(cleanup)

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
