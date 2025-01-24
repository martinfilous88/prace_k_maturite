import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Game } from '../types/game';
import { Link } from 'react-router-dom';

interface GameSlideshowProps {
  games: Game[];
  className?: string;
}

export function GameSlideshow({ games, className }: GameSlideshowProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % games.length);
    }, 5000); // Změna slidů každých 5 sekund

    return () => clearInterval(interval);
  }, [games.length]);

  const slideVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.1 }
  };

  return (
    <div className={`relative w-full h-[500px] overflow-hidden rounded-2xl ${className}`}>
      <AnimatePresence mode="wait">
        {games.map((game, index) => (
          index === currentSlide && (
            <motion.div
              key={game.id}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={slideVariants}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex items-end"
              style={{
                backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%), url(${game.imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="p-8 text-white w-full">
                <motion.div 
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="text-4xl font-bold mb-4">{game.title}</h2>
                  <p className="text-xl mb-6 max-w-2xl">{game.shortDescription}</p>
                  <div className="flex space-x-4">
                    <Link 
                      to={`/game/${game.id}`}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg 
                        hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      Zobrazit detail
                    </Link>
                    {/* Removed 'Prozkoumat hry' button */}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )
        ))}
      </AnimatePresence>

      {/* Indikátory slidů */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {games.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
