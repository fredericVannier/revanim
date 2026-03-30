import type { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { requireAuth } from '../plugins/clerk';

const updateProfileSchema = z.object({
  username: z.string().min(3).max(30).optional(),
  bio: z.string().max(500).optional(),
  avatar: z.string().url().optional(),
});

export const usersRoutes: FastifyPluginAsync = async (app) => {
  // GET /api/users/me
  app.get('/me', { preHandler: requireAuth }, async (request, reply) => {
    const user = await app.prisma.user.upsert({
      where: { clerkId: request.userId! },
      update: {},
      create: { clerkId: request.userId!, username: `user_${Date.now()}` },
      include: {
        badges: { include: { badge: true } },
        _count: { select: { ratings: true, animeList: true } },
      },
    });
    return user;
  });

  // PATCH /api/users/me
  app.patch('/me', { preHandler: requireAuth }, async (request, reply) => {
    const body = updateProfileSchema.parse(request.body);

    const user = await app.prisma.user.update({
      where: { clerkId: request.userId! },
      data: body,
      select: {
        id: true, username: true, avatar: true, bio: true, createdAt: true,
      },
    });

    return user;
  });

  // GET /api/users/:username (profil public)
  app.get<{ Params: { username: string } }>('/:username', async (request, reply) => {
    const user = await app.prisma.user.findUnique({
      where: { username: request.params.username },
      select: {
        id: true,
        username: true,
        avatar: true,
        bio: true,
        createdAt: true,
        badges: { include: { badge: true } },
        _count: { select: { ratings: true } },
      },
    });
    if (!user) return reply.status(404).send({ error: 'Utilisateur introuvable' });
    return user;
  });
};
