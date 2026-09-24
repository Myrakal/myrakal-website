import { useForm } from '@formspree/react'

import { Button } from '@/components/ui/button'

export function WaitlistForm() {
  const [state, handleSubmit] = useForm('xdekdlkq')

  if (state.succeeded) {
    return (
      <p className="text-base text-foreground">
        You're on the list — we'll be in touch.
      </p>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-2xl flex-col items-center gap-2 rounded-full border border-border bg-card p-2 shadow-sm sm:flex-row"
    >
      <input
        type="text"
        name="name"
        placeholder="Name"
        required
        className="h-14 w-full flex-1 rounded-full bg-transparent px-6 text-lg text-foreground placeholder:text-muted-foreground focus:outline-none sm:w-auto"
      />
      <div
        className="hidden h-8 w-px bg-border sm:block"
        aria-hidden="true"
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        required
        className="h-14 w-full flex-1 rounded-full bg-transparent px-6 text-lg text-foreground placeholder:text-muted-foreground focus:outline-none sm:w-auto"
      />
      <Button
        type="submit"
        size="lg"
        disabled={state.submitting}
        className="h-14 w-full shrink-0 px-10 text-base cursor-pointer sm:w-auto"
      >
        {state.submitting ? 'Joining…' : 'Join'}
      </Button>
    </form>
  )
}
