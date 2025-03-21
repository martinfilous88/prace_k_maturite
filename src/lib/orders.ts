import { supabase } from './supabase';
import { toast } from 'react-hot-toast';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

// Typ pro položku objednávky
export interface OrderItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
}

// Typ pro objednávku
export interface Order {
  id?: number;
  user_id: string;
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  items: OrderItem[];
  created_at?: string;
  updated_at?: string;
}

// Funkce pro vytvoření nové objednávky
export const createOrder = async (
  userId: string,
  items: OrderItem[],
  total: number
): Promise<Order | null> => {
  try {
    // Vytvoříme objednávku
    const { data, error } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        total,
        items,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Chyba při vytváření objednávky:', error);
      toast.error('Nepodařilo se vytvořit objednávku');
      return null;
    }

    // Aktualizujeme celkovou útratu uživatele a jeho úroveň
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        total_spend: supabase.rpc('increment_spend', { amount: total }),
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (updateError) {
      console.error('Chyba při aktualizaci profilu:', updateError);
    }

    toast.success('Objednávka byla úspěšně vytvořena');
    return data;
  } catch (error) {
    console.error('Nezachycená chyba při vytváření objednávky:', error);
    toast.error('Došlo k chybě při vytváření objednávky');
    return null;
  }
};

// Funkce pro získání objednávek uživatele
export const getUserOrders = async (userId: string): Promise<Order[]> => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Chyba při načítání objednávek:', error);
      toast.error('Nepodařilo se načíst objednávky');
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Nezachycená chyba při načítání objednávek:', error);
    return [];
  }
};

// Hook pro práci s objednávkami
export const useOrders = () => {
  const { currentUser, updateUserLevel } = useContext(AuthContext);

  // Funkce pro vytvoření objednávky a aktualizaci úrovně uživatele
  const createOrderAndUpdateLevel = async (
    items: OrderItem[],
    total: number
  ): Promise<Order | null> => {
    if (!currentUser) {
      toast.error('Pro vytvoření objednávky se musíte přihlásit');
      return null;
    }

    const order = await createOrder(currentUser.id, items, total);
    
    if (order) {
      // Aktualizujeme úroveň uživatele
      updateUserLevel(total);
    }

    return order;
  };

  return {
    createOrder: createOrderAndUpdateLevel,
    getUserOrders: () => currentUser ? getUserOrders(currentUser.id) : Promise.resolve([])
  };
};
