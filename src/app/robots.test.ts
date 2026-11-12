import robots from './robots'

describe('robots', () => {
  it('disallows /internal in every crawler group', () => {
    const rules = robots().rules
    const list = Array.isArray(rules) ? rules : [rules]
    for (const rule of list) {
      const disallow = ([] as string[]).concat(rule.disallow ?? [])
      expect(disallow.some((path) => path === '/' || path === '/internal')).toBe(true)
    }
  })
})
