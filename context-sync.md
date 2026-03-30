# context-sync.md — État du sprint revAnim

> ⚠️ Fichier maintenu automatiquement par Claude Code.
> Ne pas éditer manuellement. Mis à jour après chaque session de dev.

---

## 🗓️ Dernière mise à jour
2026-03-30 — Fin de session

---

## 🏃 Sprint en cours
**Sprint 1 — Infrastructure & Architecture** ✅ TERMINÉ
**Sprint 2 — Features core mobile** → À démarrer

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

### Priorité 1 — Seed base de données
- [ ] Seeder les 14 badges (`prisma/seed.ts`)
- [ ] Pré-charger un batch d'animes populaires depuis AniList

### Priorité 2 — Auth mobile (KAN-25)
- [ ] KAN-33 — Écran sign-in avec Clerk (`app/(auth)/sign-in.tsx`)
- [ ] KAN-34 — Écran sign-up avec Clerk (`app/(auth)/sign-up.tsx`)
- [ ] KAN-36 — Déconnexion

### Priorité 3 — Écrans mobiles branchés sur l'API (KAN-27)
- [ ] KAN-43 — HomeScreen branché sur `GET /api/animes`
- [ ] KAN-44 — Recherche par titre (`GET /api/animes?q=`)
- [ ] KAN-47 — AnimeDetailScreen branché sur `GET /api/animes/:id`

### Priorité 4 — Notation & Commentaires (KAN-28)
- [ ] KAN-48 — Notation étoiles 1-5 (`POST /api/ratings`)
- [ ] KAN-49 — Écriture commentaire (`POST /api/comments`)
- [ ] KAN-51 — Like commentaire (`POST /api/comments/:id/like`)

---

## 📥 Backlog restant

### Profil (KAN-26)
- KAN-37 à KAN-42 — Profil, favoris, wishlist, coups de cœur, historique, avatar

### Catalogue (KAN-27)
- KAN-45 — Filtrer par genre
- KAN-46 — Filtrer par année / statut

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
