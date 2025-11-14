"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const OpeningPanel = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Background Image */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: 'url("/backgrounds/intro1.jpeg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <Image
            src="/logo_nobg.png"
            alt="The Fair Shoppe Logo"
            width={300}
            height={300}
            className="mx-auto"
          />
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6 leading-snug font-markazi">
          Discover unique treasures for your home and wardrobe
        </h1>
        <p className="text-xl sm:text-2xl text-white/90 font-markazi mb-8">
          Curated home goods • Vintage clothing • Art & antiques
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/catalog"
            className="inline-block px-8 py-3 bg-white/90 backdrop-blur-sm text-gray-900 rounded-full font-semibold hover:bg-white transition-colors shadow-lg font-markazi"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OpeningPanel; 