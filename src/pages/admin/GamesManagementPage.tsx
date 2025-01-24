import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Game } from '../../types/game';
import { toast } from 'react-hot-toast';
import { Trash2, Edit, Plus, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const GamesManagementPage: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingGame, setEditingGame] = useState<Partial<Game> | null>(null);
  const [newGame, setNewGame] = useState<Partial<Game>>({
    title: '',
    description: '',
    genre: '',
    price: 0,
    imageUrl: '',
    shortDescription: '',
    ageRating: 12
  });

  // Načtení her
  const fetchGames = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('games').select('*');
    
    if (error) {
      toast.error('Nepodařilo se načíst hry');
      console.error(error);
    } else {
      setGames(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchGames();
  }, []);

  // Smazání hry
  const handleDeleteGame = async (gameId: string) => {
    const confirmDelete = window.confirm('Opravdu chcete smazat tuto hru?');
    
    if (confirmDelete) {
      const { error } = await supabase.from('games').delete().eq('id', gameId);
      
      if (error) {
        toast.error('Nepodařilo se smazat hru');
        console.error(error);
      } else {
        toast.success('Hra byla úspěšně smazána');
        fetchGames();
      }
    }
  };

  // Úprava hry
  const handleEditGame = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingGame?.id) return;

    const { error } = await supabase
      .from('games')
      .update({
        title: editingGame.title,
        description: editingGame.description,
        genre: editingGame.genre,
        price: editingGame.price,
        imageUrl: editingGame.imageUrl,
        shortDescription: editingGame.shortDescription,
        ageRating: editingGame.ageRating
      })
      .eq('id', editingGame.id);

    if (error) {
      toast.error('Nepodařilo se upravit hru');
      console.error(error);
    } else {
      toast.success('Hra byla úspěšně upravena');
      setEditingGame(null);
      fetchGames();
    }
  };

  // Přidání nové hry
  const handleAddGame = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generování unikátního ID
    const newGameId = `game_${Date.now()}`;

    const { error } = await supabase.from('games').insert({
      ...newGame,
      id: newGameId,
      type: 'new'
    });

    if (error) {
      toast.error('Nepodařilo se přidat hru');
      console.error(error);
    } else {
      toast.success('Hra byla úspěšně přidána');
      setNewGame({
        title: '',
        description: '',
        genre: '',
        price: 0,
        imageUrl: '',
        shortDescription: '',
        ageRating: 12
      });
      fetchGames();
    }
  };

  if (loading) return <div className="text-white p-4">Načítání her...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Správa Her</h1>
        <Link 
          to="/admin/dashboard" 
          className="flex items-center text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-all"
        >
          <ArrowLeft className="mr-2" /> Zpět na dashboard
        </Link>
      </div>
      
      {/* Formulář pro přidání nové hry */}
      <div className="bg-gray-800 p-6 rounded-lg mb-8">
        <h2 className="text-2xl font-semibold mb-4">Přidat novou hru</h2>
        <form onSubmit={handleAddGame} className="grid grid-cols-2 gap-4">
          <input 
            type="text"
            placeholder="Název hry"
            value={newGame.title}
            onChange={(e) => setNewGame({...newGame, title: e.target.value})}
            required
            className="bg-gray-700 p-2 rounded"
          />
          <input 
            type="number"
            placeholder="Cena"
            value={newGame.price}
            onChange={(e) => setNewGame({...newGame, price: Number(e.target.value)})}
            required
            className="bg-gray-700 p-2 rounded"
          />
          <input 
            type="text"
            placeholder="Žánr"
            value={newGame.genre}
            onChange={(e) => setNewGame({...newGame, genre: e.target.value})}
            required
            className="bg-gray-700 p-2 rounded"
          />
          <input 
            type="text"
            placeholder="URL obrázku"
            value={newGame.imageUrl}
            onChange={(e) => setNewGame({...newGame, imageUrl: e.target.value})}
            required
            className="bg-gray-700 p-2 rounded"
          />
          <textarea 
            placeholder="Krátký popis"
            value={newGame.shortDescription}
            onChange={(e) => setNewGame({...newGame, shortDescription: e.target.value})}
            required
            className="bg-gray-700 p-2 rounded col-span-2"
          />
          <button 
            type="submit"
            className="bg-green-600 text-white p-2 rounded flex items-center justify-center col-span-2"
          >
            <Plus className="mr-2" /> Přidat hru
          </button>
        </form>
      </div>

      {/* Seznam her */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {games.map(game => (
          <div 
            key={game.id} 
            className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition relative"
          >
            <img 
              src={game.imageUrl} 
              alt={game.title} 
              className="w-full h-48 object-cover rounded mb-4"
            />
            <h2 className="text-xl font-bold">{game.title}</h2>
            <p className="text-gray-400">{game.genre}</p>
            <p className="text-white font-semibold">{game.price} Kč</p>
            
            {/* Tlačítka pro úpravu a smazání */}
            <div className="absolute top-2 right-2 flex gap-2">
              <button 
                onClick={() => setEditingGame(game)}
                className="bg-blue-500 text-white p-2 rounded"
              >
                <Edit size={16} />
              </button>
              <button 
                onClick={() => handleDeleteGame(game.id)}
                className="bg-red-500 text-white p-2 rounded"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal pro úpravu hry */}
      {editingGame && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <form 
            onSubmit={handleEditGame}
            className="bg-gray-800 p-8 rounded-lg w-96"
          >
            <h2 className="text-2xl font-semibold mb-4">Upravit hru</h2>
            <input 
              type="text"
              placeholder="Název hry"
              value={editingGame.title || ''}
              onChange={(e) => setEditingGame({...editingGame, title: e.target.value})}
              required
              className="bg-gray-700 p-2 rounded w-full mb-4"
            />
            <input 
              type="number"
              placeholder="Cena"
              value={editingGame.price || 0}
              onChange={(e) => setEditingGame({...editingGame, price: Number(e.target.value)})}
              required
              className="bg-gray-700 p-2 rounded w-full mb-4"
            />
            <input 
              type="text"
              placeholder="Žánr"
              value={editingGame.genre || ''}
              onChange={(e) => setEditingGame({...editingGame, genre: e.target.value})}
              required
              className="bg-gray-700 p-2 rounded w-full mb-4"
            />
            <input 
              type="text"
              placeholder="URL obrázku"
              value={editingGame.imageUrl || ''}
              onChange={(e) => setEditingGame({...editingGame, imageUrl: e.target.value})}
              required
              className="bg-gray-700 p-2 rounded w-full mb-4"
            />
            <textarea 
              placeholder="Krátký popis"
              value={editingGame.shortDescription || ''}
              onChange={(e) => setEditingGame({...editingGame, shortDescription: e.target.value})}
              required
              className="bg-gray-700 p-2 rounded w-full mb-4"
            />
            <div className="flex justify-between">
              <button 
                type="submit"
                className="bg-blue-600 text-white p-2 rounded"
              >
                Uložit změny
              </button>
              <button 
                type="button"
                onClick={() => setEditingGame(null)}
                className="bg-gray-600 text-white p-2 rounded"
              >
                Zrušit
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
