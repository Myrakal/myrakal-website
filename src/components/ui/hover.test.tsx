import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { buttonVariants } from '@/components/ui/button'

const hoverClasses = (cls: string) => cls.split(/\s+/).filter((c) => c.startsWith('hover:'))
const read = (file: string) => readFileSync(join(process.cwd(), 'src/components', file), 'utf8')

describe('hover states stay visible on the velvet background', () => {
  it.each(['outline', 'ghost', 'secondary'] as const)('%s button does not hover to muted or a faint tint', (variant) => {
    const hovers = hoverClasses(buttonVariants({ variant })).join(' ')
    expect(hovers).not.toMatch(/hover:bg-muted/)
    expect(hovers).not.toMatch(/foreground\)_5%/)
    expect(hovers).toMatch(/hover:bg-/)
  })

  it.each([
    ['outline', 'hover:bg-accent'],
    ['ghost', 'hover:bg-accent'],
  ] as const)('%s button hovers to a distinct palette colour', (variant, expected) => {
    expect(hoverClasses(buttonVariants({ variant }))).toContain(expected)
  })

  it('chat list rows do not hover to the muted background that hides dark text', () => {
    expect(read('portal/ChatList.tsx')).not.toMatch(/hover:bg-muted/)
    expect(read('portal/ChatList.tsx')).toMatch(/hover:bg-primary\/90/)
  })

  it('navbar outline button hover is more than a 10% tint', () => {
    expect(read('Navbar.tsx')).not.toMatch(/hover:bg-alabaster\/10/)
  })
})
