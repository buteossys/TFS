'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Box, Container, Typography, Button, CircularProgress } from '@mui/material';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { dispatch } = useCart();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    if (sessionId) {
      // Clear the cart on successful payment
      dispatch({ type: 'CLEAR_CART' });
      setStatus('success');
    } else {
      setStatus('error');
    }
  }, [sessionId, dispatch]);

  if (status === 'loading') {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (status === 'error') {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Box textAlign="center">
          <Typography variant="h4" gutterBottom>
            Something went wrong
          </Typography>
          <Typography color="text.secondary" paragraph>
            We couldn't process your payment. Please try again.
          </Typography>
          <Button
            component={Link}
            href="/cart"
            variant="contained"
            sx={{ mt: 2 }}
          >
            Return to Cart
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Box textAlign="center">
        <Typography variant="h4" gutterBottom>
          Thank you for your purchase!
        </Typography>
        <Typography color="text.secondary" paragraph>
          Your order has been successfully processed. We'll send you an email with your order details.
        </Typography>
        <Button
          component={Link}
          href="/thrift-shop"
          variant="contained"
          sx={{ mt: 2 }}
        >
          Continue Shopping
        </Button>
      </Box>
    </Container>
  );
}

export default function CheckoutSuccess() {
  return (
    <Suspense
      fallback={
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '60vh',
          }}
        >
          <CircularProgress />
        </Box>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
} 