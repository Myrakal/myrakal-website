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
    <div className="w-full max-w-2xl">
      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col border border-pearl bg-transparent sm:flex-row sm:items-stretch"
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
          className="flex-1 border-b border-pearl bg-transparent px-5 py-4 text-base text-foreground placeholder:text-muted-foreground focus:outline-none sm:border-r sm:border-b-0"
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
          className="flex-1 border-b border-pearl bg-transparent px-5 py-4 text-base text-foreground placeholder:text-muted-foreground focus:outline-none sm:border-r sm:border-b-0"
        />
        <Button
          type="submit"
          size="lg"
          disabled={state.submitting}
          className="cursor-pointer rounded-none! border-none bg-pearl px-8 text-base text-primary-foreground sm:shrink-0"
        >
          {state.submitting ? 'Joining…' : 'Join'}
        </Button>
      </form>
      <p className="mt-3 text-center text-xs leading-6 text-muted-foreground">
        We use your name and email to manage the waitlist and contact you. See our{' '}
        <a className="underline underline-offset-4 hover:text-foreground" href="/privacy/">
          Privacy Policy
        </a>
        . Please do not send medical information.
      </p>
    </div>
  )
}
