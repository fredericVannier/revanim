import type { AnimeCard, ListType } from "./anime";

/** Profil utilisateur */
export interface User {
  id: string;
  clerkId: string;
  username: string;
  avatar: string | null;
  bio: string | null;
  createdAt: Date;
}

/** Donnees de mise a jour du profil */
export interface UpdateUserInput {
  username?: string;
  avatar?: string;
  bio?: string;
}

/** Notation d'un anime par un utilisateur */
export interface Rating {
  id: string;
  userId: string;
  animeId: string;
  score: number; // 1 a 5
  createdAt: Date;
}

/** Donnees pour creer/modifier une notation */
export interface CreateRatingInput {
  animeId: string;
  score: number;
}

/** Commentaire sur un anime */
export interface Comment {
  id: string;
  userId: string;
  animeId: string;
  content: string;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
  user: Pick<User, "id" | "username" | "avatar">;
  likedByMe: boolean;
}

/** Donnees pour creer un commentaire */
export interface CreateCommentInput {
  animeId: string;
  content: string;
}

/** Entree dans une liste utilisateur */
export interface UserAnimeListEntry {
  anime: AnimeCard;
  type: ListType;
  addedAt: Date;
}

/** Badge / trophee */
export interface Badge {
  id: string;
  key: string;
  name: string;
  description: string;
  icon: string;
}

/** Badge obtenu par un utilisateur */
export interface UserBadge {
  badge: Badge;
  earnedAt: Date;
}

/** Profil complet avec statistiques */
export interface UserProfile extends User {
  ratingsCount: number;
  commentsCount: number;
  badges: UserBadge[];
  favoriteGenres: string[];
}
