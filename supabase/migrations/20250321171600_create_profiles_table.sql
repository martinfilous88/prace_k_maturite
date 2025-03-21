-- Create profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    username TEXT NOT NULL,
    email TEXT NOT NULL,
    total_spend DECIMAL DEFAULT 0,
    level INTEGER DEFAULT 1,
    progress DECIMAL DEFAULT 0,
    owned_games JSONB DEFAULT '[]'::JSONB,
    wheel_prizes JSONB DEFAULT '[]'::JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
