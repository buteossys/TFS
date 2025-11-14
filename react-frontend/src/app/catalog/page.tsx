"use client";

import React, { useState } from 'react';
import { Grid, Container, Typography, Box } from '@mui/material';
import ProductCard from '@/components/product/ProductCard';
import ServicePageLayout from '@/components/ServicePageLayout';
import ProductModal from '@/components/ProductModal';
import { Product } from '@/services/db';

const backgroundImages = [
  '/backgrounds/store1.jpeg',
  '/backgrounds/store2.jpeg',
  '/backgrounds/store3.jpeg',
  '/backgrounds/store4.jpeg',
  '/backgrounds/store5.jpeg'
];

// Mock products based on API structure
const mockProducts: Product[] = [
  // Home Goods
  {
    id: '1',
    title: 'Vintage Ceramic Vase',
    description: 'Beautiful hand-painted ceramic vase from the 1960s',
    price: 45.00,
    category: 'Home Goods',
    stock: 1,
    sku: 'HG001',
    images: [{ image_url: '/backgrounds/store1.jpeg', image_priority: 1 }],
  },
  {
    id: '2',
    title: 'Mid-Century Coffee Table',
    description: 'Solid wood coffee table with tapered legs',
    price: 285.00,
    category: 'Home Goods',
    stock: 1,
    sku: 'HG002',
    images: [{ image_url: '/backgrounds/store2.jpeg', image_priority: 1 }],
  },
  {
    id: '3',
    title: 'Copper Kitchen Set',
    description: 'Set of 3 copper pots with wooden handles',
    price: 125.00,
    category: 'Home Goods',
    stock: 1,
    sku: 'HG003',
    images: [{ image_url: '/backgrounds/store3.jpeg', image_priority: 1 }],
  },
  // Clothing
  {
    id: '4',
    title: 'Vintage Leather Jacket',
    description: '1980s genuine leather jacket in excellent condition',
    price: 95.00,
    category: 'Clothing',
    stock: 1,
    sku: 'CL001',
    images: [{ image_url: '/backgrounds/design1.jpeg', image_priority: 1 }],
  },
  {
    id: '5',
    title: 'Silk Scarf Collection',
    description: 'Set of 3 vintage silk scarves with unique patterns',
    price: 35.00,
    category: 'Clothing',
    stock: 1,
    sku: 'CL002',
    images: [{ image_url: '/backgrounds/design2.jpeg', image_priority: 1 }],
  },
  {
    id: '6',
    title: 'Vintage Denim Jacket',
    description: 'Classic 1970s denim jacket with original patches',
    price: 65.00,
    category: 'Clothing',
    stock: 1,
    sku: 'CL003',
    images: [{ image_url: '/backgrounds/design3.jpeg', image_priority: 1 }],
  },
  // Art & Antiques
  {
    id: '7',
    title: 'Oil Painting Landscape',
    description: 'Original oil painting of countryside scene, signed',
    price: 350.00,
    category: 'Art & Antiques',
    stock: 1,
    sku: 'AA001',
    images: [{ image_url: '/backgrounds/design4.jpeg', image_priority: 1 }],
  },
  {
    id: '8',
    title: 'Antique Brass Candlesticks',
    description: 'Pair of Victorian-era brass candlesticks',
    price: 85.00,
    category: 'Art & Antiques',
    stock: 1,
    sku: 'AA002',
    images: [{ image_url: '/backgrounds/design5.jpeg', image_priority: 1 }],
  },
  {
    id: '9',
    title: 'Vintage Record Collection',
    description: 'Collection of 20 vinyl records from the 1960s-70s',
    price: 150.00,
    category: 'Art & Antiques',
    stock: 1,
    sku: 'AA003',
    images: [{ image_url: '/backgrounds/store4.jpeg', image_priority: 1 }],
  }
];

export default function AllProducts() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const categories = ['Home Goods', 'Clothing', 'Art & Antiques'];

  return (
    <ServicePageLayout
      title="All Products"
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
          Discover unique treasures across our curated collection of home goods, clothing, and art.
        </Typography>
        
        {categories.map((category) => {
          const categoryProducts = mockProducts.filter(product => product.category === category);
          
          return (
            <Box key={category} sx={{ mb: 8 }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  mb: 4, 
                  fontFamily: 'var(--font-markazi)',
                  color: '#1a0033',
                  textAlign: 'center'
                }}
              >
                {category}
              </Typography>
              
              <Grid container spacing={3}>
                {categoryProducts.map((product) => (
                  <Grid item key={product.id} xs={12} sm={6} md={4}>
                    <ProductCard {...product} onClick={() => handleProductClick(product)} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          );
        })}
      </Container>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
      />
    </ServicePageLayout>
  );
} 