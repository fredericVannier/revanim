# context-sync.md — État du sprint revAnim

> ⚠️ Fichier maintenu automatiquement par Claude Code.
> Ne pas éditer manuellement. Mis à jour après chaque session de dev.

---

## 🗓️ Dernière mise à jour
2026-03-31 — Session en cours

---

## 🏃 Sprint en cours
**Sprint 1 — Infrastructure & Architecture** ✅ TERMINÉ
**Sprint 2 — Features core mobile** ✅ TERMINÉ
**Sprint 3 — Catalogue avancé + Classements + Badges** → En cours

---

## ✅ Réalisé (Done) — Session du 2026-03-31

### Seed DB
- ✅ `prisma/seed.ts` — 14 badges + 50 animes populaires AniList (upsert idempotent)
- ✅ Seed exécuté en production

### Auth mobile (KAN-33/34/36)
- ✅ KAN-33 — Écran sign-up (email + username + password + vérification email)
- ✅ KAN-34 — Écran sign-in (email + password)
- ✅ KAN-36 — Déconnexion depuis le profil
- ✅ Layout tabs skeleton (Catalogue, Recherche, Ma liste, Profil)
- ✅ `@types/node` ajouté au mobile, typecheck clean

### Catalogue & Détail (KAN-43/44/47)
- ✅ KAN-43 — HomeScreen catalogue avec infinite scroll
- ✅ KAN-44 — Recherche par titre
- ✅ KAN-47 — AnimeDetailScreen (banner, cover, stats, genres, synopsis)
- ✅ Composant `AnimeCard` réutilisable

### Notation & Commentaires (KAN-48/49/51)
- ✅ KAN-48 — Notation étoiles 1-5 (upsert)
- ✅ KAN-49 — Écriture de commentaire
- ✅ KAN-51 — Like/unlike commentaire (toggle)
- ✅ Composants `StarRating` et `CommentItem`

### Profil (KAN-37 à KAN-42)
- ✅ KAN-37 — Profil avec stats (notes, listes, badges)
- ✅ KAN-38/39/40 — Favoris / Wishlist / Coups de cœur (toggle depuis le détail)
- ✅ KAN-41 — Historique ratings : endpoint `GET /api/ratings/mine`
- ✅ KAN-42 — Édition profil (username, bio, avatar URL)
- ✅ Écran "Ma liste" avec tabs Favoris / Wishlist / Coups de cœur

---

## ✅ Réalisé (Done) — Session du 2026-03-30

### Maquettes UI
- ✅ HomeScreen React + Tailwind — thème "Cinéma de nuit" (`mockups/`)
- ✅ AnimeDetailScreen React + Tailwind
- ✅ Review designer : glassmorphism, micro-animations, grain cinématographique
- ✅ Import Figma via plugin Anima (`cd mockups && npm run dev`)

### Infrastructure (KAN-32)
- ✅ KAN-64 — Monorepo pnpm + Turborepo + Fastify + TypeScript
- ✅ KAN-65 — Schéma Prisma complet + migration `init` appliquée en production
- ✅ KAN-66 — AniList GraphQL intégré (cache-aside Redis → PostgreSQL → AniList)
- ✅ KAN-67 — CI/CD : GitHub Actions (typecheck + lint + build) + Railway auto-deploy
- ✅ Types partagés `@revanim/types`
- ✅ Structure mobile Expo Router + ClerkProvider + AuthGuard
- ✅ GitHub repo public : `github.com/fredericVannier/revanim`
- ✅ PostgreSQL Railway provisionné + migration appliquée
- ✅ Redis Railway provisionné
- ✅ Clerk configuré (clés en place dans `.env`)
- ✅ API déployée en production : `https://revanim-production.up.railway.app`
- ✅ Health check : `GET /health` → `{ status: "ok" }`

### Sécurité (audit complet effectué)
- ✅ CORS whitelist explicite (fini le wildcard `origin: true`)
- ✅ `requireAuth` corrigé (return explicite)
- ✅ `@fastify/helmet` — headers sécurité HTTP
- ✅ `@fastify/rate-limit` — 100 req/min global, 10 req/min sur POST /comments
- ✅ Validation Zod sur tous les query params (comments, rankings, ratings)
- ✅ Profil public : clerkId non exposé (select restrictif)
- ✅ Race condition GET /me corrigée (upsert atomique)
- ✅ Agrégation SQL pour moyenne des ratings (plus de full scan mémoire)
- ✅ Vérification existence commentaire avant like
- ✅ Fire-and-forget AniList supervisé
- ✅ `EXPO_PUBLIC_API_URL` validée au démarrage mobile

---

## 🔜 Prochaines étapes (Sprint 2)

### Priorité 1 — Catalogue avancé (KAN-27)
- [ ] KAN-45 — Filtrer par genre
- [ ] KAN-46 — Filtrer par année / statut

### Priorité 2 — Classements (KAN-29)
- [ ] KAN-53 — Top animes hebdo / all-time
- [ ] KAN-54 — Classements communautaires
- [ ] KAN-55 — Tendances
- [ ] KAN-56 — Recommandations

### Priorité 3 — Badges & Trophées (KAN-69)
- [ ] KAN-70 — Affichage badges
- [ ] KAN-71 — Notifications badge gagné
- [ ] KAN-72 — Moteur d'attribution back-end
- [ ] KAN-73 — Catalogue badges

---

## 📥 Backlog restant

### Classements (KAN-29)
- KAN-53 à KAN-56 — Top animes, classements, tendances, recommandations

### Partage Social (KAN-30)
- KAN-57 à KAN-59 — Partage anime, profil public, liste favoris

### i18n (KAN-31)
- KAN-60 à KAN-63 — FR / EN / ES + détection auto

### Infrastructure restante (KAN-32)
- KAN-68 — Tests automatisés (unitaires + E2E)

### Badges & Trophées (KAN-69)
- KAN-70 à KAN-73 — Affichage, notifications, moteur back-end, catalogue

---

## 🏗️ Décisions techniques (validées)

| Sujet | Décision |
|-------|----------|
| Monorepo | pnpm workspaces + Turborepo |
| Backend | Fastify v4 + TypeScript |
| ORM | Prisma v5 |
| Auth | Clerk (`@clerk/fastify` + `@clerk/clerk-expo`) |
| Cache/Queue | BullMQ + Redis (sync AniList top 500 toutes les 24h) |
| Mobile | Expo SDK 51 + Expo Router v3 |
| Déploiement | Railway (API + PostgreSQL + Redis) + EAS (mobile) |
| Design | "Cinéma de nuit" — fond `#0A0A14`, or `#C9A84C`, violet `#7C3AED` |
| API AniList | Cache-aside : Redis (1h) → PostgreSQL (24h) → AniList |
| Sécurité | Audit OWASP effectué + 17 corrections appliquées |

---

## 🔑 Accès & URLs

| Ressource | URL / Info |
|-----------|------------|
| GitHub | `github.com/fredericVannier/revanim` |
| API production | `https://revanim-production.up.railway.app` |
| Railway | projet `vibrant-cat` — 3 services : revanim + Postgres + Redis |
| Clerk dashboard | `dashboard.clerk.com` — app revAnim |
| Maquettes locales | `cd mockups && npm run dev` → `localhost:5174` |

---

## 🐛 Points d'attention connus

| Problème | Impact | Action |
|----------|--------|--------|
| `@clerk/clerk-expo` v1.2.9 deprecated | Faible en dev | Mettre à jour avant release |
| `prisma` v5 → v7 disponible | Faible | Major upgrade à planifier |
| `@clerk/fastify` v1 → v2 (sécurité) | Moyen | À traiter Sprint 2 |
| `fastify` v4 → v5 (fin support actif) | Moyen | À traiter Sprint 2 |
| peer dep react-dom 19 vs 18 | Aucun | Ignorer pour l'instant |
| Railway trial : 30j ou $5 | Surveillance | Passer Hobby si nécessaire |

---

## 📝 Notes de session
- 2026-03-30 (session 1) : Initialisation complète. Stack validée, monorepo créé, DB migrée, GitHub pushé, maquettes UI réalisées, API en production, audit sécurité complet + 17 corrections.
