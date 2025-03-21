import React, { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Edit } from 'lucide-react';
import { getUserOrders, Order } from '../lib/orders';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';

// Možné odměny pro Kolo štěstí
const WHEEL_PRIZES = [
  { type: 'discount', value: '20%', description: 'Sleva na další nákup' },
  { type: 'coupon', value: '500 Kč', description: 'Slevový kupón' },
  { type: 'game', value: 'Zdarma', description: 'Náhodná hra zdarma' },
  { type: 'points', value: '100', description: 'Prémiové body' },
  { type: 'nothing', value: 'Smůla', description: 'Tentokrát nic' }
];

interface FormData {
  [key: string]: string;
}

interface WheelResult {
  type: string;
  value: string;
  description: string;
}

interface User {
  username: string;
  email: string;
  phone: string;
  age: string;
  level: number;
  progress: number;
  wheelPrizes: {
    result: WheelResult | null;
    remainingSpins: number;
    lastSpinTimestamp: number | null;
  };
  id: number;
}

interface AuthContext {
  currentUser: User | null;
  updateUser: (data: Partial<User>) => void;
}

const AccountPage: React.FC = () => {
  const { currentUser, updateUser } = useAuth() as AuthContext;
  const navigate = useNavigate();
  
  // Pokud není uživatel přihlášen, přesměruj na přihlášení
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    username: currentUser.username || '',
    email: currentUser.email || '',
    phone: currentUser.phone || '',
    age: currentUser.age || ''
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const saveChanges = () => {
    updateUser(formData);
    setEditMode(false);
  };

  // Přidáme sekci pro zobrazení objednávek
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Načteme objednávky uživatele
  useEffect(() => {
    const fetchOrders = async () => {
      if (!currentUser) return;
      
      setLoadingOrders(true);
      try {
        const orders = await getUserOrders(currentUser.id);
        setOrders(orders);
      } catch (error) {
        console.error('Nezachycená chyba při načítání objednávek:', error);
      } finally {
        setLoadingOrders(false);
      }
    };
    
    fetchOrders();
  }, [currentUser]);

  return (
    <div className="container mx-auto px-4 py-8 text-white">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gray-800 rounded-xl p-6 space-y-6 max-w-xl mx-auto"
      >
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Můj Účet</h1>
          <button 
            onClick={() => setEditMode(!editMode)}
            className="text-blue-500 hover:text-blue-400 flex items-center"
          >
            <Edit className="mr-2" /> {editMode ? 'Zrušit' : 'Upravit'}
          </button>
        </div>

        <div className="space-y-6">
          <div className="grid md:grid-cols-1 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Osobní Údaje</h2>
              {editMode ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Uživatelské jméno"
                    className="w-full bg-gray-700 p-2 rounded"
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                    className="w-full bg-gray-700 p-2 rounded"
                  />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Telefon"
                    className="w-full bg-gray-700 p-2 rounded"
                  />
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    placeholder="Věk"
                    className="w-full bg-gray-700 p-2 rounded"
                  />
                  <button 
                    onClick={saveChanges}
                    className="w-full bg-blue-500 p-2 rounded hover:bg-blue-600"
                  >
                    Uložit změny
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <p><strong>Uživatelské jméno:</strong> {currentUser.username}</p>
                  <p><strong>Email:</strong> {currentUser.email}</p>
                  <p><strong>Telefon:</strong> {currentUser.phone || 'Neuvedeno'}</p>
                  <p><strong>Věk:</strong> {currentUser.age || 'Neuvedeno'}</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Úroveň a Odměny</h2>
            <div className="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-xl p-6 shadow-2xl border border-blue-800/50 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-600 rounded-full p-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-blue-200">Level {currentUser.level}</h3>
                    <p className="text-sm text-blue-300">NextWave Herní Úroveň</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-blue-300">Postup</p>
                  <p className="text-lg font-bold text-white">{currentUser.progress}%</p>
                </div>
              </div>

              <div className="w-full bg-blue-800 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-blue-500 h-3 rounded-full transition-all duration-500 ease-in-out" 
                  style={{ 
                    width: `${currentUser.progress}%`,
                    boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)'
                  }}
                ></div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-blue-800/50 rounded-lg p-3 text-center">
                  <h4 className="text-sm text-blue-300 mb-2">Další úroveň za</h4>
                  <p className="text-lg font-bold text-white">
                    {100 - currentUser.progress}% 
                    <span className="text-sm text-blue-400 ml-1">zbývá</span>
                  </p>
                </div>
                <div className="bg-blue-800/50 rounded-lg p-3 text-center">
                  <h4 className="text-sm text-blue-300 mb-2">Aktuální odměny</h4>
                  <p className="text-lg font-bold text-white">
                    {currentUser.level > 1 ? `${(currentUser.level - 1) * 5}% sleva` : 'Žádné'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Objednávky</h2>
            {loadingOrders ? (
              <p className="text-sm text-blue-300">Načítání objednávek...</p>
            ) : (
              <div className="space-y-4">
                {orders.length > 0 ? (
                  orders.map((order, index) => (
                    <div key={index} className="bg-gray-800 rounded-lg p-4 border border-blue-800/50">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-lg font-semibold text-white">Objednávka #{order.id}</h4>
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          order.status === 'completed' ? 'bg-green-600' : 
                          order.status === 'pending' ? 'bg-yellow-600' : 'bg-red-600'
                        }`}>
                          {order.status === 'completed' ? 'Dokončeno' : 
                           order.status === 'pending' ? 'Zpracovává se' : 'Zrušeno'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300 mb-2">
                        {new Date(order.created_at).toLocaleDateString('cs-CZ', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      <div className="border-t border-gray-700 my-2 pt-2">
                        <p className="text-sm text-gray-300">Položky:</p>
                        {order.items && order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center py-1">
                            <span className="text-sm">{item.title} ({item.quantity}x)</span>
                            <span className="text-sm font-semibold">{item.price * item.quantity} Kč</span>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-gray-700 mt-2 pt-2 flex justify-between items-center">
                        <span className="text-sm font-bold">Celkem:</span>
                        <span className="text-lg font-bold text-blue-400">{order.total} Kč</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-gray-800 rounded-lg p-4 text-center">
                    <p className="text-gray-400">Zatím nemáte žádné objednávky</p>
                    <button 
                      onClick={() => navigate('/store')}
                      className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                    >
                      Přejít do obchodu
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default AccountPage;
