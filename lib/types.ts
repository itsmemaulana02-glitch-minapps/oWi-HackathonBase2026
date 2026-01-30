export type AssetType = 'USDT' | 'XAUT'

export interface Portfolio {
  id: string
  user_id: string
  usdt_balance: number
  xaut_balance: number
  total_value_usd: number
  created_at: string
  updated_at: string
}

export interface Transaction {
  id: string
  user_id: string
  type: 'deposit' | 'withdraw' | 'swap'
  from_asset: AssetType | null
  to_asset: AssetType | null
  from_amount: number
  to_amount: number
  tx_hash: string | null
  status: 'pending' | 'completed' | 'failed'
  created_at: string
}

export interface AIDecision {
  id: string
  user_id: string
  decision_type: 'hold' | 'swap_to_usdt' | 'swap_to_xaut'
  confidence: number
  reasoning: string
  market_data: MarketDataSnapshot
  executed: boolean
  execution_tx_hash: string | null
  x402_payment_hash: string | null
  created_at: string
}

export interface MarketDataSnapshot {
  gold_price_usd: number
  gold_24h_change: number
  inflation_rate: number
  market_sentiment: 'bullish' | 'bearish' | 'neutral'
  timestamp: string
}

export interface MarketData {
  id: string
  gold_price_usd: number
  gold_24h_change: number
  usdt_price: number
  inflation_rate_us: number
  market_sentiment: 'bullish' | 'bearish' | 'neutral'
  recorded_at: string
}

export interface UserProfile {
  id: string
  wallet_address: string | null
  display_name: string | null
  risk_level: 'low' | 'medium' | 'high'
  auto_swap_enabled: boolean
  created_at: string
  updated_at: string
}

// AI Decision Request/Response
export interface AIDecisionRequest {
  portfolioValue: number
  currentAllocation: {
    usdt: number
    xaut: number
  }
  marketData: MarketData
}

export interface AIDecisionResponse {
  decision: 'hold' | 'swap_to_usdt' | 'swap_to_xaut'
  confidence: number
  reasoning: string
  suggestedAmount?: number
}

// X402 Types
export interface X402PaymentInfo {
  price: string
  network: string
  payTo: string
  description: string
}
