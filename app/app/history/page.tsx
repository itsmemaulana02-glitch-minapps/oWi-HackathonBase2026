'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAccount } from 'wagmi'
import { 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  ArrowLeftRight,
  Clock,
  ExternalLink,
  History
} from 'lucide-react'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function HistoryPage() {
  const { isConnected } = useAccount()

  const { data: allTxData } = useSWR(
    isConnected ? '/api/transactions?limit=50' : null,
    fetcher
  )

  const { data: depositTxData } = useSWR(
    isConnected ? '/api/transactions?type=deposit&limit=50' : null,
    fetcher
  )

  const { data: withdrawTxData } = useSWR(
    isConnected ? '/api/transactions?type=withdraw&limit=50' : null,
    fetcher
  )

  const { data: swapTxData } = useSWR(
    isConnected ? '/api/transactions?type=swap&limit=50' : null,
    fetcher
  )

  const getIcon = (type: string) => {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-success/30 bg-success/10 text-success'
      case 'pending':
        return 'border-primary/30 bg-primary/10 text-primary'
      case 'failed':
        return 'border-destructive/30 bg-destructive/10 text-destructive'
      default:
        return ''
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const TransactionList = ({ transactions }: { transactions: any[] }) => {
    if (!transactions || transactions.length === 0) {
      return (
        <div className="py-12 text-center text-muted-foreground">
          No transactions found
        </div>
      )
    }

    return (
      <div className="space-y-3">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="flex items-center justify-between rounded-lg bg-muted/30 p-4"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                {getIcon(tx.type)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium capitalize">{tx.type}</span>
                  <Badge variant="outline" className={getStatusColor(tx.status)}>
                    {tx.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {tx.type === 'swap' ? (
                    <>
                      {tx.from_amount?.toFixed(tx.from_asset === 'XAUT' ? 6 : 2)} {tx.from_asset} → {tx.to_amount?.toFixed(tx.to_asset === 'XAUT' ? 6 : 2)} {tx.to_asset}
                    </>
                  ) : tx.type === 'deposit' ? (
                    <>+{tx.to_amount?.toFixed(2)} {tx.to_asset}</>
                  ) : (
                    <>-{tx.from_amount?.toFixed(2)} {tx.from_asset}</>
                  )}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {formatDate(tx.created_at)}
              </p>
              {tx.tx_hash && (
                <Button
                  variant="link"
                  size="sm"
                  className="h-auto p-0 text-xs"
                  asChild
                >
                  <a
                    href={`https://basescan.org/tx/${tx.tx_hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on Explorer
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <History className="h-12 w-12 text-muted-foreground/50" />
        <h2 className="mt-4 text-xl font-semibold">Connect Your Wallet</h2>
        <p className="mt-2 text-muted-foreground">
          Connect your wallet to view transaction history
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
          Transaction History
        </h1>
        <p className="mt-1 text-muted-foreground">
          View all your deposits, withdrawals, and swaps
        </p>
      </div>

      <Card className="border-border/50 bg-card/50">
        <CardContent className="pt-6">
          <Tabs defaultValue="all">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="deposits">Deposits</TabsTrigger>
              <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
              <TabsTrigger value="swaps">Swaps</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <TransactionList transactions={allTxData?.transactions || []} />
            </TabsContent>

            <TabsContent value="deposits" className="mt-6">
              <TransactionList transactions={depositTxData?.transactions || []} />
            </TabsContent>

            <TabsContent value="withdrawals" className="mt-6">
              <TransactionList transactions={withdrawTxData?.transactions || []} />
            </TabsContent>

            <TabsContent value="swaps" className="mt-6">
              <TransactionList transactions={swapTxData?.transactions || []} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
