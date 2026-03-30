/** Statut de diffusion d'un anime */
export type AnimeStatus =
  | "FINISHED"
  | "RELEASING"
  | "NOT_YET_RELEASED"
  | "CANCELLED"
  | "HIATUS";

/** Saison de diffusion */
export type AnimeSeason = "WINTER" | "SPRING" | "SUMMER" | "FALL";

/** Representation d'un anime dans l'application */
export interface Anime {
  id: string;
  anilistId: number;
  title: string;
  titleJapanese: string | null;
  synopsis: string | null;
  coverImage: string | null;
  bannerImage: string | null;
  genres: string[];
  score: number | null;
  episodes: number | null;
  status: AnimeStatus;
  season: AnimeSeason | null;
  year: number | null;
  updatedAt: Date;
}

/** Donnees compactes pour les listes et cartes */
export interface AnimeCard {
  id: string;
  anilistId: number;
  title: string;
  coverImage: string | null;
  score: number | null;
  genres: string[];
  episodes: number | null;
  status: AnimeStatus;
}

/** Reponse paginee */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/** Parametres de recherche d'animes */
export interface AnimeSearchParams {
  query?: string;
  genres?: string[];
  season?: AnimeSeason;
  year?: number;
  status?: AnimeStatus;
  page?: number;
  pageSize?: number;
  sortBy?: "score" | "title" | "year" | "episodes";
  sortOrder?: "asc" | "desc";
}

/** Types de classement */
export type RankingType = "WEEKLY" | "ALL_TIME";

/** Entree dans un classement */
export interface RankingEntry {
  position: number;
  anime: AnimeCard;
  score: number;
  ratingCount: number;
}

/** Types de liste utilisateur */
export type ListType = "FAVORITE" | "WISHLIST" | "COUP_DE_COEUR";
