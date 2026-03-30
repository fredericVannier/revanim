import type { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { requireAuth } from '../plugins/clerk';

const createRatingSchema = z.object({
  animeId: z.string(),
  score: z.number().int().min(1).max(5),
});

export const ratingsRoutes: FastifyPluginAsync = async (app) => {
  // POST /api/ratings
  app.post('/', { preHandler: requireAuth }, async (request, reply) => {
    const body = createRatingSchema.parse(request.body);

    const user = await app.prisma.user.findUnique({ where: { clerkId: request.userId! } });
    if (!user) return reply.status(404).send({ error: 'Utilisateur introuvable' });

    const rating = await app.prisma.rating.upsert({
      where: { userId_animeId: { userId: user.id, animeId: body.animeId } },
      update: { score: body.score },
      create: { userId: user.id, animeId: body.animeId, score: body.score },
    });

    return reply.status(201).send(rating);
  });

  // GET /api/ratings?animeId=xxx
  app.get<{ Querystring: { animeId: string } }>('/', async (request) => {
    const { animeId } = request.query;

    const ratings = await app.prisma.rating.findMany({
      where: { animeId },
      include: { user: { select: { username: true, avatar: true } } },
    });

    const avg = ratings.length
      ? ratings.reduce((acc, r) => acc + r.score, 0) / ratings.length
      : null;

    return { ratings, average: avg, count: ratings.length };
  });
};
