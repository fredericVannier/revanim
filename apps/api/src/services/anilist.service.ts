import { PrismaClient } from '@prisma/client';
import type { AnimeStatus } from '@prisma/client';
import Redis from 'ioredis';
import { anilistClient, GET_ANIME, SEARCH_ANIMES, GET_TOP_ANIMES } from '../lib/anilist-client';

const CACHE_TTL = 60 * 60 * 24; // 24h en secondes

interface AnilistMedia {
  id: number;
  title: { romaji: string; english: string | null; native: string | null };
  description: string | null;
  coverImage: { extraLarge: string | null; large: string | null };
  bannerImage: string | null;
  genres: string[];
  meanScore: number | null;
  episodes: number | null;
  status: string;
  season: string | null;
  seasonYear: number | null;
}

function mapStatus(status: string): AnimeStatus {
  const map: Record<string, AnimeStatus> = {
    FINISHED: 'FINISHED',
    RELEASING: 'RELEASING',
    NOT_YET_RELEASED: 'NOT_YET_RELEASED',
    CANCELLED: 'CANCELLED',
  };
  return map[status] ?? 'FINISHED';
}

// Convertit un objet AniList en format Prisma upsert
function toAnimeUpsertData(media: AnilistMedia) {
  return {
    anilistId: media.id,
    title: media.title.english ?? media.title.romaji,
    titleJapanese: media.title.native,
    synopsis: media.description,
    coverImage: media.coverImage.extraLarge ?? media.coverImage.large,
    bannerImage: media.bannerImage,
    genres: media.genres,
    score: media.meanScore ? media.meanScore / 10 : null,
    episodes: media.episodes,
    status: mapStatus(media.status),
    season: media.season,
    year: media.seasonYear,
  };
}

export async function getOrFetchAnime(anilistId: number, prisma: PrismaClient, redis: Redis) {
  // 1. Cherche dans le cache Redis
  const cacheKey = `anime:${anilistId}`;
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  // 2. Cherche en base PostgreSQL
  const existing = await prisma.anime.findUnique({ where: { anilistId } });
  const isStale = existing && new Date().getTime() - existing.updatedAt.getTime() > CACHE_TTL * 1000;

  if (existing && !isStale) {
    await redis.setex(cacheKey, 3600, JSON.stringify(existing));
    return existing;
  }

  // 3. Fetch depuis AniList
  const data = await anilistClient.request<{ Media: AnilistMedia }>(GET_ANIME, { id: anilistId });
  const anime = await prisma.anime.upsert({
    where: { anilistId },
    update: toAnimeUpsertData(data.Media),
    create: toAnimeUpsertData(data.Media),
  });

  await redis.setex(cacheKey, 3600, JSON.stringify(anime));
  return anime;
}

export async function searchAnimes(
  query: string,
  page: number,
  perPage: number,
  prisma: PrismaClient,
) {
  // Cherche d'abord en local
  const [data, total] = await prisma.$transaction([
    prisma.anime.findMany({
      where: { title: { contains: query, mode: 'insensitive' } },
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: { score: 'desc' },
    }),
    prisma.anime.count({
      where: { title: { contains: query, mode: 'insensitive' } },
    }),
  ]);

  // Si peu de résultats locaux, enrichit depuis AniList
  if (total < 5) {
    const anilistData = await anilistClient.request<{
      Page: { media: AnilistMedia[]; pageInfo: { total: number; hasNextPage: boolean } };
    }>(SEARCH_ANIMES, { search: query, page, perPage });

    // Upsert en arrière-plan (pas de await = non bloquant)
    Promise.all(
      anilistData.Page.media.map((m) =>
        prisma.anime.upsert({
          where: { anilistId: m.id },
          update: toAnimeUpsertData(m),
          create: toAnimeUpsertData(m),
        }),
      ),
    ).catch(console.error);

    return {
      data: anilistData.Page.media.map(toAnimeUpsertData),
      total: anilistData.Page.pageInfo.total,
      page,
      perPage,
      hasNextPage: anilistData.Page.pageInfo.hasNextPage,
    };
  }

  return {
    data,
    total,
    page,
    perPage,
    hasNextPage: page * perPage < total,
  };
}

export { GET_TOP_ANIMES, toAnimeUpsertData };
