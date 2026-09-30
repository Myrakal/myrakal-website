export function Footer() {
  return (
    <footer className="border-t border-border bg-background px-6 py-10 sm:px-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <span
              className="block text-2xl font-medium text-primary"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Myrakal
            </span>
            <a
              href="mailto:eshaansood@myrakal.com"
              className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4"
            >
              eshaansood@myrakal.com
            </a>
          </div>

          <nav aria-label="Company and legal" className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
            <a className="underline-offset-4 hover:underline" href="/privacy/">
              Privacy Policy
            </a>
            <a className="underline-offset-4 hover:underline" href="/terms/">
              Terms of Service
            </a>
            <a className="underline-offset-4 hover:underline" href="/contact/">
              Contact
            </a>
            <a className="underline-offset-4 hover:underline" href="/accessibility/">
              Accessibility
            </a>
          </nav>
        </div>

        <div className="flex flex-col gap-2 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Myrakal Inc. All rights reserved.</span>
          <span>Chicago, Illinois</span>
        </div>
      </div>
    </footer>
  )
}
