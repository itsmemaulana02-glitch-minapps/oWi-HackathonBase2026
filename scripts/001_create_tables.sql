-- OWi Database Schema
-- Anti-Inflation Savings App with AI Auto-Swap

-- User profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  wallet_address TEXT,
  display_name TEXT,
  risk_level TEXT DEFAULT 'low' CHECK (risk_level IN ('low', 'medium', 'high')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User portfolios - tracks current holdings
CREATE TABLE IF NOT EXISTS public.portfolios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  usdt_balance DECIMAL(20, 6) DEFAULT 0,
  xaut_balance DECIMAL(20, 8) DEFAULT 0,
  total_value_usd DECIMAL(20, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Deposits and withdrawals
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('deposit', 'withdrawal', 'swap')),
  from_token TEXT,
  to_token TEXT,
  amount DECIMAL(20, 8) NOT NULL,
  amount_received DECIMAL(20, 8),
  tx_hash TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI decision logs - transparency for users
CREATE TABLE IF NOT EXISTS public.ai_decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  decision TEXT NOT NULL CHECK (decision IN ('hold', 'swap_to_xaut', 'swap_to_usdt')),
  reasoning TEXT NOT NULL,
  market_data JSONB,
  confidence_score DECIMAL(3, 2),
  executed BOOLEAN DEFAULT FALSE,
  transaction_id UUID REFERENCES public.transactions(id),
  x402_fee_paid DECIMAL(10, 6),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Market data cache for AI decisions
CREATE TABLE IF NOT EXISTS public.market_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gold_price_usd DECIMAL(12, 2),
  gold_24h_change DECIMAL(8, 4),
  inflation_rate DECIMAL(6, 4),
  market_sentiment TEXT CHECK (market_sentiment IN ('bullish', 'bearish', 'neutral')),
  fetched_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_data ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for portfolios
CREATE POLICY "portfolios_select_own" ON public.portfolios FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "portfolios_insert_own" ON public.portfolios FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "portfolios_update_own" ON public.portfolios FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for transactions
CREATE POLICY "transactions_select_own" ON public.transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "transactions_insert_own" ON public.transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for ai_decisions
CREATE POLICY "ai_decisions_select_own" ON public.ai_decisions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "ai_decisions_insert_own" ON public.ai_decisions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Market data is readable by all authenticated users
CREATE POLICY "market_data_select_all" ON public.market_data FOR SELECT TO authenticated USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_portfolios_user_id ON public.portfolios(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON public.transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_decisions_user_id ON public.ai_decisions(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_decisions_created_at ON public.ai_decisions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_market_data_fetched_at ON public.market_data(fetched_at DESC);
