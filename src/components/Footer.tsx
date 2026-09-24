export function Footer() {
  return (
    <footer className="flex flex-col items-center gap-4 border-t border-border bg-background px-6 py-10 text-center sm:flex-row sm:justify-between sm:text-left">
      <span
        className="text-2xl font-medium text-primary"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        Myrakal
      </span>
      <span className="text-sm text-muted-foreground">
        © {new Date().getFullYear()} Myrakal Inc. All rights reserved.
      </span>
    </footer>
  )
}
