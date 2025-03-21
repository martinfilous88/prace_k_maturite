import { createClient } from '@supabase/supabase-js';
import { toast } from 'react-hot-toast';

// Explicitně definujeme URL a klíč pro případ, že by proměnné prostředí nefungovaly
const FALLBACK_URL = 'https://obmyfevuxwslywptvyiw.supabase.co';
const FALLBACK_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ibXlmZXZ1eHdzbHl3cHR2eWl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyNDUxNTgsImV4cCI6MjA1MTgyMTE1OH0.oVj7DsoORyVBfcg_NZFStO_S-2p1nCuktPVTYslwGoI';

// Zkusíme načíst z proměnných prostředí, pokud nejsou k dispozici, použijeme záložní hodnoty
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || FALLBACK_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || FALLBACK_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key:', supabaseAnonKey ? 'Přítomen' : 'Chybí');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Chybí Supabase proměnné prostředí');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    headers: { 'Accept': 'application/json' }
  }
});

// Funkce pro testování připojení k Supabase
export const testConnection = async () => {
  try {
    console.log('Testování připojení k Supabase...');
    const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('Chyba při testování připojení:', error);
      return false;
    }
    
    console.log('Připojení k Supabase je funkční!');
    return true;
  } catch (error) {
    console.error('Nezachycená chyba při testování připojení:', error);
    return false;
  }
};

// Automaticky otestujeme připojení při načtení aplikace
testConnection();

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

// Funkce pro vytvoření tabulky objednávek, pokud neexistuje
export const ensureOrdersTable = async () => {
  try {
    // Nejprve zkontrolujeme, zda tabulka již existuje
    const { error: checkError } = await supabase
      .from('orders')
      .select('id')
      .limit(1);

    // Pokud tabulka již existuje, nemusíme nic dělat
    if (!checkError) {
      console.log('Tabulka orders již existuje');
      return;
    }

    // Vytvoříme tabulku objednávek
    const { error } = await supabase.rpc('create_orders_table');

    if (error) {
      console.error('Chyba při vytváření tabulky orders:', error);
    } else {
      console.log('Tabulka orders byla úspěšně vytvořena');
    }
  } catch (error) {
    console.error('Nezachycená chyba při vytváření tabulky orders:', error);
  }
};

// Funkce pro vytvoření tabulky profilů, pokud neexistuje
export const ensureProfilesTable = async () => {
  try {
    // Nejprve zkontrolujeme, zda tabulka již existuje
    const { error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);

    // Pokud tabulka již existuje, nemusíme nic dělat
    if (!checkError) {
      console.log('Tabulka profiles již existuje');
      return;
    }

    // Vytvoříme tabulku profilů
    const { error } = await supabase.rpc('create_profiles_table');

    if (error) {
      console.error('Chyba při vytváření tabulky profiles:', error);
    } else {
      console.log('Tabulka profiles byla úspěšně vytvořena');
    }
  } catch (error) {
    console.error('Nezachycená chyba při vytváření tabulky profiles:', error);
  }
};

// Inicializace databáze při načtení aplikace
export const initializeDatabase = async () => {
  await ensureGamesTable();
  await ensureProfilesTable();
  await ensureOrdersTable();
};

// Automaticky inicializujeme databázi při načtení aplikace
initializeDatabase();

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