'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from "@/components/Navbar";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showButton, setShowButton] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const router = useRouter();

  const handleEnterShop = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setShowButton(false);
      // Backup redirect after 16 seconds
      setTimeout(() => {
        router.push('/catalog');
      }, 16000);
    }
  };

  const handleVideoEnd = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      router.push('/catalog');
    }, 800); // Allow blur effect to show
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="relative h-screen overflow-hidden">
        <video
          ref={videoRef}
          className={`w-full h-full object-cover transition-all duration-800 ${
            isTransitioning ? 'blur-md opacity-80' : ''
          }`}
          src="/intro_vid.mp4"
          onEnded={handleVideoEnd}
          preload="metadata"
        />
        {showButton && !isTransitioning && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={handleEnterShop}
              className="bg-white/90 hover:bg-white text-black font-bold py-4 px-8 rounded-lg text-xl shadow-lg transition-all duration-300 hover:scale-105"
            >
              Enter the Shoppe
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
