import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

interface PaymentFormProps {
  totalAmount: number;
  cartItems: Array<{
    id: string;
    price: number;
  }>;
  onSuccess: () => void;
}

export function PaymentForm({ totalAmount, cartItems, onSuccess }: PaymentFormProps) {
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Zahajuji platbu', {
      userExists: !!currentUser,
      cartItemsCount: cartItems?.length,
      totalAmount
    });

    // Kontroly před platbou
    if (!currentUser) {
      toast.error('Pro dokončení nákupu se musíte přihlásit');
      navigate('/login');
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      toast.error('Váš košík je prázdný');
      return;
    }

    // Validace emailu
    if (!currentUser.email || !currentUser.email.includes('@')) {
      toast.error('Neplatný uživatelský email. Aktualizujte svůj profil.');
      return;
    }

    setLoading(true);

    // Simulace zpracování platby s absolutní jistotou
    try {
      const processPayment = () => {
        // Vygenerování čísla objednávky
        const fakeOrderId = `ORDER-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

        console.log('Platba zpracována', {
          orderId: fakeOrderId,
          email: currentUser.email,
          totalAmount
        });

        // Zobrazení úspěšné platby
        toast.success('Platba proběhla úspěšně');
        
        // Vyčištění košíku
        onSuccess();
        
        setLoading(false);
      };

      // Synchronní zpracování s minimální prodlevou
      processPayment();

    } catch (error) {
      console.error('Kritická chyba při platbě', error);
      toast.error('Platba se nezdařila. Zkuste to prosím znovu.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 rounded ${loading ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
      >
        {loading ? 'Zpracování platby...' : `Zaplatit (${totalAmount.toFixed(2)} Kč)`}
      </button>
    </form>
  );
}