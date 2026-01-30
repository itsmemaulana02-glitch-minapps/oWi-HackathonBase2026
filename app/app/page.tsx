import { Suspense } from 'react'
import { PortfolioOverview } from '@/components/app/portfolio-overview'
import { AIDecisionEngine } from '@/components/app/ai-decision-engine'
import { PriceChart } from '@/components/app/price-chart'
import { QuickActions } from '@/components/app/quick-actions'
import { RecentActivity } from '@/components/app/recent-activity'
import { NetworkStatus } from '@/components/app/network-status'
import { Skeleton } from '@/components/ui/skeleton'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Network Status Alert */}
      <NetworkStatus />

      {/* Page header */}
      <div>
        <h1 
          className="text-2xl font-bold md:text-3xl"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Dashboard
        </h1>
        <p className="mt-1 text-muted-foreground">
          Overview tabungan dan aktivitas AI kamu
        </p>
      </div>

      {/* Main grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column - 2 cols */}
        <div className="space-y-6 lg:col-span-2">
          <Suspense fallback={<Skeleton className="h-[300px] w-full rounded-xl" />}>
            <PortfolioOverview />
          </Suspense>
          
          {/* Price Chart */}
          <Suspense fallback={<Skeleton className="h-[380px] w-full rounded-xl" />}>
            <PriceChart title="XAUT/USDT" symbol="XAUT" showPortfolio />
          </Suspense>

          <Suspense fallback={<Skeleton className="h-[300px] w-full rounded-xl" />}>
            <RecentActivity />
          </Suspense>
        </div>

        {/* Right column - 1 col */}
        <div className="space-y-6">
          <QuickActions />
          
          {/* AI Decision Engine */}
          <Suspense fallback={<Skeleton className="h-[500px] w-full rounded-xl" />}>
            <AIDecisionEngine />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
