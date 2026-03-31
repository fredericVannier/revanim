import { PrismaClient } from '@prisma/client';
import { GraphQLClient, gql } from 'graphql-request';

const prisma = new PrismaClient();
const anilistClient = new GraphQLClient('https://graphql.anilist.co');

// ─── Badges ────────────────────────────────────────────────────────────────

const BADGES = [
  {
    key: 'first_review',
    name: 'Critique en herbe',
    description: 'Écrire ton premier commentaire',
    icon: '✏️',
  },
  {
    key: 'ten_reviews',
    name: 'Plume affûtée',
    description: 'Écrire 10 commentaires',
    icon: '🖊️',
  },
  {
    key: 'fifty_reviews',
    name: 'Rédacteur confirmé',
    description: 'Écrire 50 commentaires',
    icon: '📝',
  },
  {
    key: 'first_rating',
    name: 'Premier avis',
    description: 'Noter ton premier anime',
    icon: '⭐',
  },
  {
    key: 'ten_ratings',
    name: 'Cinéphile',
    description: 'Noter 10 animes',
    icon: '🎬',
  },
  {
    key: 'fifty_ratings',
    name: 'Expert du genre',
    description: 'Noter 50 animes',
    icon: '🏆',
  },
  {
    key: 'first_favorite',
    name: 'Coup de cœur',
    description: 'Ajouter un anime en favori',
    icon: '❤️',
  },
  {
    key: 'first_wishlist',
    name: 'Liste de souhaits',
    description: 'Ajouter un anime à ta wishlist',
    icon: '📋',
  },
  {
    key: 'ten_favorites',
    name: 'Collectionneur',
    description: 'Avoir 10 animes en favoris',
    icon: '💎',
  },
  {
    key: 'perfect_score',
    name: 'Chef-d\'œuvre',
    description: 'Donner un 5/5 à un anime',
    icon: '👑',
  },
  {
    key: 'hundred_ratings',
    name: 'Légende',
    description: 'Noter 100 animes',
    icon: '🌟',
  },
  {
    key: 'social_sharer',
    name: 'Ambassadeur',
    description: 'Partager un anime',
    icon: '📣',
  },
  {
    key: 'profile_complete',
    name: 'Profil complet',
    description: 'Compléter ton profil (avatar + bio)',
    icon: '👤',
  },
  {
    key: 'early_adopter',
    name: 'Early Adopter',
    description: 'Parmi les 1000 premiers utilisateurs',
    icon: '🚀',
  },
];

// ─── AniList query ──────────────────────────────────────────────────────────

const GET_TOP_ANIMES = gql`
  query GetTopAnimes($page: Int!, $perPage: Int!) {
    Page(page: $page, perPage: $perPage) {
      media(type: ANIME, sort: POPULARITY_DESC) {
        id
        title { romaji english }
        description(asHtml: false)
        coverImage { extraLarge }
        bannerImage
        genres
        meanScore
        episodes
        status
        season
        seasonYear
      }
    }
  }
`;

type AnilistMedia = {
  id: number;
  title: { romaji: string; english: string | null };
  description: string | null;
  coverImage: { extraLarge: string | null };
  bannerImage: string | null;
  genres: string[];
  meanScore: number | null;
  episodes: number | null;
  status: string;
  season: string | null;
  seasonYear: number | null;
};

type AnilistResponse = {
  Page: { media: AnilistMedia[] };
};

function mapStatus(status: string): 'FINISHED' | 'RELEASING' | 'NOT_YET_RELEASED' | 'CANCELLED' {
  const map: Record<string, 'FINISHED' | 'RELEASING' | 'NOT_YET_RELEASED' | 'CANCELLED'> = {
    FINISHED: 'FINISHED',
    RELEASING: 'RELEASING',
    NOT_YET_RELEASED: 'NOT_YET_RELEASED',
    CANCELLED: 'CANCELLED',
  };
  return map[status] ?? 'FINISHED';
}

// ─── Seed ───────────────────────────────────────────────────────────────────

async function seedBadges() {
  console.log('Seeding badges...');
  for (const badge of BADGES) {
    await prisma.badge.upsert({
      where: { key: badge.key },
      update: { name: badge.name, description: badge.description, icon: badge.icon },
      create: badge,
    });
  }
  console.log(`✅ ${BADGES.length} badges seeded`);
}

async function seedAnimes() {
  console.log('Fetching top animes from AniList...');

  const perPage = 50;
  const data = await anilistClient.request<AnilistResponse>(GET_TOP_ANIMES, {
    page: 1,
    perPage,
  });

  const animes = data.Page.media;
  let count = 0;

  for (const anime of animes) {
    const title = anime.title.english ?? anime.title.romaji;
    await prisma.anime.upsert({
      where: { anilistId: anime.id },
      update: {
        title,
        synopsis: anime.description,
        coverImage: anime.coverImage.extraLarge,
        bannerImage: anime.bannerImage,
        genres: anime.genres,
        score: anime.meanScore ? anime.meanScore / 10 : null,
        episodes: anime.episodes,
        status: mapStatus(anime.status),
        season: anime.season,
        year: anime.seasonYear,
      },
      create: {
        anilistId: anime.id,
        title,
        synopsis: anime.description,
        coverImage: anime.coverImage.extraLarge,
        bannerImage: anime.bannerImage,
        genres: anime.genres,
        score: anime.meanScore ? anime.meanScore / 10 : null,
        episodes: anime.episodes,
        status: mapStatus(anime.status),
        season: anime.season,
        year: anime.seasonYear,
      },
    });
    count++;
  }

  console.log(`✅ ${count} animes seeded`);
}

async function main() {
  await seedBadges();
  await seedAnimes();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
