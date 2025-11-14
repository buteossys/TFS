"use client";

import React, { useState } from 'react';
import { Grid, Container, Typography } from '@mui/material';
import ProductCard from '@/components/product/ProductCard';
import ServicePageLayout from '@/components/ServicePageLayout';
import ProductModal from '@/components/ProductModal';
import { Product } from '@/services/db';

const backgroundImages = [
  '/backgrounds/store4.jpeg',
  '/backgrounds/store5.jpeg',
  '/backgrounds/design1.jpeg'
];

const clothingProducts: Product[] = [
  {
    id: '4',
    title: 'Vintage Leather Jacket',
    description: '1980s genuine leather jacket in excellent condition',
    price: 95.00,
    category: 'Clothing',
    stock: 1,
    sku: 'CL001',
    images: [{ image_url: '/backgrounds/design1.jpeg', image_priority: 1 }]
  },
  {
    id: '5',
    title: 'Silk Scarf Collection',
    description: 'Set of 3 vintage silk scarves with unique patterns',
    price: 35.00,
    category: 'Clothing',
    stock: 1,
    sku: 'CL002',
    images: [{ image_url: '/backgrounds/design2.jpeg', image_priority: 1 }]
  },
  {
    id: '6',
    title: 'Vintage Denim Jacket',
    description: 'Classic 1970s denim jacket with original patches',
    price: 65.00,
    category: 'Clothing',
    stock: 1,
    sku: 'CL003',
    images: [{ image_url: '/backgrounds/design3.jpeg', image_priority: 1 }]
  },
  {
    id: '13',
    title: 'Wool Peacoat',
    description: 'Navy wool peacoat from the 1960s',
    price: 125.00,
    category: 'Clothing',
    stock: 1,
    sku: 'CL004',
    images: [{ image_url: '/backgrounds/store4.jpeg', image_priority: 1 }]
  },
  {
    id: '14',
    title: 'Vintage Band T-Shirts',
    description: 'Collection of 3 authentic vintage band t-shirts',
    price: 85.00,
    category: 'Clothing',
    stock: 1,
    sku: 'CL005',
    images: [{ image_url: '/backgrounds/store5.jpeg', image_priority: 1 }]
  },
  {
    id: '15',
    title: 'Beaded Evening Bag',
    description: '1920s beaded evening bag with chain strap',
    price: 45.00,
    category: 'Clothing',
    stock: 1,
    sku: 'CL006',
    images: [{ image_url: '/backgrounds/design4.jpeg', image_priority: 1 }]
  }
];

export default function Clothing() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  return (
    <ServicePageLayout
      title="Clothing & Fashion"
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
          Express your unique style with our vintage and contemporary clothing collection.
        </Typography>
        
        <Grid container spacing={3}>
          {clothingProducts.map((product) => (
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