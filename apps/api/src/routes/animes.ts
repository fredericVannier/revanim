import type { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { getOrFetchAnime, searchAnimes } from '../services/anilist.service';

const searchSchema = z.object({
  q: z.string().optional(),
  genre: z.string().optional(),
  year: z.coerce.number().int().min(1900).max(2100).optional(),
  status: z.enum(['FINISHED', 'RELEASING', 'NOT_YET_RELEASED', 'CANCELLED']).optional(),
  page: z.coerce.number().min(1).default(1),
  perPage: z.coerce.number().min(1).max(50).default(20),
});

export const animesRoutes: FastifyPluginAsync = async (app) => {
  // GET /api/animes/trending — animes les plus notés sur les 7 derniers jours
  app.get('/trending', async () => {
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const topRated = await app.prisma.rating.groupBy({
      by: ['animeId'],
      where: { createdAt: { gte: since } },
      _count: { animeId: true },
      orderBy: { _count: { animeId: 'desc' } },
      take: 20,
    });

    if (topRated.length === 0) {
      // Fallback : top animes par score si aucune activité récente
      return app.prisma.anime.findMany({ orderBy: { score: 'desc' }, take: 20 });
    }

    const ids = topRated.map((r) => r.animeId);
    const animes = await app.prisma.anime.findMany({ where: { id: { in: ids } } });
    // Reorder by activity count
    return ids.map((id) => animes.find((a) => a.id === id)).filter(Boolean);
  });

  // GET /api/animes?q=naruto&genre=Action&year=2023&status=FINISHED&page=1&perPage=20
  app.get('/', async (request, reply) => {
    const query = searchSchema.parse(request.query);

    if (query.q) {
      const results = await searchAnimes(query.q, query.page, query.perPage, app.prisma);
      return results;
    }

    const where = {
      ...(query.genre && { genres: { has: query.genre } }),
      ...(query.year && { year: query.year }),
      ...(query.status && { status: query.status }),
    };

    const [data, total] = await app.prisma.$transaction([
      app.prisma.anime.findMany({
        where,
        skip: (query.page - 1) * query.perPage,
        take: query.perPage,
        orderBy: { score: 'desc' },
      }),
      app.prisma.anime.count({ where }),
    ]);

    return { data, total, page: query.page, perPage: query.perPage, hasNextPage: query.page * query.perPage < total };
  });

  // GET /api/animes/:id (anilistId)
  app.get<{ Params: { id: string } }>('/:id', async (request, reply) => {
    const anilistId = parseInt(request.params.id);
    if (isNaN(anilistId)) return reply.status(400).send({ error: 'ID invalide' });

    const anime = await getOrFetchAnime(anilistId, app.prisma, app.redis);
    if (!anime) return reply.status(404).send({ error: 'Anime introuvable' });

    return anime;
  });
};
