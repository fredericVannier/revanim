# CLAUDE.md — revAnim

> Fichier de contexte permanent. Lu automatiquement par Claude Code à chaque session.
> Ne pas supprimer. Mettre à jour après chaque décision structurante.

---

## 🎯 Projet

**revAnim** — Application mobile de notation d'animes
- Fonctionnalités : favoris, wishlist, coups de cœur, commentaires, partage social
- Langues supportées : FR / EN / ES
- Statut : En développement actif
- GitHub : `github.com/fredericVannier/revanim`

---

## 🛠️ Stack Technique

| Couche | Technologie | Détail |
|--------|-------------|--------|
| Mobile | Expo + React Native | Expo Router (file-based routing) |
| Backend | Fastify + TypeScript | API REST, plugins prisma/clerk/redis |
| ORM | Prisma v5 | Schéma dans `apps/api/prisma/schema.prisma` |
| Base de données | PostgreSQL | Hébergé Railway |
| Cache / Queue | BullMQ + Redis | Hébergé Railway, sync AniList 24h |
| Auth | Clerk | `@clerk/fastify` + `@clerk/clerk-expo` |
| API externe | AniList GraphQL | Cache-aside : Redis → PostgreSQL → AniList |
| Monorepo | pnpm + Turborepo | Workspaces : `apps/*`, `packages/*` |
| Déploiement | Railway (API+DB+Redis) + EAS (mobile) | |
| Internationalisation | i18n (FR/EN/ES) | À implémenter |

---

## 📁 Structure du monorepo

```
revAnim/
├── apps/
│   ├── api/                  ← Fastify backend
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── migrations/   ← Migration init appliquée ✅
│   │   └── src/
│   │       ├── index.ts
│   │       ├── plugins/      (prisma, clerk, redis)
│   │       ├── routes/       (animes, users, ratings, comments, lists, rankings)
│   │       ├── services/     (anilist.service — cache-aside)
│   │       ├── jobs/         (anime-sync.job — BullMQ 24h)
│   │       └── lib/          (anilist-client GraphQL)
│   └── mobile/               ← Expo app
│       ├── app/
│       │   ├── _layout.tsx   ← ClerkProvider + AuthGuard
│       │   ├── (auth)/       ← sign-in, sign-up
│       │   ├── (tabs)/       ← catalogue, search, my-list, profile
│       │   └── anime/[id].tsx
│       └── lib/api.ts        ← hook useApi() avec token Clerk
├── packages/
│   ├── types/                ← @revanim/types (Anime, User, Rating, Comment...)
│   └── config/               ← ESLint + TypeScript partagés
├── mockups/                  ← Maquettes React "Cinéma de nuit" (Figma via Anima)
└── .env.example
```

---

## 🗄️ Schéma Prisma — Modèles

| Modèle | Description |
|--------|-------------|
| `User` | clerkId, username, avatar, bio |
| `Anime` | anilistId, title, genres[], score, status... |
| `Rating` | score 1-5, unique par (userId, animeId) |
| `Comment` | content, likes, likedBy |
| `CommentLike` | pivot userId × commentId |
| `UserAnimeList` | type FAVORITE / WISHLIST / COUP_DE_COEUR |
| `Badge` | key, name, description, icon (14 badges) |
| `UserBadge` | pivot userId × badgeId |
| `Ranking` | type WEEKLY / ALL_TIME, position |

---

## 🔑 Variables d'environnement

Fichier `apps/api/.env` (non commité) :
```
DATABASE_URL        → PostgreSQL Railway (URL publique TCP pour dev local)
REDIS_URL           → Redis Railway (URL publique TCP pour dev local)
CLERK_SECRET_KEY    → sk_test_...
CLERK_PUBLISHABLE_KEY → pk_test_...
ANILIST_API_URL     → https://graphql.anilist.co
PORT                → 3000
```

Fichier `apps/mobile/.env` (non commité) :
```
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY → pk_test_...
EXPO_PUBLIC_API_URL               → http://localhost:3000
```

> En production Railway, les variables internes (`.railway.internal`) sont injectées directement via le dashboard Railway — pas besoin de les commiter.

---

## 🎨 Design

- Thème : **"Cinéma de nuit"** (dark, premium, cinématographique)
- Palette : fond `#0A0A14`, or `#C9A84C`, violet `#7C3AED`
- Polices : Space Grotesk (titres), DM Sans (corps)
- Maquettes dans `mockups/` — lancer avec `cd mockups && npm run dev`
- Import Figma via plugin **Anima**

---

## 📋 Jira

- **Site** : `exomind-team-evp0jtyz.atlassian.net`
- **Projet** : Mugiwaras — clé `KAN`

### Épics

| Clé | Titre |
|-----|-------|
| KAN-25 | Authentification & Gestion des comptes |
| KAN-26 | Profil Utilisateur |
| KAN-27 | Catalogue & Recherche d'Animes |
| KAN-28 | Système de Notation & Commentaires |
| KAN-29 | Classements & Découverte |
| KAN-30 | Partage Social |
| KAN-31 | Internationalisation (FR/EN/ES) |
| KAN-32 | Infrastructure & Architecture Technique |
| KAN-69 | Badges & Trophées |

### Tickets
~40 Stories/Tâches de **KAN-33 à KAN-73**, chacun avec critères d'acceptance.

---

## 📚 Confluence

- **Site** : `exomind-team-evp0jtyz.atlassian.net`
- **Espace** : `Revanime`
- **Page principale** : *Rev-anime — Vision & Documentation Produit*
  - ID : `884737`
  - URL : `/wiki/spaces/Revanime/pages/884737/`

Contenu : vision produit, fonctionnalités clés, architecture technique, règles métier,
catalogue de 14 badges (🖊️ Critique en herbe → 👑 Légende).

---

## 🔄 Workflow obligatoire

### Après chaque implémentation
1. **Commit** avec le format : `feat|fix|chore(KAN-XX): description courte`
2. **Mettre à jour le statut Jira** du ticket concerné via MCP Atlassian
3. **Si nouvelle décision d'archi** → mettre à jour ce fichier + page Confluence ID 884737
4. **Mettre à jour** `context-sync.md` (état courant du sprint)

### Format de commit

```
feat(KAN-35): ajout écran de notation avec étoiles
fix(KAN-41): correction bug affichage avatar profil
chore(KAN-32): configuration pipeline CI/CD
```

---

## 🔌 MCP — Connexion Atlassian

Configuration dans `.claude/mcp.json` (voir fichier dédié).

Capacités disponibles via MCP :
- ✅ Lire / mettre à jour les tickets Jira
- ✅ Transitionner les statuts (To Do → In Progress → Done)
- ✅ Lire / mettre à jour les pages Confluence
- ✅ Ajouter des commentaires sur les tickets

---

## 📁 Fichiers de référence

| Fichier | Rôle |
|---------|------|
| `CLAUDE.md` | Contexte permanent (ce fichier) |
| `context-sync.md` | État courant du sprint — mis à jour par Claude Code |
| `.claude/mcp.json` | Configuration MCP Atlassian |
| `apps/api/prisma/schema.prisma` | Source de vérité du schéma DB |
| `packages/types/src/` | Types TypeScript partagés mobile ↔ backend |
| `mockups/` | Maquettes UI Figma |
