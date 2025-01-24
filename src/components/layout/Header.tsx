/* @jsxImportSource react */
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { ShoppingCart, Library, Store, LogIn, Gamepad2, User, LogOut } from 'lucide-react';

export function Header() {
  const { currentUser, logout } = useAuth();
  const { items } = useCart();
  const location = useLocation();

  return (
    <header className="bg-gray-800 py-6">
      <div className="max-w-full mx-auto px-16 flex items-center justify-between">
        <Link to="/" className="text-white text-2xl font-bold flex items-center gap-3">
          <Gamepad2 size={40} className="text-blue-500 hover:text-blue-400 transition-colors" />
          <span className="hover:text-gray-200 transition-colors">NextWave Games</span>
        </Link>
        
        <nav className="flex items-center space-x-6">
          {location.pathname !== '/' && (
            <Link to="/" className="text-gray-300 hover:text-white flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-all">
              <Store size={20} className="mr-2" />
              Obchod
            </Link>
          )}
          {currentUser ? (
            <div className="flex items-center space-x-4">
              <Link to="/library" className="text-gray-300 hover:text-white flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-all">
                <Library size={20} className="mr-2" />
                Knihovna
              </Link>
              <Link to="/account" className="text-gray-300 hover:text-white flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-all">
                <User size={20} className="mr-2" />
                Můj účet
              </Link>
              <Link 
                to="/cart"
                className="text-gray-300 hover:text-white flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-all"
              >
                <ShoppingCart size={20} className="mr-2" />
                Košík ({items.length})
              </Link>
              <button 
                onClick={() => logout()}
                className="text-gray-300 hover:text-white flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-all"
              >
                <LogOut size={20} className="mr-2" />
                Odhlásit se
              </button>
            </div>
          ) : (
            <Link to="/login" className="text-gray-300 hover:text-white flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-all">
              <LogIn size={20} className="mr-2" />
              Přihlásit
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}