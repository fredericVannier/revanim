import type { FastifyPluginAsync } from 'fastify';
import type { RankingType } from '@prisma/client';

export const rankingsRoutes: FastifyPluginAsync = async (app) => {
  // GET /api/rankings?type=WEEKLY&limit=50
  app.get<{ Querystring: { type?: RankingType; limit?: string } }>('/', async (request) => {
    const type = request.query.type ?? 'ALL_TIME';
    const limit = Math.min(parseInt(request.query.limit ?? '50'), 100);

    const rankings = await app.prisma.ranking.findMany({
      where: { type },
      include: { anime: { select: { id: true, title: true, coverImage: true, score: true, genres: true } } },
      orderBy: { position: 'asc' },
      take: limit,
    });

    return rankings;
  });
};
