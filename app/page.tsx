/**
 * app/page.tsx
 */

import Link from 'next/link';
import { db } from '@/lib/db';
import Carousel from '@/components/home/Carousel';

export default async function HomePage() {
  const images = await db.getCarouselImages();

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-black flex flex-col items-center justify-center relative overflow-hidden pb-20">
      {/* Luces de fondo sutiles */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-500/5 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]"></div>

      <main className="relative z-10 w-full max-w-6xl px-4 flex flex-col items-center gap-12">
        {/* Carrusel Dinámico */}
        <Carousel images={images} />

        {/* Botón de Menú (Estilo Ámbar solicitado) */}
        <div className="text-center">
          <Link 
            href="/menu" 
            className="group relative inline-flex items-center justify-center"
          >
            {/* Brillo exterior */}
            <div className="absolute -inset-1 bg-amber-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            
            <div className="relative bg-amber-500 hover:bg-amber-400 text-black px-16 py-6 rounded-2xl font-black text-2xl tracking-widest transition-all hover:scale-105 active:scale-95 shadow-2xl">
              MENÚ
            </div>
          </Link>
          
          <p className="mt-6 text-gray-500 text-xs font-black uppercase tracking-[0.3em]">
            BIRRERIA 11•22
          </p>
        </div>
      </main>

      <footer className="mt-20 text-gray-800 text-[10px] font-black uppercase tracking-[0.5em]">
        Calidad y Tradición
      </footer>
    </div>
  );
}
