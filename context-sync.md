# context-sync.md — État du sprint revAnim

> ⚠️ Fichier maintenu automatiquement par Claude Code.
> Ne pas éditer manuellement. Mis à jour après chaque session de dev.

---

## 🗓️ Dernière mise à jour
2026-04-03 — Session 3 (debug build iOS)

---

## 🏃 Sprints

**Sprint 1 — Infrastructure & Architecture** ✅ TERMINÉ
**Sprint 2 — Features core mobile** ✅ TERMINÉ
**Sprint 3 — Catalogue avancé + Classements + Badges + Tests** ✅ TERMINÉ

---

## ✅ Réalisé — Session 2 (2026-03-31)

### Seed DB
- ✅ `prisma/seed.ts` — 14 badges + 50 animes populaires AniList (upsert idempotent)

### Auth mobile (KAN-33/34/36)
- ✅ `app/(auth)/sign-in.tsx` — connexion email/password
- ✅ `app/(auth)/sign-up.tsx` — inscription + vérification email (2 étapes)
- ✅ `app/(tabs)/profile.tsx` — déconnexion via `useAuth().signOut()`
- ✅ Layout tabs : Catalogue / Recherche / Ma liste / Profil

### Catalogue & Détail (KAN-43/44/47)
- ✅ `app/(tabs)/index.tsx` — catalogue avec infinite scroll
- ✅ `app/(tabs)/search.tsx` — recherche par titre + filtres genre/statut
- ✅ `app/anime/[id].tsx` — détail anime (banner, cover, stats, genres, synopsis)
- ✅ `components/AnimeCard.tsx` — composant carte réutilisable

### Notation & Commentaires (KAN-48/49/51)
- ✅ Notation étoiles 1-5 (`POST /api/ratings`, upsert)
- ✅ Écriture de commentaire (`POST /api/comments`)
- ✅ Like/unlike commentaire toggle (`POST /api/comments/:id/like`)
- ✅ `components/StarRating.tsx` + `components/CommentItem.tsx`

### Profil (KAN-37 à KAN-42)
- ✅ Profil avec stats (notes, listes, badges) + `GET /api/users/me`
- ✅ Toggle Favoris / Wishlist / Coups de cœur depuis le détail
- ✅ `app/(tabs)/my-list.tsx` — tabs Favoris / Wishlist / Coups de cœur
- ✅ `GET /api/ratings/mine` — historique de notation ajouté
- ✅ Édition profil (username, bio, avatar URL) via `PATCH /api/users/me`

### Filtres & Classements (KAN-45/46/53/55)
- ✅ `GET /api/animes` — filtres `genre`, `year`, `status` ajoutés
- ✅ `GET /api/animes/trending` — animes les plus notés sur 7j (fallback score)
- ✅ `app/rankings.tsx` — Top All-Time + Tendances (podium 🥇🥈🥉)

### Badges & Trophées (KAN-70/71/72/73)
- ✅ `apps/api/src/services/badges.service.ts` — moteur d'attribution (12 conditions)
- ✅ Intégré dans ratings, comments, lists, users (déclenché à chaque action)
- ✅ `app/badges.tsx` — catalogue 14 badges earned/locked
- ✅ `components/BadgeEarnedModal.tsx` — toast animé (auto-dismiss 4s)

### Tests automatisés (KAN-68)
- ✅ Vitest configuré (`vitest.config.ts`)
- ✅ `src/test/helpers.ts` — `buildTestApp()` + `createPrismaMock()`
- ✅ `badges.service.test.ts` — 13 tests unitaires
- ✅ `animes.test.ts` — 11 tests d'intégration
- ✅ `ratings.test.ts` — 10 tests d'intégration
- ✅ **34/34 tests passent**
- ✅ Bug corrigé au passage : ZodError → 500 en prod → maintenant 400

### Upgrade SDK (hors ticket)
- ✅ Expo SDK 51 → **54** (expo-router 3.5 → 6.0, RN 0.74 → 0.76, React 18.2 → 18.3.1)
- ✅ `@clerk/clerk-expo` v1 → **v2** + `clearToken` ajouté
- ✅ Typecheck clean après upgrade

---

## ✅ Réalisé — Session 1 (2026-03-30)

### Infrastructure (KAN-32 complet)
- ✅ Monorepo pnpm + Turborepo, Fastify + TypeScript, Prisma + migration prod
- ✅ AniList GraphQL cache-aside (Redis → PostgreSQL → AniList)
- ✅ CI/CD GitHub Actions + Railway auto-deploy
- ✅ API prod : `https://revanim-production.up.railway.app`

### Sécurité (audit OWASP)
- ✅ 17 corrections : CORS, helmet, rate-limit, Zod validation, clerkId non exposé, upsert atomique, agrégation SQL

### Maquettes UI
- ✅ HomeScreen + AnimeDetailScreen — thème "Cinéma de nuit" (`mockups/`)

---

## 🔜 Backlog restant

| Epic | Tickets | Statut |
|------|---------|--------|
| KAN-29 Classements | KAN-54 (communautaire), KAN-56 (recommandations) | À faire |
| KAN-30 Partage social | KAN-57, KAN-58, KAN-59 | À faire |
| KAN-31 i18n | KAN-60 à KAN-63 — FR/EN/ES + détection auto | À faire |

---

## 🏗️ Décisions techniques (validées)

| Sujet | Décision |
|-------|----------|
| Monorepo | pnpm workspaces + Turborepo |
| Backend | Fastify v4 + TypeScript |
| ORM | Prisma v5 |
| Auth | Clerk (`@clerk/fastify` v1 + `@clerk/clerk-expo` v2) |
| Cache/Queue | BullMQ + Redis (sync AniList top 500 toutes les 24h) |
| Mobile | **Expo SDK 54** + Expo Router v6 + RN 0.76 |
| Déploiement | Railway (API + PostgreSQL + Redis) + EAS (mobile) |
| Design | "Cinéma de nuit" — fond `#0A0A14`, or `#C9A84C`, violet `#7C3AED` |
| API AniList | Cache-aside : Redis (1h) → PostgreSQL (24h) → AniList |
| Tests | Vitest 4.x — unitaires + intégration (34 tests) |
| Erreurs | ZodError → 400 via `setErrorHandler` global |

---

## 🔑 Accès & URLs

| Ressource | URL / Info |
|-----------|------------|
| GitHub | `github.com/fredericVannier/revanim` |
| API production | `https://revanim-production.up.railway.app` |
| Railway | projet `vibrant-cat` — 3 services : revanim + Postgres + Redis |
| Clerk dashboard | `dashboard.clerk.com` — app revAnim |
| Maquettes locales | `cd mockups && npm run dev` → `localhost:5174` |
| Tests | `pnpm --filter @revanim/api test` |

---

## 🐛 Points d'attention connus

| Problème | Impact | Action |
|----------|--------|--------|
| **Build iOS en pause** — `RNCSafeareaProvider` manquant | **Bloquant** | `pnpm install` → pod install → rebuild Xcode |
| `@clerk/fastify` v1 (v2 dispo) | Moyen | Upgrade à planifier |
| `fastify` v4 → v5 (fin support actif) | Moyen | Upgrade à planifier |
| react-native-screens@4.24.0 patché (Fabric codegen) | Info | Patch dans `patches/` — survit aux `pnpm install` |
| `prisma` v5 → v7 disponible | Faible | Major upgrade à planifier |
| Railway trial : 30j ou $5 | Surveillance | Passer Hobby si nécessaire |

---

## 📝 Notes de session
- **2026-03-30 (session 1)** : Init complète — stack, monorepo, DB, CI/CD, API prod, audit sécu.
- **2026-03-31 (session 2)** : Sprint 2 + 3 complets — toutes les features core mobile, filtres, classements, badges, 34 tests, upgrade Expo SDK 54.
- **2026-04-03 (session 3)** : Debug build iOS — app ne se lançait pas après upgrade SDK. Résolu : patch Fabric codegen react-native-screens (TSQualifiedName → alias locaux), pinning versions expo-auth-session/expo-crypto/expo-web-browser/safe-area-context, metro.config.js monorepo. **En pause** sur `RNCSafeareaProvider` — `pnpm install` + pod install + rebuild Xcode à relancer.
