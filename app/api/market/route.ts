import { NextResponse } from 'next/server'

// Demo market data generator - realistic simulation
function generateDemoMarketData() {
  // Base gold price around current market levels
  const baseGoldPrice = 2650
  const hour = new Date().getHours()
  
  // Add some time-based variation for realism
  const timeVariation = Math.sin(hour / 24 * Math.PI * 2) * 30
  const randomVariation = (Math.random() - 0.5) * 40
  const goldPrice = baseGoldPrice + timeVariation + randomVariation
  
  // 24h change based on slightly bullish bias (gold tends to rise with inflation)
  const gold24hChange = (Math.random() - 0.3) * 3
  
  // Current US inflation rate (realistic)
  const inflationRate = 3.2 + (Math.random() - 0.5) * 0.4
  
  // Market sentiment based on gold movement
  let marketSentiment: 'bullish' | 'bearish' | 'neutral' = 'neutral'
  if (gold24hChange > 0.5) marketSentiment = 'bullish'
  else if (gold24hChange < -0.5) marketSentiment = 'bearish'

  return {
    id: `demo-${Date.now()}`,
    gold_price_usd: parseFloat(goldPrice.toFixed(2)),
    gold_24h_change: parseFloat(gold24hChange.toFixed(2)),
    inflation_rate: parseFloat(inflationRate.toFixed(1)),
    market_sentiment: marketSentiment,
    fetched_at: new Date().toISOString(),
  }
}

export async function GET() {
  try {
    const marketData = generateDemoMarketData()
    
    return NextResponse.json({
      success: true,
      data: marketData,
      cached: false,
      demo: true,
    })
  } catch (error) {
    console.error('Market data error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch market data' },
      { status: 500 }
    )
  }
}
