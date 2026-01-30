'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { OWiLogo } from '@/components/ui/owi-logo'

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <OWiLogo className="h-8 w-8" />
          <span className="text-xl font-semibold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            OWi
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link href="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Features
          </Link>
          <Link href="#how-it-works" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            How it Works
          </Link>
          <Link href="#faq" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            FAQ
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/auth/login">
            <Button variant="ghost" size="sm">
              Login
            </Button>
          </Link>
          <Link href="/app">
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Launch App
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
