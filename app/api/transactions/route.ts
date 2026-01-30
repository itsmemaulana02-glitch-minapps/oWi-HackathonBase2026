import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const DEMO_TRANSACTIONS_COOKIE = 'owi_demo_transactions'

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

async function getDemoTransactions(): Promise<Transaction[]> {
  const cookieStore = await cookies()
  const txCookie = cookieStore.get(DEMO_TRANSACTIONS_COOKIE)
  
  if (txCookie) {
    try {
      return JSON.parse(txCookie.value)
    } catch {
      return generateDemoHistory()
    }
  }
  
  return generateDemoHistory()
}

function generateDemoHistory(): Transaction[] {
  const now = Date.now()
  
  return [
    {
      id: 'tx-demo-1',
      type: 'deposit',
      to_asset: 'USDT',
      to_amount: 1000,
      status: 'completed',
      created_at: new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'tx-demo-2',
      type: 'swap',
      from_asset: 'USDT',
      from_amount: 250,
      to_asset: 'XAUT',
      to_amount: 0.094,
      fee: 0.75,
      status: 'completed',
      created_at: new Date(now - 5 * 24 * 60 * 60 * 1000).toISOString(),
      ai_triggered: true,
    },
    {
      id: 'tx-demo-3',
      type: 'swap',
      from_asset: 'USDT',
      from_amount: 150,
      to_asset: 'XAUT',
      to_amount: 0.056,
      fee: 0.45,
      status: 'completed',
      created_at: new Date(now - 3 * 24 * 60 * 60 * 1000).toISOString(),
      ai_triggered: true,
    },
    {
      id: 'tx-demo-4',
      type: 'deposit',
      to_asset: 'USDT',
      to_amount: 500,
      status: 'completed',
      created_at: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'tx-demo-5',
      type: 'swap',
      from_asset: 'XAUT',
      from_amount: 0.02,
      to_asset: 'USDT',
      to_amount: 52.84,
      fee: 0.16,
      status: 'completed',
      created_at: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString(),
      ai_triggered: false,
    },
  ]
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type')
    const limit = parseInt(searchParams.get('limit') || '50')
    
    let transactions = await getDemoTransactions()
    
    // Filter by type if specified
    if (type && type !== 'all') {
      transactions = transactions.filter(t => t.type === type)
    }
    
    // Limit results
    transactions = transactions.slice(0, limit)
    
    return NextResponse.json({
      success: true,
      transactions,
      pagination: {
        total: transactions.length,
        limit,
        offset: 0,
        hasMore: false,
      },
      demo: true,
    })
  } catch (error) {
    console.error('Transactions fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    )
  }
}
