import { useForm } from '@formspree/react'
import { useId } from 'react'

import { Button } from '@/components/ui/button'

export function WaitlistForm() {
  const [state, handleSubmit] = useForm('xdekdlkq')
  const fieldId = useId()

  if (state.succeeded) {
    return (
      <p className="text-base text-foreground" role="status">
        You're on the list, we'll be in touch.
      </p>
    )
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <form
        onSubmit={handleSubmit}
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
          className="h-12 w-full min-w-0 flex-1 rounded-full bg-transparent px-5 text-base text-foreground placeholder:text-muted-foreground focus:outline-none sm:h-14 sm:px-6 sm:text-lg"
        />
        <div
          className="h-px w-full bg-border sm:h-8 sm:w-px"
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
          className="h-12 w-full min-w-0 flex-1 rounded-full bg-transparent px-5 text-base text-foreground placeholder:text-muted-foreground focus:outline-none sm:h-14 sm:px-6 sm:text-lg"
        />
        <Button
          type="submit"
          size="lg"
          disabled={state.submitting}
          className="h-12 w-full shrink-0 cursor-pointer px-10 text-base sm:h-14 sm:w-auto"
        >
          {state.submitting ? 'Joining…' : 'Join'}
        </Button>
      </form>
      <p className="mt-3 px-2 text-center text-sm leading-6 text-muted-foreground">
        We use your name and email to manage the waitlist and contact you. See our{' '}
        <a className="underline underline-offset-4 hover:text-foreground" href="/privacy/">
          Privacy Policy
        </a>
        . Please do not send medical information.
      </p>
    </div>
  )
}
