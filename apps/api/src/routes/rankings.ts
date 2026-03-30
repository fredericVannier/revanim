import type { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';

const rankingQuerySchema = z.object({
  type: z.enum(['WEEKLY', 'ALL_TIME']).default('ALL_TIME'),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

export const rankingsRoutes: FastifyPluginAsync = async (app) => {
  // GET /api/rankings?type=WEEKLY&limit=50
  app.get('/', async (request, reply) => {
    const { type, limit } = rankingQuerySchema.parse(request.query);
    const rankings = await app.prisma.ranking.findMany({
      where: { type },
      include: { anime: { select: { id: true, title: true, coverImage: true, score: true, genres: true } } },
      orderBy: { position: 'asc' },
      take: limit,
    });
    return rankings;
  });
};
