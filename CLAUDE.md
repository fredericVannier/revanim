# CLAUDE.md — revAnim

> Fichier de contexte permanent. Lu automatiquement par Claude Code à chaque session.
> Ne pas supprimer. Mettre à jour après chaque décision structurante.

---

## 🎯 Projet

**revAnim** — Application mobile de notation d'animes
- Fonctionnalités : favoris, wishlist, coups de cœur, commentaires, partage social
- Langues supportées : FR / EN / ES
- Statut : En développement actif

---

## 🛠️ Stack Technique

| Couche | Technologie |
|--------|-------------|
| Mobile | React Native |
| Backend | Node.js |
| Base de données | PostgreSQL |
| API externe | AniList API |
| Internationalisation | i18n (FR/EN/ES) |

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
3. **Si nouvelle décision d'archi** → mettre à jour la page Confluence ID 884737
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
