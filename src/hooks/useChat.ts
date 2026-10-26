'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import type { Message } from '@/components/chat/ChatMessage'
import { uploadAttachment, UploadError } from '@/lib/uploadAttachment'

export type Progress = { collected: number; total: number }
type AttachmentRequest = { label: string }
type Reply = { reply: Message; status: string; progress: Progress; attachmentRequest?: AttachmentRequest | null }
type Detail = { status: string; progress: Progress; messages: Message[]; attachmentRequest?: AttachmentRequest | null }

type Options = {
  onCreated?: (id: string) => void
  onStatusChange?: (status: string, id: string, replace: boolean) => void
  onLocked?: (id: string) => void
}

class RateLimited extends Error {}

const post = (url: string, body?: object) =>
  fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: body && JSON.stringify(body) })

export function useChat(chatId: string | null, options: Options = {}) {
  const router = useRouter()
  const callbacks = useRef(options)
  useEffect(() => {
    callbacks.current = options
  })
  const [id, setId] = useState(chatId)
  const [messages, setMessages] = useState<Message[]>([])
  const [progress, setProgress] = useState<Progress | null>(null)
  const [status, setStatus] = useState('intake')
  const [attachmentRequest, setAttachmentRequest] = useState<AttachmentRequest | null>(null)
  const [busy, setBusy] = useState(false)
  const [loading, setLoading] = useState(chatId !== null)
  const [error, setError] = useState('')
  const [loadFailed, setLoadFailed] = useState(false)

  useEffect(() => {
    if (!chatId) return
    const controller = new AbortController()
    fetch(`/api/chats/${chatId}`, { signal: controller.signal })
      .then(async (res) => {
        if (res.status === 401) return router.replace('/login')
        if (!res.ok) throw new Error()
        const detail: Detail = await res.json()
        setStatus(detail.status)
        if (detail.status !== 'intake') return callbacks.current.onStatusChange?.(detail.status, chatId, true)
        setMessages(detail.messages)
        setProgress(detail.progress)
        setAttachmentRequest(detail.attachmentRequest ?? null)
        setLoading(false)
      })
      .catch(() => {
        if (controller.signal.aborted) return
        setError('We could not load this chat. Please refresh the page.')
        setLoadFailed(true)
        setLoading(false)
      })
    return () => controller.abort()
  }, [chatId, router])

  const send = async (text: string) => {
    const pending: Message = { id: `pending-${Date.now()}`, role: 'user', text }
    const drop = () => setMessages((all) => all.filter((m) => m.id !== pending.id))
    setError('')
    setBusy(true)
    setMessages((all) => [...all, pending])
    try {
      let current = id
      if (!current) {
        const created = await post('/api/chats')
        if (created.status === 429) throw new RateLimited()
        if (!created.ok) throw new Error()
        current = (await created.json()).id as string
        setId(current)
        callbacks.current.onCreated?.(current)
      }
      const res = await post(`/api/chats/${current}/messages`, { text })
      if (res.status === 401 || res.status === 409) {
        drop()
        if (res.status === 401) router.replace('/login')
        else callbacks.current.onLocked?.(current)
        return true
      }
      if (res.status === 429) throw new RateLimited()
      if (!res.ok) throw new Error()
      const data: Reply = await res.json()
      setMessages((all) => [...all, data.reply])
      setProgress(data.progress)
      setStatus(data.status)
      setAttachmentRequest(data.attachmentRequest ?? null)
      if (data.status !== 'intake') callbacks.current.onStatusChange?.(data.status, current, false)
      return true
    } catch (e) {
      drop()
      setError(e instanceof RateLimited ? 'You have reached the limit for this chat. Please contact us to continue.' : 'Your message was not sent. Please try again.')
      return false
    } finally {
      setBusy(false)
    }
  }

  const upload = async (file: File) => {
    if (!id) return false
    setError('')
    try {
      const message = await uploadAttachment(id, file)
      setMessages((all) => [...all, message])
      return true
    } catch (e) {
      const code = e instanceof UploadError ? e.status : 0
      if (code === 401) router.replace('/login')
      else if (code === 409) callbacks.current.onLocked?.(id)
      else setError(code === 429 ? 'This chat has reached its limit of 10 files.' : `${file.name} could not be uploaded. Check the file type and size (10 MB max) and try again.`)
      return false
    }
  }

  const skip = () => send("I don't have this right now.")

  return { messages, progress, status, busy, loading, error, loadFailed, attachmentRequest, send, upload, skip }
}
