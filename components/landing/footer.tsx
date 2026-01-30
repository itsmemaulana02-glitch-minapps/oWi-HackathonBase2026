import Link from 'next/link'
import { OWiLogo } from '@/components/ui/owi-logo'

export function Footer() {
  return (
    <footer className="border-t border-border/50 py-12">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <OWiLogo className="h-6 w-6" />
            <span className="font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
              OWi
            </span>
          </div>

          <nav className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="#" className="transition-colors hover:text-foreground">
              Terms
            </Link>
            <Link href="#" className="transition-colors hover:text-foreground">
              Privacy
            </Link>
            <Link href="#" className="transition-colors hover:text-foreground">
              Docs
            </Link>
            <Link href="https://twitter.com" className="transition-colors hover:text-foreground">
              Twitter
            </Link>
          </nav>

          <p className="text-sm text-muted-foreground">
            Built for Base Hackathon 2026
          </p>
        </div>
      </div>
    </footer>
  )
}
