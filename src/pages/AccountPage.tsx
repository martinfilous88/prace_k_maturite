import React, { useState, FormEvent, ChangeEvent } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Edit } from 'lucide-react';
import toast from 'react-hot-toast';

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
}

interface AuthContext {
  currentUser: User | null;
  updateUser: (data: Partial<User>) => void;
}

const AccountPage: React.FC = () => {
  const { currentUser, updateUser } = useAuth() as AuthContext;
  
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
        </div>
      </motion.div>
    </div>
  );
}

export default AccountPage;
