-- Vytvoření tabulky games
CREATE TABLE games (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  genre TEXT,
  price NUMERIC NOT NULL,
  "imageUrl" TEXT,
  "shortDescription" TEXT,
  "ageRating" INTEGER
);

-- Vložení vzorových her
INSERT INTO games (id, title, description, genre, price, "imageUrl", "shortDescription", "ageRating")
VALUES 
  ('disc1', 'Středověká Bitva', 'Epické bitvy ve středověkém prostředí plném strategie a dobrodružství.', 'Action', 399, 'https://images.unsplash.com/photo-1519872775884-d120267933ba?w=800', 'Strategická hra o válečnictví', 16),
  ('disc2', 'Vesmírná Kolonie', 'Postav a spravuj vlastní vesmírnou kolonii v nejnáročnějších podmínkách.', 'Simulation', 299, 'https://images.unsplash.com/photo-1614850523060-8da1a1d5ac1a?w=800', 'Simulace vesmírné kolonizace', 12),
  ('disc3', 'Zombie Apokalypsa', 'Přežij apokalypsu plnou nebezpečných zombií v otevřeném světě.', 'Survival Horror', 349, 'https://images.unsplash.com/photo-1601933463674-24ae4b4da4d8?w=800', 'Přežití v zombie světě', 18),
  ('upcoming1', 'Vesmírní Průzkumníci', 'Prozkoumejte nekonečný vesmír v této epické sci-fi adventuře.', 'Sci-fi Adventure', 499, 'https://images.unsplash.com/photo-1581822261290-991b38693d1b?w=800', 'Dobrodružství ve vesmíru', 12),
  ('upcoming2', 'Lesní Království', 'Magický svět plný tajemství a kouzel čeká na své objevení.', 'Fantasy RPG', 499, 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800', 'Fantasy RPG dobrodružství', 12),
  ('new1', 'Pirátské Dobrodružství', 'Dobrodružství na moři plné nečekaných zvratů.', 'Action Adventure', 599, 'https://images.unsplash.com/photo-1603526206295-9a2e0255c87b?w=800', 'Pirátské dobrodružství', 16),
  ('new2', 'Městský Architekt', 'Navrhněte a spravujte vlastní metropoli.', 'Simulation', 499, 'https://images.unsplash.com/photo-1486325212027-882707db888b?w=800', 'Simulace městské správy', 12);
