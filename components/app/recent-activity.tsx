'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import useSWR from 'swr'
import { 
  ArrowRight, 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  ArrowLeftRight,
  Clock,
  Bot
} from 'lucide-react'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function RecentActivity() {
  const { data } = useSWR('/api/transactions?limit=5', fetcher)
  
  const transactions = data?.transactions || []

  const getIcon = (type: string, aiTriggered?: boolean) => {
    if (aiTriggered) {
      return <Bot className="h-4 w-4 text-primary" />
    }
    switch (type) {
      case 'deposit':
        return <ArrowDownToLine className="h-4 w-4 text-success" />
      case 'withdraw':
        return <ArrowUpFromLine className="h-4 w-4 text-destructive" />
      case 'swap':
        return <ArrowLeftRight className="h-4 w-4 text-primary" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  const formatTransaction = (tx: {
    type: string
    from_asset?: string
    from_amount?: number
    to_asset?: string
    to_amount?: number
  }) => {
    if (tx.type === 'swap') {
      return `${tx.from_amount?.toFixed(tx.from_asset === 'XAUT' ? 4 : 2)} ${tx.from_asset} → ${tx.to_amount?.toFixed(tx.to_asset === 'XAUT' ? 4 : 2)} ${tx.to_asset}`
    }
    if (tx.type === 'deposit') {
      return `+${tx.to_amount?.toFixed(2)} ${tx.to_asset}`
    }
    if (tx.type === 'withdraw') {
      return `-${tx.from_amount?.toFixed(2)} ${tx.from_asset}`
    }
    return ''
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-lg">
          Recent Activity
          <Badge variant="outline" className="text-xs">Demo</Badge>
        </CardTitle>
        <Link href="/app/history">
          <Button variant="ghost" size="sm" className="gap-1 text-xs">
            View All
            <ArrowRight className="h-3 w-3" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            No recent activity. Make a deposit to get started!
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx: {
              id: string
              type: string
              from_asset?: string
              from_amount?: number
              to_asset?: string
              to_amount?: number
              status: string
              created_at: string
              ai_triggered?: boolean
            }) => (
              <div
                key={tx.id}
                className="flex items-center justify-between rounded-lg bg-muted/30 p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                    {getIcon(tx.type, tx.ai_triggered)}
                  </div>
                  <div>
                    <p className="flex items-center gap-1.5 text-sm font-medium capitalize">
                      {tx.type}
                      {tx.ai_triggered && (
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                          AI
                        </Badge>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatTransaction(tx)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge 
                    variant="outline" 
                    className={
                      tx.status === 'completed' 
                        ? 'border-success/30 bg-success/10 text-success' 
                        : tx.status === 'pending'
                        ? 'border-primary/30 bg-primary/10 text-primary'
                        : 'border-destructive/30 bg-destructive/10 text-destructive'
                    }
                  >
                    {tx.status}
                  </Badge>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatTime(tx.created_at)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
