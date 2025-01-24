import { createClient } from '@supabase/supabase-js';
import { toast } from 'react-hot-toast';

console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Supabase Anon Key:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Přítomen' : 'Chybí');

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Chybí Supabase proměnné prostředí');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Funkce pro vytvoření tabulky her, pokud neexistuje
export const ensureGamesTable = async () => {
  try {
    // Nejprve zkontrolujeme, zda tabulka existuje
    const { error: checkError } = await supabase
      .from('games')
      .select('id', { count: 'exact' });

    // Pokud tabulka neexistuje, vytvoříme ji
    if (checkError && checkError.code === 'PGRST116') {
      console.log('Tabulka games neexistuje, vytváření...');

      // Vytvoření tabulky
      const { error: createError } = await supabase.rpc('create_games_table');

      if (createError) {
        console.error('Chyba při vytváření tabulky:', createError);
        toast.error(`Chyba vytvoření tabulky: ${createError.message}`);
        return false;
      }

      // Vložení vzorových dat
      const homepageGames = [
        {
          id: 'disc1',
          title: 'Středověká Bitva',
          price: 399,
          imageUrl: 'https://images.unsplash.com/photo-1519872775884-d120267933ba?w=800',
          genre: 'Action',
          description: 'Epické bitvy ve středověkém prostředí plném strategie a dobrodružství.',
          shortDescription: 'Strategická hra o válečnictví',
          ageRating: 16
        },
        // ... další hry
      ];

      const { error: insertError } = await supabase.from('games').insert(homepageGames);

      if (insertError) {
        console.error('Chyba při vkládání her:', insertError);
        toast.error(`Chyba vložení her: ${insertError.message}`);
        return false;
      }

      return true;
    }

    return true;
  } catch (error) {
    console.error('Kritická chyba při vytváření tabulky:', error);
    toast.error('Nepodařilo se vytvořit tabulku her');
    return false;
  }
};

// Zjednodušená funkce pro testování připojení
export const testSupabaseConnection = async () => {
  try {
    console.log('Testování připojení Supabase...');
    
    // Nejprve zajistíme existenci tabulky
    await ensureGamesTable();
    
    const { data, error } = await supabase
      .from('games')
      .select('*');
    
    if (error) {
      console.error('Chyba připojení:', error);
      toast.error(`Chyba připojení: ${error.message}`);
      return false;
    }
    
    console.log('Počet her:', data?.length || 0);
    return true;
  } catch (error) {
    console.error('Kritická chyba:', error);
    toast.error('Nepodařilo se připojit k databázi');
    return false;
  }
};