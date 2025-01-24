import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FEATURED_GAMES } from '../data/games';
import { Game } from '../types/game';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { GameSlideshow } from '../components/GameSlideshow';

const categoryIcons = {
  'vse': <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <path d="M3 9h18"/>
    <path d="M9 21V9"/>
  </svg>,
  'doporučené': <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>,
  'novinky': <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="12" y1="12" x2="12" y2="18"/>
    <line x1="9" y1="15" x2="15" y2="15"/>
  </svg>,
  'slevy': <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 9l3 3-3 3"/>
    <path d="M5 17l-3-3 3-3"/>
    <path d="M22 15V9"/>
    <path d="M18 9h0a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h0"/>
  </svg>,
  'připravujeme': <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
};

const categories = [
  { id: 'vse', label: 'Vše', icon: categoryIcons['vse'] },
  { id: 'doporučené', label: 'Doporučené', icon: categoryIcons['doporučené'] },
  { id: 'novinky', label: 'Novinky', icon: categoryIcons['novinky'] },
  { id: 'slevy', label: 'Slevy', icon: categoryIcons['slevy'] },
  { id: 'připravujeme', label: 'Připravujeme', icon: categoryIcons['připravujeme'] }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.1 
    } 
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5 
    } 
  }
};

export function HomePage() {
  const [games, setGames] = useState<Game[]>([]);
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [activeCategory, setActiveCategory] = useState('vse');
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Stavy pro filtry
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedAgeRatings, setSelectedAgeRatings] = useState<number[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 199, max: 599 });

  // Funkce pro aplikaci filtrů
  const applyFilters = () => {
    const filtered = FEATURED_GAMES.filter(game => {
      const genreMatch = selectedGenres.length === 0 || selectedGenres.includes(game.genre);
      const ageRatingMatch = selectedAgeRatings.length === 0 || selectedAgeRatings.includes(game.ageRating);
      const priceMatch = game.price >= priceRange.min && game.price <= priceRange.max;

      return genreMatch && ageRatingMatch && priceMatch;
    });

    setFilteredGames(filtered);
    setIsFilterOpen(false);
  };

  // Funkce pro reset filtrů
  const resetFilters = () => {
    setSelectedGenres([]);
    setSelectedAgeRatings([]);
    setPriceRange({ min: 199, max: 599 });
    setFilteredGames(FEATURED_GAMES);
  };

  useEffect(() => {
    const fetchAllGames = async () => {
      try {
        const allGames = FEATURED_GAMES;
        setGames(allGames || []);
        setFilteredGames(allGames || []);
      } catch (err) {
        console.error('Chyba při načítání her:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllGames();
  }, []);

  if (loading) {
    return <div className="text-white p-4">Načítání her...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero sekce */}
      <section className="container mx-auto px-4 mb-12 flex space-x-8 items-center">
        <div className="w-2/3 mt-12">
          <GameSlideshow games={games} className="w-full" />
        </div>
        <div className="w-1/3 flex flex-col justify-center">
          <h2 className="text-4xl font-bold text-white mb-6">Objev svět her</h2>
          <p className="text-xl text-gray-300 mb-6">Nejlepší herní zážitky na jednom místě. Připrav se na dobrodružství!</p>
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-xl shadow-lg">
            <h3 className="text-2xl font-bold text-white mb-4">Registrační výhoda</h3>
            <p className="text-lg text-white/90 mb-4">
              <span className="font-extrabold text-yellow-300">5% sleva</span> na každou hru v košíku pro registrované uživatele!
            </p>
            <button 
              className="mt-4 w-full bg-white text-blue-600 font-semibold py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Registrovat se
            </button>
          </div>
        </div>
      </section>

      {/* Filtry her */}
      <section className="container mx-auto px-4 mt-6 mb-12">
        <div className="flex justify-center">
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
            Filtry her
          </button>
        </div>

        {isFilterOpen && (
          <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 shadow-lg mt-4">
            <div className="grid grid-cols-3 gap-6">
              {/* Žánry */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Žánry</h3>
                {['RPG', 'Simulace', 'Action', 'Survival', 'FPS', 'Strategie'].map(genre => (
                  <label key={genre} className="flex items-center space-x-2 text-gray-300 mb-2">
                    <input 
                      type="checkbox" 
                      className="form-checkbox text-blue-500"
                      checked={selectedGenres.includes(genre)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedGenres([...selectedGenres, genre]);
                        } else {
                          setSelectedGenres(selectedGenres.filter(g => g !== genre));
                        }
                      }}
                    />
                    <span>{genre}</span>
                  </label>
                ))}
              </div>

              {/* Věkové kategorie */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Věk</h3>
                {[3, 7, 12, 16, 18].map(age => (
                  <label key={age} className="flex items-center space-x-2 text-gray-300 mb-2">
                    <input 
                      type="checkbox" 
                      className="form-checkbox text-blue-500"
                      checked={selectedAgeRatings.includes(age)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedAgeRatings([...selectedAgeRatings, age]);
                        } else {
                          setSelectedAgeRatings(selectedAgeRatings.filter(a => a !== age));
                        }
                      }}
                    />
                    <span>{age}+</span>
                  </label>
                ))}
              </div>

              {/* Cenový rozsah */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Cena</h3>
                <div className="flex items-center space-x-4">
                  <input 
                    type="range" 
                    min="199" 
                    max="599" 
                    step="50" 
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                    className="w-full"
                  />
                </div>
                <div className="flex justify-between text-gray-400 text-sm mt-2">
                  <span>199 Kč</span>
                  <span>{priceRange.max} Kč</span>
                </div>
              </div>
            </div>
            
            {/* Tlačítka pro aplikaci a reset filtrů */}
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={resetFilters}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Resetovat filtry
              </button>
              <button
                onClick={applyFilters}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                Použít filtry
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Seznam her */}
      <section className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-white tracking-wider">
          Naše Herní Kolekce
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 perspective-1000">
          {filteredGames.map((game, index) => (
            <motion.div 
              key={game.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="game-card transform transition-all duration-300 ease-out"
            >
              <div 
                className="bg-gray-800 rounded-xl overflow-hidden shadow-2xl 
                border border-gray-700/50 transform transition-all duration-300"
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={game.imageUrl} 
                    alt={game.title} 
                    className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
                  />
                  {game.type === 'new' && (
                    <span className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                      Novinka
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2 text-white">{game.title}</h2>
                  <p className="text-gray-400 mb-4 h-12 overflow-hidden">{game.shortDescription}</p>
                  <div className="bg-gray-900/50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-blue-400">{game.price} Kč</span>
                      <div className="flex space-x-2">
                        <Link 
                          to={`/game/${game.id}`} 
                          className="bg-blue-600 text-white px-4 py-2 rounded-md 
                            hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                          Detail
                        </Link>
                        <button
                          onClick={() => addToCart(game)}
                          className="bg-green-600 text-white px-4 py-2 rounded-md 
                            hover:bg-green-700 transition-colors flex items-center gap-2"
                        >
                          <ShoppingCart size={20} />
                          Koupit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}