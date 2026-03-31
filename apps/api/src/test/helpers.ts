import Fastify, { type FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import type { PrismaClient } from '@prisma/client';
import { ZodError } from 'zod';

/**
 * Construit une instance Fastify légère pour les tests.
 * - Prisma injecté en tant que mock
 * - Clerk remplacé par un plugin minimal (userId configurable)
 * - Redis non chargé
 */
export function buildTestApp(
  prisma: PrismaClient,
  opts: { userId?: string | null } = {},
): FastifyInstance {
  const app = Fastify({ logger: false });

  // Inject mock prisma
  app.register(
    fp(async (a) => {
      a.decorate('prisma', prisma);
    }),
  );

  // Inject mock clerk (userId statique pour les tests)
  app.register(
    fp(async (a) => {
      a.decorateRequest('userId', null);
      a.addHook('preHandler', async (req) => {
        req.userId = opts.userId ?? null;
      });
    }),
  );

  // ZodError → 400 (même comportement que la prod)
  app.setErrorHandler((error, _req, reply) => {
    if (error instanceof ZodError) {
      return reply.status(400).send({ error: 'Paramètres invalides', details: error.errors });
    }
    reply.send(error);
  });

  return app;
}

/** Mock minimal d'un objet PrismaClient — surcharge les méthodes nécessaires dans chaque test */
export function createPrismaMock(): PrismaClient {
  return {
    user: { findUnique: vi.fn(), upsert: vi.fn(), update: vi.fn() },
    anime: { findMany: vi.fn(), findUnique: vi.fn(), count: vi.fn(), upsert: vi.fn() },
    rating: {
      upsert: vi.fn(), findMany: vi.fn(), count: vi.fn(),
      aggregate: vi.fn(), groupBy: vi.fn(),
    },
    comment: { findMany: vi.fn(), findUnique: vi.fn(), create: vi.fn(), count: vi.fn() },
    commentLike: { findUnique: vi.fn(), create: vi.fn(), delete: vi.fn() },
    userAnimeList: { findMany: vi.fn(), findUnique: vi.fn(), create: vi.fn(), delete: vi.fn(), count: vi.fn() },
    badge: { findMany: vi.fn() },
    userBadge: { findMany: vi.fn(), createMany: vi.fn() },
    ranking: { findMany: vi.fn() },
    $transaction: vi.fn(),
    $connect: vi.fn(),
    $disconnect: vi.fn(),
  } as unknown as PrismaClient;
}
