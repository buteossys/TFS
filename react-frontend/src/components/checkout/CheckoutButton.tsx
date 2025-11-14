'use client';

import { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { useCart } from '@/contexts/CartContext';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface CheckoutButtonProps {
  userId?: string;
}

export default function CheckoutButton({ userId }: CheckoutButtonProps) {
  const { state } = useCart();
  const items = state.items;
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setLoading(true);

      // Create checkout session
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          userId,
        }),
      });

      const data = await response.json();
      
      // The API returns { url } for the payment link
      if (data.url) {
        // Redirect to payment URL
        window.location.href = data.url;
      } else if (data.sessionId) {
        // Fallback: if it's a Stripe session ID, use Stripe redirect
        const stripe = await stripePromise;
        if (!stripe) throw new Error('Stripe failed to load');
        
        const { error } = await stripe.redirectToCheckout({
          sessionId: data.sessionId,
        });

        if (error) {
          throw error;
        }
      } else {
        throw new Error('No payment URL or session ID received');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('Failed to start checkout process. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="contained"
      color="primary"
      size="large"
      onClick={handleCheckout}
      disabled={loading || items.length === 0}
      sx={{ mt: 2 }}
    >
      {loading ? (
        <CircularProgress size={24} color="inherit" />
      ) : (
        'Proceed to Checkout'
      )}
    </Button>
  );
} 