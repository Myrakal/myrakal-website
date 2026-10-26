'use client'

import { useId, useState, type ChangeEvent } from 'react'

import { Button } from '@/components/ui/button'

type Props = { label: string; onUpload: (file: File) => Promise<boolean>; onSkip: () => void; busy?: boolean }

export function AttachmentUpload({ label, onUpload, onSkip, busy = false }: Props) {
  const id = useId()
  const [uploading, setUploading] = useState(false)
  const locked = uploading || busy

  const choose = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    e.target.value = ''
    setUploading(true)
    for (const file of files) if (!(await onUpload(file))) break
    setUploading(false)
  }

  return (
    <div className="mb-3 rounded-3xl border border-dashed border-border bg-card p-4 text-card-foreground">
      <p className="text-sm font-medium">Please upload {label}</p>
      <p className="mt-1 text-xs text-card-foreground/80">
        Our AI does not read your files. Only your doctor will see them. PDF, JPG, PNG, WEBP or HEIC, up to 10 MB each.
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <input
          id={id}
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png,.webp,.heic,.heif,application/pdf,image/*"
          disabled={locked}
          onChange={choose}
          className="peer sr-only"
        />
        <label
          htmlFor={id}
          className={`inline-flex min-h-10 cursor-pointer items-center rounded-full bg-background px-4 text-sm font-medium text-foreground peer-focus-visible:ring-2 peer-focus-visible:ring-card-foreground ${locked ? 'pointer-events-none opacity-60' : ''}`}
        >
          {uploading ? 'Uploading…' : 'Choose files'}
        </label>
        <Button type="button" variant="ghost" disabled={locked} onClick={onSkip} className="cursor-pointer">
          Skip, I don&apos;t have this
        </Button>
      </div>
    </div>
  )
}
