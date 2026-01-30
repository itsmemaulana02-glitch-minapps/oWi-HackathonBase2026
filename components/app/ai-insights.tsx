'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Brain, Sparkles, ArrowRight, Zap, Loader2 } from 'lucide-react'
import Link from 'next/link'
import useSWR from 'swr'
import { useState } from 'react'
import { toast } from 'sonner'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function AIInsights() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  
  const { data: decisionsData, mutate } = useSWR('/api/ai/decisions', fetcher)
  const { data: portfolioData } = useSWR('/api/portfolio', fetcher)
  const { data: marketData } = useSWR('/api/market', fetcher)

  const latestDecision = decisionsData?.decisions?.[0]

  const decisionColors: Record<string, string> = {
    hold: 'bg-secondary/20 text-secondary',
    swap_to_usdt: 'bg-success/20 text-success',
    swap_to_xaut: 'bg-primary/20 text-primary',
  }

  const decisionLabels: Record<string, string> = {
    hold: 'Hold Position',
    swap_to_usdt: 'Swap to USDT',
    swap_to_xaut: 'Swap to Gold',
  }

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
        toast.success('AI analysis complete!', {
          description: `Recommendation: ${decisionLabels[data.decision.decision]}`,
        })
        mutate()
      } else {
        toast.error('Analysis failed', {
          description: data.error || 'Please try again',
        })
      }
    } catch (error) {
      toast.error('Failed to request analysis')
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Insights
          <Badge variant="outline" className="text-xs">Demo</Badge>
        </CardTitle>
        <Link href="/app/decisions">
          <Button variant="ghost" size="sm" className="gap-1 text-xs">
            View All
            <ArrowRight className="h-3 w-3" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {latestDecision ? (
          <div className="rounded-xl bg-muted/30 p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                  <Brain className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <Badge className={decisionColors[latestDecision.decision] || decisionColors.hold}>
                    {decisionLabels[latestDecision.decision] || 'Unknown'}
                  </Badge>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Latest recommendation
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">{latestDecision.confidence}%</p>
                <p className="text-xs text-muted-foreground">Confidence</p>
              </div>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {latestDecision.reasoning}
            </p>

            <div className="mt-4 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                {new Date(latestDecision.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
              <Button 
                size="sm" 
                variant="outline" 
                className="gap-1.5 text-xs bg-transparent"
                onClick={requestNewAnalysis}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Zap className="h-3 w-3" />
                    Request New Analysis
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8">
            <Brain className="h-10 w-10 text-muted-foreground/50" />
            <p className="mt-3 text-center text-sm text-muted-foreground">
              No analysis yet. Request your first AI insight!
            </p>
            <Button 
              size="sm" 
              className="mt-4 gap-1.5"
              onClick={requestNewAnalysis}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Get First Analysis
                </>
              )}
            </Button>
          </div>
        )}

        <p className="mt-3 text-center text-xs text-muted-foreground">
          AI analysis powered by X402 micropayments
        </p>
      </CardContent>
    </Card>
  )
}
