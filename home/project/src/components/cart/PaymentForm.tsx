import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { CreditCard, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

interface PaymentFormProps {
  totalAmount: number;
  cartItems: Array<{
    id: string;
    price: number;
  }>;
  onSuccess: () => void;
}

export function PaymentForm({ totalAmount, cartItems, onSuccess }: PaymentFormProps) {
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast.error('Please log in to complete your purchase');
      navigate('/login');
      return;
    }

    try {
      setLoading(true);

      // Create order in database
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: currentUser.id,
          total_amount: totalAmount,
          status: 'processing'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        game_id: item.id,
        price: item.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Update order status
      const { error: updateError } = await supabase
        .from('orders')
        .update({ status: 'completed' })
        .eq('id', order.id);

      if (updateError) throw updateError;

      toast.success('Payment successful!');
      onSuccess();
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-gray-800 p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-white mb-4">Payment Details</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Card Number
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
              <CreditCard className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Expiry Date
              </label>
              <input
                type="text"
                placeholder="MM/YY"
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                CVC
              </label>
              <input
                type="text"
                placeholder="123"
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <Loader className="animate-spin -ml-1 mr-3 h-5 w-5" />
            Processing...
          </span>
        ) : (
          `Pay $${totalAmount.toFixed(2)}`
        )}
      </button>
    </form>
  );
}