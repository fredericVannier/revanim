import { useState } from 'react'

// --- Icones SVG inline ---

function IconArrowLeft({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}

function IconShare({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
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

function IconThumbUp({ size = 16, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
      <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
    </svg>
  )
}

// --- Etoile interactive ---
function StarRating({ value, onChange }) {
  const [hovered, setHovered] = useState(null)
  const display = hovered ?? value

  return (
    <div className="flex items-center gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(null)}
          onClick={() => onChange(star)}
          className="transition-transform duration-200 hover:scale-125 active:scale-110"
          style={{ filter: star <= display ? 'drop-shadow(0 0 4px rgba(245,158,11,0.4))' : 'none' }}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill={star <= display ? '#F59E0B' : 'none'}
            stroke={star <= display ? '#F59E0B' : '#2A2A3E'}
            strokeWidth="1.8"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </button>
      ))}
      {value > 0 && (
        <span
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          className="text-[14px] font-bold text-[#F59E0B] ml-1"
        >
          {value}/5
        </span>
      )}
    </div>
  )
}

// --- Donnees mock ---
const ANIME = {
  title: 'Attack on Titan',
  titleJp: '\u9032\u6483\u306E\u5DE8\u4EBA',
  score: '9.0',
  rank: 1,
  year: 2013,
  episodes: 87,
  status: 'Termin\u00E9',
  genres: ['Action', 'Aventure', 'Fantasy', 'Drame', 'Horreur'],
  gradient: 'from-[#0d0404] via-[#3d0f0f] to-[#7a1c1c]',
  synopsis:
    "Dans un monde dystopique o\u00F9 l\u2019humanit\u00E9 est contrainte de vivre derri\u00E8re d\u2019immenses murs pour se prot\u00E9ger de cr\u00E9atures gigantesques appel\u00E9es les Titans, Eren Yeager, sa s\u0153ur adoptive Mikasa Ackermann et leur ami Armin Arlert voient leur vie basculer le jour o\u00F9 un Titan Colossal d\u00E9truit l\u2019un des remparts protecteurs...",
  comments: [
    {
      id: 1,
      user: 'Yuki_Fan',
      avatar: 'from-[#7c3aed] to-[#4c1d95]',
      text: "Absolument magistral. L'histoire de cette s\u00E9rie m'a litt\u00E9ralement bris\u00E9 le c\u0153ur.",
      likes: 42,
      date: 'il y a 2j',
    },
    {
      id: 2,
      user: 'OtakuMax',
      avatar: 'from-[#0369a1] to-[#0c4a6e]',
      text: 'Le meilleur anime de la d\u00E9cennie. Les retournements de situation sont incroyables !',
      likes: 38,
      date: 'il y a 4j',
    },
    {
      id: 3,
      user: 'AnimeQueen',
      avatar: 'from-[#b45309] to-[#78350f]',
      text: 'La saison finale... je ne sais toujours pas si je dois applaudir ou pleurer.',
      likes: 27,
      date: 'il y a 1s',
    },
  ],
}

// --- Ecran principal ---

export default function AnimeDetailScreen() {
  const [userRating, setUserRating] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isWishlist, setIsWishlist] = useState(false)
  const [isCoupDeCoeur, setIsCoupDeCoeur] = useState(false)
  const [synopsisExpanded, setSynopsisExpanded] = useState(false)

  return (
    <div
      className="relative w-[390px] h-[844px] bg-[#0A0A14] overflow-hidden rounded-[44px]"
      style={{ boxShadow: '0 0 0 1px rgba(255,255,255,0.06), 0 40px 100px rgba(0,0,0,0.9), 0 0 60px rgba(201,168,76,0.03)' }}
    >
      {/* Encoche simulee */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[126px] h-[34px] bg-[#0A0A14] rounded-b-2xl z-50 flex items-center justify-center">
        <div className="w-[80px] h-[5px] bg-[#1a1a2e] rounded-full" />
      </div>

      {/* Contenu scrollable */}
      <div className="h-full overflow-y-auto phone-scroll">

        {/* ===== HERO ===== */}
        <div className="relative w-full h-[340px] shrink-0">
          {/* Fond gradient simulant un poster */}
          <div className={`absolute inset-0 bg-gradient-to-br ${ANIME.gradient}`} />

          {/* Grain cinematographique */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none z-[5]"
            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")' }}
          />

          {/* Elements decoratifs */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 right-0 w-60 h-60 rounded-full bg-red-900/20 blur-3xl translate-x-10 -translate-y-10" />
            <div className="absolute bottom-20 left-0 w-40 h-40 rounded-full bg-orange-900/15 blur-2xl" />

            {/* Bandes cinema horizontales */}
            <div className="absolute inset-0 opacity-[0.03]">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-full h-px bg-white"
                  style={{ top: `${(i + 1) * 15}%` }}
                />
              ))}
            </div>

            {/* Motif cercles concentres */}
            <div className="absolute right-10 top-1/3 -translate-y-1/2 opacity-[0.06]">
              {[80, 56, 32, 12].map((size) => (
                <div
                  key={size}
                  className="absolute border border-white rounded-full"
                  style={{
                    width: size,
                    height: size,
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}
                />
              ))}
            </div>

            {/* Titre japonais decoratif en fond */}
            <div
              className="absolute bottom-24 left-0 right-0 text-center text-white/[0.03] text-[64px] font-bold leading-none overflow-hidden"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              {ANIME.titleJp}
            </div>
          </div>

          {/* Status bar */}
          <div className="relative flex items-center justify-between px-8 pt-[14px] pb-1 z-20">
            <span style={{ fontFamily: "'Space Grotesk', sans-serif" }} className="text-[12px] font-semibold text-white/80">9:41</span>
            <div className="flex items-center gap-1.5">
              <svg width="16" height="11" viewBox="0 0 16 11" fill="white">
                <rect x="0" y="4" width="3" height="7" rx="0.8" opacity="0.5" />
                <rect x="4.5" y="2.5" width="3" height="8.5" rx="0.8" opacity="0.7" />
                <rect x="9" y="1" width="3" height="10" rx="0.8" opacity="0.9" />
                <rect x="13.5" y="0" width="2.5" height="11" rx="0.8" />
              </svg>
              <svg width="16" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.8">
                <path d="M5 12.55a11 11 0 0 1 14.08 0" />
                <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
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

          {/* Boutons retour + partage */}
          <div className="relative flex items-center justify-between px-5 mt-2 z-20">
            <button className="w-10 h-10 rounded-2xl glass-card flex items-center justify-center btn-press">
              <IconArrowLeft size={20} color="white" />
            </button>
            <button className="w-10 h-10 rounded-2xl glass-card flex items-center justify-center btn-press">
              <IconShare size={18} color="white" />
            </button>
          </div>

          {/* Badge score flottant */}
          <div
            className="absolute top-[105px] right-5 flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl z-20 animate-glow-pulse"
            style={{
              background: 'linear-gradient(135deg, #C9A84C, #8B6914)',
              boxShadow: '0 6px 24px rgba(201,168,76,0.4), 0 0 0 1px rgba(201,168,76,0.2)',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#0A0A14" stroke="none">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif" }} className="text-[16px] font-bold text-[#0A0A14]">
              {ANIME.score}
            </span>
          </div>

          {/* Gradient de transition -- triple couche pour overlap card */}
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0A0A14] via-[#0A0A14]/80 to-transparent" />
        </div>

        {/* ===== CONTENU -- overlap card style ===== */}
        <div
          className="relative z-10 -mt-16 mx-3 rounded-t-3xl pt-6 px-4"
          style={{
            background: 'linear-gradient(180deg, rgba(14,14,24,0.98) 0%, #0A0A14 8%)',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            borderLeft: '1px solid rgba(255,255,255,0.03)',
            borderRight: '1px solid rgba(255,255,255,0.03)',
          }}
        >
          {/* Poignee decorative */}
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-10 h-1 bg-white/10 rounded-full" />

          {/* Titre principal */}
          <h1
            style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.03em' }}
            className="text-[28px] font-bold text-white leading-tight mb-1 animate-fade-in-up"
          >
            {ANIME.title}
          </h1>
          <p
            style={{ fontFamily: "'DM Serif Display', serif" }}
            className="text-[15px] italic text-white/25 mb-5 animate-fade-in-up-delay-1"
          >
            {ANIME.titleJp}
          </p>

          {/* Metadonnees -- chips style */}
          <div className="flex flex-wrap items-center gap-2 mb-5 animate-fade-in-up-delay-1">
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
              style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.15)' }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="#C9A84C" stroke="none">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span style={{ fontFamily: "'Space Grotesk', sans-serif" }} className="text-[11px] font-bold text-[#C9A84C]">
                #{ANIME.rank}
              </span>
            </div>
            <div
              className="px-2.5 py-1 rounded-lg"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <span style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-[11px] text-[#9CA3AF]">
                {ANIME.year}
              </span>
            </div>
            <div
              className="px-2.5 py-1 rounded-lg"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <span style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-[11px] text-[#9CA3AF]">
                {ANIME.episodes} ep.
              </span>
            </div>
            <div
              className="px-2.5 py-1 rounded-lg"
              style={{ background: 'rgba(45,212,191,0.08)', border: '1px solid rgba(45,212,191,0.15)' }}
            >
              <span
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                className="text-[11px] font-semibold text-[#2DD4BF]"
              >
                {ANIME.status}
              </span>
            </div>
          </div>

          {/* Tags genres */}
          <div className="flex flex-wrap gap-2 mb-6 animate-fade-in-up-delay-2">
            {ANIME.genres.map((genre) => (
              <span
                key={genre}
                className="text-[11px] font-medium px-3 py-1.5 rounded-xl transition-colors duration-200 cursor-default"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  background: 'rgba(124,58,237,0.1)',
                  border: '1px solid rgba(124,58,237,0.2)',
                  color: '#a78bfa',
                }}
              >
                {genre}
              </span>
            ))}
          </div>

          {/* 3 boutons d'action */}
          <div className="flex gap-3 mb-6 animate-fade-in-up-delay-2">
            {[
              {
                label: 'Favori',
                icon: (active) => (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill={active ? '#ef4444' : 'none'} stroke={active ? '#ef4444' : '#6B7280'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                ),
                active: isFavorite,
                toggle: () => setIsFavorite(!isFavorite),
                activeColor: '#ef4444',
                activeBg: 'rgba(239,68,68,0.1)',
                activeBorder: 'rgba(239,68,68,0.25)',
                activeGlow: '0 0 16px rgba(239,68,68,0.2)',
              },
              {
                label: 'Wishlist',
                icon: (active) => (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? '#60a5fa' : '#6B7280'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                  </svg>
                ),
                active: isWishlist,
                toggle: () => setIsWishlist(!isWishlist),
                activeColor: '#60a5fa',
                activeBg: 'rgba(96,165,250,0.1)',
                activeBorder: 'rgba(96,165,250,0.25)',
                activeGlow: '0 0 16px rgba(96,165,250,0.2)',
              },
              {
                label: 'Coup de c\u0153ur',
                icon: (active) => (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill={active ? '#C9A84C' : 'none'} stroke={active ? '#C9A84C' : '#6B7280'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ),
                active: isCoupDeCoeur,
                toggle: () => setIsCoupDeCoeur(!isCoupDeCoeur),
                activeColor: '#C9A84C',
                activeBg: 'rgba(201,168,76,0.1)',
                activeBorder: 'rgba(201,168,76,0.25)',
                activeGlow: '0 0 16px rgba(201,168,76,0.2)',
              },
            ].map(({ label, icon, active, toggle, activeColor, activeBg, activeBorder, activeGlow }) => (
              <button
                key={label}
                onClick={toggle}
                className="flex-1 flex flex-col items-center gap-2 py-3.5 rounded-2xl transition-all duration-300 btn-press"
                style={{
                  background: active ? activeBg : 'rgba(18,18,30,0.6)',
                  border: `1px solid ${active ? activeBorder : 'rgba(255,255,255,0.05)'}`,
                  boxShadow: active ? activeGlow : 'none',
                }}
              >
                <span className="transition-transform duration-200" style={{ transform: active ? 'scale(1.1)' : 'scale(1)' }}>
                  {icon(active)}
                </span>
                <span
                  style={{ fontFamily: "'DM Sans', sans-serif", color: active ? activeColor : '#6B7280' }}
                  className="text-[10px] font-medium text-center leading-tight transition-colors duration-200"
                >
                  {label}
                </span>
              </button>
            ))}
          </div>

          {/* Separateur premium */}
          <div className="separator-glow mb-6" />

          {/* Section notation */}
          <div className="mb-6 animate-fade-in-up-delay-3">
            <h3
              style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.01em' }}
              className="text-[15px] font-bold text-white mb-3"
            >
              Votre note
            </h3>
            <div className="glass-card rounded-2xl px-4 py-4">
              <div className="flex items-center justify-between">
                <StarRating value={userRating} onChange={setUserRating} />
                {userRating > 0 && (
                  <button
                    onClick={() => setUserRating(0)}
                    className="text-[11px] text-[#6B7280] hover:text-white transition-colors duration-200 btn-press"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Effacer
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Synopsis */}
          <div className="mb-6">
            <h3
              style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.01em' }}
              className="text-[15px] font-bold text-white mb-3"
            >
              Synopsis
            </h3>
            <div className="glass-card rounded-2xl p-4">
              <p
                style={{ fontFamily: "'DM Sans', sans-serif", lineHeight: '1.7' }}
                className={`text-[13px] text-[#9CA3AF] ${!synopsisExpanded ? 'line-clamp-3' : ''}`}
              >
                {ANIME.synopsis}
              </p>
              <button
                onClick={() => setSynopsisExpanded(!synopsisExpanded)}
                className="mt-3 flex items-center gap-1 text-[12px] font-semibold text-[#C9A84C]/80 hover:text-[#C9A84C] transition-colors duration-200 btn-press"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {synopsisExpanded ? 'R\u00E9duire' : 'Lire la suite'}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    transform: synopsisExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                    transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  }}
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>

          {/* Section commentaires */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3
                style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.01em' }}
                className="text-[15px] font-bold text-white"
              >
                Commentaires
              </h3>
              <button
                className="text-[11px] font-semibold text-[#C9A84C]/80 hover:text-[#C9A84C] flex items-center gap-1 transition-colors duration-200 btn-press"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Voir tout
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>

            {/* Champ d'ecriture rapide */}
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-9 h-9 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#4c1d95] flex items-center justify-center shrink-0"
                style={{ boxShadow: '0 0 12px rgba(124,58,237,0.2)' }}
              >
                <span style={{ fontFamily: "'Space Grotesk', sans-serif" }} className="text-[10px] font-bold text-white">Moi</span>
              </div>
              <div className="flex-1 glass-card rounded-2xl px-4 py-2.5 flex items-center gap-2">
                <span style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-[12px] text-[#4B5563] flex-1">
                  Ecrire un commentaire...
                </span>
                <button
                  className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 btn-press"
                  style={{ background: 'linear-gradient(135deg, #C9A84C, #8B6914)', boxShadow: '0 2px 8px rgba(201,168,76,0.3)' }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0A0A14" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Liste commentaires */}
            <div className="flex flex-col gap-3">
              {ANIME.comments.map((comment, i) => (
                <div
                  key={comment.id}
                  className="glass-card rounded-2xl p-4 animate-fade-in-up"
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${comment.avatar} flex items-center justify-center shrink-0`}>
                      <span style={{ fontFamily: "'Space Grotesk', sans-serif" }} className="text-[10px] font-bold text-white">
                        {comment.user.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between mb-1.5">
                        <span style={{ fontFamily: "'Space Grotesk', sans-serif" }} className="text-[12px] font-semibold text-white">
                          {comment.user}
                        </span>
                        <span style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-[10px] text-[#4B5563]">
                          {comment.date}
                        </span>
                      </div>
                      <p style={{ fontFamily: "'DM Sans', sans-serif", lineHeight: '1.6' }} className="text-[12px] text-[#9CA3AF]">
                        {comment.text}
                      </p>
                      <div className="flex items-center gap-1 mt-2.5">
                        <button className="flex items-center gap-1 text-[#4B5563] hover:text-[#C9A84C] transition-colors duration-200 btn-press">
                          <IconThumbUp size={12} />
                          <span style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-[11px] font-medium">{comment.likes}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Espace pour la tab bar */}
          <div className="h-24" />
        </div>
      </div>

      {/* Bottom Tab Bar -- glass premium */}
      <div className="absolute bottom-0 left-0 right-0 h-[83px] tab-bar-glass flex items-start pt-3 px-2">
        {[
          { icon: <IconHome size={22} color="#4B5563" />, label: 'Accueil', active: false },
          { icon: <IconSearchTab size={22} color="#4B5563" />, label: 'Recherche', active: false },
          { icon: <IconList size={22} color="#C9A84C" />, label: 'Ma Liste', active: true },
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
