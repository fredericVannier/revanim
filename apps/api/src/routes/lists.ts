import type { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { requireAuth } from '../plugins/clerk';
import { ListType } from '@prisma/client';

const listSchema = z.object({
  animeId: z.string(),
  type: z.enum(['FAVORITE', 'WISHLIST', 'COUP_DE_COEUR']),
});

export const listsRoutes: FastifyPluginAsync = async (app) => {
  // GET /api/lists?type=FAVORITE
  app.get<{ Querystring: { type?: ListType } }>('/', { preHandler: requireAuth }, async (request) => {
    const user = await app.prisma.user.findUnique({ where: { clerkId: request.userId! } });
    if (!user) throw { statusCode: 404, message: 'Utilisateur introuvable' };

    const items = await app.prisma.userAnimeList.findMany({
      where: { userId: user.id, ...(request.query.type && { type: request.query.type }) },
      include: { anime: true },
      orderBy: { addedAt: 'desc' },
    });

    return items;
  });

  // POST /api/lists — ajoute ou retire un anime d'une liste
  app.post('/', { preHandler: requireAuth }, async (request, reply) => {
    const body = listSchema.parse(request.body);
    const user = await app.prisma.user.findUnique({ where: { clerkId: request.userId! } });
    if (!user) return reply.status(404).send({ error: 'Utilisateur introuvable' });

    const existing = await app.prisma.userAnimeList.findUnique({
      where: { userId_animeId_type: { userId: user.id, animeId: body.animeId, type: body.type } },
    });

    if (existing) {
      await app.prisma.userAnimeList.delete({
        where: { userId_animeId_type: { userId: user.id, animeId: body.animeId, type: body.type } },
      });
      return { added: false, type: body.type };
    }

    await app.prisma.userAnimeList.create({
      data: { userId: user.id, animeId: body.animeId, type: body.type },
    });

    return reply.status(201).send({ added: true, type: body.type });
  });
};
