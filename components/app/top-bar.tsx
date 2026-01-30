'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { OWiLogo } from '@/components/ui/owi-logo'
import { WalletConnect } from '@/components/app/wallet-connect'
import { cn } from '@/lib/utils'
import { 
  Menu, 
  X, 
  LayoutDashboard, 
  Wallet, 
  History, 
  Brain, 
  Settings 
} from 'lucide-react'

const mobileNav = [
  { name: 'Dashboard', href: '/app', icon: LayoutDashboard },
  { name: 'Portfolio', href: '/app/portfolio', icon: Wallet },
  { name: 'AI Decisions', href: '/app/decisions', icon: Brain },
  { name: 'History', href: '/app/history', icon: History },
  { name: 'Settings', href: '/app/settings', icon: Settings },
]

export function TopBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-xl md:px-6 lg:justify-end">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </Button>

        {/* Mobile logo */}
        <Link href="/app" className="flex items-center gap-2 lg:hidden">
          <OWiLogo className="h-7 w-7" />
          <span className="font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
            OWi
          </span>
        </Link>

        {/* Wallet connect */}
        <WalletConnect />
      </header>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-72 bg-sidebar p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <OWiLogo className="h-8 w-8" />
                <span 
                  className="text-xl font-semibold"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  OWi
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <nav className="mt-8 space-y-1">
              {mobileNav.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                        : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
