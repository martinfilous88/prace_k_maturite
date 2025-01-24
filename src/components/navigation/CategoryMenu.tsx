import { Sparkles, Tag, Clock, Grid, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface CategoryMenuProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryMenu({ activeCategory, onCategoryChange }: CategoryMenuProps) {
  const categories = [
    { id: 'vse', label: 'Vše', icon: Grid },
    { id: 'novinky', label: 'Novinky', icon: Sparkles },
    { id: 'slevy', label: 'Slevy', icon: Tag },
    { id: 'pripravujeme', label: 'Připravujeme', icon: Clock },
    { id: 'vyzkousej-hru', label: 'Vyzkoušej hru', icon: Play },
  ];

  return (
    <div className="flex justify-end w-full gap-6 mb-8 flex-wrap px-4 py-4">
      {categories.map((category) => {
        const Icon = category.icon;
        
        // Pro kategorii "Vyzkoušej hru" přidám Link na herní stránku
        if (category.id === 'vyzkousej-hru') {
          return (
            <Link 
              key={category.id} 
              to="/space-colony"
              className={`flex items-center gap-2 px-6 py-3 rounded-lg text-lg font-medium
                transition-colors bg-green-500/20 text-green-300 hover:bg-green-500/30`}
            >
              <Icon className="w-5 h-5" />
              {category.label}
            </Link>
          );
        }

        return (
          <motion.button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg text-lg font-medium
              transition-colors ${
                activeCategory === category.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
              }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Icon className="w-5 h-5" />
            {category.label}
          </motion.button>
        );
      })}
    </div>
  );
}
