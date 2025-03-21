import { supabase } from './supabase';
import { toast } from 'react-hot-toast';

// Funkce pro vytvoření tabulky profilů
export const createProfilesTable = async () => {
  const { error } = await supabase.from('profiles').select('count').limit(1);
  
  if (error && error.code === '42P01') { // Tabulka neexistuje
    const { error: createError } = await supabase.rpc('create_profiles_table');
    
    if (createError) {
      console.error('Chyba při vytváření tabulky profilů:', createError);
      return false;
    }
    
    console.log('Tabulka profilů byla úspěšně vytvořena');
    return true;
  } else if (error) {
    console.error('Chyba při kontrole tabulky profilů:', error);
    return false;
  }
  
  console.log('Tabulka profilů již existuje');
  return true;
};

// Funkce pro vytvoření tabulky objednávek
export const createOrdersTable = async () => {
  const { error } = await supabase.from('orders').select('count').limit(1);
  
  if (error && error.code === '42P01') { // Tabulka neexistuje
    const { error: createError } = await supabase.rpc('create_orders_table');
    
    if (createError) {
      console.error('Chyba při vytváření tabulky objednávek:', createError);
      return false;
    }
    
    console.log('Tabulka objednávek byla úspěšně vytvořena');
    return true;
  } else if (error) {
    console.error('Chyba při kontrole tabulky objednávek:', error);
    return false;
  }
  
  console.log('Tabulka objednávek již existuje');
  return true;
};

// Funkce pro inicializaci databáze
export const initializeDatabase = async () => {
  try {
    console.log('Inicializace databáze...');
    
    // Vytvoříme tabulky
    const profilesCreated = await createProfilesTable();
    const ordersCreated = await createOrdersTable();
    
    if (profilesCreated && ordersCreated) {
      console.log('Databáze byla úspěšně inicializována');
      return true;
    } else {
      console.error('Nepodařilo se inicializovat databázi');
      return false;
    }
  } catch (error) {
    console.error('Nezachycená chyba při inicializaci databáze:', error);
    return false;
  }
};
