"use client";

import React from 'react';
import {
  Dialog,
  Typography,
  Box,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon, ShoppingCart } from '@mui/icons-material';
import type { Product } from '@/services/db';
import { useCart } from '@/contexts/CartContext';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  backgroundImage?: string;
  shelfImage?: string;
}

const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  product,
  backgroundImage,
  shelfImage,
}) => {
  const { dispatch } = useCart();
  
  if (!product) return null;

  const displayTitle = product.title || product.name || 'Untitled Product';
  const displayImage = product.image || (product.images && product.images[0]?.image_url) || '/placeholder.jpg';
  const displayPrice = product.price || product.base_price || 0;

  const handleAddToCart = () => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: product.id,
        title: displayTitle,
        price: displayPrice,
        image: displayImage,
        category: product.category,
        quantity: 1,
      },
    });
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth={false}
      fullWidth
      PaperProps={{
        sx: {
          width: '90vw',
          height: '90vh',
          maxWidth: 'none',
          maxHeight: 'none',
          borderRadius: 2,
          overflow: 'hidden',
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        },
      }}
    >
      {/* Close Button */}
      <IconButton
        onClick={onClose}
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          zIndex: 10,
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 1)',
          },
        }}
      >
        <CloseIcon />
      </IconButton>

      {/* Product Title - Top 20% */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '20%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 4,
        }}
      >
        <Typography 
          variant="h3" 
          sx={{ 
            fontFamily: 'var(--font-markazi)',
            color: '#1a0033',
            textAlign: 'center',
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(255,255,255,0.8)',
          }}
        >
          {displayTitle}
        </Typography>
      </Box>

      {/* Product Image - 20% to 50% from top */}
      <Box
        sx={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '300px',
          height: '30%',
          borderRadius: 2,
          overflow: 'hidden',
          zIndex: 3,
        }}
      >
        <img
          src={displayImage}
          alt={displayTitle}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </Box>

      {/* Shelf Image - 50% to 70% from top */}
      {shelfImage && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '600px',
            height: '20%',
            backgroundImage: `url(${shelfImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            zIndex: 1,
          }}
        />
      )}

      {/* Product Details - Bottom 30% */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '80%',
          height: '30%',
          p: 3,
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 2,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: '#1a0033',
            mb: 2,
            fontWeight: 'bold',
            textShadow: '1px 1px 2px rgba(255,255,255,0.8)',
          }}
        >
          ${displayPrice.toFixed(2)}
        </Typography>
        
        {product.description && (
          <Typography
            variant="body1"
            sx={{
              color: '#1a0033',
              mb: 3,
              textShadow: '1px 1px 2px rgba(255,255,255,0.8)',
              maxWidth: '600px',
            }}
          >
            {product.description}
          </Typography>
        )}
        
        <IconButton
          onClick={handleAddToCart}
          sx={{
            backgroundColor: '#1a0033',
            color: 'white',
            p: 2,
            '&:hover': {
              backgroundColor: '#2a0052',
            },
          }}
        >
          <ShoppingCart fontSize="large" />
        </IconButton>
      </Box>
    </Dialog>
  );
};

export default ProductModal; 