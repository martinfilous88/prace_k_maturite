import { createContext, useContext, useState, ReactNode } from 'react';
import { CartItem, Game } from '../types/game';
import toast from 'react-hot-toast';

interface CartContextType {
  items: CartItem[];
  addToCart: (game: Game) => void;
  removeFromCart: (gameId: string) => void;
  updateQuantity: (gameId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (game: Game) => {
    console.log('Aktuální stav košíku:', items);
    
    setItems(current => {
      // Vytvoř kopii aktuálního stavu
      const updatedItems = [...current];
      
      // Najdi index hry v košíku
      const existingItemIndex = updatedItems.findIndex(item => item.game.id === game.id);
      
      if (existingItemIndex > -1) {
        // Pokud hra již existuje, zvyš její množství
        updatedItems[existingItemIndex].quantity += 1;
      } else {
        // Pokud hra neexistuje, přidej ji
        updatedItems.push({ game, quantity: 1 });
      }
      
      // Zobraz úspěšnou zprávu
      toast.success(`${game.title} byla přidána do košíku`);
      
      return updatedItems;
    });
  };

  const removeFromCart = (gameId: string) => {
    setItems(current => current.filter(item => item.game.id !== gameId));
    toast.success('Hra byla odebrána z košíku');
  };

  const updateQuantity = (gameId: string, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(gameId);
      return;
    }
    setItems(current =>
      current.map(item =>
        item.game.id === gameId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    toast.success('Košík byl vyprázdněn');
  };

  const total = items.reduce((sum, item) => sum + item.game.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};