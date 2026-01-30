'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function MarketOverview() {
  const { data, isLoading, mutate } = useSWR('/api/market', fetcher, {
    refreshInterval: 60000, // Refresh every minute
  })

  const marketData = data?.data || {
    gold_price_usd: 2650,
    gold_24h_change: 0,
    inflation_rate: 3.2,
    market_sentiment: 'neutral',
    fetched_at: new Date().toISOString(),
  }

  const isGoldUp = marketData.gold_24h_change >= 0

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-lg">
          Market Overview
          <Badge variant="outline" className="text-xs">Live</Badge>
        </CardTitle>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8"
          onClick={() => mutate()}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span className="sr-only">Refresh</span>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Gold price */}
        <div className="rounded-lg bg-muted/30 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
                <span className="text-sm font-bold text-primary">Au</span>
              </div>
              <span className="text-sm font-medium">Gold (XAUT)</span>
            </div>
            <div className="text-right">
              <p className="font-semibold">${marketData.gold_price_usd.toLocaleString()}</p>
              <p className={`flex items-center justify-end text-xs ${isGoldUp ? 'text-success' : 'text-destructive'}`}>
                {isGoldUp ? <TrendingUp className="mr-1 h-3 w-3" /> : <TrendingDown className="mr-1 h-3 w-3" />}
                {isGoldUp ? '+' : ''}{marketData.gold_24h_change.toFixed(2)}%
              </p>
            </div>
          </div>
        </div>

        {/* USDT */}
        <div className="rounded-lg bg-muted/30 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/20">
                <span className="text-sm font-bold text-success">$</span>
              </div>
              <span className="text-sm font-medium">USDT</span>
            </div>
            <div className="text-right">
              <p className="font-semibold">$1.00</p>
              <p className="text-xs text-muted-foreground">Stablecoin</p>
            </div>
          </div>
        </div>

        {/* Inflation & Sentiment */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-muted/30 p-3 text-center">
            <p className="text-xs text-muted-foreground">US Inflation</p>
            <p className="mt-1 text-lg font-semibold text-destructive">{marketData.inflation_rate}%</p>
          </div>
          <div className="rounded-lg bg-muted/30 p-3 text-center">
            <p className="text-xs text-muted-foreground">Sentiment</p>
            <p className={`mt-1 text-lg font-semibold capitalize ${
              marketData.market_sentiment === 'bullish' 
                ? 'text-success' 
                : marketData.market_sentiment === 'bearish' 
                ? 'text-destructive' 
                : 'text-muted-foreground'
            }`}>
              {marketData.market_sentiment}
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Updated: {new Date(marketData.fetched_at).toLocaleTimeString()}
        </p>
      </CardContent>
    </Card>
  )
}
