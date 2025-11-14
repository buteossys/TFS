"use client";

import React, { useState } from 'react';
import { Grid, Container, Typography } from '@mui/material';
import ProductCard from '@/components/product/ProductCard';
import ServicePageLayout from '@/components/ServicePageLayout';
import ProductModal from '@/components/ProductModal';
import { Product } from '@/services/db';

const backgroundImages = [
  '/backgrounds/store1.jpeg',
  '/backgrounds/store2.jpeg',
  '/backgrounds/store3.jpeg'
];

const homeGoodsProducts: Product[] = [
  {
    id: '1',
    title: 'Vintage Ceramic Vase',
    description: 'Beautiful hand-painted ceramic vase from the 1960s',
    price: 45.00,
    category: 'Home Goods',
    stock: 1,
    sku: 'HG001',
    images: [{ image_url: '/backgrounds/store1.jpeg', image_priority: 1 }]
  },
  {
    id: '2',
    title: 'Mid-Century Coffee Table',
    description: 'Solid wood coffee table with tapered legs',
    price: 285.00,
    category: 'Home Goods',
    stock: 1,
    sku: 'HG002',
    images: [{ image_url: '/backgrounds/store2.jpeg', image_priority: 1 }]
  },
  {
    id: '3',
    title: 'Copper Kitchen Set',
    description: 'Set of 3 copper pots with wooden handles',
    price: 125.00,
    category: 'Home Goods',
    stock: 1,
    sku: 'HG003',
    images: [{ image_url: '/backgrounds/store3.jpeg', image_priority: 1 }]
  },
  {
    id: '10',
    title: 'Woven Throw Blanket',
    description: 'Handwoven wool throw in earth tones',
    price: 75.00,
    category: 'Home Goods',
    stock: 1,
    sku: 'HG004',
    images: [{ image_url: '/backgrounds/store4.jpeg', image_priority: 1 }]
  },
  {
    id: '11',
    title: 'Glass Hurricane Lamps',
    description: 'Pair of vintage glass hurricane lamps',
    price: 55.00,
    category: 'Home Goods',
    stock: 1,
    sku: 'HG005',
    images: [{ image_url: '/backgrounds/store5.jpeg', image_priority: 1 }]
  },
  {
    id: '12',
    title: 'Wooden Serving Tray',
    description: 'Handcrafted wooden serving tray with handles',
    price: 35.00,
    category: 'Home Goods',
    stock: 1,
    sku: 'HG006',
    images: [{ image_url: '/backgrounds/design1.jpeg', image_priority: 1 }]
  }
];

export default function HomeGoods() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  return (
    <ServicePageLayout
      title="Home Goods"
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
          Transform your living space with our curated collection of home decor and essentials.
        </Typography>
        
        <Grid container spacing={3}>
          {homeGoodsProducts.map((product) => (
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