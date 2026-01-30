'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { ArrowDownToLine, ArrowUpFromLine, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function QuickActions() {
  const [depositAmount, setDepositAmount] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const { data: portfolioData, mutate } = useSWR('/api/portfolio', fetcher)
  
  const usdtBalance = portfolioData?.portfolio?.usdt_balance || 0

  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      toast.error('Please enter a valid amount')
      return
    }
    
    setIsLoading(true)
    try {
      const response = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'deposit',
          amount: parseFloat(depositAmount),
          asset: 'USDT',
        }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast.success(`Deposited $${depositAmount} USDT successfully!`)
        setDepositAmount('')
        mutate()
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
    
    if (parseFloat(withdrawAmount) > usdtBalance) {
      toast.error('Insufficient balance')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'withdraw',
          amount: parseFloat(withdrawAmount),
          asset: 'USDT',
        }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast.success(`Withdrawn $${withdrawAmount} successfully!`)
        setWithdrawAmount('')
        mutate()
      } else {
        toast.error(data.error || 'Withdrawal failed')
      }
    } catch (error) {
      toast.error('Withdrawal failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Quick Actions</CardTitle>
        <Badge variant="outline" className="text-xs">Demo</Badge>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="deposit" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="deposit" className="gap-1.5">
              <ArrowDownToLine className="h-4 w-4" />
              Deposit
            </TabsTrigger>
            <TabsTrigger value="withdraw" className="gap-1.5">
              <ArrowUpFromLine className="h-4 w-4" />
              Withdraw
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="deposit" className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="deposit-amount">Amount (USDT)</Label>
              <Input
                id="deposit-amount"
                type="number"
                placeholder="0.00"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>
            <div className="flex gap-2">
              {['100', '500', '1000', '5000'].map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs bg-transparent"
                  onClick={() => setDepositAmount(amount)}
                >
                  ${amount}
                </Button>
              ))}
            </div>
            <Button 
              className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90" 
              onClick={handleDeposit}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <ArrowDownToLine className="h-4 w-4" />
                  Deposit USDT
                </>
              )}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Demo mode: Instant deposit simulation
            </p>
          </TabsContent>
          
          <TabsContent value="withdraw" className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="withdraw-amount">Amount (USDT)</Label>
              <Input
                id="withdraw-amount"
                type="number"
                placeholder="0.00"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Available:</span>
              <Button 
                variant="link" 
                size="sm" 
                className="h-auto p-0 text-xs"
                onClick={() => setWithdrawAmount(usdtBalance.toString())}
              >
                ${usdtBalance.toFixed(2)} (Max)
              </Button>
            </div>
            <Button 
              className="w-full gap-2 bg-transparent" 
              variant="outline"
              onClick={handleWithdraw}
              disabled={isLoading || usdtBalance === 0}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <ArrowUpFromLine className="h-4 w-4" />
                  Withdraw
                </>
              )}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
