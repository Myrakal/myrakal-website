const uploadToSignedUrl = jest.fn()
const from = jest.fn(() => ({ uploadToSignedUrl }))
jest.mock('@/lib/supabase', () => ({ getSupabase: () => ({ storage: { from } }) }))

import { uploadAttachment } from './uploadAttachment'

const fetchMock = jest.fn()
globalThis.fetch = fetchMock
const reply = (status: number, body: object = {}) => ({ ok: status < 400, status, json: async () => body })
const file = new File(['x'], 'labs.pdf', { type: 'application/pdf' })
const message = { id: 'm1', role: 'user', text: '[Attached: labs.pdf]' }

beforeEach(() => {
  jest.resetAllMocks()
  from.mockImplementation(() => ({ uploadToSignedUrl }))
  uploadToSignedUrl.mockResolvedValue({ error: null })
})

describe('uploadAttachment', () => {
  it('signs, uploads straight to storage, then confirms', async () => {
    fetchMock
      .mockResolvedValueOnce(reply(200, { bucket: 'attachments', path: 'c/u-labs.pdf', token: 'tok', contentType: 'application/pdf' }))
      .mockResolvedValueOnce(reply(200, { message }))
    expect(await uploadAttachment('c', file)).toEqual(message)
    expect(fetchMock.mock.calls[0][0]).toBe('/api/chats/c/attachments')
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({ name: 'labs.pdf', type: 'application/pdf', size: 1 })
    expect(from).toHaveBeenCalledWith('attachments')
    expect(uploadToSignedUrl).toHaveBeenCalledWith('c/u-labs.pdf', 'tok', file, { contentType: 'application/pdf' })
    expect(JSON.parse(fetchMock.mock.calls[1][1].body)).toEqual({ path: 'c/u-labs.pdf' })
  })

  it('throws the response status when signing is refused', async () => {
    fetchMock.mockResolvedValueOnce(reply(409))
    await expect(uploadAttachment('c', file)).rejects.toMatchObject({ status: 409 })
    expect(uploadToSignedUrl).not.toHaveBeenCalled()
  })

  it('does not confirm when the storage upload fails', async () => {
    fetchMock.mockResolvedValueOnce(reply(200, { bucket: 'attachments', path: 'p', token: 't', contentType: 'application/pdf' }))
    uploadToSignedUrl.mockResolvedValue({ error: new Error('boom') })
    await expect(uploadAttachment('c', file)).rejects.toBeInstanceOf(Error)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})
