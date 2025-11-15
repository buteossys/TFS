'use client';

import { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { useCart } from '@/contexts/CartContext';

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
      
      // The API returns { url } for the payment link (handled by backend)
      if (data.url) {
        // Redirect to payment URL
        window.location.href = data.url;
      } else {
        throw new Error('No payment URL received from backend');
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