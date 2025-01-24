import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, GamepadIcon, Store, User } from 'lucide-react';

export function MainNavigation() {
  const [activeLink, setActiveLink] = useState('/');

  const navLinks = [
    { path: '/', icon: Home, label: 'Domů' },
    { path: '/games', icon: GamepadIcon, label: 'Hry' },
    { path: '/space-colony', icon: Store, label: 'Vesmírná Kolonie' },
    { path: '/account', icon: User, label: 'Můj účet' }
  ];

  const user = { role: 'admin' }; // assuming user is defined somewhere in your code

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-800/50 backdrop-blur-sm z-50">
      <div className="container mx-auto flex justify-between items-center px-4 py-3">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            onClick={() => setActiveLink(link.path)}
            className={`flex flex-col items-center justify-center text-sm transition-all 
              ${activeLink === link.path 
                ? 'text-blue-500' 
                : 'text-gray-400 hover:text-white'
              }`}
          >
            <link.icon className="w-6 h-6 mb-1" />
            {link.label}
          </Link>
        ))}
        {user ? (
          <>
            {user.role === 'admin' && (
              <Link 
                to="/admin/page" 
                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Admin
              </Link>
            )}
            <Link 
              to="/admin/page" 
              className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Admin
            </Link>
          </>
        ) : null}
      </div>
    </nav>
  );
}
