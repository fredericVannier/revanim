import type { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { getOrFetchAnime, searchAnimes } from '../services/anilist.service';

const searchSchema = z.object({
  q: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  perPage: z.coerce.number().min(1).max(50).default(20),
});

export const animesRoutes: FastifyPluginAsync = async (app) => {
  // GET /api/animes?q=naruto&page=1&perPage=20
  app.get('/', async (request, reply) => {
    const query = searchSchema.parse(request.query);

    if (query.q) {
      const results = await searchAnimes(query.q, query.page, query.perPage, app.prisma);
      return results;
    }

    // Catalogue : animes en cache local triés par score
    const [data, total] = await app.prisma.$transaction([
      app.prisma.anime.findMany({
        skip: (query.page - 1) * query.perPage,
        take: query.perPage,
        orderBy: { score: 'desc' },
      }),
      app.prisma.anime.count(),
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
