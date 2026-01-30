'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function PortfolioOverview() {
  const { data: portfolioData, isLoading, mutate } = useSWR('/api/portfolio', fetcher, {
    refreshInterval: 30000, // Refresh every 30 seconds
  })
  
  const { data: marketData } = useSWR('/api/market', fetcher, {
    refreshInterval: 60000,
  })

  const goldPrice = marketData?.data?.gold_price_usd || 2650
  const gold24hChange = marketData?.data?.gold_24h_change || 0
  
  const portfolio = portfolioData?.portfolio || {
    usdt_balance: 0,
    xaut_balance: 0,
  }

  const usdtValue = portfolio.usdt_balance || 0
  const xautValue = (portfolio.xaut_balance || 0) * goldPrice
  const totalValue = usdtValue + xautValue
  
  // Calculate overall portfolio change based on gold movement and allocation
  const xautAllocation = totalValue > 0 ? xautValue / totalValue : 0
  const portfolioChange = xautAllocation * gold24hChange // Weighted by gold allocation
  const isPositive = portfolioChange >= 0

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg">Portfolio Overview</CardTitle>
          <Badge variant="outline" className="text-xs">Demo</Badge>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => mutate()}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Total value */}
        <div>
          <p className="text-sm text-muted-foreground">Total Value</p>
          <div className="mt-1 flex items-baseline gap-3">
            <span 
              className="text-4xl font-bold"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className={`flex items-center text-sm ${isPositive ? 'text-success' : 'text-destructive'}`}>
              {isPositive ? <TrendingUp className="mr-1 h-4 w-4" /> : <TrendingDown className="mr-1 h-4 w-4" />}
              {isPositive ? '+' : ''}{portfolioChange.toFixed(2)}%
            </span>
          </div>
        </div>

        {/* Asset breakdown */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* USDT Card */}
          <div className="rounded-xl bg-muted/50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/20">
                <span className="text-lg font-bold text-success">$</span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">USDT</p>
                <p className="font-semibold">{usdtValue.toFixed(2)}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Value</span>
              <span>${usdtValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </div>

          {/* XAUT Card */}
          <div className="rounded-xl bg-muted/50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                <span className="text-lg font-bold text-primary">Au</span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">XAUT (Gold)</p>
                <p className="font-semibold">{(portfolio.xaut_balance || 0).toFixed(6)} oz</p>
              </div>
            </div>
            <div className="mt-3 space-y-1 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Value</span>
                <span>${xautValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Price/oz</span>
                <span className={gold24hChange >= 0 ? 'text-success' : 'text-destructive'}>
                  ${goldPrice.toFixed(2)} ({gold24hChange >= 0 ? '+' : ''}{gold24hChange.toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Allocation bar */}
        <div>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Allocation</span>
            <div className="flex gap-4">
              <span className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-success" />
                USDT {totalValue > 0 ? ((usdtValue / totalValue) * 100).toFixed(0) : 50}%
              </span>
              <span className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-primary" />
                XAUT {totalValue > 0 ? ((xautValue / totalValue) * 100).toFixed(0) : 50}%
              </span>
            </div>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-muted">
            <div 
              className="h-full bg-gradient-to-r from-success to-success/80 transition-all duration-500"
              style={{ 
                width: totalValue > 0 
                  ? `${(usdtValue / totalValue) * 100}%` 
                  : '50%' 
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
