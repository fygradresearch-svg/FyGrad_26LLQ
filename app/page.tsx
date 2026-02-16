'use client';

import dynamic from 'next/dynamic';

// Dynamically import the Map component with no SSR
const WorldMap = dynamic(() => import('../components/WorldMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] w-full flex items-center justify-center bg-zinc-900 rounded-2xl animate-pulse">
      <p className="text-zinc-400 font-medium">Cargando Mapa Global...</p>
    </div>
  ),
});

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-indigo-500/30">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-20 lg:py-32">
        <div className="flex flex-col items-center text-center space-y-8 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-indigo-300 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Investigación Académica: Hipótesis v1.2
          </div>

          <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight text-white max-w-5xl leading-tight">
            Modelo digital para la <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">conexión internacional de profesores</span> a través de un entorno digital georeferenciado
          </h1>

          <p className="text-zinc-400 text-lg lg:text-xl max-w-3xl leading-relaxed">
            Esta plataforma sirve como prototipo experimental para validar la eficiencia de los entornos síncronos geolocalizados en la colaboración académica global y la transferencia de conocimiento entre pares.
          </p>
        </div>

        <div className="animate-slide-up">
          <WorldMap />
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300">
            <h3 className="text-xl font-bold mb-3 text-indigo-300">Interconexión Síncrona</h3>
            <p className="text-zinc-500 leading-relaxed">
              Eliminamos las barreras geográficas permitiendo el contacto instantáneo entre docentes con especialidades complementarias.
            </p>
          </div>
          <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300">
            <h3 className="text-xl font-bold mb-3 text-purple-300">Visualización Estratégica</h3>
            <p className="text-zinc-500 leading-relaxed">
              El entorno georreferenciado facilita la identificación de nodos de conocimiento y polos de investigación regional.
            </p>
          </div>
          <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300">
            <h3 className="text-xl font-bold mb-3 text-pink-300">Validación de Hipótesis</h3>
            <p className="text-zinc-500 leading-relaxed">
              Recopilación de métricas sobre la eficacia del modelo en la reducción de la brecha digital en la educación superior.
            </p>
          </div>
        </div>

        <footer className="mt-32 pt-12 border-t border-white/10 text-center">
          <p className="text-zinc-600 text-sm">
            © 2026 Prototipo de Investigación Científica - Entornos Digitales Georreferenciados
          </p>
        </footer>
      </main>
    </div>
  );
}
