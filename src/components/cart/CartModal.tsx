/* @jsxImportSource react */
import { X, Minus, Plus, CreditCard, Store } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartModal({ isOpen, onClose }: CartModalProps) {
  const navigate = useNavigate();
  const { items, updateQuantity, removeFromCart, total } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleCheckout = async () => {
    setIsProcessing(true);
    try {
      // Zde bude integrace s platební bránou
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulace zpracování
      alert('Platba byla úspěšná!');
      onClose();
    } catch (error) {
      alert('Platba selhala. Zkuste to prosím znovu.');
    } finally {
      setIsProcessing(false);
    }
  };

  const goToStore = () => {
    navigate('/');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">Košík</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="flex-grow overflow-auto">
          {items.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-4">Košík je prázdný</p>
              <button
                onClick={goToStore}
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 flex items-center justify-center gap-2 mx-auto"
              >
                <Store size={20} />
                Přejít na hlavní stránku
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map(item => (
                <div key={item.game.id} className="flex items-center gap-4 bg-gray-700 p-4 rounded-lg">
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
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-gray-700 mt-4 pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-white font-bold">Celkem:</span>
              <span className="text-white font-bold">{total} Kč</span>
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
        )}
      </div>
    </div>
  );
}