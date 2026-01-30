import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const DEMO_DECISIONS_COOKIE = 'owi_demo_decisions'

interface AIDecision {
  id: string
  decision: 'hold' | 'swap_to_usdt' | 'swap_to_xaut'
  confidence: number
  reasoning: string
  suggested_swap_percentage: number | null
  // New indicator fields for AI Decision Engine UI
  gold_trend: string
  inflation: string
  sentiment: string
  technical: string
  gold_price: number
  gold_24h_change: number
  market_data: {
    gold_price_usd: number
    gold_24h_change: number
    inflation_rate: number
    market_sentiment: string
  }
  created_at: string
  executed: boolean
}

// Smart AI decision logic based on market conditions
function generateAIDecision(
  marketData: {
    gold_price_usd: number
    gold_24h_change: number
    inflation_rate: number
    market_sentiment: string
  },
  portfolio: {
    usdt_balance: number
    xaut_balance: number
  }
): Omit<AIDecision, 'id' | 'created_at' | 'executed' | 'market_data'> & { gold_trend: string; inflation: string; sentiment: string; technical: string } {
  const xautValueUsd = portfolio.xaut_balance * marketData.gold_price_usd
  const totalValue = portfolio.usdt_balance + xautValueUsd
  const usdtPercentage = totalValue > 0 ? (portfolio.usdt_balance / totalValue) * 100 : 50
  const xautPercentage = totalValue > 0 ? (xautValueUsd / totalValue) * 100 : 50

  // Decision logic based on multiple factors
  let decision: 'hold' | 'swap_to_usdt' | 'swap_to_xaut' = 'hold'
  let confidence = 50
  let reasoning = ''
  let suggestedSwapPercentage: number | null = null

  // Factor 1: Gold price movement
  const goldTrending = marketData.gold_24h_change > 0.5 ? 'up' : marketData.gold_24h_change < -0.5 ? 'down' : 'stable'
  
  // Factor 2: Inflation rate
  const inflationHigh = marketData.inflation_rate > 3.0
  
  // Factor 3: Current allocation
  const heavyUsdt = usdtPercentage > 70
  const heavyXaut = xautPercentage > 70
  const balanced = usdtPercentage >= 30 && usdtPercentage <= 70

  // Decision making
  if (inflationHigh && goldTrending === 'up' && heavyUsdt) {
    decision = 'swap_to_xaut'
    confidence = 78 + Math.floor(Math.random() * 12)
    suggestedSwapPercentage = 25 + Math.floor(Math.random() * 15)
    reasoning = `Inflation at ${marketData.inflation_rate}% is above target, and gold is showing positive momentum (+${marketData.gold_24h_change.toFixed(2)}%). With ${usdtPercentage.toFixed(0)}% of portfolio in USDT, recommend allocating more to gold as an inflation hedge. Suggested swap: ${suggestedSwapPercentage}% of USDT holdings.`
  } else if (goldTrending === 'down' && marketData.gold_24h_change < -1.5 && heavyXaut) {
    decision = 'swap_to_usdt'
    confidence = 72 + Math.floor(Math.random() * 10)
    suggestedSwapPercentage = 20 + Math.floor(Math.random() * 10)
    reasoning = `Gold is declining (${marketData.gold_24h_change.toFixed(2)}% in 24h) and your portfolio is ${xautPercentage.toFixed(0)}% in XAUT. Consider taking some profits and rebalancing to USDT. Suggested swap: ${suggestedSwapPercentage}% of XAUT holdings.`
  } else if (balanced && goldTrending === 'stable') {
    decision = 'hold'
    confidence = 85 + Math.floor(Math.random() * 10)
    reasoning = `Portfolio is well-balanced (${usdtPercentage.toFixed(0)}% USDT / ${xautPercentage.toFixed(0)}% XAUT) and market is stable. Current allocation provides good protection against inflation while maintaining liquidity. No action recommended.`
  } else if (marketData.market_sentiment === 'bullish' && usdtPercentage > 50) {
    decision = 'swap_to_xaut'
    confidence = 65 + Math.floor(Math.random() * 15)
    suggestedSwapPercentage = 15 + Math.floor(Math.random() * 10)
    reasoning = `Market sentiment is ${marketData.market_sentiment} with gold at $${marketData.gold_price_usd.toFixed(2)}/oz. Consider increasing gold exposure for potential upside while maintaining inflation protection.`
  } else {
    decision = 'hold'
    confidence = 70 + Math.floor(Math.random() * 15)
    reasoning = `Current market conditions are mixed. Gold is ${goldTrending} (${marketData.gold_24h_change > 0 ? '+' : ''}${marketData.gold_24h_change.toFixed(2)}%) and inflation is at ${marketData.inflation_rate}%. Your current allocation of ${usdtPercentage.toFixed(0)}% USDT / ${xautPercentage.toFixed(0)}% XAUT is appropriate. Monitoring for better entry points.`
  }

  return {
    decision,
    confidence,
    reasoning,
    suggested_swap_percentage: suggestedSwapPercentage,
  }
}

async function getDemoDecisions(): Promise<AIDecision[]> {
  const cookieStore = await cookies()
  const decisionsCookie = cookieStore.get(DEMO_DECISIONS_COOKIE)
  
  if (decisionsCookie) {
    try {
      return JSON.parse(decisionsCookie.value)
    } catch {
      return []
    }
  }
  
  return []
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { portfolio, market_data } = body

    // Use provided market data or fetch from our market API
    const marketData = market_data || {
      gold_price_usd: 2650 + (Math.random() - 0.5) * 50,
      gold_24h_change: (Math.random() - 0.3) * 3,
      inflation_rate: 3.2,
      market_sentiment: 'neutral',
    }

    const portfolioData = portfolio || {
      usdt_balance: 1000,
      xaut_balance: 0.15,
    }

    // Generate AI decision
    const decisionResult = generateAIDecision(marketData, portfolioData)
    
    const newDecision: AIDecision = {
      id: `decision-${Date.now()}`,
      ...decisionResult,
      market_data: marketData,
      created_at: new Date().toISOString(),
      executed: false,
    }

    // Get existing decisions and add new one
    const existingDecisions = await getDemoDecisions()
    const updatedDecisions = [newDecision, ...existingDecisions].slice(0, 20)

    // Create response with cookie
    const response = NextResponse.json({
      success: true,
      decision: newDecision,
      demo: true,
    })

    response.cookies.set(DEMO_DECISIONS_COOKIE, JSON.stringify(updatedDecisions), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    })

    return response
  } catch (error) {
    console.error('AI Decision Error:', error)
    return NextResponse.json(
      { error: 'Failed to generate AI decision' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const decisions = await getDemoDecisions()
    
    // If no decisions, generate some demo history
    if (decisions.length === 0) {
      const demoHistory: AIDecision[] = [
        {
          id: 'decision-demo-1',
          decision: 'swap_to_xaut',
          confidence: 82,
          reasoning: 'Inflation at 3.4% is above target. Gold showing strong momentum. Recommended increasing gold allocation for inflation protection.',
          suggested_swap_percentage: 30,
          market_data: {
            gold_price_usd: 2620,
            gold_24h_change: 1.2,
            inflation_rate: 3.4,
            market_sentiment: 'bullish',
          },
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          executed: true,
        },
        {
          id: 'decision-demo-2',
          decision: 'hold',
          confidence: 88,
          reasoning: 'Portfolio well-balanced at 71% USDT / 29% XAUT. Market stable. Maintaining current allocation.',
          suggested_swap_percentage: null,
          market_data: {
            gold_price_usd: 2645,
            gold_24h_change: 0.3,
            inflation_rate: 3.2,
            market_sentiment: 'neutral',
          },
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          executed: false,
        },
      ]
      
      return NextResponse.json({
        success: true,
        decisions: demoHistory,
        demo: true,
      })
    }
    
    return NextResponse.json({
      success: true,
      decisions,
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
