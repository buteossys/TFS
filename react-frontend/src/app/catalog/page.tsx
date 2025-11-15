"use client";

import React, { useState, useEffect } from 'react';
import { Grid, Container, Typography, Box, CircularProgress, Alert } from '@mui/material';
import ProductCard from '@/components/product/ProductCard';
import ServicePageLayout from '@/components/ServicePageLayout';
import ProductModal from '@/components/ProductModal';
import { Product, productService } from '@/services/db';

const backgroundImages = [
  '/backgrounds/store1.jpeg',
  '/backgrounds/store2.jpeg',
  '/backgrounds/store3.jpeg',
  '/backgrounds/store4.jpeg',
  '/backgrounds/store5.jpeg'
];

export default function AllProducts() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getAllProducts();
      
      // Transform API response: map 'name' to 'title' for frontend compatibility
      const transformedProducts = data.map((product: Product) => ({
        ...product,
        title: product.title || product.name || 'Untitled Product',
      }));
      
      setProducts(transformedProducts);
    } catch (err) {
      console.error('Error loading products:', err);
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // Get unique categories from products
  const categories = Array.from(
    new Set(products.map(p => p.category).filter(Boolean))
  ).sort() as string[];

  // If no categories found, use default categories
  const displayCategories = categories.length > 0 
    ? categories 
    : ['Home Goods', 'Clothing', 'Art & Antiques'];

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

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {!loading && !error && products.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No products available at this time.
            </Typography>
          </Box>
        )}

        {!loading && !error && displayCategories.map((category) => {
          const categoryProducts = products.filter(
            product => product.category === category && (product.is_active !== false)
          );
          
          if (categoryProducts.length === 0) return null;
          
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