# context-sync.md — État du sprint Rev-anime

> ⚠️ Fichier maintenu automatiquement par Claude Code.
> Ne pas éditer manuellement. Mis à jour après chaque session de dev.

---

## 🗓️ Dernière mise à jour
2026-03-30

---

## 🏃 Sprint en cours
**Sprint 0 — Initialisation & Architecture**
Aucun ticket en cours. Projet en phase de cadrage technique.

---

## ✅ Tickets terminés (Done)
- (aucun pour l'instant)

---

## 🔄 Tickets en cours (In Progress)
- (aucun pour l'instant)

---

## 📥 Backlog Rev-anime (À faire)

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

### Infrastructure (KAN-32)
- KAN-64 — Concevoir et mettre en place l'architecture backend (API REST)
- KAN-65 — Mettre en place le schéma et la base de données
- KAN-66 — Intégrer l'API externe d'animes (AniList)
- KAN-67 — Configurer le pipeline CI/CD
- KAN-68 — Mettre en place les tests automatisés (unitaires et E2E)

### Auth (KAN-25)
- KAN-33 — Inscription email + mot de passe
- KAN-34 — Connexion OAuth Google / Apple
- KAN-35 — Réinitialisation de mot de passe
- KAN-36 — Déconnexion

### Profil (KAN-26)
- KAN-37 — Voir son profil avec statistiques
- KAN-38 — Gérer sa liste de favoris
- KAN-39 — Gérer sa wishlist
- KAN-40 — Marquer des animes comme coups de cœur
- KAN-41 — Historique de commentaires
- KAN-42 — Modifier avatar et pseudo

### Catalogue (KAN-27)
- KAN-43 — Parcourir le catalogue complet
- KAN-44 — Recherche par titre
- KAN-45 — Filtrer par genre
- KAN-46 — Filtrer par année / statut
- KAN-47 — Page détail d'un anime

### Notation & Commentaires (KAN-28)
- KAN-48 — Noter un anime (étoiles 1-5)
- KAN-49 — Écrire un commentaire
- KAN-50 — Modifier / supprimer son commentaire
- KAN-51 — Liker un commentaire
- KAN-52 — Modération des commentaires

### Classements (KAN-29)
- KAN-53 — Top animes les mieux notés
- KAN-54 — Classement utilisateurs les plus actifs
- KAN-55 — Animes tendances
- KAN-56 — Recommandations personnalisées

### Partage Social (KAN-30)
- KAN-57 — Partager la fiche d'un anime
- KAN-58 — Lien public vers son profil
- KAN-59 — Partager sa liste de favoris

### i18n (KAN-31)
- KAN-60 — Traductions FR
- KAN-61 — Traductions EN
- KAN-62 — Traductions ES
- KAN-63 — Détection automatique de la langue

### Badges & Trophées (KAN-69)
- KAN-70 — Voir ses badges sur le profil
- KAN-71 — Notification de débloquage de badge
- KAN-72 — Moteur de déclenchement des badges (back-end)
- KAN-73 — Catalogue des badges (design + règles métier)

---

## 🏗️ Décisions techniques récentes

### Architecture globale
- **Monorepo** pnpm workspaces + Turborepo
  - `apps/mobile` (Expo), `apps/api` (NestJS), `packages/types`, `packages/utils`, `packages/config`

### Stack Mobile
- **Expo SDK 52+** (managed workflow, EAS Build pour iOS/Android)
- **Expo Router v3** (file-system routing, remplace React Navigation)
- **Zustand** (state UI) + **TanStack Query v5** (state async / cache API)
- **NativeWind v4** (Tailwind CSS pour RN — styling)
- **FlashList** (listes performantes), **expo-image** (posters/covers)
- **Reanimated 3** + **Lottie** (animations), **expo-haptics** (retour haptique)
- **react-hook-form + Zod** (formulaires), **i18next** (i18n)
- **expo-secure-store** (tokens), **MMKV** (storage rapide)

### Stack Backend
- **NestJS** (architecture modulaire, TypeScript first)
- **Prisma** (ORM + migrations)
- **Passport.js + JWT** (auth : email/password + OAuth Google/Apple)
  - Access token 15min (mémoire), refresh token 30j (secure-store)
- **REST API** (GraphQL AniList consommé côté backend uniquement)
- **graphql-request + graphql-codegen** (client AniList typé)
- **Cache PostgreSQL** TTL 24h pour les données animes (cache-aside pattern)
- **p-queue** (rate limiting AniList : max 80 req/min)

### Base de données
- Entités principales : User, Anime, Rating, Favorite, WishlistItem, Comment, Badge, UserBadge, Follow, RefreshToken
- Rating : score 1-10 + flag `coup` (coup de cœur)
- Badge : condition stockée en JSON `{ type, threshold }`

### Design System
- **Direction** : "Cinéma de nuit" — dark mode chaud, épuré, premium
- **Couleur primaire** : Vermillon électrique `#E8432A`
- **Fond** : `#0D0B0E` (noir chaud légèrement violet)
- **Accent secondaire** : Cyan `#2DD4BF`
- **Typographie** : Space Grotesk (titres) + DM Sans (corps)
- **Navigation** : Tab Bar 5 onglets (Découvrir, Recherche, Classements, Collection, Profil)

### CI/CD
- **GitHub Actions** (lint + typecheck + tests sur chaque PR)
- **EAS Build** (builds iOS/Android cloud)
- **Railway** (hébergement backend early-stage, PostgreSQL inclus)
- **Docker multi-stage** pour l'API

### Ordre d'implémentation
1. Init monorepo (pnpm + Turborepo + Expo + NestJS)
2. Schéma Prisma + DB locale (Docker Compose)
3. Auth backend complet (register/login/refresh/OAuth)
4. Intégration AniList + cache
5. Navigation squelette mobile + i18n
6. Features core : Rating, Favoris, Wishlist
7. CI/CD baseline (GitHub Actions + EAS Build)

---

## 🐛 Bugs / Blocages connus
- (aucun pour l'instant)

---

## 📝 Notes de session
- 2026-03-30 : Initialisation du fichier. 40 tickets Rev-anime tous en statut "À faire" (KAN-33 à KAN-73). Le projet démarre de zéro.
