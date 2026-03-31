import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ratingsRoutes } from '../ratings';
import { buildTestApp, createPrismaMock } from '../../test/helpers';

vi.mock('../../services/badges.service', () => ({
  checkAndAwardBadges: vi.fn().mockResolvedValue([]),
}));

const USER_FIXTURE = { id: 'user-db-1', clerkId: 'clerk-1', username: 'taro', avatar: null, bio: null, createdAt: new Date() };
const RATING_FIXTURE = { id: 'rat-1', userId: 'user-db-1', animeId: 'anime-1', score: 4, createdAt: new Date() };

describe('POST /api/ratings', () => {
  let prisma: ReturnType<typeof createPrismaMock>;

  async function buildApp(userId: string | null = 'clerk-1') {
    prisma = createPrismaMock();
    const app = buildTestApp(prisma, { userId });
    await app.register(ratingsRoutes, { prefix: '/api/ratings' });
    await app.ready();
    return app;
  }

  it('retourne 401 sans authentification', async () => {
    const app = await buildApp(null);
    const res = await app.inject({
      method: 'POST',
      url: '/api/ratings',
      payload: { animeId: 'anime-1', score: 4 },
    });
    expect(res.statusCode).toBe(401);
  });

  it('crée ou met à jour une notation', async () => {
    const app = await buildApp('clerk-1');
    vi.mocked(prisma.user.findUnique).mockResolvedValue(USER_FIXTURE as any);
    vi.mocked(prisma.rating.upsert).mockResolvedValue(RATING_FIXTURE as any);

    const res = await app.inject({
      method: 'POST',
      url: '/api/ratings',
      payload: { animeId: 'anime-1', score: 4 },
    });

    expect(res.statusCode).toBe(201);
    const body = res.json();
    expect(body.rating.score).toBe(4);
    expect(body.newBadges).toEqual([]);
  });

  it('retourne 400 pour un score hors plage', async () => {
    const app = await buildApp('clerk-1');
    const res = await app.inject({
      method: 'POST',
      url: '/api/ratings',
      payload: { animeId: 'anime-1', score: 6 },
    });
    expect(res.statusCode).toBe(400);
  });

  it('retourne 400 pour un score de 0', async () => {
    const app = await buildApp('clerk-1');
    const res = await app.inject({
      method: 'POST',
      url: '/api/ratings',
      payload: { animeId: 'anime-1', score: 0 },
    });
    expect(res.statusCode).toBe(400);
  });

  it('retourne 404 si l\'utilisateur n\'existe pas en DB', async () => {
    const app = await buildApp('clerk-1');
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

    const res = await app.inject({
      method: 'POST',
      url: '/api/ratings',
      payload: { animeId: 'anime-1', score: 3 },
    });
    expect(res.statusCode).toBe(404);
  });

  it('inclut les nouveaux badges dans la réponse', async () => {
    const { checkAndAwardBadges } = await import('../../services/badges.service');
    vi.mocked(checkAndAwardBadges).mockResolvedValueOnce([
      { key: 'first_rating', name: 'Premier avis', icon: '⭐' },
    ]);

    const app = await buildApp('clerk-1');
    vi.mocked(prisma.user.findUnique).mockResolvedValue(USER_FIXTURE as any);
    vi.mocked(prisma.rating.upsert).mockResolvedValue(RATING_FIXTURE as any);

    const res = await app.inject({
      method: 'POST',
      url: '/api/ratings',
      payload: { animeId: 'anime-1', score: 5 },
    });

    expect(res.statusCode).toBe(201);
    expect(res.json().newBadges).toHaveLength(1);
    expect(res.json().newBadges[0].key).toBe('first_rating');
  });
});

describe('GET /api/ratings', () => {
  let prisma: ReturnType<typeof createPrismaMock>;
  let app: ReturnType<typeof buildTestApp>;

  beforeEach(async () => {
    prisma = createPrismaMock();
    app = buildTestApp(prisma);
    await app.register(ratingsRoutes, { prefix: '/api/ratings' });
    await app.ready();
  });

  it('retourne les ratings et l\'agrégat pour un anime', async () => {
    vi.mocked(prisma.$transaction).mockResolvedValue([
      [{ ...RATING_FIXTURE, user: { username: 'taro', avatar: null } }],
      { _avg: { score: 4 }, _count: { score: 1 } },
    ]);

    const res = await app.inject({ method: 'GET', url: '/api/ratings?animeId=anime-1' });

    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.ratings).toHaveLength(1);
    expect(body.average).toBe(4);
    expect(body.count).toBe(1);
  });

  it('retourne 400 si animeId manquant', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/ratings' });
    expect(res.statusCode).toBe(400);
  });
});

describe('GET /api/ratings/mine', () => {
  it('retourne 401 sans auth', async () => {
    const prisma = createPrismaMock();
    const app = buildTestApp(prisma, { userId: null });
    await app.register(ratingsRoutes, { prefix: '/api/ratings' });
    await app.ready();

    const res = await app.inject({ method: 'GET', url: '/api/ratings/mine' });
    expect(res.statusCode).toBe(401);
  });

  it('retourne l\'historique de notation de l\'utilisateur', async () => {
    const prisma = createPrismaMock();
    const app = buildTestApp(prisma, { userId: 'clerk-1' });
    await app.register(ratingsRoutes, { prefix: '/api/ratings' });
    await app.ready();

    vi.mocked(prisma.user.findUnique).mockResolvedValue(USER_FIXTURE as any);
    vi.mocked(prisma.rating.findMany).mockResolvedValue([
      { ...RATING_FIXTURE, anime: { id: 'anime-1', title: 'Naruto' } },
    ] as any);

    const res = await app.inject({ method: 'GET', url: '/api/ratings/mine' });

    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body).toHaveLength(1);
    expect(body[0].score).toBe(4);
  });
});
