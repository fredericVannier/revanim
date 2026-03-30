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
    const user = await app.prisma.user.findUnique({
      where: { clerkId: request.userId! },
      include: {
        badges: { include: { badge: true } },
        _count: { select: { ratings: true, animeList: true } },
      },
    });

    if (!user) {
      // Premier accès : crée le profil utilisateur
      const newUser = await app.prisma.user.create({
        data: { clerkId: request.userId!, username: `user_${Date.now()}` },
        include: { badges: { include: { badge: true } } },
      });
      return newUser;
    }

    return user;
  });

  // PATCH /api/users/me
  app.patch('/me', { preHandler: requireAuth }, async (request, reply) => {
    const body = updateProfileSchema.parse(request.body);

    const user = await app.prisma.user.update({
      where: { clerkId: request.userId! },
      data: body,
    });

    return user;
  });

  // GET /api/users/:username (profil public)
  app.get<{ Params: { username: string } }>('/:username', async (request) => {
    const user = await app.prisma.user.findUnique({
      where: { username: request.params.username },
      include: {
        badges: { include: { badge: true } },
        _count: { select: { ratings: true } },
      },
    });

    if (!user) throw { statusCode: 404, message: 'Utilisateur introuvable' };

    return user;
  });
};
