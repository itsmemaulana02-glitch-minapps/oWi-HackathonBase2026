'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  ArrowLeftRight,
  Loader2,
  RefreshCw
} from 'lucide-react'
import { toast } from 'sonner'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function PortfolioPage() {
  const [depositAmount, setDepositAmount] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [swapAmount, setSwapAmount] = useState('')
  const [swapDirection, setSwapDirection] = useState<'usdt_to_xaut' | 'xaut_to_usdt'>('usdt_to_xaut')
  const [isLoading, setIsLoading] = useState(false)

  const { data: portfolioData, mutate: refreshPortfolio } = useSWR(
    '/api/portfolio',
    fetcher,
    { refreshInterval: 30000 }
  )

  const { data: marketData, mutate: refreshMarket } = useSWR(
    '/api/market',
    fetcher,
    { refreshInterval: 60000 }
  )

  const portfolio = portfolioData?.portfolio || { usdt_balance: 0, xaut_balance: 0 }
  const market = marketData?.data || { gold_price_usd: 2650 }

  const xautValueUsd = (portfolio.xaut_balance || 0) * market.gold_price_usd
  const totalValue = (portfolio.usdt_balance || 0) + xautValueUsd

  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      toast.error('Please enter a valid amount')
      return
    }
    
    setIsLoading(true)
    try {
      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'deposit', 
          amount: parseFloat(depositAmount), 
          asset: 'USDT' 
        }),
      })
      
      const data = await res.json()
      if (data.success) {
        toast.success(`Deposited $${depositAmount} USDT successfully!`)
        setDepositAmount('')
        refreshPortfolio()
      } else {
        toast.error(data.error || 'Deposit failed')
      }
    } catch (error) {
      toast.error('Deposit failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleWithdraw = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'withdraw', 
          amount: parseFloat(withdrawAmount), 
          asset: 'USDT' 
        }),
      })
      
      const data = await res.json()
      if (data.success) {
        toast.success(`Withdrawn $${withdrawAmount} successfully!`)
        setWithdrawAmount('')
        refreshPortfolio()
      } else {
        toast.error(data.error || 'Withdrawal failed')
      }
    } catch (error) {
      toast.error('Withdrawal failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSwap = async () => {
    if (!swapAmount || parseFloat(swapAmount) <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    const from_asset = swapDirection === 'usdt_to_xaut' ? 'USDT' : 'XAUT'
    const to_asset = swapDirection === 'usdt_to_xaut' ? 'XAUT' : 'USDT'

    setIsLoading(true)
    try {
      const res = await fetch('/api/swap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          from_asset,
          to_asset,
          amount: parseFloat(swapAmount),
          gold_price: market.gold_price_usd,
        }),
      })
      
      const data = await res.json()
      if (data.success) {
        toast.success(`Swapped ${data.swap.from_amount} ${from_asset} to ${data.swap.to_amount.toFixed(6)} ${to_asset}!`)
        setSwapAmount('')
        refreshPortfolio()
      } else {
        toast.error(data.error || 'Swap failed')
      }
    } catch (error) {
      toast.error('Swap failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 
            className="flex items-center gap-2 text-2xl font-bold md:text-3xl"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Portfolio
            <Badge variant="outline">Demo</Badge>
          </h1>
          <p className="mt-1 text-muted-foreground">
            Manage your USDT and Gold allocation
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => {
            refreshPortfolio()
            refreshMarket()
          }}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Portfolio summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border/50 bg-card/50">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Value</p>
            <p className="mt-1 text-3xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
              ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/20">
                <span className="text-sm font-bold text-success">$</span>
              </div>
              <span className="text-sm text-muted-foreground">USDT Balance</span>
            </div>
            <p className="mt-2 text-2xl font-bold">
              {(portfolio.usdt_balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
                <span className="text-sm font-bold text-primary">Au</span>
              </div>
              <span className="text-sm text-muted-foreground">XAUT (Gold)</span>
            </div>
            <p className="mt-2 text-2xl font-bold">
              {(portfolio.xaut_balance || 0).toFixed(6)}
            </p>
            <p className="text-sm text-muted-foreground">
              = ${xautValueUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Deposit/Withdraw */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle>Deposit / Withdraw</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="deposit">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="deposit">
                  <ArrowDownToLine className="mr-2 h-4 w-4" />
                  Deposit
                </TabsTrigger>
                <TabsTrigger value="withdraw">
                  <ArrowUpFromLine className="mr-2 h-4 w-4" />
                  Withdraw
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="deposit" className="mt-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="deposit">Amount (USDT)</Label>
                  <Input
                    id="deposit"
                    type="number"
                    placeholder="0.00"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  {['100', '500', '1000', '5000'].map((amount) => (
                    <Button
                      key={amount}
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                      onClick={() => setDepositAmount(amount)}
                    >
                      ${amount}
                    </Button>
                  ))}
                </div>
                <Button 
                  className="w-full bg-primary text-primary-foreground"
                  onClick={handleDeposit}
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowDownToLine className="mr-2 h-4 w-4" />}
                  Deposit USDT
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  Demo mode: Instant deposit simulation
                </p>
              </TabsContent>
              
              <TabsContent value="withdraw" className="mt-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="withdraw">Amount (USDT)</Label>
                  <Input
                    id="withdraw"
                    type="number"
                    placeholder="0.00"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Available: ${(portfolio.usdt_balance || 0).toFixed(2)}</span>
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto p-0 text-xs"
                      onClick={() => setWithdrawAmount((portfolio.usdt_balance || 0).toString())}
                    >
                      Max
                    </Button>
                  </div>
                </div>
                <Button 
                  className="w-full bg-transparent"
                  variant="outline"
                  onClick={handleWithdraw}
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowUpFromLine className="mr-2 h-4 w-4" />}
                  Withdraw
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Swap */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowLeftRight className="h-5 w-5" />
              Manual Swap
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button
                variant={swapDirection === 'usdt_to_xaut' ? 'default' : 'outline'}
                className={`flex-1 ${swapDirection !== 'usdt_to_xaut' ? 'bg-transparent' : ''}`}
                onClick={() => {
                  setSwapDirection('usdt_to_xaut')
                  setSwapAmount('')
                }}
              >
                USDT → XAUT
              </Button>
              <Button
                variant={swapDirection === 'xaut_to_usdt' ? 'default' : 'outline'}
                className={`flex-1 ${swapDirection !== 'xaut_to_usdt' ? 'bg-transparent' : ''}`}
                onClick={() => {
                  setSwapDirection('xaut_to_usdt')
                  setSwapAmount('')
                }}
              >
                XAUT → USDT
              </Button>
            </div>

            <div className="space-y-2">
              <Label>
                Amount ({swapDirection === 'usdt_to_xaut' ? 'USDT' : 'XAUT'})
              </Label>
              <Input
                type="number"
                placeholder="0.00"
                value={swapAmount}
                onChange={(e) => setSwapAmount(e.target.value)}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>
                  Available: {swapDirection === 'usdt_to_xaut' 
                    ? `$${(portfolio.usdt_balance || 0).toFixed(2)} USDT`
                    : `${(portfolio.xaut_balance || 0).toFixed(6)} XAUT`
                  }
                </span>
                <Button
                  variant="link"
                  size="sm"
                  className="h-auto p-0 text-xs"
                  onClick={() => setSwapAmount(
                    swapDirection === 'usdt_to_xaut' 
                      ? (portfolio.usdt_balance || 0).toString()
                      : (portfolio.xaut_balance || 0).toString()
                  )}
                >
                  Max
                </Button>
              </div>
            </div>

            {swapAmount && parseFloat(swapAmount) > 0 && (
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-sm text-muted-foreground">You will receive (est.)</p>
                <p className="text-lg font-semibold">
                  {swapDirection === 'usdt_to_xaut'
                    ? `${((parseFloat(swapAmount) * 0.997) / market.gold_price_usd).toFixed(6)} XAUT`
                    : `$${((parseFloat(swapAmount) * market.gold_price_usd) * 0.997).toFixed(2)} USDT`
                  }
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Rate: 1 XAUT = ${market.gold_price_usd.toLocaleString()} | Fee: 0.3%
                </p>
              </div>
            )}

            <Button 
              className="w-full bg-primary text-primary-foreground"
              onClick={handleSwap}
              disabled={isLoading || !swapAmount}
            >
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowLeftRight className="mr-2 h-4 w-4" />}
              Swap
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Tip: Let AI handle swaps automatically for optimal timing
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
