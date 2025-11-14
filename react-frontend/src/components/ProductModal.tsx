"use client";

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import Image from 'next/image';
import type { Product } from '@/services/db';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  product,
}) => {
  if (!product) return null;

  // Get display values with fallbacks
  const displayTitle = product.title || product.name || 'Untitled Product';
  const displayImage = product.image || (product.images && product.images[0]?.image_url) || '/placeholder.jpg';
  const displayCondition = product.condition || 'N/A';
  const displaySize = product.size || 'N/A';
  const displayBrand = product.brand || 'Unknown';
  const displayDescription = product.description || 'No description available';

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          overflow: 'hidden',
        },
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {displayTitle}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
          {/* Product Image */}
          <Box
            sx={{
              position: 'relative',
              width: { xs: '100%', md: '50%' },
              height: '400px',
            }}
          >
            <Image
              src={displayImage}
              alt={displayTitle}
              fill
              style={{ objectFit: 'cover' }}
            />
          </Box>

          {/* Product Details */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" color="primary" gutterBottom>
              ${product.price.toFixed(2)}
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Chip
                label={displayCondition}
                color="secondary"
                sx={{ borderRadius: 1 }}
              />
              {product.size && (
                <Chip
                  label={`Size: ${displaySize}`}
                  variant="outlined"
                  sx={{ borderRadius: 1 }}
                />
              )}
              {product.brand && (
                <Chip
                  label={displayBrand}
                  variant="outlined"
                  sx={{ borderRadius: 1 }}
                />
              )}
            </Box>

            <Typography variant="body1" color="text.secondary" paragraph>
              {displayDescription}
            </Typography>

            <Typography variant="subtitle2" color="text.secondary">
              Category: {product.category}
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Close</Button>
        <Button variant="contained" color="primary">
          Add to Cart
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductModal; 