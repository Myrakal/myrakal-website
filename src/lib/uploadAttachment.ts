import type { Message } from '@/components/chat/ChatMessage'
import { getSupabase } from '@/lib/supabase'

export class UploadError extends Error {
  status: number
  constructor(status: number) {
    super('upload failed')
    this.status = status
  }
}

const post = (url: string, body: object) =>
  fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) })

export async function uploadAttachment(chatId: string, file: File) {
  const base = `/api/chats/${chatId}/attachments`
  const signed = await post(base, { name: file.name, type: file.type, size: file.size })
  if (!signed.ok) throw new UploadError(signed.status)
  const { bucket, path, token, contentType } = await signed.json()
  const supabase = getSupabase()
  if (!supabase) throw new UploadError(0)
  const stored = await supabase.storage.from(bucket).uploadToSignedUrl(path, token, file, { contentType })
  if (stored.error) throw new UploadError(0)
  const done = await post(`${base}/complete`, { path })
  if (!done.ok) throw new UploadError(done.status)
  return (await done.json()).message as Message
}
