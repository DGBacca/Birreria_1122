/**
 * components/home/Carousel.tsx
 */

'use client';

import { useState, useEffect } from 'react';

interface CarouselImage {
  id: number;
  url: string;
  alt_text?: string;
}

export default function Carousel({ images }: { images: CarouselImage[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  if (images.length === 0) {
    return (
      <div className="w-full aspect-video md:aspect-[21/9] bg-white/5 rounded-[2.5rem] flex items-center justify-center border border-white/5">
        <p className="text-gray-600 font-bold italic">Sube imágenes desde el administrador para el carrusel</p>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video md:aspect-[21/9] overflow-hidden rounded-[2.5rem] border border-white/10 group shadow-2xl">
      {images.map((image, index) => (
        <div
          key={image.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={image.url}
            alt={image.alt_text || 'Birreria 11•22'}
            className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-10000"
          />
          {/* Overlay gradiente */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        </div>
      ))}

      {/* Indicadores */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-1 rounded-full transition-all ${
              index === currentIndex ? 'w-8 bg-amber-500' : 'w-2 bg-white/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
