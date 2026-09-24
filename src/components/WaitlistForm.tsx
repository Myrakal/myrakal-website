import { useForm } from '@formspree/react'

import { Button } from '@/components/ui/button'

export function WaitlistForm() {
  const [state, handleSubmit] = useForm('xdekdlkq')

  if (state.succeeded) {
    return (
      <p className="text-base text-foreground">
        You're on the list, we'll be in touch.
      </p>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-2xl flex-col items-stretch gap-2 rounded-3xl border border-border bg-card p-2 shadow-sm sm:flex-row sm:items-center sm:rounded-full"
    >
      <input
        type="text"
        name="name"
        placeholder="Name"
        required
        className="h-12 w-full min-w-0 flex-1 rounded-full bg-transparent px-5 text-base text-foreground placeholder:text-muted-foreground focus:outline-none sm:h-14 sm:px-6 sm:text-lg"
      />
      <div
        className="h-px w-full bg-border sm:h-8 sm:w-px"
        aria-hidden="true"
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        required
        className="h-12 w-full min-w-0 flex-1 rounded-full bg-transparent px-5 text-base text-foreground placeholder:text-muted-foreground focus:outline-none sm:h-14 sm:px-6 sm:text-lg"
      />
      <Button
        type="submit"
        size="lg"
        disabled={state.submitting}
        className="h-12 w-full shrink-0 px-10 text-base cursor-pointer sm:h-14 sm:w-auto"
      >
        {state.submitting ? 'Joining…' : 'Join'}
      </Button>
    </form>
  )
}
