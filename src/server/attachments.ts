import { createClient } from '@supabase/supabase-js'

export const MAX_BYTES = 10 * 1024 * 1024
export const MAX_FILES = 10
export const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']

export const safeName = (name: string) =>
  (name.split(/[\\/]/).pop() ?? '').replace(/[^A-Za-z0-9._-]+/g, '_').replace(/^\.+/, '').slice(0, 100) || 'file'

export function attachmentBucket() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) throw new Error('NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set')
  return createClient(url, serviceKey, { auth: { persistSession: false } }).storage.from(process.env.ATTACHMENT_BUCKET || 'attachments')
}

export const REQUEST_ATTACHMENT_TOOL = {
  name: 'request_attachment',
  description:
    'Show the patient a file upload box. Call it when you ask for a document or image such as medical records, lab results, scans or a referral letter. You cannot read uploaded files.',
  input_schema: {
    type: 'object' as const,
    properties: { label: { type: 'string', description: 'Short description of what to upload, for example "your recent lab results"' } },
    required: ['label'],
  },
}
