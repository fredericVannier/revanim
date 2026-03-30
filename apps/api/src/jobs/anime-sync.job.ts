import { Queue, Worker } from 'bullmq';
import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';
import { anilistClient, GET_TOP_ANIMES } from '../lib/anilist-client';
import { toAnimeUpsertData } from '../services/anilist.service';

const QUEUE_NAME = 'anime-sync';

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

export function createAnimeSyncQueue(redis: Redis) {
  return new Queue(QUEUE_NAME, {
    connection: redis,
    defaultJobOptions: {
      attempts: 3,
      backoff: { type: 'exponential', delay: 5000 },
      removeOnComplete: 100,
      removeOnFail: 50,
    },
  });
}

export function startAnimeSyncWorker(redis: Redis, prisma: PrismaClient) {
  const worker = new Worker(
    QUEUE_NAME,
    async (job) => {
      console.log(`[anime-sync] Job ${job.name} démarré`);

      // Sync les 500 animes les plus populaires (10 pages × 50)
      for (let page = 1; page <= 10; page++) {
        const data = await anilistClient.request<{
          Page: { media: AnilistMedia[] };
        }>(GET_TOP_ANIMES, { page, perPage: 50 });

        await Promise.all(
          data.Page.media.map((m) =>
            prisma.anime.upsert({
              where: { anilistId: m.id },
              update: toAnimeUpsertData(m),
              create: toAnimeUpsertData(m),
            }),
          ),
        );

        // Pause pour respecter le rate limit AniList (90 req/min)
        await new Promise((resolve) => setTimeout(resolve, 700));
      }

      console.log(`[anime-sync] Sync terminée — 500 animes mis à jour`);
    },
    { connection: redis, concurrency: 1 },
  );

  worker.on('failed', (job, err) => {
    console.error(`[anime-sync] Job échoué:`, err);
  });

  return worker;
}

// Planifie le job toutes les 24h
export async function scheduleAnimeSyncJob(queue: ReturnType<typeof createAnimeSyncQueue>) {
  await queue.upsertJobScheduler('daily-sync', { every: 24 * 60 * 60 * 1000 }, {
    name: 'sync-top-animes',
    data: {},
  });
}
