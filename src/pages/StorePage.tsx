/* @jsxImportSource react */
import { useState } from 'react';
import { GameGrid } from '../components/games/GameGrid';
import { FEATURED_GAMES } from '../data/games';
import { Filter, SortAsc, SortDesc } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

export function StorePage() {
  const { addToCart } = useCart();
  const [sortBy, setSortBy] = useState<'price' | 'name'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const sortedGames = [...FEATURED_GAMES].sort((a, b) => {
    if (sortBy === 'price') {
      return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
    }
    return sortOrder === 'asc' 
      ? a.title.localeCompare(b.title) 
      : b.title.localeCompare(a.title);
  });

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Game Store</h1>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-gray-800 p-2 rounded-lg">
              <Filter className="h-5 w-5 text-gray-400" />
              <select 
                className="bg-transparent text-white focus:outline-none"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'price' | 'name')}
              >
                <option value="name" className="bg-gray-800">Name</option>
                <option value="price" className="bg-gray-800">Price</option>
              </select>
            </div>
            
            <button
              onClick={() => setSortOrder(order => order === 'asc' ? 'desc' : 'asc')}
              className="p-2 bg-gray-800 rounded-lg text-gray-400 hover:text-white"
            >
              {sortOrder === 'asc' ? <SortAsc className="h-5 w-5" /> : <SortDesc className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="col-span-1 bg-gray-800 p-4 rounded-lg h-fit">
            <h2 className="text-xl font-semibold text-white mb-4">Filters</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-white font-medium mb-2">Categories</h3>
                {['Action', 'Adventure', 'Racing', 'Platformer', 'Family'].map(category => (
                  <label key={category} className="flex items-center space-x-2 text-gray-300 mb-2">
                    <input type="checkbox" className="form-checkbox" />
                    <span>{category}</span>
                  </label>
                ))}
              </div>

              <div>
                <h3 className="text-white font-medium mb-2">Age Rating</h3>
                {[6, 7, 8, 12, 16, 18].map(age => (
                  <label key={age} className="flex items-center space-x-2 text-gray-300 mb-2">
                    <input type="checkbox" className="form-checkbox" />
                    <span>{age}+</span>
                  </label>
                ))}
              </div>

              <div>
                <h3 className="text-white font-medium mb-2">Price Range</h3>
                <input 
                  type="range" 
                  min="0" 
                  max="20" 
                  step="5"
                  className="w-full"
                />
                <div className="flex justify-between text-gray-400 text-sm">
                  <span>$0</span>
                  <span>$20</span>
                </div>
              </div>
            </div>
          </div>

          {/* Games Grid */}
          <div className="col-span-3">
            <GameGrid 
              games={sortedGames} 
              onGameClick={(game) => addToCart(game)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}