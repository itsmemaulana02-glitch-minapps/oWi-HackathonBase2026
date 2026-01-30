'use client'

import { useState } from 'react'
import { X, Info, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function DemoBanner() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 border-b border-primary/20">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Info className="h-4 w-4 text-primary shrink-0" />
            <p className="text-sm text-foreground/80">
              <span className="font-medium text-primary">Demo Mode:</span>{' '}
              Using Sepolia testnet with simulated USDT/XAUT balances.{' '}
              <a 
                href="https://sepoliafaucet.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline"
              >
                Get test ETH <ExternalLink className="h-3 w-3" />
              </a>
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 shrink-0"
            onClick={() => setIsVisible(false)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Dismiss</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
