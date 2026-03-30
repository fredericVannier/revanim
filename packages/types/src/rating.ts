/** Distribution des notes pour un anime */
export interface RatingDistribution {
  animeId: string;
  average: number;
  total: number;
  distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

/** Notation avec les infos anime pour le profil */
export interface RatingWithAnime {
  id: string;
  score: number;
  createdAt: Date;
  anime: {
    id: string;
    title: string;
    coverImage: string | null;
  };
}
