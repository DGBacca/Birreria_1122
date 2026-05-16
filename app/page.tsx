/**
 * app/page.tsx
 */

'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function HomePage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-[calc(100-5rem)] flex flex-col items-center justify-center relative overflow-hidden py-20">
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-500/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]"></div>

      <main className="relative z-10 text-center px-4">
        <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-4">
          BIRRERIA <span className="text-amber-500">11•22</span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-medium">
          La experiencia definitiva en bebidas artesanales. 
          Explora nuestro menú digital y descubre sabores únicos.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link 
            href="/menu" 
            className="bg-amber-500 hover:bg-amber-600 text-black px-12 py-5 rounded-2xl font-black text-xl transition-all hover:scale-105 shadow-2xl shadow-amber-500/20"
          >
            {session ? 'IR AL TABLERO' : 'VER MENÚ'}
          </Link>
          
          {!session && (
            <Link 
              href="/login" 
              className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-12 py-5 rounded-2xl font-bold text-xl transition-all"
            >
              ACCESO PERSONAL
            </Link>
          )}
        </div>
      </main>

      <footer className="mt-20 text-gray-600 text-sm font-medium">
        <p>BIRRERIA 11•22 - CALIDAD Y TRADICIÓN</p>
      </footer>
    </div>
  );
}
