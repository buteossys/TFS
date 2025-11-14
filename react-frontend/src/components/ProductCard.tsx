"use client";

import React from 'react';
import Image from 'next/image';

interface Product {
  id: string;
  title: string;
  description: string;
  specifications: string;
  size: string;
  price: number;
  image: string;
  category: string;
}

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

const ProductCard = ({ product, onClick }: ProductCardProps) => {
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement add to cart functionality
    console.log('Added to cart:', product.title);
  };

  return (
    <div
      className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transform transition-transform hover:scale-105"
      onClick={onClick}
    >
      <div className="relative h-48">
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4 space-y-2">
        <h3 className="text-lg font-bold text-[#1a0033] font-[var(--font-markazi)]">
          {product.title}
        </h3>
        <p className="text-sm text-gray-600">
          {truncateText(product.description, 100)}
        </p>
        <p className="text-sm text-gray-500">
          <span className="font-semibold">Specs:</span>{' '}
          {truncateText(product.specifications.split('\n')[0], 50)}
        </p>
        <p className="text-sm text-gray-500">
          <span className="font-semibold">Size:</span> {product.size}
        </p>
        <div className="flex justify-between items-center pt-2">
          <span className="text-lg font-bold text-[#1a0033]">
            ${product.price.toFixed(2)}
          </span>
          <button
            onClick={handleAddToCart}
            className="px-4 py-2 bg-[#1a0033] text-white rounded-full text-sm font-semibold hover:bg-[#2a0052] transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 