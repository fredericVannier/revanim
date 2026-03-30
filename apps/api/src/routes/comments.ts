import type { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { requireAuth } from '../plugins/clerk';

const createCommentSchema = z.object({
  animeId: z.string(),
  content: z.string().min(1).max(1000),
});

export const commentsRoutes: FastifyPluginAsync = async (app) => {
  // GET /api/comments?animeId=xxx&page=1
  app.get<{ Querystring: { animeId: string; page?: string } }>('/', async (request) => {
    const animeId = request.query.animeId;
    const page = parseInt(request.query.page ?? '1');
    const perPage = 20;

    const [comments, total] = await app.prisma.$transaction([
      app.prisma.comment.findMany({
        where: { animeId },
        include: { user: { select: { username: true, avatar: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      app.prisma.comment.count({ where: { animeId } }),
    ]);

    return { comments, total, page, hasNextPage: page * perPage < total };
  });

  // POST /api/comments
  app.post('/', { preHandler: requireAuth }, async (request, reply) => {
    const body = createCommentSchema.parse(request.body);
    const user = await app.prisma.user.findUnique({ where: { clerkId: request.userId! } });
    if (!user) return reply.status(404).send({ error: 'Utilisateur introuvable' });

    const comment = await app.prisma.comment.create({
      data: { userId: user.id, animeId: body.animeId, content: body.content },
      include: { user: { select: { username: true, avatar: true } } },
    });

    return reply.status(201).send(comment);
  });

  // POST /api/comments/:id/like
  app.post<{ Params: { id: string } }>('/:id/like', { preHandler: requireAuth }, async (request, reply) => {
    const user = await app.prisma.user.findUnique({ where: { clerkId: request.userId! } });
    if (!user) return reply.status(404).send({ error: 'Utilisateur introuvable' });

    const existing = await app.prisma.commentLike.findUnique({
      where: { userId_commentId: { userId: user.id, commentId: request.params.id } },
    });

    if (existing) {
      await app.prisma.$transaction([
        app.prisma.commentLike.delete({
          where: { userId_commentId: { userId: user.id, commentId: request.params.id } },
        }),
        app.prisma.comment.update({
          where: { id: request.params.id },
          data: { likes: { decrement: 1 } },
        }),
      ]);
      return { liked: false };
    }

    await app.prisma.$transaction([
      app.prisma.commentLike.create({
        data: { userId: user.id, commentId: request.params.id },
      }),
      app.prisma.comment.update({
        where: { id: request.params.id },
        data: { likes: { increment: 1 } },
      }),
    ]);

    return reply.status(201).send({ liked: true });
  });
};
