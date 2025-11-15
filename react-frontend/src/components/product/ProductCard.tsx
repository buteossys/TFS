'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
  Dialog,
  Grid,
} from '@mui/material';
import { ShoppingCart, Close as CloseIcon } from '@mui/icons-material';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';

interface ProductCardProps {
  id: string;
  title?: string;
  name?: string;
  price?: number;
  base_price?: number;
  image?: string;
  images?: Array<{
    image_url: string;
    image_priority?: number;
    alt_text?: string;
  }>;
  condition?: string;
  size?: string;
  brand?: string;
  category: string;
  description?: string;
  onClick?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  title,
  name,
  price,
  base_price,
  image,
  images,
  condition,
  size,
  brand,
  category,
  description,
  onClick,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { dispatch } = useCart();

  // Get display values with fallbacks
  const displayTitle = title || name || 'Untitled Product';
  const displayImage = image || (images && images[0]?.image_url) || '/placeholder.jpg';
  const displayCondition = condition || 'N/A';
  const displaySize = size || 'N/A';
  const displayBrand = brand || 'Unknown';
  const displayDescription = description || 'No description available';
  // Use price or base_price, default to 0 if neither is available
  const displayPrice = price ?? base_price ?? 0;

  const handleAddToCart = () => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id,
        title: displayTitle,
        price: displayPrice,
        image: displayImage,
        category,
        quantity: 1,
      },
    });
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <Card
        sx={{
          height: 400,
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.2s',
          backgroundImage: 'url(/shelf1.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          '&:hover': {
            transform: 'translateY(-4px)',
          },
        }}
      >
        {/* Top section - Product Image */}
        <Box sx={{ 
          height: '50%', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          p: 2
        }}>
          <CardMedia
            component="img"
            image={displayImage}
            alt={displayTitle}
            sx={{
              width: '70%',
              height: 'auto',
              maxHeight: '100%',
              objectFit: 'contain',
              cursor: 'pointer',
            }}
            onClick={handleClick}
          />
        </Box>
        
        {/* Bottom section - Product Data */}
        <CardContent sx={{ 
          height: '50%', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          p: 2
        }}>
          <Typography
            variant="h6"
            component="h2"
            sx={{
              fontFamily: 'var(--font-markazi)',
              mb: 1,
              color: '#1a0033'
            }}
          >
            {displayTitle}
          </Typography>
          <Typography variant="h6" color="primary" gutterBottom>
            ${displayPrice.toFixed(2)}
          </Typography>
          <Button
            variant="contained"
            startIcon={<ShoppingCart />}
            onClick={handleAddToCart}
            sx={{
              fontFamily: 'var(--font-markazi)',
              mt: 1
            }}
          >
            Add to Cart
          </Button>
        </CardContent>
      </Card>

      {/* Product Modal */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <Box sx={{ position: 'relative', p: 2 }}>
          <IconButton
            onClick={() => setIsModalOpen(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              zIndex: 1,
            }}
          >
            <CloseIcon />
          </IconButton>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ position: 'relative', paddingTop: '100%' }}>
                <Image
                  src={displayImage}
                  alt={displayTitle}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography
                variant="h4"
                component="h2"
                sx={{
                  fontFamily: 'var(--font-markazi)',
                  mb: 2,
                }}
              >
                {displayTitle}
              </Typography>
              <Typography variant="h6" color="primary" gutterBottom>
                ${displayPrice.toFixed(2)}
              </Typography>
              <Typography variant="body1" paragraph>
                {displayDescription}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Chip
                  label={displayCondition}
                  color="primary"
                  variant="outlined"
                />
                <Chip
                  label={displaySize}
                  color="secondary"
                  variant="outlined"
                />
              </Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Brand: {displayBrand}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Category: {category}
              </Typography>
              <Button
                variant="contained"
                startIcon={<ShoppingCart />}
                fullWidth
                onClick={handleAddToCart}
                sx={{
                  mt: 2,
                  fontFamily: 'var(--font-markazi)',
                }}
              >
                Add to Cart
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Dialog>
    </>
  );
};

export default ProductCard; 