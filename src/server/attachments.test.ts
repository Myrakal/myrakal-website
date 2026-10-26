import { REQUEST_ATTACHMENT_TOOL, safeName } from './attachments'

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
