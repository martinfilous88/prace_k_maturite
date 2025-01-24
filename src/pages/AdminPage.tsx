import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@gamestore.cz');
  const [password, setPassword] = useState('AdminHeslo2024!');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (email === 'admin@gamestore.cz' && password === 'AdminHeslo2024!') {
      navigate('/admin/dashboard', { replace: true });
    } else {
      setError('Nesprávné přihlašovací údaje');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-800 p-8 rounded-lg shadow-xl w-96"
      >
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Admin Přihlášení</h2>
        <form onSubmit={handleLogin}>
          <input 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full p-3 rounded bg-gray-700 text-white mb-4"
          />
          <input 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Heslo"
            required
            className="w-full p-3 rounded bg-gray-700 text-white mb-4"
          />
          {error && (
            <div className="text-red-500 mb-4 text-center">
              {error}
            </div>
          )}
          <button 
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
          >
            Přihlásit se
          </button>
        </form>
      </motion.div>
    </div>
  );
};
