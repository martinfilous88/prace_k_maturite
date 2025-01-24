import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useAuth } from '../auth/AuthContext';

interface CartItem {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getDiscountedPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { currentUser } = useAuth();

  const addToCart = (item: CartItem) => {
    setItems(prevItems => [...prevItems, item]);
  };

  const removeFromCart = (itemId: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price, 0);
  };

  const getDiscountedPrice = () => {
    const totalPrice = getTotalPrice();
    // 5% sleva pro registrované uživatele
    return currentUser 
      ? totalPrice * 0.95  // Sleva 5%
      : totalPrice;
  };

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      clearCart,
      getTotalPrice,
      getDiscountedPrice
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
