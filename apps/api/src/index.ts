import Fastify from 'fastify';
import cors from '@fastify/cors';
import { prismaPlugin } from './plugins/prisma';
import { clerkPlugin } from './plugins/clerk';
import { redisPlugin } from './plugins/redis';
import { animesRoutes } from './routes/animes';
import { usersRoutes } from './routes/users';
import { ratingsRoutes } from './routes/ratings';
import { commentsRoutes } from './routes/comments';
import { listsRoutes } from './routes/lists';
import { rankingsRoutes } from './routes/rankings';

const app = Fastify({ logger: true });

async function bootstrap() {
  await app.register(cors, {
    origin: true,
    credentials: true,
  });

  // Plugins
  await app.register(prismaPlugin);
  await app.register(clerkPlugin);
  await app.register(redisPlugin);

  // Routes
  await app.register(animesRoutes, { prefix: '/api/animes' });
  await app.register(usersRoutes, { prefix: '/api/users' });
  await app.register(ratingsRoutes, { prefix: '/api/ratings' });
  await app.register(commentsRoutes, { prefix: '/api/comments' });
  await app.register(listsRoutes, { prefix: '/api/lists' });
  await app.register(rankingsRoutes, { prefix: '/api/rankings' });

  // Health check
  app.get('/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }));

  const port = Number(process.env.PORT ?? 3000);
  await app.listen({ port, host: '0.0.0.0' });
  console.log(`revAnim API démarrée sur le port ${port}`);
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
