-- Auto-create profile and portfolio when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (id, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;

  -- Create empty portfolio
  INSERT INTO public.portfolios (user_id)
  VALUES (NEW.id)
  ON CONFLICT DO NOTHING;

  RETURN NEW;
END;
$$;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to update portfolio total value
CREATE OR REPLACE FUNCTION public.update_portfolio_value()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_gold_price DECIMAL(12, 2);
BEGIN
  -- Get latest gold price
  SELECT gold_price_usd INTO current_gold_price
  FROM public.market_data
  ORDER BY fetched_at DESC
  LIMIT 1;

  -- Default gold price if no market data
  IF current_gold_price IS NULL THEN
    current_gold_price := 2650.00;
  END IF;

  -- Update total value
  NEW.total_value_usd := NEW.usdt_balance + (NEW.xaut_balance * current_gold_price);
  NEW.updated_at := NOW();

  RETURN NEW;
END;
$$;

-- Trigger to auto-calculate portfolio value
DROP TRIGGER IF EXISTS on_portfolio_update ON public.portfolios;
CREATE TRIGGER on_portfolio_update
  BEFORE UPDATE ON public.portfolios
  FOR EACH ROW
  EXECUTE FUNCTION public.update_portfolio_value();
