import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// Demo portfolio storage (in-memory, resets on server restart)
// In production this would be in the database
const DEMO_PORTFOLIO_COOKIE = 'owi_demo_portfolio'

interface DemoPortfolio {
  usdt_balance: number
  xaut_balance: number
  updated_at: string
}

function getDefaultPortfolio(): DemoPortfolio {
  return {
    usdt_balance: 1000, // Start with $1000 USDT for demo
    xaut_balance: 0.15, // And some gold (~$400)
    updated_at: new Date().toISOString(),
  }
}

async function getDemoPortfolio(): Promise<DemoPortfolio> {
  const cookieStore = await cookies()
  const portfolioCookie = cookieStore.get(DEMO_PORTFOLIO_COOKIE)
  
  if (portfolioCookie) {
    try {
      return JSON.parse(portfolioCookie.value)
    } catch {
      return getDefaultPortfolio()
    }
  }
  
  return getDefaultPortfolio()
}

export async function GET() {
  try {
    const portfolio = await getDemoPortfolio()
    
    // Calculate total value (need gold price)
    const goldPrice = 2650 // Use approximate price
    const xautValueUsd = portfolio.xaut_balance * goldPrice
    const totalValueUsd = portfolio.usdt_balance + xautValueUsd
    
    return NextResponse.json({
      success: true,
      portfolio: {
        ...portfolio,
        total_value_usd: parseFloat(totalValueUsd.toFixed(2)),
        xaut_value_usd: parseFloat(xautValueUsd.toFixed(2)),
      },
      demo: true,
    })
  } catch (error) {
    console.error('Portfolio error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch portfolio' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { action, amount, asset } = body
    
    const portfolio = await getDemoPortfolio()
    const goldPrice = 2650

    let newPortfolio = { ...portfolio }

    if (action === 'deposit' && asset === 'USDT') {
      newPortfolio.usdt_balance += amount
      newPortfolio.updated_at = new Date().toISOString()
    }

    if (action === 'withdraw' && asset === 'USDT') {
      if (amount > portfolio.usdt_balance) {
        return NextResponse.json(
          { error: 'Insufficient USDT balance' },
          { status: 400 }
        )
      }
      newPortfolio.usdt_balance -= amount
      newPortfolio.updated_at = new Date().toISOString()
    }

    if (action === 'withdraw' && asset === 'XAUT') {
      if (amount > portfolio.xaut_balance) {
        return NextResponse.json(
          { error: 'Insufficient XAUT balance' },
          { status: 400 }
        )
      }
      newPortfolio.xaut_balance -= amount
      newPortfolio.updated_at = new Date().toISOString()
    }

    // Calculate total value
    const xautValueUsd = newPortfolio.xaut_balance * goldPrice
    const totalValueUsd = newPortfolio.usdt_balance + xautValueUsd

    // Create response with cookie
    const response = NextResponse.json({
      success: true,
      portfolio: {
        ...newPortfolio,
        total_value_usd: parseFloat(totalValueUsd.toFixed(2)),
        xaut_value_usd: parseFloat(xautValueUsd.toFixed(2)),
      },
      demo: true,
    })

    // Store in cookie for persistence across requests
    response.cookies.set(DEMO_PORTFOLIO_COOKIE, JSON.stringify(newPortfolio), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error) {
    console.error('Portfolio update error:', error)
    return NextResponse.json(
      { error: 'Failed to update portfolio' },
      { status: 500 }
    )
  }
}
