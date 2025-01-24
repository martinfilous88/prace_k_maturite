import { Game } from '../types/Game';

// Mapování žánrů na klíčová slova pro generování obrázků
const genreImageKeywords: { [key: string]: string[] } = {
  'RPG': ['fantasy', 'dragon', 'magic', 'medieval', 'wizard', 'quest', 'knight'],
  'Simulace': ['city', 'management', 'building', 'economy', 'infrastructure', 'planning', 'urban'],
  'Action': ['fight', 'explosion', 'combat', 'battle', 'warrior', 'adventure', 'hero'],
  'FPS': ['shooter', 'gun', 'military', 'war', 'battlefield', 'soldier', 'weapon'],
  'Strategy': ['war', 'map', 'tactical', 'planning', 'command', 'empire', 'battle'],
  'Survival': ['wilderness', 'forest', 'danger', 'escape', 'survival', 'camping', 'adventure']
};

// Funkce pro generování unikátního obrázku
export const generateGameImage = (game: Game): string => {
  console.log('Generování obrázku - vstupní data:');
  console.log('ID hry:', game.id);
  console.log('Název hry:', game.title);
  console.log('Žánr hry:', game.genre);

  // Pokud hra již má imageUrl, použij ji
  if (game.imageUrl) {
    console.log('Použití existující imageUrl:', game.imageUrl);
    return game.imageUrl;
  }

  // Extrahuj klíčová slova z názvu hry
  const titleKeywords = game.title
    .toLowerCase()
    .split(' ')
    .filter(word => word.length > 3);

  console.log('Klíčová slova z názvu:', titleKeywords);

  // Prioritní klíčová slova pro daný žánr
  const genreKeywords = genreImageKeywords[game.genre] || [];
  console.log('Klíčová slova žánru:', genreKeywords);

  // Kombinuj klíčová slova a přidej unikátní identifikátor
  const keywords = [...new Set([...genreKeywords, ...titleKeywords])];
  console.log('Kombinovaná klíčová slova:', keywords);
  
  // Přidej unikátní hash z ID hry pro zajištění jedinečnosti
  const uniqueIdentifier = game.id.slice(0, 5);
  
  // Náhodný výběr klíčového slova
  const keyword = keywords[Math.abs(hashCode(game.id)) % keywords.length];
  console.log('Vybrané klíčové slovo:', keyword);
  
  // Generuj URL obrázku s unikátními parametry
  const imageUrl = `https://source.unsplash.com/800x600/?${keyword},game,${uniqueIdentifier}`;
  console.log('Vygenerované URL obrázku:', imageUrl);
  
  return imageUrl;
};

// Pomocná funkce pro generování konzistentního hash kódu
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// Funkce pro náhradní obrázky, pokud selže generování
export const getFallbackGameImage = (game: Game): string => {
  console.log('Generování náhradního obrázku - vstupní data:');
  console.log('ID hry:', game.id);
  console.log('Název hry:', game.title);
  console.log('Žánr hry:', game.genre);

  const fallbackImages: { [key: string]: string[] } = {
    'RPG': [
      'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?w=800',
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800',
      'https://images.unsplash.com/photo-1518562923432-22ad19e93f9b?w=800'
    ],
    'Simulace': [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
      'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800',
      'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800'
    ],
    'Action': [
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800',
      'https://images.unsplash.com/photo-1592394533824-9440e5d68392?w=800',
      'https://images.unsplash.com/photo-1519669556860-22b8f61a5c6b?w=800'
    ],
    'FPS': [
      'https://images.unsplash.com/photo-1542751371-abadd9bea05?w=800',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800',
      'https://images.unsplash.com/photo-1614850523060-8da1a1d5ac1a?w=800'
    ],
    'Strategy': [
      'https://images.unsplash.com/photo-1579374400604-a5e239f4dfcd?w=800',
      'https://images.unsplash.com/photo-1531525645387-7f14be4bfdc0?w=800',
      'https://images.unsplash.com/photo-1569025690938-1d4ca7fcd44d?w=800'
    ],
    'Survival': [
      'https://images.unsplash.com/photo-1519638399535-1b036603ac77?w=800',
      'https://images.unsplash.com/photo-1534951009808-94576f5d1c0e?w=800',
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800'
    ]
  };

  // Vybere náhodný obrázek pro daný žánr
  const genreFallbacks = fallbackImages[game.genre] || [];
  const selectedFallbackIndex = Math.abs(hashCode(game.id)) % genreFallbacks.length;
  
  console.log('Dostupné náhradní obrázky pro žánr:', genreFallbacks);
  console.log('Vybraný index náhradního obrázku:', selectedFallbackIndex);

  const fallbackImage = genreFallbacks[selectedFallbackIndex] 
    || 'https://images.unsplash.com/photo-1493711662062-fa9a0a8e6c9d?w=800';
  
  console.log('Vybraný náhradní obrázek:', fallbackImage);
  
  return fallbackImage;
};
