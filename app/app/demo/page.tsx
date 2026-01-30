'use client'

import { useState } from 'react'
import { useAccount, useBalance } from 'wagmi'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { NetworkStatus } from '@/components/app/network-status'
import { 
  CheckCircle, 
  Circle, 
  ArrowRight, 
  Wallet, 
  Brain, 
  BarChart3, 
  History,
  Settings,
  ExternalLink,
  Play,
  Sparkles
} from 'lucide-react'
import Link from 'next/link'

const demoSteps = [
  {
    id: 1,
    title: 'Connect Wallet',
    description: 'Connect MetaMask or any Web3 wallet to Sepolia testnet',
    icon: Wallet,
    link: null,
    action: 'connect',
  },
  {
    id: 2,
    title: 'View Dashboard',
    description: 'See your portfolio overview with demo USDT & XAUT balances',
    icon: BarChart3,
    link: '/app',
    action: 'navigate',
  },
  {
    id: 3,
    title: 'AI Decisions',
    description: 'View AI-generated swap recommendations based on market analysis',
    icon: Brain,
    link: '/app/decisions',
    action: 'navigate',
  },
  {
    id: 4,
    title: 'Execute Swap',
    description: 'Approve or reject AI suggestions, watch simulated swaps',
    icon: Sparkles,
    link: '/app/decisions',
    action: 'navigate',
  },
  {
    id: 5,
    title: 'Transaction History',
    description: 'Review all past transactions and AI activity',
    icon: History,
    link: '/app/history',
    action: 'navigate',
  },
  {
    id: 6,
    title: 'Settings',
    description: 'Configure AI risk tolerance and auto-swap preferences',
    icon: Settings,
    link: '/app/settings',
    action: 'navigate',
  },
]

export default function DemoGuidePage() {
  const { isConnected, address } = useAccount()
  const { data: balance } = useBalance({ address })
  const [currentStep, setCurrentStep] = useState(1)

  const getStepStatus = (stepId: number) => {
    if (stepId === 1 && isConnected) return 'completed'
    if (stepId < currentStep) return 'completed'
    if (stepId === currentStep) return 'current'
    return 'pending'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 
            className="text-2xl font-bold md:text-3xl"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Demo Guide
          </h1>
          <Badge variant="secondary" className="bg-primary/20 text-primary">
            For Judges
          </Badge>
        </div>
        <p className="mt-1 text-muted-foreground">
          Step-by-step walkthrough of OWi features for hackathon evaluation
        </p>
      </div>

      {/* Network Status */}
      <NetworkStatus />

      {/* Quick Info Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Network</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">Sepolia Testnet</p>
            <p className="text-xs text-muted-foreground">Ethereum test network</p>
          </CardContent>
        </Card>

        <Card className="border-success/20 bg-success/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Wallet Status</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">
              {isConnected ? 'Connected' : 'Not Connected'}
            </p>
            {isConnected && address && (
              <p className="text-xs text-muted-foreground font-mono">
                {address.slice(0, 6)}...{address.slice(-4)}
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="border-warning/20 bg-warning/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Test ETH Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">
              {balance ? `${Number(balance.formatted).toFixed(4)} ETH` : '0 ETH'}
            </p>
            <a 
              href="https://sepoliafaucet.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline inline-flex items-center gap-1"
            >
              Get free test ETH <ExternalLink className="h-3 w-3" />
            </a>
          </CardContent>
        </Card>
      </div>

      {/* Demo Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5 text-primary" />
            Demo Walkthrough
          </CardTitle>
          <CardDescription>
            Follow these steps to explore all OWi features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {demoSteps.map((step, index) => {
              const status = getStepStatus(step.id)
              const Icon = step.icon
              
              return (
                <div key={step.id}>
                  <div className="flex items-start gap-4">
                    {/* Step indicator */}
                    <div className="flex flex-col items-center">
                      <div className={`
                        flex h-10 w-10 items-center justify-center rounded-full border-2
                        ${status === 'completed' ? 'border-success bg-success/20 text-success' : ''}
                        ${status === 'current' ? 'border-primary bg-primary/20 text-primary' : ''}
                        ${status === 'pending' ? 'border-muted bg-muted/20 text-muted-foreground' : ''}
                      `}>
                        {status === 'completed' ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          <span className="text-sm font-semibold">{step.id}</span>
                        )}
                      </div>
                      {index < demoSteps.length - 1 && (
                        <div className={`
                          mt-2 h-12 w-0.5
                          ${status === 'completed' ? 'bg-success' : 'bg-muted'}
                        `} />
                      )}
                    </div>

                    {/* Step content */}
                    <div className="flex-1 pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className={`h-5 w-5 ${status === 'current' ? 'text-primary' : 'text-muted-foreground'}`} />
                          <h3 className={`font-semibold ${status === 'current' ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {step.title}
                          </h3>
                        </div>
                        {step.link && (
                          <Button
                            variant={status === 'current' ? 'default' : 'outline'}
                            size="sm"
                            asChild
                            onClick={() => setCurrentStep(step.id + 1)}
                          >
                            <Link href={step.link} className="gap-2">
                              Go <ArrowRight className="h-4 w-4" />
                            </Link>
                          </Button>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Technical Info */}
      <Card>
        <CardHeader>
          <CardTitle>Technical Information</CardTitle>
          <CardDescription>For technical evaluation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-semibold mb-2">Tech Stack</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>Next.js 16 (App Router)</li>
                <li>Tailwind CSS v4 + shadcn/ui</li>
                <li>Supabase (Auth + PostgreSQL)</li>
                <li>wagmi v3 + WalletConnect</li>
                <li>Vercel AI SDK</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Key Features</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>AI-powered swap decisions</li>
                <li>Real-time market analysis</li>
                <li>USDT/XAUT portfolio management</li>
                <li>Multi-wallet support</li>
                <li>Transaction history tracking</li>
              </ul>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h4 className="font-semibold mb-2">Demo Notes</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>- Using Sepolia testnet for blockchain interactions</li>
              <li>- Portfolio balances are simulated (stored in cookies)</li>
              <li>- AI decisions are generated using market data simulation</li>
              <li>- No real funds are involved in this demo</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
