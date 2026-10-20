import { useForm } from '@formspree/react'
import { useEffect, useId, useRef } from 'react'

import { Button } from '@/components/ui/button'
import { track, type AnalyticsEvent } from '@/lib/analytics'

export function WaitlistForm() {
  const [state, handleSubmit] = useForm('xdekdlkq')
  const fieldId = useId()
  const fired = useRef(new Set<AnalyticsEvent>())

  const trackOnce = (event: AnalyticsEvent) => {
    if (fired.current.has(event)) return
    fired.current.add(event)
    track(event)
  }

  useEffect(() => {
    if (state.succeeded) trackOnce('waitlist_success')
  })

  if (state.succeeded) {
    return (
      <p className="text-base text-foreground" role="status">
        Thanks, we'll be in touch.
      </p>
    )
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <form
        onFocus={(e) => {
          if (e.target instanceof HTMLInputElement) trackOnce('waitlist_focus')
        }}
        onChange={() => trackOnce('waitlist_type')}
        onSubmit={(e) => {
          trackOnce('waitlist_submit')
          return handleSubmit(e)
        }}
        className="flex w-full flex-col items-stretch gap-2 rounded-3xl border border-border bg-card p-2 shadow-sm sm:flex-row sm:items-center sm:rounded-full"
      >
        <label className="sr-only" htmlFor={`${fieldId}-name`}>
          Name
        </label>
        <input
          id={`${fieldId}-name`}
          type="text"
          name="name"
          autoComplete="name"
          placeholder="Name"
          required
          className="h-12 w-full min-w-0 flex-1 rounded-full bg-transparent px-5 text-base text-card-foreground placeholder:text-card-foreground/60 focus:outline-none sm:h-14 sm:px-6 sm:text-lg"
        />
        <div
          className="h-px w-full bg-card-foreground/20 sm:h-8 sm:w-px"
          aria-hidden="true"
        />
        <label className="sr-only" htmlFor={`${fieldId}-email`}>
          Email
        </label>
        <input
          id={`${fieldId}-email`}
          type="email"
          name="email"
          autoComplete="email"
          placeholder="Email"
          required
          className="h-12 w-full min-w-0 flex-1 rounded-full bg-transparent px-5 text-base text-card-foreground placeholder:text-card-foreground/60 focus:outline-none sm:h-14 sm:px-6 sm:text-lg"
        />
        <Button
          type="submit"
          size="lg"
          disabled={state.submitting}
          className="h-12 w-full shrink-0 cursor-pointer px-10 text-base sm:h-14 sm:w-auto"
        >
          {state.submitting ? 'Sending…' : 'Talk with us'}
        </Button>
      </form>
      <p className="mt-3 px-2 text-center text-sm leading-6 text-muted-foreground">
        We use your name and email to contact you about Myrakal. See our{' '}
        <a className="underline underline-offset-4 hover:text-foreground" href="/privacy/">
          Privacy Policy
        </a>
        . Please do not send medical information.
      </p>
    </div>
  )
}
