"use client";

import React, { useState } from 'react';
import { Grid, Container, Typography } from '@mui/material';
import ProductCard from '@/components/product/ProductCard';
import ServicePageLayout from '@/components/ServicePageLayout';
import ProductModal from '@/components/ProductModal';
import { Product } from '@/services/db';

const backgroundImages = [
  '/backgrounds/design2.jpeg',
  '/backgrounds/design3.jpeg',
  '/backgrounds/design4.jpeg'
];

const artAntiquesProducts: Product[] = [
  {
    id: '7',
    title: 'Oil Painting Landscape',
    description: 'Original oil painting of countryside scene, signed',
    price: 350.00,
    category: 'Art & Antiques',
    stock: 1,
    sku: 'AA001',
    images: [{ image_url: '/backgrounds/design4.jpeg', image_priority: 1 }]
  },
  {
    id: '8',
    title: 'Antique Brass Candlesticks',
    description: 'Pair of Victorian-era brass candlesticks',
    price: 85.00,
    category: 'Art & Antiques',
    stock: 1,
    sku: 'AA002',
    images: [{ image_url: '/backgrounds/design5.jpeg', image_priority: 1 }]
  },
  {
    id: '9',
    title: 'Vintage Record Collection',
    description: 'Collection of 20 vinyl records from the 1960s-70s',
    price: 150.00,
    category: 'Art & Antiques',
    stock: 1,
    sku: 'AA003',
    images: [{ image_url: '/backgrounds/store4.jpeg', image_priority: 1 }]
  },
  {
    id: '16',
    title: 'Antique Pocket Watch',
    description: 'Gold-plated pocket watch from the 1920s',
    price: 275.00,
    category: 'Art & Antiques',
    stock: 1,
    sku: 'AA004',
    images: [{ image_url: '/backgrounds/design2.jpeg', image_priority: 1 }]
  },
  {
    id: '17',
    title: 'Vintage Map Collection',
    description: 'Set of 5 antique maps from the 1800s',
    price: 195.00,
    category: 'Art & Antiques',
    stock: 1,
    sku: 'AA005',
    images: [{ image_url: '/backgrounds/design3.jpeg', image_priority: 1 }]
  },
  {
    id: '18',
    title: 'Crystal Decanter Set',
    description: 'Cut crystal decanter with 6 matching glasses',
    price: 125.00,
    category: 'Art & Antiques',
    stock: 1,
    sku: 'AA006',
    images: [{ image_url: '/backgrounds/contact1.jpeg', image_priority: 1 }]
  }
];

export default function ArtAntiques() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  return (
    <ServicePageLayout
      title="Art & Antiques"
      backgroundImages={backgroundImages}
    >
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography 
          variant="h6" 
          color="text.secondary" 
          sx={{ 
            textAlign: 'center', 
            mb: 6,
            fontFamily: 'var(--font-markazi)'
          }}
        >
          Discover treasures from the past and artistic creations that inspire.
        </Typography>
        
        <Grid container spacing={3}>
          {artAntiquesProducts.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={4}>
              <ProductCard {...product} onClick={() => handleProductClick(product)} />
            </Grid>
          ))}
        </Grid>
      </Container>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
      />
    </ServicePageLayout>
  );
}