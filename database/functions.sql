-- Funkce pro inkrementaci celkové útraty uživatele
CREATE OR REPLACE FUNCTION increment_spend(user_id UUID, amount NUMERIC)
RETURNS NUMERIC
LANGUAGE plpgsql
AS $$
DECLARE
  current_spend NUMERIC;
  new_spend NUMERIC;
BEGIN
  -- Získáme aktuální útratu
  SELECT total_spend INTO current_spend FROM profiles WHERE id = user_id;
  
  -- Vypočítáme novou útratu
  new_spend := COALESCE(current_spend, 0) + amount;
  
  -- Aktualizujeme profil
  UPDATE profiles 
  SET 
    total_spend = new_spend,
    level = FLOOR(new_spend / 1000) + 1,
    progress = ((new_spend % 1000) / 1000) * 100,
    updated_at = NOW()
  WHERE id = user_id;
  
  RETURN new_spend;
END;
$$;

-- Funkce pro získání úrovně uživatele na základě celkové útraty
CREATE OR REPLACE FUNCTION calculate_user_level(total_spend NUMERIC)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN FLOOR(total_spend / 1000) + 1;
END;
$$;

-- Funkce pro získání postupu k další úrovni
CREATE OR REPLACE FUNCTION calculate_user_progress(total_spend NUMERIC)
RETURNS NUMERIC
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN ((total_spend % 1000) / 1000) * 100;
END;
$$;
