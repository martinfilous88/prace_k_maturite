import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';

const app = express();
const stripe = new Stripe('sk_test_váš_tajný_klíč');

app.use(cors());
app.use(express.json());

app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { items, userId } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map(item => ({
        price_data: {
          currency: 'czk',
          product_data: {
            name: item.game.title,
            description: item.game.shortDescription,
            images: [item.game.imageUrl],
          },
          unit_amount: item.game.price * 100,
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: 'http://localhost:5173/payment/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:5173/cart',
      metadata: {
        userId,
      },
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(3001, () => {
  console.log('Server běží na portu 3001');
}); 