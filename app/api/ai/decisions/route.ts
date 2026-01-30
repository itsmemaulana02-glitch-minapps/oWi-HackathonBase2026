import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const DEMO_DECISIONS_COOKIE = 'owi_demo_decisions'

interface AIDecision {
  id: string
  decision: 'hold' | 'swap_to_usdt' | 'swap_to_xaut'
  confidence: number
  reasoning: string
  suggested_swap_percentage: number | null
  market_data: {
    gold_price_usd: number
    gold_24h_change: number
    inflation_rate: number
    market_sentiment: string
  }
  created_at: string
  executed: boolean
}

function generateDemoDecisions(): AIDecision[] {
  const now = Date.now()
  
  return [
    {
      id: 'decision-demo-1',
      decision: 'swap_to_xaut',
      confidence: 82,
      reasoning: 'Inflation at 3.4% is above the 2% target. Gold showing strong upward momentum (+1.2% in 24h). With 85% of portfolio in USDT, recommend allocating 30% to gold as an inflation hedge.',
      suggested_swap_percentage: 30,
      market_data: {
        gold_price_usd: 2620,
        gold_24h_change: 1.2,
        inflation_rate: 3.4,
        market_sentiment: 'bullish',
      },
      created_at: new Date(now - 5 * 24 * 60 * 60 * 1000).toISOString(),
      executed: true,
    },
    {
      id: 'decision-demo-2',
      decision: 'swap_to_xaut',
      confidence: 75,
      reasoning: 'Continued inflationary pressure. Gold price stabilizing at higher levels. Recommend additional allocation to maintain inflation protection.',
      suggested_swap_percentage: 20,
      market_data: {
        gold_price_usd: 2635,
        gold_24h_change: 0.6,
        inflation_rate: 3.3,
        market_sentiment: 'bullish',
      },
      created_at: new Date(now - 3 * 24 * 60 * 60 * 1000).toISOString(),
      executed: true,
    },
    {
      id: 'decision-demo-3',
      decision: 'hold',
      confidence: 88,
      reasoning: 'Portfolio now well-balanced at 71% USDT / 29% XAUT. Market conditions stable. Current allocation provides adequate inflation protection while maintaining liquidity for opportunities.',
      suggested_swap_percentage: null,
      market_data: {
        gold_price_usd: 2645,
        gold_24h_change: 0.3,
        inflation_rate: 3.2,
        market_sentiment: 'neutral',
      },
      created_at: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(),
      executed: false,
    },
    {
      id: 'decision-demo-4',
      decision: 'swap_to_usdt',
      confidence: 71,
      reasoning: 'Gold experiencing minor correction (-0.8%). Taking small profit on recent gains. Reallocating 10% of XAUT back to USDT to lock in gains.',
      suggested_swap_percentage: 10,
      market_data: {
        gold_price_usd: 2638,
        gold_24h_change: -0.8,
        inflation_rate: 3.1,
        market_sentiment: 'neutral',
      },
      created_at: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString(),
      executed: true,
    },
    {
      id: 'decision-demo-5',
      decision: 'hold',
      confidence: 85,
      reasoning: 'Market showing mixed signals. Gold price stable, inflation within expected range. Maintaining current balanced allocation until clearer trend emerges.',
      suggested_swap_percentage: null,
      market_data: {
        gold_price_usd: 2650,
        gold_24h_change: 0.1,
        inflation_rate: 3.2,
        market_sentiment: 'neutral',
      },
      created_at: new Date(now - 6 * 60 * 60 * 1000).toISOString(),
      executed: false,
    },
  ]
}

export async function GET() {
  try {
    const cookieStore = await cookies()
    const decisionsCookie = cookieStore.get(DEMO_DECISIONS_COOKIE)
    
    let decisions: AIDecision[]
    
    if (decisionsCookie) {
      try {
        decisions = JSON.parse(decisionsCookie.value)
      } catch {
        decisions = generateDemoDecisions()
      }
    } else {
      decisions = generateDemoDecisions()
    }
    
    // If cookie was empty or had no items, use demo data
    if (decisions.length === 0) {
      decisions = generateDemoDecisions()
    }
    
    return NextResponse.json({
      success: true,
      decisions,
      pagination: {
        total: decisions.length,
        limit: 20,
        offset: 0,
        hasMore: false,
      },
      demo: true,
    })
  } catch (error) {
    console.error('AI Decisions fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch AI decisions' },
      { status: 500 }
    )
  }
}
