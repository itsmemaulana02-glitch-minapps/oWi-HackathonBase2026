import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const DEMO_PORTFOLIO_COOKIE = 'owi_demo_portfolio'
const DEMO_TRANSACTIONS_COOKIE = 'owi_demo_transactions'
const SWAP_FEE_PERCENT = 0.3 // 0.3% swap fee

interface DemoPortfolio {
  usdt_balance: number
  xaut_balance: number
  updated_at: string
}

interface Transaction {
  id: string
  type: 'swap' | 'deposit' | 'withdraw'
  from_asset?: string
  from_amount?: number
  to_asset?: string
  to_amount?: number
  fee?: number
  status: 'completed' | 'pending' | 'failed'
  created_at: string
  ai_triggered?: boolean
}

async function getDemoPortfolio(): Promise<DemoPortfolio> {
  const cookieStore = await cookies()
  const portfolioCookie = cookieStore.get(DEMO_PORTFOLIO_COOKIE)
  
  if (portfolioCookie) {
    try {
      return JSON.parse(portfolioCookie.value)
    } catch {
      // Default portfolio
    }
  }
  
  return {
    usdt_balance: 1000,
    xaut_balance: 0.15,
    updated_at: new Date().toISOString(),
  }
}

async function getDemoTransactions(): Promise<Transaction[]> {
  const cookieStore = await cookies()
  const txCookie = cookieStore.get(DEMO_TRANSACTIONS_COOKIE)
  
  if (txCookie) {
    try {
      return JSON.parse(txCookie.value)
    } catch {
      return []
    }
  }
  
  // Generate some demo history
  return [
    {
      id: 'tx-demo-1',
      type: 'deposit',
      to_asset: 'USDT',
      to_amount: 1000,
      status: 'completed',
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'tx-demo-2',
      type: 'swap',
      from_asset: 'USDT',
      from_amount: 400,
      to_asset: 'XAUT',
      to_amount: 0.15,
      fee: 1.2,
      status: 'completed',
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      ai_triggered: true,
    },
  ]
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { from_asset, to_asset, amount, gold_price, ai_triggered } = body
    
    // Validate input
    if (!from_asset || !to_asset || !amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid swap parameters' },
        { status: 400 }
      )
    }
    
    const portfolio = await getDemoPortfolio()
    const transactions = await getDemoTransactions()
    const currentGoldPrice = gold_price || 2650
    
    const newPortfolio = { ...portfolio }
    let toAmount = 0
    let fee = 0
    
    // USDT -> XAUT
    if (from_asset === 'USDT' && to_asset === 'XAUT') {
      if (amount > portfolio.usdt_balance) {
        return NextResponse.json(
          { error: 'Insufficient USDT balance' },
          { status: 400 }
        )
      }
      
      fee = amount * (SWAP_FEE_PERCENT / 100)
      const amountAfterFee = amount - fee
      toAmount = amountAfterFee / currentGoldPrice
      
      newPortfolio.usdt_balance -= amount
      newPortfolio.xaut_balance += toAmount
    }
    // XAUT -> USDT
    else if (from_asset === 'XAUT' && to_asset === 'USDT') {
      if (amount > portfolio.xaut_balance) {
        return NextResponse.json(
          { error: 'Insufficient XAUT balance' },
          { status: 400 }
        )
      }
      
      const usdValue = amount * currentGoldPrice
      fee = usdValue * (SWAP_FEE_PERCENT / 100)
      toAmount = usdValue - fee
      
      newPortfolio.xaut_balance -= amount
      newPortfolio.usdt_balance += toAmount
    } else {
      return NextResponse.json(
        { error: 'Invalid asset pair' },
        { status: 400 }
      )
    }
    
    newPortfolio.updated_at = new Date().toISOString()
    
    // Create transaction record
    const newTransaction: Transaction = {
      id: `tx-${Date.now()}`,
      type: 'swap',
      from_asset,
      from_amount: amount,
      to_asset,
      to_amount: parseFloat(toAmount.toFixed(6)),
      fee: parseFloat(fee.toFixed(4)),
      status: 'completed',
      created_at: new Date().toISOString(),
      ai_triggered: ai_triggered || false,
    }
    
    const updatedTransactions = [newTransaction, ...transactions].slice(0, 50) // Keep last 50
    
    // Calculate new total value
    const xautValueUsd = newPortfolio.xaut_balance * currentGoldPrice
    const totalValueUsd = newPortfolio.usdt_balance + xautValueUsd
    
    // Create response with updated cookies
    const response = NextResponse.json({
      success: true,
      swap: {
        from_asset,
        from_amount: amount,
        to_asset,
        to_amount: parseFloat(toAmount.toFixed(6)),
        fee: parseFloat(fee.toFixed(4)),
        rate: currentGoldPrice,
      },
      portfolio: {
        ...newPortfolio,
        total_value_usd: parseFloat(totalValueUsd.toFixed(2)),
        xaut_value_usd: parseFloat(xautValueUsd.toFixed(2)),
      },
      transaction: newTransaction,
      demo: true,
    })
    
    // Update cookies
    response.cookies.set(DEMO_PORTFOLIO_COOKIE, JSON.stringify(newPortfolio), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    })
    
    response.cookies.set(DEMO_TRANSACTIONS_COOKIE, JSON.stringify(updatedTransactions), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    })
    
    return response
  } catch (error) {
    console.error('Swap error:', error)
    return NextResponse.json(
      { error: 'Failed to execute swap' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const transactions = await getDemoTransactions()
    
    return NextResponse.json({
      success: true,
      transactions: transactions.filter(t => t.type === 'swap'),
      demo: true,
    })
  } catch (error) {
    console.error('Swap history error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch swap history' },
      { status: 500 }
    )
  }
}
