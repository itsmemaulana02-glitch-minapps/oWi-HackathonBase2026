'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { OWiLogo } from '@/components/ui/owi-logo'
import { 
  LayoutDashboard, 
  Wallet, 
  History, 
  Brain, 
  Settings,
  PlayCircle
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/app', icon: LayoutDashboard },
  { name: 'Portfolio', href: '/app/portfolio', icon: Wallet },
  { name: 'AI Decisions', href: '/app/decisions', icon: Brain },
  { name: 'History', href: '/app/history', icon: History },
]

const bottomNav = [
  { name: 'Demo Guide', href: '/app/demo', icon: PlayCircle },
  { name: 'Settings', href: '/app/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-border bg-sidebar lg:flex">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
        <OWiLogo className="h-8 w-8" />
        <span 
          className="text-xl font-semibold text-sidebar-foreground"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          OWi
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
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

      {/* Bottom navigation */}
      <div className="border-t border-sidebar-border p-4">
        {bottomNav.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
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
      </div>
    </aside>
  )
}
