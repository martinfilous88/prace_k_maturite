/* @jsxImportSource react */
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import type { Game } from '../../types/game';

interface GameSlideshowProps {
  games: Game[];
  className?: string;
}

export function GameSlideshow({ 
  games, 
  className = '' 
}: GameSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const navigate = useNavigate();

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0
    })
  };

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % games.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + games.length) % games.length);
  };

  return (
    <div className={`grid grid-cols-[1fr] gap-6 max-w-7xl mx-auto px-4 ${className}`}>
      {/* Slideshow */}
      <div className="relative aspect-video max-h-[600px] overflow-hidden rounded-xl bg-gray-900">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="absolute inset-0"
          >
            {/* Hlavní obrázek */}
            <div className="relative w-full h-full">
              <img
                src={games[currentIndex].imageUrl}
                alt={games[currentIndex].title}
                className="w-full h-full object-cover"
              />
              
              {/* Tmavý overlay s gradientem */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                {/* Informace o hře */}
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 p-8"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: {
                        when: "beforeChildren",
                        staggerChildren: 0.1
                      }
                    }
                  }}
                >
                  <div className="max-w-7xl mx-auto">
                    <motion.h2 
                      className="text-4xl font-bold text-white mb-3"
                      variants={{
                        hidden: { opacity: 0 },
                        visible: {
                          opacity: 1,
                          transition: {
                            duration: 0.3
                          }
                        }
                      }}
                    >
                      {games[currentIndex].title}
                    </motion.h2>
                    <motion.p 
                      className="text-2xl text-white/90 mb-4"
                      variants={{
                        hidden: { opacity: 0 },
                        visible: {
                          opacity: 1,
                          transition: {
                            duration: 0.3
                          }
                        }
                      }}
                    >
                      {games[currentIndex].price} Kč
                    </motion.p>
                    <motion.button
                      variants={{
                        hidden: { opacity: 0 },
                        visible: {
                          opacity: 1,
                          transition: {
                            duration: 0.3
                          }
                        }
                      }}
                      onClick={() => navigate(`/game/${games[currentIndex].id}`)}
                      className="bg-blue-500/90 text-white px-6 py-2 rounded-lg 
                        hover:bg-blue-600 transition-all hover:scale-105 flex items-center gap-2 
                        w-fit text-lg"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Info className="w-5 h-5" />
                      Zjistit více
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigační šipky */}
        <motion.button
          whileHover={{ scale: 1.1, backgroundColor: 'rgba(59, 130, 246, 0.6)' }}
          whileTap={{ scale: 0.9 }}
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 
            rounded-full transition-colors backdrop-blur-sm z-10"
        >
          <ChevronLeft className="w-6 h-6" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1, backgroundColor: 'rgba(59, 130, 246, 0.6)' }}
          whileTap={{ scale: 0.9 }}
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 
            rounded-full transition-colors backdrop-blur-sm z-10"
        >
          <ChevronRight className="w-6 h-6" />
        </motion.button>

        {/* Indikátory slidů */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {games.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex 
                  ? 'bg-blue-500 w-4' 
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
