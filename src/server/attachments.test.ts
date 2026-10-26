import { REQUEST_ATTACHMENT_TOOL, chatFiles, safeName } from './attachments'

describe('safeName', () => {
  it('strips paths and unsafe characters', () => {
    expect(safeName('../a/b (1).pdf')).toBe('b_1_.pdf')
    expect(safeName('')).toBe('file')
  })
})

describe('REQUEST_ATTACHMENT_TOOL', () => {
  it('requires a label', () => {
    expect(REQUEST_ATTACHMENT_TOOL.name).toBe('request_attachment')
    expect(REQUEST_ATTACHMENT_TOOL.input_schema.required).toEqual(['label'])
  })
})

describe('chatFiles', () => {
  const U1 = '11111111-1111-4111-8111-111111111111'
  const U2 = '22222222-2222-4222-8222-222222222222'
  it('strips the uuid prefix, sorts newest first and builds paths', () => {
    const files = chatFiles('c1', [
      { name: `${U1}-old.pdf`, created_at: '2026-10-01T00:00:00Z', metadata: { size: 5 } },
      { name: `${U2}-new_scan.png`, created_at: '2026-10-02T00:00:00Z', metadata: { size: 9 } },
    ])
    expect(files).toEqual([
      { name: 'new_scan.png', path: `c1/${U2}-new_scan.png`, size: 9, createdAt: '2026-10-02T00:00:00Z' },
      { name: 'old.pdf', path: `c1/${U1}-old.pdf`, size: 5, createdAt: '2026-10-01T00:00:00Z' },
    ])
  })

  it('keeps names without a uuid prefix and skips folders and placeholders', () => {
    expect(
      chatFiles('c1', [
        { name: 'plain.pdf', created_at: null, metadata: {} },
        { name: 'sub', created_at: null, metadata: null },
        { name: '.emptyFolderPlaceholder', created_at: null, metadata: { size: 0 } },
      ]),
    ).toEqual([{ name: 'plain.pdf', path: 'c1/plain.pdf', size: 0, createdAt: null }])
  })
})
