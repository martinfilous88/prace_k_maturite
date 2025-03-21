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
    <header className="bg-gray-800 py-4 md:py-6">
      <div className="max-w-full mx-auto px-4 md:px-16 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
        <Link to="/" className="text-white text-xl md:text-2xl font-bold flex items-center gap-2">
          <Gamepad2 size={32} className="text-blue-500 hover:text-blue-400 transition-colors" />
          <span className="hover:text-gray-200 transition-colors">NextWave Games</span>
        </Link>
        
        <nav className="flex flex-wrap justify-center gap-2 md:gap-6">
          {location.pathname !== '/' && (
            <Link to="/" className="text-gray-300 hover:text-white flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-3 py-1.5 md:px-4 md:py-2 rounded-lg transition-all text-sm md:text-base">
              <Store size={18} className="mr-1 md:mr-2" />
              Obchod
            </Link>
          )}
          {currentUser ? (
            <div className="flex flex-wrap justify-center gap-2 md:gap-4">
              <Link to="/library" className="text-gray-300 hover:text-white flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-3 py-1.5 md:px-4 md:py-2 rounded-lg transition-all text-sm md:text-base">
                <Library size={18} className="mr-1 md:mr-2" />
                Knihovna
              </Link>
              <Link to="/cart" className="relative text-gray-300 hover:text-white flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-3 py-1.5 md:px-4 md:py-2 rounded-lg transition-all text-sm md:text-base">
                <ShoppingCart size={18} className="mr-1 md:mr-2" />
                Košík
                {items.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                    {items.length}
                  </span>
                )}
              </Link>
              <button
                onClick={logout}
                className="text-gray-300 hover:text-white flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-3 py-1.5 md:px-4 md:py-2 rounded-lg transition-all text-sm md:text-base"
              >
                <LogOut size={18} className="mr-1 md:mr-2" />
                Odhlásit
              </button>
            </div>
          ) : (
            <Link to="/login" className="text-gray-300 hover:text-white flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-3 py-1.5 md:px-4 md:py-2 rounded-lg transition-all text-sm md:text-base">
              <LogIn size={18} className="mr-1 md:mr-2" />
              Přihlásit
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}