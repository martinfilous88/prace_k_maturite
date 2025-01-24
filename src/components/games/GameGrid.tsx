/* @jsxImportSource react */
import { GameCard } from './GameCard';
import type { Game } from '../../types/game';

interface GameGridProps {
  games: Game[];
  onGameClick?: (game: Game) => void;
}

export function GameGrid({ games, onGameClick }: GameGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {games.map(game => (
        <div key={game.id} onClick={() => onGameClick?.(game)}>
          <GameCard game={game} />
        </div>
      ))}
    </div>
  );
}