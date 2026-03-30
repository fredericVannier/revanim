import { useState } from 'react'

// --- Icones SVG inline ---

function IconSearch({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

function IconBell({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  )
}

function IconHome({ size = 22, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none">
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </svg>
  )
}

function IconSearchTab({ size = 22, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

function IconList({ size = 22, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" strokeWidth="3" />
      <line x1="3" y1="12" x2="3.01" y2="12" strokeWidth="3" />
      <line x1="3" y1="18" x2="3.01" y2="18" strokeWidth="3" />
    </svg>
  )
}

function IconProfile({ size = 22, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function StarIcon({ filled = true, size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? '#F59E0B' : 'none'} stroke="#F59E0B" strokeWidth="2">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

// --- Donnees mock ---

const FEATURED_ANIME = {
  title: 'Attack on Titan',
  titleJp: '\u9032\u6483\u306E\u5DE8\u4EBA',
  score: '9.0',
  episodes: 87,
  year: 2013,
  gradient: 'from-[#1a0a0a] via-[#3d1515] to-[#8b1a1a]',
  accentColor: '#C0392B',
  genre: 'Action \u2022 Drame',
  description: "Dans un monde o\u00F9 l\u2019humanit\u00E9 vit derri\u00E8re d\u2019immenses murs pour se prot\u00E9ger des Titans...",
}

const TRENDING_ANIMES = [
  {
    id: 1,
    title: 'Demon Slayer',
    titleJp: '\u9B3C\u6EC5\u306E\u5203',
    score: '8.7',
    gradient: 'from-[#0a1628] via-[#1a3a5c] to-[#2e7bc4]',
    tag: '#1',
  },
  {
    id: 2,
    title: 'Jujutsu Kaisen',
    titleJp: '\u546A\u8853\u5EFB\u6226',
    score: '8.6',
    gradient: 'from-[#0d0a1a] via-[#2d1b69] to-[#7c3aed]',
    tag: '#2',
  },
  {
    id: 3,
    title: 'One Piece',
    titleJp: '\u30EF\u30F3\u30D4\u30FC\u30B9',
    score: '9.1',
    gradient: 'from-[#0a1a0a] via-[#1a4a1a] to-[#2d8a2d]',
    tag: '#3',
  },
  {
    id: 4,
    title: 'Bleach',
    titleJp: '\u30D6\u30EA\u30FC\u30C1',
    score: '8.3',
    gradient: 'from-[#0a0a1a] via-[#1a1a4a] to-[#2d2d8a]',
    tag: '#4',
  },
]

const RECOMMENDED_ANIMES = [
  {
    id: 5,
    title: 'Naruto',
    titleJp: '\u30CA\u30EB\u30C8',
    score: '8.4',
    gradient: 'from-[#1a1000] via-[#4a3000] to-[#c97f00]',
    tag: 'Pour vous',
  },
  {
    id: 6,
    title: 'Attack on Titan',
    titleJp: '\u9032\u6483\u306E\u5DE8\u4EBA',
    score: '9.0',
    gradient: 'from-[#1a0a0a] via-[#4a1010] to-[#8b2020]',
    tag: 'Top not\u00E9',
  },
  {
    id: 7,
    title: 'Demon Slayer',
    titleJp: '\u9B3C\u6EC5\u306E\u5203',
    score: '8.7',
    gradient: 'from-[#001020] via-[#003060] to-[#005fa3]',
    tag: 'Tendance',
  },
  {
    id: 8,
    title: 'Jujutsu Kaisen',
    titleJp: '\u546A\u8853\u5EFB\u6226',
    score: '8.6',
    gradient: 'from-[#100820] via-[#2d1b50] to-[#6d28d9]',
    tag: 'Populaire',
  },
]

// --- Composants internes ---

function AnimeCard({ anime, index = 0 }) {
  return (
    <div
      className={`shrink-0 w-[140px] rounded-2xl overflow-hidden cursor-pointer card-hover animate-fade-in-up`}
      style={{ animationDelay: `${index * 0.06}s` }}
    >
      {/* Poster — ratio 2:3 pour realisme */}
      <div className={`relative w-full h-[210px] bg-gradient-to-b ${anime.gradient} rounded-2xl overflow-hidden`}>
        {/* Film grain overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none z-10"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")' }}
        />

        {/* Badge rang */}
        <div className="absolute top-2 left-2 glass-card rounded-lg px-2 py-0.5 z-20">
          <span
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            className="text-[10px] font-bold text-[#C9A84C]"
          >
            {anime.tag}
          </span>
        </div>

        {/* Score */}
        <div className="absolute top-2 right-2 flex items-center gap-0.5 glass-card rounded-lg px-1.5 py-0.5 z-20">
          <StarIcon size={9} />
          <span
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            className="text-[10px] font-bold text-white"
          >
            {anime.score}
          </span>
        </div>

        {/* Motif decoratif central */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.12]">
          <div className="w-20 h-20 rounded-full border border-white/30" />
          <div className="absolute w-12 h-12 rounded-full border border-white/20" />
        </div>

        {/* Gradient de bas — plus long, plus cinematographique */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        {/* Titre japonais decoratif */}
        <div className="absolute bottom-3 left-0 right-0 px-2">
          <p
            style={{ fontFamily: "'DM Serif Display', serif" }}
            className="text-[10px] text-white/30 text-center truncate tracking-wide"
          >
            {anime.titleJp}
          </p>
        </div>
      </div>

      {/* Infos sous le poster */}
      <div className="pt-2.5 pb-1 px-1">
        <p
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          className="text-[12px] font-semibold text-white/90 leading-tight truncate transition-colors duration-200"
        >
          {anime.title}
        </p>
      </div>
    </div>
  )
}

function SectionHeader({ title, actionLabel = 'Voir tout' }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2
        style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.02em' }}
        className="text-[18px] font-bold text-white"
      >
        {title}
      </h2>
      <button className="flex items-center gap-1 text-[11px] font-semibold text-[#C9A84C]/80 hover:text-[#C9A84C] transition-colors duration-200 btn-press">
        {actionLabel}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  )
}

// --- Ecran principal ---

export default function HomeScreen() {
  const [searchValue, setSearchValue] = useState('')

  return (
    <div
      className="relative w-[390px] h-[844px] bg-[#0A0A14] overflow-hidden rounded-[44px]"
      style={{ boxShadow: '0 0 0 1px rgba(255,255,255,0.06), 0 40px 100px rgba(0,0,0,0.9), 0 0 60px rgba(201,168,76,0.03)' }}
    >
      {/* Encoche simulee */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[126px] h-[34px] bg-[#0A0A14] rounded-b-2xl z-50 flex items-center justify-center">
        <div className="w-[80px] h-[5px] bg-[#1a1a2e] rounded-full" />
      </div>

      {/* Status bar simulee */}
      <div className="flex items-center justify-between px-8 pt-[14px] pb-1 z-40 relative">
        <span
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          className="text-[12px] font-semibold text-white"
        >
          9:41
        </span>
        <div className="flex items-center gap-1.5">
          <svg width="16" height="11" viewBox="0 0 16 11" fill="white">
            <rect x="0" y="4" width="3" height="7" rx="0.8" opacity="0.4" />
            <rect x="4.5" y="2.5" width="3" height="8.5" rx="0.8" opacity="0.6" />
            <rect x="9" y="1" width="3" height="10" rx="0.8" opacity="0.8" />
            <rect x="13.5" y="0" width="2.5" height="11" rx="0.8" />
          </svg>
          <svg width="16" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <path d="M5 12.55a11 11 0 0 1 14.08 0" opacity="0.5" />
            <path d="M1.42 9a16 16 0 0 1 21.16 0" opacity="0.3" />
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0" opacity="0.8" />
            <circle cx="12" cy="20" r="1" fill="white" stroke="none" />
          </svg>
          <div className="flex items-center gap-0.5">
            <div className="w-[22px] h-[11px] rounded-[3px] border border-white/60 flex items-center px-[2px]">
              <div className="w-full h-[6px] bg-white rounded-[1px]" />
            </div>
            <div className="w-[2px] h-[5px] bg-white/60 rounded-r-sm" />
          </div>
        </div>
      </div>

      {/* Contenu scrollable */}
      <div className="h-[calc(844px-83px)] overflow-y-auto phone-scroll" style={{ marginTop: 0 }}>

        {/* Header avec blur */}
        <div
          className="sticky top-0 z-30 flex items-center justify-between px-5 pt-3 pb-4"
          style={{
            background: 'linear-gradient(180deg, rgba(10,10,20,0.95) 0%, rgba(10,10,20,0.8) 70%, transparent 100%)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
          }}
        >
          <div className="flex items-center gap-2.5">
            {/* Logo revAnim */}
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center animate-glow-pulse"
              style={{ background: 'linear-gradient(135deg, #C9A84C 0%, #8B6914 100%)' }}
            >
              <span
                style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.04em' }}
                className="text-[12px] font-black text-[#0A0A14]"
              >
                rA
              </span>
            </div>
            <div>
              <span
                style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.03em' }}
                className="text-[18px] font-bold"
              >
                <span className="text-white/60">rev</span>
                <span className="text-[#C9A84C]">Anim</span>
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 rounded-xl glass-card flex items-center justify-center text-[#9CA3AF] hover:text-white transition-colors duration-200 btn-press">
              <IconSearch size={17} />
            </button>
            <button className="relative w-9 h-9 rounded-xl glass-card flex items-center justify-center text-[#9CA3AF] hover:text-white transition-colors duration-200 btn-press">
              <IconBell size={17} />
              <span
                className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#C9A84C] rounded-full animate-subtle-pulse"
                style={{ boxShadow: '0 0 6px rgba(201,168,76,0.6)' }}
              />
            </button>
          </div>
        </div>

        {/* Barre de recherche */}
        <div className="px-5 mb-5 animate-fade-in-up">
          <div
            className="flex items-center gap-3 rounded-2xl px-4 py-3 glass-card transition-all duration-200"
            style={{ borderColor: searchValue ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.05)' }}
          >
            <IconSearch size={16} color="#6B7280" />
            <input
              type="text"
              placeholder="Rechercher un anime..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="bg-transparent flex-1 text-[13px] text-white placeholder-[#4B5563] outline-none"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            />
            <button className="w-7 h-7 rounded-lg flex items-center justify-center btn-press" style={{ background: 'rgba(201,168,76,0.12)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="7" y1="12" x2="17" y2="12" />
                <line x1="10" y1="18" x2="14" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Section Hero -- Featured */}
        <div className="px-5 mb-7 animate-fade-in-up-delay-1">
          <div
            className={`relative w-full h-[220px] rounded-2xl overflow-hidden bg-gradient-to-br ${FEATURED_ANIME.gradient}`}
            style={{ boxShadow: '0 8px 40px rgba(139,26,26,0.25), 0 0 0 1px rgba(255,255,255,0.04)' }}
          >
            {/* Grain cinematographique */}
            <div
              className="absolute inset-0 opacity-[0.04] pointer-events-none z-[5]"
              style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")' }}
            />

            {/* Motifs decoratifs -- lueur diffuse */}
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/5 blur-3xl translate-x-8 -translate-y-8" />
            <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white/5 blur-2xl -translate-x-4 translate-y-4" />

            {/* Motif cinematographique -- bandes */}
            <div className="absolute inset-0 opacity-[0.03]">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-full h-px bg-white"
                  style={{ top: `${(i + 1) * 12}%` }}
                />
              ))}
            </div>

            {/* Motif geometrique */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-[0.08]">
              <div className="w-28 h-28 border border-white rounded-full" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 border border-white rounded-full" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 border border-white rounded-full" />
            </div>

            {/* Badge "A la une" -- redesigne */}
            <div
              className="absolute top-3.5 left-3.5 rounded-lg px-3 py-1.5 z-10"
              style={{
                background: 'linear-gradient(135deg, #C9A84C, #A07830)',
                boxShadow: '0 4px 16px rgba(201,168,76,0.35)',
              }}
            >
              <span
                style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '0.08em' }}
                className="text-[9px] font-bold text-[#0A0A14] uppercase"
              >
                A la une
              </span>
            </div>

            {/* Score flottant */}
            <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5 glass-card rounded-xl px-2.5 py-1.5 z-10">
              <StarIcon size={12} />
              <span
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                className="text-[14px] font-bold text-white"
              >
                {FEATURED_ANIME.score}
              </span>
            </div>

            {/* Overlay bas -- gradient triple couche */}
            <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-[#0A0A14] via-black/60 to-transparent" />

            {/* Infos */}
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <p
                style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '0.12em' }}
                className="text-[9px] text-[#C9A84C]/80 font-semibold mb-1.5 uppercase"
              >
                {FEATURED_ANIME.genre}
              </p>
              <h3
                style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.02em' }}
                className="text-[24px] font-bold text-white leading-none mb-3"
              >
                {FEATURED_ANIME.title}
              </h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-[#9CA3AF]/80 text-[11px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  <span>{FEATURED_ANIME.year}</span>
                  <span className="text-white/15">|</span>
                  <span>{FEATURED_ANIME.episodes} ep.</span>
                </div>
                <button
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-bold text-[#0A0A14] btn-press"
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    background: 'linear-gradient(135deg, #C9A84C, #8B6914)',
                    boxShadow: '0 4px 20px rgba(201,168,76,0.3)',
                  }}
                >
                  Voir plus
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0A0A14" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section Tendances */}
        <div className="mb-7 animate-fade-in-up-delay-2">
          <div className="px-5">
            <SectionHeader title="Tendances cette semaine" />
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide px-5 pb-2">
            {TRENDING_ANIMES.map((anime, i) => (
              <AnimeCard key={anime.id} anime={anime} index={i} />
            ))}
          </div>
        </div>

        {/* Separateur premium */}
        <div className="mx-5 mb-7 separator-glow" />

        {/* Section Recommandes */}
        <div className="mb-4 animate-fade-in-up-delay-3">
          <div className="px-5">
            <SectionHeader title="Recommand\u00E9s pour vous" />
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide px-5 pb-2">
            {RECOMMENDED_ANIMES.map((anime, i) => (
              <AnimeCard key={anime.id} anime={anime} index={i} />
            ))}
          </div>
        </div>

        {/* Espace pour la tab bar */}
        <div className="h-24" />
      </div>

      {/* Bottom Tab Bar -- glass premium */}
      <div className="absolute bottom-0 left-0 right-0 h-[83px] tab-bar-glass flex items-start pt-3 px-2">
        {[
          { icon: <IconHome size={22} color="#C9A84C" />, label: 'Accueil', active: true },
          { icon: <IconSearchTab size={22} color="#4B5563" />, label: 'Recherche', active: false },
          { icon: <IconList size={22} color="#4B5563" />, label: 'Ma Liste', active: false },
          { icon: <IconProfile size={22} color="#4B5563" />, label: 'Profil', active: false },
        ].map(({ icon, label, active }) => (
          <button key={label} className="flex-1 flex flex-col items-center gap-1 btn-press">
            <div className={`${active ? 'relative' : ''}`}>
              {icon}
              {active && (
                <div
                  className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-[#C9A84C] rounded-full"
                  style={{ boxShadow: '0 0 8px rgba(201,168,76,0.5)' }}
                />
              )}
            </div>
            <span
              style={{ fontFamily: "'DM Sans', sans-serif" }}
              className={`text-[10px] font-medium ${active ? 'text-[#C9A84C]' : 'text-[#4B5563]'}`}
            >
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
