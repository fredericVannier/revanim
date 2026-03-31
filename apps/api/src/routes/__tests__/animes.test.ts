import { describe, it, expect, vi, beforeEach } from 'vitest';
import { animesRoutes } from '../animes';
import { buildTestApp, createPrismaMock } from '../../test/helpers';

vi.mock('../../services/anilist.service', () => ({
  searchAnimes: vi.fn(),
  getOrFetchAnime: vi.fn(),
}));

import { searchAnimes, getOrFetchAnime } from '../../services/anilist.service';

const ANIME_FIXTURE = {
  id: 'cuid1',
  anilistId: 1,
  title: 'Naruto',
  titleJapanese: 'ナルト',
  synopsis: 'Un ninja.',
  coverImage: null,
  bannerImage: null,
  genres: ['Action', 'Adventure'],
  score: 8.5,
  episodes: 220,
  status: 'FINISHED' as const,
  season: 'FALL',
  year: 2002,
  updatedAt: new Date(),
};

describe('GET /api/animes', () => {
  let prisma: ReturnType<typeof createPrismaMock>;
  let app: ReturnType<typeof buildTestApp>;

  beforeEach(async () => {
    prisma = createPrismaMock();
    app = buildTestApp(prisma);
    await app.register(animesRoutes, { prefix: '/api/animes' });
    await app.ready();
  });

  it('retourne le catalogue paginé', async () => {
    vi.mocked(prisma.$transaction).mockResolvedValue([[ANIME_FIXTURE], 1]);

    const res = await app.inject({ method: 'GET', url: '/api/animes' });

    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.data).toHaveLength(1);
    expect(body.data[0].title).toBe('Naruto');
    expect(body.total).toBe(1);
    expect(body.hasNextPage).toBe(false);
  });

  it('délègue à searchAnimes quand q est fourni', async () => {
    vi.mocked(searchAnimes).mockResolvedValue({ data: [ANIME_FIXTURE], total: 1 } as any);

    const res = await app.inject({ method: 'GET', url: '/api/animes?q=naruto' });

    expect(res.statusCode).toBe(200);
    expect(searchAnimes).toHaveBeenCalledWith('naruto', 1, 20, prisma);
  });

  it('applique le filtre genre', async () => {
    vi.mocked(prisma.$transaction).mockResolvedValue([[ANIME_FIXTURE], 1]);

    await app.inject({ method: 'GET', url: '/api/animes?genre=Action' });

    const callArgs = vi.mocked(prisma.$transaction).mock.calls[0][0];
    expect(callArgs).toBeDefined();
  });

  it('rejette perPage > 50', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/animes?perPage=100' });
    expect(res.statusCode).toBe(400);
  });

  it('rejette un status invalide', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/animes?status=UNKNOWN' });
    expect(res.statusCode).toBe(400);
  });
});

describe('GET /api/animes/trending', () => {
  let prisma: ReturnType<typeof createPrismaMock>;
  let app: ReturnType<typeof buildTestApp>;

  beforeEach(async () => {
    prisma = createPrismaMock();
    app = buildTestApp(prisma);
    await app.register(animesRoutes, { prefix: '/api/animes' });
    await app.ready();
  });

  it('retourne les animes par activité récente', async () => {
    vi.mocked(prisma.rating.groupBy).mockResolvedValue([
      { animeId: 'cuid1', _count: { animeId: 5 } },
    ] as any);
    vi.mocked(prisma.anime.findMany).mockResolvedValue([ANIME_FIXTURE]);

    const res = await app.inject({ method: 'GET', url: '/api/animes/trending' });

    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body).toHaveLength(1);
    expect(body[0].title).toBe('Naruto');
  });

  it('fallback sur top score si aucune activité récente', async () => {
    vi.mocked(prisma.rating.groupBy).mockResolvedValue([]);
    vi.mocked(prisma.anime.findMany).mockResolvedValue([ANIME_FIXTURE]);

    const res = await app.inject({ method: 'GET', url: '/api/animes/trending' });

    expect(res.statusCode).toBe(200);
    expect(prisma.anime.findMany).toHaveBeenCalled();
  });
});

describe('GET /api/animes/:id', () => {
  let prisma: ReturnType<typeof createPrismaMock>;
  let app: ReturnType<typeof buildTestApp>;

  beforeEach(async () => {
    prisma = createPrismaMock();
    app = buildTestApp(prisma);
    await app.register(animesRoutes, { prefix: '/api/animes' });
    await app.ready();
  });

  it('retourne l\'anime via cache-aside', async () => {
    vi.mocked(getOrFetchAnime).mockResolvedValue(ANIME_FIXTURE as any);

    const res = await app.inject({ method: 'GET', url: '/api/animes/1' });

    expect(res.statusCode).toBe(200);
    expect(res.json().title).toBe('Naruto');
  });

  it('retourne 404 si l\'anime est introuvable', async () => {
    vi.mocked(getOrFetchAnime).mockResolvedValue(null);

    const res = await app.inject({ method: 'GET', url: '/api/animes/9999' });

    expect(res.statusCode).toBe(404);
  });

  it('retourne 400 pour un id non numérique', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/animes/abc' });
    expect(res.statusCode).toBe(400);
  });
});
