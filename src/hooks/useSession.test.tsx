import { act, renderHook, waitFor } from '@testing-library/react'

const mockGetSession = jest.fn()
const mockUnsubscribe = jest.fn()
let authListener: (event: string, session: { user: { id: string } } | null) => void
const mockClient = {
  auth: {
    getSession: mockGetSession,
    onAuthStateChange: jest.fn((cb: typeof authListener) => {
      authListener = cb
      return { data: { subscription: { unsubscribe: mockUnsubscribe } } }
    }),
  },
}
const mockGetSupabase = jest.fn(() => mockClient as unknown)
jest.mock('@/lib/supabase', () => ({ getSupabase: () => mockGetSupabase() }))

import { useSession } from '@/hooks/useSession'

afterEach(() => jest.clearAllMocks())

describe('useSession', () => {
  it('starts loading, then exposes the current user', async () => {
    mockGetSession.mockResolvedValue({ data: { session: { user: { id: 'u1' } } } })
    const { result } = renderHook(() => useSession())
    expect(result.current.loading).toBe(true)
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.user).toEqual({ id: 'u1' })
  })

  it('has no user when signed out', async () => {
    mockGetSession.mockResolvedValue({ data: { session: null } })
    const { result } = renderHook(() => useSession())
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.user).toBeNull()
  })

  it('follows auth state changes and unsubscribes on unmount', async () => {
    mockGetSession.mockResolvedValue({ data: { session: null } })
    const { result, unmount } = renderHook(() => useSession())
    await waitFor(() => expect(result.current.loading).toBe(false))
    act(() => authListener('SIGNED_IN', { user: { id: 'u2' } }))
    expect(result.current.user).toEqual({ id: 'u2' })
    act(() => authListener('SIGNED_OUT', null))
    expect(result.current.user).toBeNull()
    unmount()
    expect(mockUnsubscribe).toHaveBeenCalled()
  })

  it('is not loading and has no user when supabase is not configured', async () => {
    mockGetSupabase.mockReturnValueOnce(null)
    const { result } = renderHook(() => useSession())
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.user).toBeNull()
  })
})
