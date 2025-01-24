import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { FEATURED_GAMES } from '../data/games';
import { ShoppingCart, ArrowLeft, Info, Users, Clock } from 'lucide-react';

export function GameDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    console.log('GameDetailPage - ID hry:', id);
    console.log('Všechny hry:', FEATURED_GAMES);
  }, [id]);

  const game = FEATURED_GAMES.find(g => g.id === id);

  useEffect(() => {
    console.log('Nalezená hra:', game);
  }, [game]);

  if (!game) {
    console.error('Hra nebyla nalezena pro ID:', id);
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Hra nenalezena</h1>
          <button
            onClick={() => navigate('/')}
            className="text-blue-500 hover:text-blue-400 flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            Zpět na hlavní stránku
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Navigace zpět */}
        <button
          onClick={() => navigate('/')}
          className="text-blue-500 hover:text-blue-400 flex items-center gap-2 mb-8"
        >
          <ArrowLeft size={20} />
          Zpět na hlavní stránku
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Obrázek hry */}
          <div className="relative">
            <img
              src={game.imageUrl}
              alt={game.title}
              className="w-full rounded-lg shadow-xl"
            />
          </div>

          {/* Informace o hře */}
          <div>
            <h1 className="text-4xl font-bold text-white mb-4">{game.title}</h1>
            <p className="text-gray-400 text-lg mb-6">{game.description}</p>

            {/* Detaily */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-blue-500 mb-2">
                  <Info size={20} />
                  <span className="font-semibold">Žánr</span>
                </div>
                <p className="text-white">{game.genre}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-blue-500 mb-2">
                  <Users size={20} />
                  <span className="font-semibold">Věkové omezení</span>
                </div>
                <p className="text-white">{game.ageRating}+</p>
              </div>
            </div>

            {/* Cena a tlačítko pro nákup */}
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl font-bold text-white">{game.price} Kč</span>
                <button
                  onClick={() => addToCart(game)}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 
                    transition-all hover:scale-105 flex items-center gap-2"
                >
                  <ShoppingCart size={24} />
                  Přidat do košíku
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
