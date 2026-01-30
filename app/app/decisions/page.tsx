'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAccount } from 'wagmi'
import { 
  Brain, 
  Sparkles, 
  Zap,
  Loader2,
  CheckCircle2,
  Clock,
  ArrowLeftRight
} from 'lucide-react'
import { toast } from 'sonner'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function DecisionsPage() {
  const { isConnected } = useAccount()
  const [isRequesting, setIsRequesting] = useState(false)
  const [latestDecision, setLatestDecision] = useState<any>(null)

  const { data: decisionsData, mutate: refreshDecisions } = useSWR(
    isConnected ? '/api/ai/decisions?limit=20' : null,
    fetcher
  )

  const { data: portfolioData } = useSWR(
    isConnected ? '/api/portfolio' : null,
    fetcher
  )

  const { data: marketData } = useSWR('/api/market', fetcher)

  const decisions = decisionsData?.decisions || []
  const portfolio = portfolioData?.portfolio || { usdt_balance: 0, xaut_balance: 0 }
  const market = marketData?.data || { gold_price_usd: 2650 }

  const requestAIDecision = async (premium = false) => {
    setIsRequesting(true)
    try {
      const endpoint = premium ? '/api/ai/premium-decision' : '/api/ai/decision'
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          portfolioValue: portfolio.usdt_balance + (portfolio.xaut_balance * market.gold_price_usd),
          usdtBalance: portfolio.usdt_balance || 0,
          xautBalance: portfolio.xaut_balance || 0,
        }),
      })

      const data = await res.json()
      
      if (data.success) {
        setLatestDecision(data.decision)
        refreshDecisions()
        toast.success('AI analysis complete!')
      } else {
        toast.error(data.error || 'Failed to get AI decision')
      }
    } catch (error) {
      toast.error('Failed to request AI decision')
    } finally {
      setIsRequesting(false)
    }
  }

  const executeDecision = async (decision: any) => {
    if (decision.decision === 'hold') {
      toast.info('No action needed - AI recommends holding')
      return
    }

    const fromAsset = decision.decision === 'swap_to_xaut' ? 'USDT' : 'XAUT'
    const toAsset = decision.decision === 'swap_to_xaut' ? 'XAUT' : 'USDT'
    const percentage = decision.suggestedSwapPercentage || 50
    
    const balance = fromAsset === 'USDT' ? portfolio.usdt_balance : portfolio.xaut_balance
    const amount = balance * (percentage / 100)

    if (amount <= 0) {
      toast.error(`Insufficient ${fromAsset} balance`)
      return
    }

    try {
      const res = await fetch('/api/swap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromAsset,
          toAsset,
          amount,
          aiDecisionId: decision.id,
        }),
      })

      const data = await res.json()
      if (data.success) {
        toast.success(`Executed AI decision: Swapped to ${toAsset}`)
        refreshDecisions()
      } else {
        toast.error(data.error || 'Failed to execute swap')
      }
    } catch (error) {
      toast.error('Failed to execute decision')
    }
  }

  const decisionColors = {
    hold: 'bg-secondary/20 text-secondary border-secondary/30',
    swap_to_usdt: 'bg-success/20 text-success border-success/30',
    swap_to_xaut: 'bg-primary/20 text-primary border-primary/30',
  }

  const decisionLabels = {
    hold: 'Hold',
    swap_to_usdt: 'Swap to USDT',
    swap_to_xaut: 'Swap to Gold',
  }

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Brain className="h-12 w-12 text-muted-foreground/50" />
        <h2 className="mt-4 text-xl font-semibold">Connect Your Wallet</h2>
        <p className="mt-2 text-muted-foreground">
          Connect your wallet to access AI insights
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 
          className="text-2xl font-bold md:text-3xl"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          AI Decisions
        </h1>
        <p className="mt-1 text-muted-foreground">
          View AI recommendations and execute trades
        </p>
      </div>

      {/* Request new decision */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="flex flex-col items-center py-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
            <Brain className="h-8 w-8 text-primary" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">Request AI Analysis</h3>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Get personalized recommendations based on current market conditions and your portfolio
          </p>
          <div className="mt-6 flex gap-3">
            <Button
              onClick={() => requestAIDecision(false)}
              disabled={isRequesting}
              className="gap-2"
            >
              {isRequesting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              Basic Analysis
            </Button>
            <Button
              onClick={() => requestAIDecision(true)}
              disabled={isRequesting}
              variant="outline"
              className="gap-2 border-primary/50 text-primary hover:bg-primary/10"
            >
              <Zap className="h-4 w-4" />
              Premium Analysis
              <Badge variant="outline" className="ml-1 text-xs">$0.01</Badge>
            </Button>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Premium uses X402 micropayments for enhanced AI model
          </p>
        </CardContent>
      </Card>

      {/* Latest decision */}
      {latestDecision && (
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Latest Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start justify-between">
              <div>
                <Badge className={decisionColors[latestDecision.decision as keyof typeof decisionColors]}>
                  {decisionLabels[latestDecision.decision as keyof typeof decisionLabels]}
                </Badge>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {latestDecision.reasoning}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-primary">{latestDecision.confidence}%</p>
                <p className="text-xs text-muted-foreground">Confidence</p>
              </div>
            </div>

            {latestDecision.decision !== 'hold' && (
              <Button
                onClick={() => executeDecision(latestDecision)}
                className="mt-4 w-full gap-2 bg-primary text-primary-foreground"
              >
                <ArrowLeftRight className="h-4 w-4" />
                Execute This Decision
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Decision history */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle>Decision History</CardTitle>
        </CardHeader>
        <CardContent>
          {decisions.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No AI decisions yet. Request your first analysis above!
            </div>
          ) : (
            <div className="space-y-3">
              {decisions.map((decision: any) => (
                <div
                  key={decision.id}
                  className="flex items-center justify-between rounded-lg bg-muted/30 p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                      <Brain className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="outline"
                          className={decisionColors[decision.decision_type as keyof typeof decisionColors]}
                        >
                          {decisionLabels[decision.decision_type as keyof typeof decisionLabels]}
                        </Badge>
                        {decision.executed && (
                          <Badge variant="outline" className="gap-1 border-success/30 bg-success/10 text-success">
                            <CheckCircle2 className="h-3 w-3" />
                            Executed
                          </Badge>
                        )}
                        {decision.x402_payment_hash && decision.x402_payment_hash !== 'demo-free-tier' && (
                          <Badge variant="outline" className="gap-1 border-primary/30 bg-primary/10 text-primary">
                            <Zap className="h-3 w-3" />
                            Premium
                          </Badge>
                        )}
                      </div>
                      <p className="mt-1 line-clamp-2 max-w-lg text-sm text-muted-foreground">
                        {decision.reasoning}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">{decision.confidence}%</p>
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {new Date(decision.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
