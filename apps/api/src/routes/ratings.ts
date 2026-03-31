import type { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { requireAuth } from '../plugins/clerk';
import { checkAndAwardBadges } from '../services/badges.service';

const createRatingSchema = z.object({
  animeId: z.string(),
  score: z.number().int().min(1).max(5),
});

const ratingsQuerySchema = z.object({
  animeId: z.string().min(1).max(100),
  page: z.coerce.number().int().min(1).max(1000).default(1),
});

export const ratingsRoutes: FastifyPluginAsync = async (app) => {
  // GET /api/ratings/mine — historique de notation de l'utilisateur connecté
  app.get('/mine', { preHandler: requireAuth }, async (request) => {
    const user = await app.prisma.user.findUnique({ where: { clerkId: request.userId! } });
    if (!user) throw { statusCode: 404, message: 'Utilisateur introuvable' };

    const ratings = await app.prisma.rating.findMany({
      where: { userId: user.id },
      include: { anime: true },
      orderBy: { createdAt: 'desc' },
    });

    return ratings;
  });

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

    const newBadges = await checkAndAwardBadges(user.id, 'rating', app.prisma, { score: body.score });

    return reply.status(201).send({ rating, newBadges });
  });

  // GET /api/ratings?animeId=xxx&page=1
  app.get('/', async (request) => {
    const { animeId, page } = ratingsQuerySchema.parse(request.query);
    const perPage = 20;

    const [ratings, aggregate] = await app.prisma.$transaction([
      app.prisma.rating.findMany({
        where: { animeId },
        include: { user: { select: { username: true, avatar: true } } },
        skip: (page - 1) * perPage,
        take: perPage,
        orderBy: { createdAt: 'desc' },
      }),
      app.prisma.rating.aggregate({
        where: { animeId },
        _avg: { score: true },
        _count: { score: true },
      }),
    ]);

    return {
      ratings,
      average: aggregate._avg.score,
      count: aggregate._count.score,
      page,
      hasNextPage: page * perPage < aggregate._count.score,
    };
  });
};
