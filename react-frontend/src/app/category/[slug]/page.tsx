"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Typography, Box, CircularProgress, Alert, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight, ShoppingCart } from '@mui/icons-material';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ProductModal from '@/components/ProductModal';
import Footer from '@/components/Footer';
import { Product, productService } from '@/services/db';
import { useCart } from '@/contexts/CartContext';

const backgroundImages = [
  '/backgrounds/fs_bckgrd1.png',
  '/backgrounds/fs_bckgrd2.png',
  '/backgrounds/fs_bckgrd3.png'
];

const shelfImages = [
  '/shelves/fs_shelf1.png',
  '/shelves/fs_shelf2.png',
  '/shelves/fs_shelf3.png'
];

// Product display component for shelf layout
interface ShelfProductProps {
  product: Product;
  onClick: () => void;
}

const ShelfProduct: React.FC<ShelfProductProps> = ({ product, onClick }) => {
  const { dispatch } = useCart();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: product.id,
        title: product.title || product.name || 'Untitled Product',
        price: product.price || product.base_price || 0,
        image: product.image || (product.images && product.images[0]?.image_url) || '/placeholder.jpg',
        category: product.category,
        quantity: 1,
      },
    });
  };

  const displayImage = product.image || (product.images && product.images[0]?.image_url);
  
  // Debug logging for image issues
  if (!displayImage) {
    console.log('No image found for product:', {
      id: product.id,
      title: product.title || product.name,
      image: product.image,
      images: product.images
    });
  }

  return (
    <Box
      onClick={onClick}
      sx={{
        width: { xs: '280px', sm: '300px', md: '320px', lg: '280px' },
        height: '100%',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      {displayImage ? (
        <Box
          sx={{
            position: 'absolute',
            top: '25%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '195px',
            height: '30%',
            borderRadius: 2,
            overflow: 'hidden',
            transition: 'transform 0.2s',
            zIndex: 3,
            '&:hover': {
              transform: 'translateX(-50%) scale(1.05)',
            },
          }}
        >
          <img
            src={displayImage}
            alt={product.title || product.name || 'Product'}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
            onError={(e) => {
              console.log('Image failed to load:', displayImage);
              e.currentTarget.style.display = 'none';
            }}
          />
        </Box>
      ) : (
        <Box
          sx={{
            position: 'absolute',
            top: '25%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '195px',
            height: '30%',
            borderRadius: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px dashed #ccc',
            zIndex: 3,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: '#666',
              textAlign: 'center',
              fontSize: '0.8rem'
            }}
          >
            No Image
          </Typography>
        </Box>
      )}
      
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '90%',
          height: '30%',
          p: 2,
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontFamily: 'var(--font-markazi)',
            color: '#1a0033',
            mb: 1,
            fontWeight: 'bold',
            fontSize: { xs: '0.9rem', sm: '1rem' },
            lineHeight: 1.2,
            textShadow: '1px 1px 2px rgba(255,255,255,0.8)',
          }}
        >
          {product.title || product.name || 'Untitled Product'}
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: '#1a0033',
            mb: 1,
            fontWeight: 'bold',
            fontSize: { xs: '1.1rem', sm: '1.2rem' },
            textShadow: '1px 1px 2px rgba(255,255,255,0.8)',
          }}
        >
          ${(product.price || product.base_price || 0).toFixed(2)}
        </Typography>
        <IconButton
          onClick={handleAddToCart}
          size="small"
          sx={{
            backgroundColor: '#1a0033',
            color: 'white',
            '&:hover': {
              backgroundColor: '#2a0052',
            },
          }}
        >
          <ShoppingCart fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
};

// Carousel Component
interface CarouselProps {
  products: Product[];
  shelfImage: string;
  onProductClick: (product: Product) => void;
}

const ProductCarousel: React.FC<CarouselProps> = ({ products, shelfImage, onProductClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  const getItemsPerView = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1200) return Math.min(4, products.length);
      if (window.innerWidth >= 900) return Math.min(3, products.length);
      if (window.innerWidth >= 600) return Math.min(2, products.length);
    }
    return 1;
  };

  const [itemsPerView, setItemsPerView] = useState(getItemsPerView());

  useEffect(() => {
    const handleResize = () => {
      setItemsPerView(getItemsPerView());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, products.length - itemsPerView);

  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const cardWidth = 360;
  const gap = 20;
  const shelfWidth = Math.min(itemsPerView * (cardWidth + gap), window?.innerWidth * 0.8 || 1200);

  return (
    <>
      {/* Multiple shelves - one for each visible product */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: `${shelfWidth}px`,
          height: '20%',
          display: 'flex',
          justifyContent: 'center',
          gap: `${gap}px`,
          zIndex: 1,
        }}
      >
        {Array.from({ length: itemsPerView }).map((_, index) => (
          <Box
            key={index}
            sx={{
              width: `${cardWidth}px`,
              height: '100%',
              backgroundImage: `url(${shelfImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          />
        ))}
      </Box>
      
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2,
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: `${shelfWidth}px`,
            height: '100%',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            ref={carouselRef}
            sx={{
              display: 'flex',
              gap: `${gap}px`,
              height: '100%',
              justifyContent: 'center',
            }}
          >
            {products.slice(currentIndex, currentIndex + itemsPerView).map((product) => (
              <Box key={product.id} sx={{ flexShrink: 0, height: '100%' }}>
                <ShelfProduct
                  product={product}
                  onClick={() => onProductClick(product)}
                />
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {products.length > itemsPerView && (
        <>
          <IconButton
            onClick={prevSlide}
            disabled={currentIndex === 0}
            sx={{
              position: 'absolute',
              left: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(26, 0, 51, 0.8)',
              color: 'white',
              zIndex: 3,
              '&:hover': {
                backgroundColor: 'rgba(26, 0, 51, 0.9)',
              },
              '&:disabled': {
                backgroundColor: 'rgba(26, 0, 51, 0.4)',
              },
            }}
          >
            <ChevronLeft />
          </IconButton>
          <IconButton
            onClick={nextSlide}
            disabled={currentIndex >= maxIndex}
            sx={{
              position: 'absolute',
              right: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(26, 0, 51, 0.8)',
              color: 'white',
              zIndex: 3,
              '&:hover': {
                backgroundColor: 'rgba(26, 0, 51, 0.9)',
              },
              '&:disabled': {
                backgroundColor: 'rgba(26, 0, 51, 0.4)',
              },
            }}
          >
            <ChevronRight />
          </IconButton>
        </>
      )}
    </>
  );
};

export default function CategoryPage() {
  const params = useParams();
  const categorySlug = params.slug as string;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalBackgroundImage, setModalBackgroundImage] = useState<string>('');
  const [modalShelfImage, setModalShelfImage] = useState<string>('');

  useEffect(() => {
    loadProducts();
  }, [categorySlug]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getAllProducts();
      
      const categoryName = categorySlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      const categoryProducts = data.filter(product => 
        product.category?.toLowerCase() === categoryName.toLowerCase() && 
        (product.is_active !== false)
      );
      
      setProducts(categoryProducts);
    } catch (err) {
      console.error('Error loading products:', err);
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (product: Product, backgroundImage: string, shelfImage: string) => {
    setSelectedProduct(product);
    setModalBackgroundImage(backgroundImage);
    setModalShelfImage(shelfImage);
    setIsModalOpen(true);
  };

  const categoryName = categorySlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  // Group products by subcategory
  const productsWithoutSubcategory = products.filter(p => !p.subcategory);
  const subcategories = Array.from(
    new Set(products.filter(p => p.subcategory).map(p => p.subcategory))
  ).sort() as string[];

  const sections = [];
  
  // Add section for products without subcategory
  if (productsWithoutSubcategory.length > 0) {
    sections.push({
      title: categoryName,
      products: productsWithoutSubcategory,
      id: 'main'
    });
  }

  // Add sections for each subcategory
  subcategories.forEach(subcategory => {
    const subcategoryProducts = products.filter(p => p.subcategory === subcategory);
    if (subcategoryProducts.length > 0) {
      sections.push({
        title: subcategory,
        products: subcategoryProducts,
        id: subcategory.toLowerCase().replace(/\s+/g, '-')
      });
    }
  });

  return (
    <>
      <Navbar />
      
      <Box 
        className="catalog-container"
        sx={{ 
          height: '100vh',
          overflowY: 'auto',
          scrollSnapType: 'y mandatory',
          pt: '64px'
        }}
      >
        {/* Title Banner */}
        <Box
          className="catalog-section"
          sx={{
            height: '100vh',
            backgroundImage: 'url(/end-scene.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            scrollSnapAlign: 'start',
            position: 'relative'
          }}
        >
          <Box
            sx={{
              textAlign: 'center',
              maxWidth: '600px',
              mx: 2
            }}
          >
            <Typography 
              variant="h2" 
              sx={{ 
                fontFamily: 'var(--font-markazi)',
                color: 'white',
                mb: 2,
                fontWeight: 'bold',
                textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
              }}
            >
              {categoryName}
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                fontFamily: 'var(--font-markazi)',
                color: 'white',
                textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
              }}
            >
              Explore our curated {categoryName.toLowerCase()} collection
            </Typography>
          </Box>
        </Box>

        {loading && (
          <Box sx={{ 
            height: '100vh',
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            scrollSnapAlign: 'start'
          }}>
            <CircularProgress size={60} />
          </Box>
        )}

        {error && (
          <Box sx={{ 
            height: '100vh',
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            scrollSnapAlign: 'start',
            p: 4
          }}>
            <Alert severity="error" sx={{ maxWidth: '600px' }}>
              {error}
            </Alert>
          </Box>
        )}

        {!loading && !error && sections.length === 0 && (
          <Box sx={{ 
            height: '100vh',
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            scrollSnapAlign: 'start'
          }}>
            <Typography variant="h6" color="text.secondary">
              No products available in this category.
            </Typography>
          </Box>
        )}

        {!loading && !error && sections.map((section, index) => {
          const backgroundImage = backgroundImages[index % backgroundImages.length];
          const shelfImage = shelfImages[index % shelfImages.length];
          
          return (
            <Box
              key={section.id}
              id={section.id}
              className="catalog-section"
              sx={{
                height: '100vh',
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                scrollSnapAlign: 'start',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
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
                  {section.title}
                </Typography>
              </Box>
              
              <ProductCarousel
                products={section.products}
                shelfImage={shelfImage}
                onProductClick={(product) => handleProductClick(product, backgroundImage, shelfImage)}
              />
            </Box>
          );
        })}

        <Box sx={{ scrollSnapAlign: 'start' }}>
          <Footer />
        </Box>

        <ProductModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          product={selectedProduct}
          backgroundImage={modalBackgroundImage}
          shelfImage={modalShelfImage}
        />
      </Box>
    </>
  );
}