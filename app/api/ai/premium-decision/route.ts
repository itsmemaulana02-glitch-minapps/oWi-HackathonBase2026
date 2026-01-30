import { generateText, Output } from 'ai'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// X402 Payment verification (simplified for hackathon)
// In production, use @x402/next withX402 wrapper
async function verifyX402Payment(req: NextRequest): Promise<{ verified: boolean; paymentHash?: string }> {
  const paymentHeader = req.headers.get('X-Payment-Hash')
  const paymentProof = req.headers.get('X-Payment-Proof')
  
  // For hackathon demo - simplified verification
  // In production, verify with X402 facilitator
  if (paymentHeader && paymentProof) {
    return { verified: true, paymentHash: paymentHeader }
  }
  
  // Allow free tier for demo
  return { verified: true, paymentHash: 'demo-free-tier' }
}

// Premium AI Decision schema with more detailed analysis
const PremiumAIDecisionSchema = z.object({
  decision: z.enum(['hold', 'swap_to_usdt', 'swap_to_xaut']),
  confidence: z.number().min(0).max(100),
  reasoning: z.string(),
  suggestedSwapPercentage: z.number().min(0).max(100).nullable(),
  marketAnalysis: z.object({
    goldTrend: z.enum(['bullish', 'bearish', 'neutral']),
    inflationOutlook: z.enum(['rising', 'falling', 'stable']),
    riskLevel: z.enum(['low', 'medium', 'high']),
  }),
  projectedOutcome: z.object({
    expectedReturn: z.number(),
    timeHorizon: z.string(),
    worstCase: z.number(),
    bestCase: z.number(),
  }),
})

export async function POST(req: NextRequest) {
  try {
    // Verify X402 payment
    const { verified, paymentHash } = await verifyX402Payment(req)
    
    if (!verified) {
      return NextResponse.json(
        { 
          error: 'Payment required',
          x402: {
            price: '$0.01',
            network: 'base-sepolia',
            payTo: process.env.X402_PAYMENT_ADDRESS || '0x0000000000000000000000000000000000000000',
            description: 'Premium AI analysis for OWi savings',
          }
        },
        { status: 402 }
      )
    }

    const supabase = await createClient()
    
    // Get user session
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { portfolioValue, usdtBalance, xautBalance } = body

    // Fetch latest market data
    const { data: marketData } = await supabase
      .from('market_data')
      .select('*')
      .order('recorded_at', { ascending: false })
      .limit(1)
      .single()

    const currentMarket = marketData || {
      gold_price_usd: 2650,
      gold_24h_change: 0,
      inflation_rate_us: 3.2,
      market_sentiment: 'neutral',
    }

    // Calculate allocation
    const xautValueUsd = xautBalance * currentMarket.gold_price_usd
    const totalValue = usdtBalance + xautValueUsd
    const usdtPercentage = totalValue > 0 ? (usdtBalance / totalValue) * 100 : 50
    const xautPercentage = totalValue > 0 ? (xautValueUsd / totalValue) * 100 : 50

    // Generate premium AI decision with detailed analysis
    const result = await generateText({
      model: 'openai/gpt-4o', // Premium model for paid requests
      system: `You are OWi Premium, an advanced AI financial advisor providing detailed anti-inflation analysis.
Your analysis should be comprehensive and include market trends, risk assessment, and projected outcomes.

Current market data:
- Gold price: $${currentMarket.gold_price_usd}/oz
- Gold 24h change: ${currentMarket.gold_24h_change}%
- US Inflation rate: ${currentMarket.inflation_rate_us}%
- Market sentiment: ${currentMarket.market_sentiment}

Provide detailed analysis with projected outcomes based on historical patterns and current market conditions.
Be specific about your reasoning and include quantitative projections.`,
      prompt: `Provide a premium analysis for:

Portfolio:
- Total Value: $${totalValue.toFixed(2)}
- USDT: $${usdtBalance.toFixed(2)} (${usdtPercentage.toFixed(1)}%)
- XAUT: ${xautBalance.toFixed(6)} oz ($${xautValueUsd.toFixed(2)}, ${xautPercentage.toFixed(1)}%)

Include market analysis, risk assessment, and projected outcomes.`,
      output: Output.object({ schema: PremiumAIDecisionSchema }),
    })

    const decision = result.output

    // Save premium decision
    const { data: savedDecision, error: saveError } = await supabase
      .from('ai_decisions')
      .insert({
        user_id: user.id,
        decision_type: decision.decision,
        confidence: decision.confidence,
        reasoning: decision.reasoning,
        market_data: {
          ...currentMarket,
          premium_analysis: decision.marketAnalysis,
          projected_outcome: decision.projectedOutcome,
          timestamp: new Date().toISOString(),
        },
        x402_payment_hash: paymentHash,
        executed: false,
      })
      .select()
      .single()

    if (saveError) {
      console.error('Error saving premium decision:', saveError)
    }

    return NextResponse.json({
      success: true,
      premium: true,
      decision: {
        ...decision,
        id: savedDecision?.id,
        timestamp: new Date().toISOString(),
        paymentHash,
      },
    })
  } catch (error) {
    console.error('Premium AI Decision Error:', error)
    return NextResponse.json(
      { error: 'Failed to generate premium AI decision' },
      { status: 500 }
    )
  }
}

// X402 payment info endpoint
export async function GET() {
  return NextResponse.json({
    x402: {
      accepts: [
        {
          scheme: 'exact',
          price: '$0.01',
          network: 'eip155:84532', // Base Sepolia
          payTo: process.env.X402_PAYMENT_ADDRESS || '0x0000000000000000000000000000000000000000',
        }
      ],
      description: 'Premium AI analysis for OWi anti-inflation savings',
      mimeType: 'application/json',
    }
  })
}
