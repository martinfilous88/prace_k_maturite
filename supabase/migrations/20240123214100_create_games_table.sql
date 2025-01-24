-- Vytvoření tabulky games
CREATE TABLE public.games (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    genre TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Přidání některých defaultních her
INSERT INTO public.games (title, description, price, genre, image_url) VALUES
    ('Pouštní Válečník', 'Epická strategie v pouštním prostředí', 499.00, 'Strategie', 'https://via.placeholder.com/300x200?text=Pouštní+Válečník'),
    ('Vesmírná Kolonie', 'Budujte a spravujte meziplanetární kolonii', 599.00, 'Simulátor', 'https://via.placeholder.com/300x200?text=Vesmírná+Kolonie');
