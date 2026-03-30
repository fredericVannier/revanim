import fp from 'fastify-plugin';
import { clerkPlugin as clerkFastifyPlugin, getAuth } from '@clerk/fastify';
import type { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    userId: string | null;
  }
}

const clerkPlugin: FastifyPluginAsync = fp(async (app) => {
  await app.register(clerkFastifyPlugin, {
    secretKey: process.env.CLERK_SECRET_KEY,
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
  });

  // Décorateur pour récupérer l'userId Clerk depuis le token JWT
  app.decorateRequest('userId', null);

  app.addHook('preHandler', async (request: FastifyRequest) => {
    const auth = getAuth(request);
    request.userId = auth.userId;
  });
});

// Middleware pour les routes protégées
export async function requireAuth(request: FastifyRequest, reply: FastifyReply) {
  if (!request.userId) {
    return reply.status(401).send({ error: 'Non authentifié' });
  }
}

export { clerkPlugin };
