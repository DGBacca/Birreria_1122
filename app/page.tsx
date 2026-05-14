import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0f1115] flex flex-col items-center justify-center relative overflow-hidden">
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
            VER MENÚ
          </Link>
          <Link 
            href="/login" 
            className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-12 py-5 rounded-2xl font-bold text-xl transition-all"
          >
            ACCESO PERSONAL
          </Link>
        </div>
      </main>

      <footer className="absolute bottom-8 w-full text-center text-gray-600 text-sm font-medium">
        <p>BIRRERIA 11•22 - CALIDAD Y TRADICIÓN</p>
      </footer>
    </div>
  );
}
