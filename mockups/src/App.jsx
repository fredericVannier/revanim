import { useState } from 'react'
import HomeScreen from './screens/HomeScreen.jsx'
import AnimeDetailScreen from './screens/AnimeDetailScreen.jsx'

export default function App() {
  const [activeScreen, setActiveScreen] = useState('both')

  return (
    <div
      style={{ fontFamily: "'DM Sans', sans-serif" }}
      className="min-h-screen bg-[#06060F] flex flex-col"
    >
      {/* Barre de navigation des maquettes */}
      <header
        className="flex items-center justify-between px-8 py-4"
        style={{
          borderBottom: '1px solid rgba(201,168,76,0.08)',
          background: 'linear-gradient(180deg, rgba(10,10,20,0.95) 0%, rgba(6,6,15,1) 100%)',
          backdropFilter: 'blur(16px)',
        }}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-baseline">
            <span
              style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.03em' }}
              className="text-xl font-bold text-white/50"
            >
              rev
            </span>
            <span
              style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.03em' }}
              className="text-xl font-bold text-[#C9A84C]"
            >
              Anim
            </span>
          </div>
          <span className="text-[#4B5563] text-sm ml-2">Maquettes UI</span>
        </div>
        <div className="flex items-center gap-2">
          {[
            { key: 'home', label: 'Accueil' },
            { key: 'detail', label: 'Fiche d\u00E9tail' },
            { key: 'both', label: 'Les deux' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveScreen(key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeScreen === key
                  ? 'text-[#0A0A14] font-semibold'
                  : 'text-[#6B7280] hover:text-white'
              }`}
              style={
                activeScreen === key
                  ? {
                      background: 'linear-gradient(135deg, #C9A84C, #8B6914)',
                      boxShadow: '0 4px 16px rgba(201,168,76,0.25)',
                    }
                  : {
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.06)',
                    }
              }
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      {/* Zone d'affichage des maquettes */}
      <main className="flex-1 flex items-start justify-center gap-12 p-10 overflow-x-auto">
        {(activeScreen === 'home' || activeScreen === 'both') && (
          <div className="flex flex-col items-center gap-4 shrink-0">
            <p
              style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '0.1em' }}
              className="text-[#4B5563] text-xs font-medium uppercase"
            >
              HomeScreen.jsx
            </p>
            <HomeScreen />
          </div>
        )}
        {(activeScreen === 'detail' || activeScreen === 'both') && (
          <div className="flex flex-col items-center gap-4 shrink-0">
            <p
              style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '0.1em' }}
              className="text-[#4B5563] text-xs font-medium uppercase"
            >
              AnimeDetailScreen.jsx
            </p>
            <AnimeDetailScreen />
          </div>
        )}
      </main>

      <footer
        className="text-center py-4 text-[#2A2A3E] text-xs"
        style={{ borderTop: '1px solid rgba(255,255,255,0.03)' }}
      >
        <span style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          <span className="text-white/30">rev</span>
          <span className="text-[#C9A84C]/40">Anim</span>
        </span>
        <span className="mx-2 text-white/10">|</span>
        Design "Cin\u00E9ma de nuit"
      </footer>
    </div>
  )
}
