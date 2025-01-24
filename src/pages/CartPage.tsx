/* @jsxImportSource react */
import { useCart } from '../contexts/CartContext';
import { Minus, Plus, X, CreditCard } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export function CartPage() {
  const { items, updateQuantity, removeFromCart, total, clearCart } = useCart();
  const { currentUser, updateUser } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isOrderComplete, setIsOrderComplete] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!currentUser) {
      toast.error('Pro dokončení objednávky se musíte přihlásit');
      return;
    }

    setIsProcessing(true);
    try {
      // Výpočet celkové ceny
      const totalPrice = Math.round(total * 1.21);

      // Přičtení procent v levelu (1% za každých 100 Kč)
      const progressToAdd = Math.floor(totalPrice / 100);

      // Aktualizace uživatele
      await updateUser({
        totalSpend: (currentUser.totalSpend || 0) + totalPrice,
        progress: Math.min(100, (currentUser.progress || 0) + progressToAdd),
        level: currentUser.progress + progressToAdd >= 100 
          ? (currentUser.level || 1) + 1 
          : (currentUser.level || 1),
        ownedGames: [
          ...currentUser.ownedGames,
          ...items.map(item => item.game)
        ]
      });

      // Vyčištění košíku
      clearCart();

      // Nastavení stavu dokončené objednávky
      setIsOrderComplete(true);

      // Úspěšná notifikace
      toast.success(`Objednávka za ${totalPrice} Kč byla úspěšně dokončena`);
    } catch (error) {
      console.error('Chyba při zpracování objednávky:', error);
      toast.error('Nepodařilo se dokončit objednávku');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCloseModal = () => {
    setIsOrderComplete(false);
    navigate('/');
  };

  if (isOrderComplete) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-green-600 mb-4">Objednávka úspěšná!</h2>
          <p className="mb-6 text-gray-700">Faktura byla odeslána na váš email.</p>
          <button 
            onClick={handleCloseModal}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Zavřít
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-white mb-8">Košík</h1>
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <p className="text-gray-400">Váš košík je prázdný</p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              Přejít na hlavní stránku
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-8">Košík</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Seznam položek */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <div key={item.game.id} className="bg-gray-800 rounded-lg p-4 flex items-center gap-4">
                <img
                  src={item.game.imageUrl}
                  alt={item.game.title}
                  className="w-24 h-24 object-cover rounded"
                />
                <div className="flex-grow">
                  <h3 className="text-white font-bold">{item.game.title}</h3>
                  <p className="text-gray-400">{item.game.price} Kč</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.game.id, Math.max(0, item.quantity - 1))}
                    className="text-gray-400 hover:text-white p-1"
                  >
                    <Minus size={20} />
                  </button>
                  <span className="text-white w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.game.id, item.quantity + 1)}
                    className="text-gray-400 hover:text-white p-1"
                  >
                    <Plus size={20} />
                  </button>
                  <button
                    onClick={() => removeFromCart(item.game.id)}
                    className="text-red-400 hover:text-red-500 ml-4"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Souhrn objednávky */}
          <div className="bg-gray-800 rounded-lg p-6 h-fit">
            <h2 className="text-xl font-bold text-white mb-4">Souhrn objednávky</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-gray-400">
                <span>Mezisoučet:</span>
                <span>{total} Kč</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>DPH (21%):</span>
                <span>{Math.round(total * 0.21)} Kč</span>
              </div>
              <div className="border-t border-gray-700 pt-2 flex justify-between text-white font-bold">
                <span>Celkem:</span>
                <span>{Math.round(total * 1.21)} Kč</span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? (
                'Zpracovávání...'
              ) : (
                <>
                  <CreditCard size={20} />
                  Zaplatit
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}