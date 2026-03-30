# context-sync.md — État du sprint revAnim

> ⚠️ Fichier maintenu automatiquement par Claude Code.
> Ne pas éditer manuellement. Mis à jour après chaque session de dev.

---

## 🗓️ Dernière mise à jour
2026-03-30

---

## 🏃 Sprint en cours
**Sprint 1 — Infrastructure & Architecture**
Base technique posée. Prêt à implémenter les features core.

---

## ✅ Réalisé (Done)

### Infrastructure (KAN-32)
- ✅ Monorepo pnpm + Turborepo initialisé
- ✅ KAN-64 — Architecture backend Fastify + TypeScript + plugins (prisma, clerk, redis)
- ✅ KAN-65 — Schéma Prisma complet + migration `init` appliquée sur Railway
- ✅ KAN-66 — Intégration AniList GraphQL (cache-aside Redis → PostgreSQL → AniList)
- ✅ Types partagés `@revanim/types` (Anime, User, Rating, Comment)
- ✅ Structure mobile Expo Router + ClerkProvider + AuthGuard
- ✅ GitHub repo public : `github.com/fredericVannier/revanim`
- ✅ PostgreSQL Railway provisionné + connecté
- ✅ Redis Railway provisionné + connecté
- ✅ Clerk configuré (`@clerk/fastify` + `@clerk/clerk-expo`)
- ✅ Maquettes UI "Cinéma de nuit" (HomeScreen + AnimeDetailScreen) dans `mockups/`

---

## 🔄 En cours / Prochaines étapes

### Auth (KAN-25)
- KAN-33 — Inscription email + mot de passe
- KAN-34 — Connexion OAuth Google / Apple
- KAN-35 — Réinitialisation de mot de passe
- KAN-36 — Déconnexion

### Catalogue (KAN-27)
- KAN-43 — Écran catalogue (brancher HomeScreen sur l'API)
- KAN-44 — Recherche par titre
- KAN-47 — Fiche détail (brancher AnimeDetailScreen sur l'API)

---

## 📥 Backlog (À faire)

### Profil (KAN-26)
- KAN-37 — Voir son profil avec statistiques
- KAN-38 — Gérer sa liste de favoris
- KAN-39 — Gérer sa wishlist
- KAN-40 — Marquer des animes comme coups de cœur
- KAN-41 — Historique de commentaires
- KAN-42 — Modifier avatar et pseudo

### Catalogue (KAN-27)
- KAN-45 — Filtrer par genre
- KAN-46 — Filtrer par année / statut

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

### Infrastructure restante (KAN-32)
- KAN-67 — Configurer le pipeline CI/CD (GitHub Actions + EAS)
- KAN-68 — Mettre en place les tests automatisés

### Badges & Trophées (KAN-69)
- KAN-70 — Voir ses badges sur le profil
- KAN-71 — Notification de débloquage de badge
- KAN-72 — Moteur de déclenchement des badges (back-end)
- KAN-73 — Catalogue des badges (design + règles métier)

---

## 🏗️ Décisions techniques (validées)

| Sujet | Décision |
|-------|----------|
| Monorepo | pnpm workspaces + Turborepo |
| Backend | Fastify + TypeScript (remplace NestJS — plus simple) |
| ORM | Prisma v5 |
| Auth | Clerk (`@clerk/fastify` + `@clerk/clerk-expo`) |
| Cache/Queue | BullMQ + Redis (sync AniList top 500 toutes les 24h) |
| Mobile | Expo SDK 51 + Expo Router v3 |
| Déploiement | Railway (API + PostgreSQL + Redis) + EAS (mobile) |
| Design | "Cinéma de nuit" — fond `#0A0A14`, or `#C9A84C`, violet `#7C3AED` |
| API AniList | Cache-aside : Redis (1h) → PostgreSQL (24h) → AniList |

---

## 🐛 Bugs / Points d'attention
- `@clerk/clerk-expo` v1.2.9 marqué deprecated → à mettre à jour lors du prochain sprint
- `prisma` v5.22 → v7.6 disponible (major upgrade, reporter)
- peer dependency `react-dom` (19 vs 18) dans le workspace → sans impact pour l'instant

---

## 📝 Notes de session
- 2026-03-30 : Initialisation complète du projet revAnim (ex Rev-anime). Stack validée, monorepo créé, DB migrée, GitHub pushé. Maquettes UI réalisées.
