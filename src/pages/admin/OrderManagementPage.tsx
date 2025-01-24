import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface Order {
  id: number;
  user_id: string;
  total_amount: number;
  status: 'pending' | 'completed' | 'cancelled';
  created_at: string;
  order_items: {
    game_id: number;
    game_title: string;
    price: number;
  }[];
}

export const OrderManagementPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'cancelled'>('all');

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const fetchOrders = async () => {
    try {
      console.log('Začínám načítat objednávky s filtrem:', filter);
      
      let query = supabase.from('orders').select(`
        id, 
        user_id, 
        total_amount, 
        status, 
        created_at,
        order_items (
          game_id,
          game_title,
          price
        )
      `);

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;

      console.log('Výsledek dotazu:', { data, error });

      if (error) {
        console.error('Detailní chyba při načítání objednávek:', error);
        toast.error(`Chyba načítání objednávek: ${error.message}`);
      }

      if (data) {
        console.log('Počet načtených objednávek:', data.length);
        setOrders(data);
      } else {
        console.warn('Žádné objednávky nebyly načteny');
        setOrders([]);
      }
    } catch (err) {
      console.error('Kritická chyba při načítání objednávek:', err);
      toast.error('Nepodařilo se načíst objednávky');
    }
  };

  const updateOrderStatus = async (orderId: number, newStatus: 'pending' | 'completed' | 'cancelled') => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (!error) {
      toast.success(`Objednávka ${newStatus}`);
      fetchOrders();
    } else {
      toast.error('Nepodařilo se aktualizovat stav objednávky');
    }
  };

  const renderStatusButton = (order: Order) => {
    switch(order.status) {
      case 'pending':
        return (
          <>
            <button 
              onClick={() => updateOrderStatus(order.id, 'completed')}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded mr-2"
            >
              Dokončit
            </button>
            <button 
              onClick={() => updateOrderStatus(order.id, 'cancelled')}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
            >
              Zrušit
            </button>
          </>
        );
      case 'completed':
        return <span className="text-green-500">Dokončeno</span>;
      case 'cancelled':
        return <span className="text-red-500">Zrušeno</span>;
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Správa Objednávek</h1>
        <Link 
          to="/admin/dashboard" 
          className="flex items-center text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-all"
        >
          <ArrowLeft className="mr-2" /> Zpět na dashboard
        </Link>
      </div>
      
      <div className="mb-6 flex space-x-4">
        <button 
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-600' : 'bg-gray-700'}`}
        >
          Všechny
        </button>
        <button 
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded ${filter === 'pending' ? 'bg-blue-600' : 'bg-gray-700'}`}
        >
          Čekající
        </button>
        <button 
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 rounded ${filter === 'completed' ? 'bg-blue-600' : 'bg-gray-700'}`}
        >
          Dokončené
        </button>
        <button 
          onClick={() => setFilter('cancelled')}
          className={`px-4 py-2 rounded ${filter === 'cancelled' ? 'bg-blue-600' : 'bg-gray-700'}`}
        >
          Zrušené
        </button>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-gray-800 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Objednávka č. {order.id}</h2>
              <span className="text-gray-400">{new Date(order.created_at).toLocaleString()}</span>
            </div>
            
            <div className="mb-4">
              <h3 className="font-bold mb-2">Položky objednávky:</h3>
              {order.order_items.map((item) => (
                <div key={item.game_id} className="flex justify-between">
                  <span>{item.game_title}</span>
                  <span>{item.price} Kč</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <div>
                <strong>Celková cena:</strong> {order.total_amount} Kč
              </div>
              <div className="flex space-x-2">
                {renderStatusButton(order)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
