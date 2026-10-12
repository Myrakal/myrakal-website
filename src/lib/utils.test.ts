import { cn } from '@/lib/utils'

describe('cn', () => {
  it('joins class names', () => {
    expect(cn('a', 'b')).toContain('a')
    expect(cn('a', 'b')).toContain('b')
  })
})
