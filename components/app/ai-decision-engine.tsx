'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Brain, RefreshCw, Zap, Loader2 } from 'lucide-react'
import useSWR from 'swr'
import { toast } from 'sonner'

const fetcher = (url: string) => fetch(url).then(res => res.json())

interface AIDecision {
  decision: 'hold' | 'swap_to_usdt' | 'swap_to_xaut'
  confidence: number
  reasoning: string
  gold_trend?: string
  inflation?: string
  sentiment?: string
  technical?: string
  gold_price?: number
  gold_24h_change?: number
  created_at: string
}

export function AIDecisionEngine() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const { data: decisionsData, mutate } = useSWR('/api/ai/decisions', fetcher, {
    refreshInterval: 60000,
  })
  const { data: portfolioData } = useSWR('/api/portfolio', fetcher)
  const { data: marketData } = useSWR('/api/market', fetcher)

  const latestDecision: AIDecision | null = decisionsData?.decisions?.[0] || null
  const market = marketData?.data || { gold_price_usd: 2650, gold_24h_change: 0 }

  useEffect(() => {
    if (latestDecision?.created_at) {
      setLastUpdated(new Date(latestDecision.created_at))
    }
  }, [latestDecision?.created_at])

  const requestNewAnalysis = async () => {
    setIsAnalyzing(true)
    try {
      const response = await fetch('/api/ai/decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          portfolio: portfolioData?.portfolio,
          market_data: marketData?.data,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success('AI analysis complete!')
        mutate()
        setLastUpdated(new Date())
      } else {
        toast.error(data.error || 'Analysis failed')
      }
    } catch (error) {
      toast.error('Failed to request analysis')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getDecisionLabel = (decision: string) => {
    switch (decision) {
      case 'hold': return 'Hold'
      case 'swap_to_usdt': return 'Sell Gold'
      case 'swap_to_xaut': return 'Buy Gold'
      default: return 'Hold'
    }
  }

  const getDecisionIcon = (decision: string) => {
    switch (decision) {
      case 'hold': return '−'
      case 'swap_to_usdt': return '↓'
      case 'swap_to_xaut': return '↑'
      default: return '−'
    }
  }

  const getTrendColor = (trend: string | undefined) => {
    if (!trend) return 'text-muted-foreground'
    const lower = trend.toLowerCase()
    if (lower.includes('bullish') || lower.includes('rising') || lower.includes('risk on')) {
      return 'text-success'
    }
    if (lower.includes('bearish') || lower.includes('falling') || lower.includes('risk off')) {
      return 'text-destructive'
    }
    return 'text-primary'
  }

  const confidenceColor = (confidence: number) => {
    if (confidence >= 70) return 'bg-success'
    if (confidence >= 50) return 'bg-primary'
    return 'bg-warning'
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
            <Brain className="h-4 w-4 text-primary" />
          </div>
          AI Decision Engine
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-xs"
          onClick={requestNewAnalysis}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <RefreshCw className="h-3.5 w-3.5" />
          )}
          Refresh
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {latestDecision ? (
          <>
            {/* Recommendation Section */}
            <div className="rounded-lg border border-border/50 bg-muted/30 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Recommendation</span>
                <Badge variant="outline" className="gap-1 font-medium">
                  <span>{getDecisionIcon(latestDecision.decision)}</span>
                  {getDecisionLabel(latestDecision.decision)}
                </Badge>
              </div>

              {/* Confidence Bar */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-primary">Confidence</span>
                  <span className="font-bold">{latestDecision.confidence}%</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full transition-all duration-500 ${confidenceColor(latestDecision.confidence)}`}
                    style={{ width: `${latestDecision.confidence}%` }}
                  />
                </div>
              </div>

              {/* Reasoning */}
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                {latestDecision.reasoning}
              </p>
            </div>

            {/* Indicators Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-border/50 bg-muted/20 p-3">
                <span className="text-xs text-muted-foreground">Gold Trend</span>
                <p className={`mt-0.5 font-semibold ${getTrendColor(latestDecision.gold_trend)}`}>
                  {latestDecision.gold_trend || 'Neutral'}
                </p>
              </div>
              <div className="rounded-lg border border-border/50 bg-muted/20 p-3">
                <span className="text-xs text-muted-foreground">Inflation</span>
                <p className={`mt-0.5 font-semibold ${getTrendColor(latestDecision.inflation)}`}>
                  {latestDecision.inflation || 'Stable'}
                </p>
              </div>
              <div className="rounded-lg border border-border/50 bg-muted/20 p-3">
                <span className="text-xs text-muted-foreground">Sentiment</span>
                <p className={`mt-0.5 font-semibold ${getTrendColor(latestDecision.sentiment)}`}>
                  {latestDecision.sentiment || 'Neutral'}
                </p>
              </div>
              <div className="rounded-lg border border-border/50 bg-muted/20 p-3">
                <span className="text-xs text-muted-foreground">Technical</span>
                <p className="mt-0.5 font-semibold text-foreground">
                  {latestDecision.technical || 'Hold'}
                </p>
              </div>
            </div>

            {/* Gold Price */}
            <div className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/20 p-3">
              <div>
                <span className="text-xs text-muted-foreground">Gold Price</span>
                <p className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                  ${(latestDecision.gold_price || market.gold_price_usd).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-muted-foreground">24h Change</span>
                <p className={`font-semibold ${(latestDecision.gold_24h_change || market.gold_24h_change) >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {(latestDecision.gold_24h_change || market.gold_24h_change) >= 0 ? '+' : ''}
                  {(latestDecision.gold_24h_change || market.gold_24h_change).toFixed(2)}%
                </p>
              </div>
            </div>

            {/* X402 Footer */}
            <div className="rounded-lg bg-primary/10 p-3">
              <p className="flex items-center gap-2 text-xs text-primary">
                <Zap className="h-3.5 w-3.5" />
                AI decisions powered by X402 micropayments
              </p>
            </div>

            {/* Last Updated */}
            <p className="text-center text-xs text-muted-foreground">
              Last updated: {lastUpdated?.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              }) || 'Never'}
            </p>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-8">
            <Brain className="h-12 w-12 text-muted-foreground/50" />
            <p className="mt-3 text-center text-sm text-muted-foreground">
              No AI analysis yet. Click refresh to get your first recommendation.
            </p>
            <Button
              size="sm"
              className="mt-4 gap-1.5"
              onClick={requestNewAnalysis}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Zap className="h-4 w-4" />
              )}
              Get AI Analysis
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
