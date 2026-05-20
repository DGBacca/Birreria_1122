'use client';

import { useState, useEffect, useRef } from 'react';

interface CarouselImage {
  id: number;
  url: string;
  alt_text?: string;
}

export default function Carousel({ images }: { images: CarouselImage[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (images.length === 0) return;
    
    // Auto-scroll logic
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const maxScroll = scrollWidth - clientWidth;
        
        if (scrollLeft >= maxScroll - 10) {
          // Reset to start if we reached the end
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          // Scroll one image width
          const firstChild = scrollRef.current.firstElementChild as HTMLElement;
          const scrollAmount = firstChild ? firstChild.clientWidth + 16 : clientWidth / 3; // 16 is gap-4
          scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      }
    }, 4000);
    
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
    <div className="relative w-full">
      {/* Carrusel deslizable */}
      <div 
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide py-4 px-2"
        style={{ scrollBehavior: 'smooth' }}
      >
        {images.map((image) => (
          <div
            key={image.id}
            className="snap-center shrink-0 w-[80%] sm:w-[45%] md:w-[30%] lg:w-[calc(33.333%-11px)] aspect-[9/16] relative rounded-3xl overflow-hidden border border-white/10 group shadow-xl"
          >
            <img
              src={image.url}
              alt={image.alt_text || 'Birreria 11•22'}
              className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700"
            />
            {/* Overlay gradiente opcional para legibilidad si hubiera texto */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
          </div>
        ))}
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
