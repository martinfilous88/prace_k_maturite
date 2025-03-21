-- Vytvoření tabulky profilů
CREATE OR REPLACE FUNCTION create_profiles_table()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    username TEXT,
    email TEXT,
    phone TEXT,
    age INTEGER,
    total_spend NUMERIC DEFAULT 0,
    level INTEGER DEFAULT 1,
    progress NUMERIC DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
END;
$$;

-- Vytvoření tabulky objednávek
CREATE OR REPLACE FUNCTION create_orders_table()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    total NUMERIC NOT NULL,
    status TEXT DEFAULT 'pending',
    items JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
END;
$$;

-- Trigger pro automatické vytvoření profilu při registraci
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger 
LANGUAGE plpgsql 
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, email, created_at, updated_at)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)), 
    NEW.email,
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$;

-- Vytvoření triggeru pro nové uživatele
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
