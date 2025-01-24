import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, isAdmin } = useAuth();

  useEffect(() => {
    // Pokud není přihlášený admin, přesměruj na přihlašovací stránku
    if (!isAdmin()) {
      toast.error('Nemáte oprávnění pro přístup do administrace');
      navigate('/admin/page');
    }
  }, [currentUser, navigate, isAdmin]);

  const handleLogout = () => {
    navigate('/admin/page');
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div 
            onClick={() => navigate('/admin/games')}
            className="bg-gray-800 p-6 rounded-lg cursor-pointer hover:bg-gray-700 transition"
          >
            <h2 className="text-xl font-semibold mb-4">Správa Her</h2>
            <p>Přidávejte, upravujte a mazejte hry v katalogu.</p>
          </div>
          
          <div 
            onClick={() => navigate('/admin/orders')}
            className="bg-gray-800 p-6 rounded-lg cursor-pointer hover:bg-gray-700 transition"
          >
            <h2 className="text-xl font-semibold mb-4">Objednávky</h2>
            <p>Spravujte a sledujte všechny objednávky.</p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Uživatelé</h2>
            <p>Správa uživatelských účtů.</p>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="mt-8 bg-red-600 text-white px-6 py-3 rounded hover:bg-red-700 transition"
        >
          Odhlásit se
        </button>
      </div>
    </div>
  );
};
