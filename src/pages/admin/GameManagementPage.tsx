import React, { useState, useEffect } from 'react';
import { supabase, testSupabaseConnection } from '../../lib/supabase';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface Game {
  id?: number;
  title: string;
  description: string;
  price: number;
  genre: string;
  image_url: string;
}

export const GameManagementPage: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [newGame, setNewGame] = useState({
    title: '',
    description: '',
    price: 0,
    genre: '',
    image_url: ''
  });

  useEffect(() => {
    const initializePage = async () => {
      try {
        const connectionSuccessful = await testSupabaseConnection();
        
        if (!connectionSuccessful) {
          toast.error('Nepodařilo se navázat připojení k databázi. Zkontrolujte nastavení.');
          return;
        }

        await fetchGames();
      } catch (error) {
        console.error('Kritická chyba při inicializaci stránky:', error);
        toast.error('Nastala neočekávaná chyba při inicializaci.');
      }
    };

    initializePage();
  }, []);

  const fetchGames = async () => {
    try {
      console.log('Fetching games...');
      const { data, error } = await supabase
        .from('games')
        .select('*');

      if (error) {
        console.error('Chyba při načítání her:', error);
        toast.error(`Nepodařilo se načíst hry: ${error.message}`);
        return;
      }

      setGames(data || []);
      console.log('Načteno her:', data?.length || 0);
    } catch (error) {
      console.error('Kritická chyba při načítání her:', error);
      toast.error('Nepodařilo se načíst hry');
    }
  };

  const handleAddGame = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('games')
        .insert(newGame)
        .select();

      if (error) {
        console.error('Chyba při přidávání hry:', error);
        toast.error(`Nepodařilo se přidat hru: ${error.message}`);
        return;
      }

      if (data) {
        setGames([...games, data[0]]);
        setNewGame({
          title: '',
          description: '',
          price: 0,
          genre: '',
          image_url: ''
        });
        toast.success('Hra úspěšně přidána');
      }
    } catch (error) {
      console.error('Kritická chyba při přidávání hry:', error);
      toast.error('Nepodařilo se přidat hru');
    }
  };

  const handleEditGame = async (updatedGame: Game) => {
    try {
      const { data, error } = await supabase
        .from('games')
        .update(updatedGame)
        .eq('id', updatedGame.id)
        .select();

      if (error) {
        console.error('Chyba při úpravě hry:', error);
        toast.error(`Nepodařilo se upravit hru: ${error.message}`);
        return;
      }

      if (data) {
        setGames(games.map(game => 
          game.id === updatedGame.id ? data[0] : game
        ));
        setEditingGame(null);
        toast.success('Hra úspěšně upravena');
      }
    } catch (error) {
      console.error('Kritická chyba při úpravě hry:', error);
      toast.error('Nepodařilo se upravit hru');
    }
  };

  const handleDeleteGame = async (gameId: number) => {
    try {
      const { error } = await supabase
        .from('games')
        .delete()
        .eq('id', gameId);

      if (error) {
        console.error('Chyba při mazání hry:', error);
        toast.error(`Nepodařilo se smazat hru: ${error.message}`);
        return;
      }

      setGames(games.filter(game => game.id !== gameId));
      toast.success('Hra úspěšně smazána');
    } catch (error) {
      console.error('Kritická chyba při mazání hry:', error);
      toast.error('Nepodařilo se smazat hru');
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <div className="flex items-center mb-6">
        <Link 
          to="/admin" 
          className="flex items-center text-gray-300 hover:text-white mr-4"
        >
          <ArrowLeft className="mr-2" /> Zpět na dashboard
        </Link>
        <h1 className="text-3xl font-bold">Správa Her</h1>
      </div>
      
      {/* Formulář pro přidání hry */}
      <form onSubmit={handleAddGame} className="bg-gray-800 p-6 rounded-lg mb-6">
        <h2 className="text-2xl mb-4">Přidat novou hru</h2>
        <div className="grid grid-cols-2 gap-4">
          <input 
            type="text" 
            placeholder="Název hry" 
            value={newGame.title}
            onChange={(e) => setNewGame({...newGame, title: e.target.value})}
            className="bg-gray-700 p-2 rounded"
            required 
          />
          <input 
            type="number" 
            placeholder="Cena" 
            value={newGame.price}
            onChange={(e) => setNewGame({...newGame, price: Number(e.target.value)})}
            className="bg-gray-700 p-2 rounded"
            required 
          />
          <input 
            type="text" 
            placeholder="Žánr" 
            value={newGame.genre}
            onChange={(e) => setNewGame({...newGame, genre: e.target.value})}
            className="bg-gray-700 p-2 rounded"
            required 
          />
          <input 
            type="text" 
            placeholder="URL obrázku" 
            value={newGame.image_url}
            onChange={(e) => setNewGame({...newGame, image_url: e.target.value})}
            className="bg-gray-700 p-2 rounded"
          />
        </div>
        <textarea 
          placeholder="Popis hry"
          value={newGame.description}
          onChange={(e) => setNewGame({...newGame, description: e.target.value})}
          className="w-full bg-gray-700 p-2 rounded mt-4"
          required
        />
        <button 
          type="submit" 
          className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
        >
          Přidat hru
        </button>
      </form>

      {/* Seznam her */}
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {games.map((game) => (
            <div key={game.id} className="bg-gray-800 p-4 rounded-lg">
              {editingGame?.id === game.id ? (
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleEditGame(editingGame);
                  }}
                  className="space-y-2"
                >
                  <input 
                    type="text"
                    value={editingGame.title}
                    onChange={(e) => setEditingGame({...editingGame, title: e.target.value})}
                    className="w-full bg-gray-700 p-2 rounded"
                  />
                  <input 
                    type="number"
                    value={editingGame.price}
                    onChange={(e) => setEditingGame({...editingGame, price: Number(e.target.value)})}
                    className="w-full bg-gray-700 p-2 rounded"
                  />
                  <input 
                    type="text"
                    value={editingGame.genre}
                    onChange={(e) => setEditingGame({...editingGame, genre: e.target.value})}
                    className="w-full bg-gray-700 p-2 rounded"
                  />
                  <textarea 
                    value={editingGame.description}
                    onChange={(e) => setEditingGame({...editingGame, description: e.target.value})}
                    className="w-full bg-gray-700 p-2 rounded"
                  />
                  <div className="flex space-x-2">
                    <button 
                      type="submit"
                      className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded w-full"
                    >
                      Uložit
                    </button>
                    <button 
                      type="button"
                      onClick={() => setEditingGame(null)}
                      className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded w-full"
                    >
                      Zrušit
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <img 
                    src={game.image_url} 
                    alt={game.title} 
                    className="w-full h-48 object-cover rounded mb-4"
                  />
                  <h3 className="text-xl font-semibold">{game.title}</h3>
                  <p className="text-gray-400">{game.genre}</p>
                  <p className="text-green-500">{game.price} Kč</p>
                  <div className="flex space-x-2 mt-2">
                    <button 
                      onClick={() => setEditingGame(game)}
                      className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded w-full"
                    >
                      Upravit
                    </button>
                    <button 
                      onClick={() => handleDeleteGame(game.id)}
                      className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded w-full"
                    >
                      Smazat
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
