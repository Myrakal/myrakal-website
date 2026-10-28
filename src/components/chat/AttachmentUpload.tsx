'use client'

import { useId, useState, type ChangeEvent } from 'react'

import { Button } from '@/components/ui/button'

type Props = { label: string; onUpload: (file: File) => Promise<boolean>; onSkip: (uploaded: boolean) => void; busy?: boolean }

export function AttachmentUpload({ label, onUpload, onSkip, busy = false }: Props) {
  const id = useId()
  const [uploading, setUploading] = useState(false)
  const [uploaded, setUploaded] = useState(false)
  const locked = uploading || busy

  const choose = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    e.target.value = ''
    setUploading(true)
    for (const file of files) {
      if (!(await onUpload(file))) break
      setUploaded(true)
    }
    setUploading(false)
  }

  return (
    <div className="mb-3 border border-dashed border-champagne/50 bg-velvet-deep/40 p-4 text-cream">
      <p className="font-display text-lg text-cream italic">Please upload {label}</p>
      <p className="mt-1 text-sm leading-6 text-mist">
        Our AI does not read your files. Only your doctor will see them. PDF, JPG, PNG, WEBP or HEIC, up to 10 MB each.
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <input
          id={id}
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png,.webp,.heic,.heif"
          disabled={locked}
          onChange={choose}
          className="peer sr-only"
        />
        <label
          htmlFor={id}
          className={`inline-flex min-h-10 cursor-pointer items-center border border-champagne/85 px-5 font-caslon text-xs tracking-[0.26em] text-champagne uppercase transition-colors hover:bg-champagne hover:text-ink peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-champagne ${locked ? 'pointer-events-none opacity-60' : ''}`}
        >
          {uploading ? 'Uploading…' : 'Choose files'}
        </label>
        <Button type="button" variant="ghost" disabled={locked} onClick={() => onSkip(uploaded)} className="cursor-pointer rounded-none font-caslon text-xs tracking-[0.22em] text-mist uppercase hover:bg-transparent hover:text-champagne">
          {uploaded ? 'Done uploading' : "Skip, I don't have this"}
        </Button>
      </div>
    </div>
  )
}
