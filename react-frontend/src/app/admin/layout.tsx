'use client';

import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Implement proper authentication check
    // For now, we'll just simulate a check
    const checkAuth = async () => {
      try {
        // Replace this with actual authentication check
        const isAuthenticated = localStorage.getItem('isAdmin') === 'true';
        
        if (!isAuthenticated) {
          router.push('/admin/login');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/admin/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {children}
    </Box>
  );
} 