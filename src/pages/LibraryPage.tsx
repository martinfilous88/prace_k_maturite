import { useAuth } from '../contexts/AuthContext';
import { GameCard } from '../components/games/GameCard';

export function LibraryPage() {
  const { currentUser } = useAuth();
  
  if (!currentUser?.ownedGames?.length) {
    return (
      <div className="min-h-screen bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Vaše knihovna</h1>
          <p className="text-gray-400">
            Zatím nemáte žádné hry. Navštivte náš obchod a pořiďte si nějakou!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-4">Vaše knihovna</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentUser.ownedGames.map(game => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </div>
    </div>
  );
} 