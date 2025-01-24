/* @jsxImportSource react */
import { Game } from '../../types/game';
import { useCart } from '../../contexts/CartContext';
import { ShoppingCart, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface GameCardProps {
  game: Game;
  showBuyButton?: boolean;
}

export function GameCard({ game, showBuyButton = true }: GameCardProps) {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105">
      <div className="relative h-48">
        <img 
          src={game.imageUrl} 
          alt={game.title} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold text-white mb-2">{game.title}</h3>
        <p className="text-gray-400 text-sm mb-4">{game.shortDescription}</p>
        <div className="flex justify-between items-center gap-2">
          <span className="text-white font-bold">{game.price} Kč</span>
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/game/${game.id}`);
              }}
              className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors flex items-center gap-2"
            >
              Detail
            </button>
            {showBuyButton && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(game);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                Do košíku
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}