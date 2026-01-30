'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { TrendingUp, TrendingDown } from 'lucide-react'

type TimeRange = '24h' | '7d' | '30d' | '3m' | '6m' | '1y'

interface PriceChartProps {
  title?: string
  symbol?: string
  showPortfolio?: boolean
}

// Generate realistic price data based on timeframe
function generatePriceData(timeRange: TimeRange, basePrice: number = 2650) {
  const now = Date.now()
  const points: { time: string; price: number; portfolio?: number }[] = []
  
  const config: Record<TimeRange, { count: number; interval: number; volatility: number; format: string }> = {
    '24h': { count: 48, interval: 30 * 60 * 1000, volatility: 0.002, format: 'HH:mm' },
    '7d': { count: 84, interval: 2 * 60 * 60 * 1000, volatility: 0.005, format: 'ddd' },
    '30d': { count: 60, interval: 12 * 60 * 60 * 1000, volatility: 0.01, format: 'MMM dd' },
    '3m': { count: 90, interval: 24 * 60 * 60 * 1000, volatility: 0.015, format: 'MMM dd' },
    '6m': { count: 90, interval: 2 * 24 * 60 * 60 * 1000, volatility: 0.02, format: 'MMM dd' },
    '1y': { count: 120, interval: 3 * 24 * 60 * 60 * 1000, volatility: 0.025, format: 'MMM yy' },
  }
  
  const { count, interval, volatility } = config[timeRange]
  
  let price = basePrice * (1 - volatility * count / 4) // Start lower to show uptrend
  let portfolioValue = 1000 // Starting portfolio value
  
  for (let i = count; i >= 0; i--) {
    const timestamp = now - (i * interval)
    const date = new Date(timestamp)
    
    // Add some trend and randomness
    const trend = (count - i) / count * 0.05 // Slight upward trend
    const noise = (Math.random() - 0.5) * 2 * volatility
    price = price * (1 + trend / count + noise)
    
    // Portfolio follows price with some lag
    portfolioValue = portfolioValue * (1 + (trend / count + noise) * 0.8)
    
    let timeLabel: string
    if (timeRange === '24h') {
      timeLabel = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
    } else if (timeRange === '7d') {
      timeLabel = date.toLocaleDateString('en-US', { weekday: 'short' })
    } else if (timeRange === '1y') {
      timeLabel = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
    } else {
      timeLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
    
    points.push({
      time: timeLabel,
      price: Math.round(price * 100) / 100,
      portfolio: Math.round(portfolioValue * 100) / 100,
    })
  }
  
  return points
}

const timeRanges: { value: TimeRange; label: string }[] = [
  { value: '24h', label: '24H' },
  { value: '7d', label: '7D' },
  { value: '30d', label: '30D' },
  { value: '3m', label: '3M' },
  { value: '6m', label: '6M' },
  { value: '1y', label: '1Y' },
]

export function PriceChart({ title = 'XAUT/USDT', symbol = 'XAUT', showPortfolio = false }: PriceChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('7d')
  
  const data = useMemo(() => generatePriceData(timeRange), [timeRange])
  
  const firstPrice = data[0]?.price || 0
  const lastPrice = data[data.length - 1]?.price || 0
  const priceChange = lastPrice - firstPrice
  const priceChangePercent = firstPrice > 0 ? ((priceChange / firstPrice) * 100) : 0
  const isPositive = priceChange >= 0

  const firstPortfolio = data[0]?.portfolio || 0
  const lastPortfolio = data[data.length - 1]?.portfolio || 0
  const portfolioChange = lastPortfolio - firstPortfolio
  const portfolioChangePercent = firstPortfolio > 0 ? ((portfolioChange / firstPortfolio) * 100) : 0
  const isPortfolioPositive = portfolioChange >= 0
  
  const minPrice = Math.min(...data.map(d => d.price)) * 0.998
  const maxPrice = Math.max(...data.map(d => d.price)) * 1.002

  // Compute colors in JS for Recharts
  const primaryColor = 'hsl(47, 95%, 55%)' // --primary gold
  const successColor = 'hsl(142, 76%, 45%)' // --success green
  const destructiveColor = 'hsl(0, 84%, 60%)' // --destructive red

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg">
            {title}
            <Badge variant="outline" className="text-xs">Live</Badge>
          </CardTitle>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
              ${lastPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
            <span className={`flex items-center text-sm ${isPositive ? 'text-success' : 'text-destructive'}`}>
              {isPositive ? <TrendingUp className="mr-1 h-3 w-3" /> : <TrendingDown className="mr-1 h-3 w-3" />}
              {isPositive ? '+' : ''}{priceChangePercent.toFixed(2)}%
            </span>
          </div>
          {showPortfolio && (
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-sm text-muted-foreground">Portfolio:</span>
              <span className="font-medium">${lastPortfolio.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              <span className={`text-xs ${isPortfolioPositive ? 'text-success' : 'text-destructive'}`}>
                {isPortfolioPositive ? '+' : ''}{portfolioChangePercent.toFixed(2)}%
              </span>
            </div>
          )}
        </div>
        <div className="flex gap-1">
          {timeRanges.map((range) => (
            <Button
              key={range.value}
              variant={timeRange === range.value ? 'default' : 'ghost'}
              size="sm"
              className={`h-7 px-2 text-xs ${timeRange !== range.value ? 'bg-transparent' : ''}`}
              onClick={() => setTimeRange(range.value)}
            >
              {range.label}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isPositive ? successColor : destructiveColor} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={isPositive ? successColor : destructiveColor} stopOpacity={0} />
                </linearGradient>
                {showPortfolio && (
                  <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={primaryColor} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={primaryColor} stopOpacity={0} />
                  </linearGradient>
                )}
              </defs>
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(0, 0%, 50%)', fontSize: 10 }}
                interval="preserveStartEnd"
                minTickGap={30}
              />
              <YAxis
                domain={[minPrice, maxPrice]}
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(0, 0%, 50%)', fontSize: 10 }}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
                width={70}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(0, 0%, 10%)',
                  border: '1px solid hsl(0, 0%, 20%)',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                labelStyle={{ color: 'hsl(0, 0%, 70%)' }}
                formatter={(value: number, name: string) => [
                  `$${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
                  name === 'price' ? symbol : 'Portfolio'
                ]}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke={isPositive ? successColor : destructiveColor}
                strokeWidth={2}
                fill="url(#priceGradient)"
              />
              {showPortfolio && (
                <Area
                  type="monotone"
                  dataKey="portfolio"
                  stroke={primaryColor}
                  strokeWidth={2}
                  fill="url(#portfolioGradient)"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
