import { describe, it, expect, vi, beforeEach } from 'vitest';
import { checkAndAwardBadges } from '../badges.service';
import { createPrismaMock } from '../../test/helpers';
import type { PrismaClient } from '@prisma/client';

describe('badges.service — checkAndAwardBadges', () => {
  let prisma: PrismaClient;

  beforeEach(() => {
    prisma = createPrismaMock();
    // Par défaut : aucun badge déjà acquis
    vi.mocked(prisma.userBadge.findMany).mockResolvedValue([]);
    vi.mocked(prisma.badge.findMany).mockResolvedValue([]);
    vi.mocked(prisma.userBadge.createMany).mockResolvedValue({ count: 0 });
  });

  // ─── Context: rating ───────────────────────────────────────────────────

  describe('context: rating', () => {
    it('attribue first_rating au premier vote', async () => {
      vi.mocked(prisma.rating.count).mockResolvedValue(1);
      vi.mocked(prisma.badge.findMany).mockResolvedValue([
        { id: 'b1', key: 'first_rating', name: 'Premier avis', icon: '⭐', description: '' },
      ]);

      const result = await checkAndAwardBadges('user1', 'rating', prisma, { score: 3 });

      expect(result).toHaveLength(1);
      expect(result[0].key).toBe('first_rating');
      expect(prisma.userBadge.createMany).toHaveBeenCalledWith({
        data: [{ userId: 'user1', badgeId: 'b1' }],
        skipDuplicates: true,
      });
    });

    it('n\'attribue pas first_rating si déjà acquis', async () => {
      vi.mocked(prisma.userBadge.findMany).mockResolvedValue([
        { userId: 'user1', badgeId: 'b1', earnedAt: new Date(), badge: { key: 'first_rating' } } as any,
      ]);
      vi.mocked(prisma.rating.count).mockResolvedValue(5);

      const result = await checkAndAwardBadges('user1', 'rating', prisma, { score: 3 });

      expect(result).toHaveLength(0);
      expect(prisma.userBadge.createMany).not.toHaveBeenCalled();
    });

    it('attribue ten_ratings à 10 votes', async () => {
      vi.mocked(prisma.rating.count).mockResolvedValue(10);
      vi.mocked(prisma.badge.findMany).mockResolvedValue([
        { id: 'b2', key: 'ten_ratings', name: 'Cinéphile', icon: '🎬', description: '' },
      ]);

      const result = await checkAndAwardBadges('user1', 'rating', prisma, { score: 4 });

      expect(result.map((b) => b.key)).toContain('ten_ratings');
    });

    it('attribue perfect_score pour un 5/5', async () => {
      vi.mocked(prisma.rating.count).mockResolvedValue(1);
      vi.mocked(prisma.badge.findMany).mockResolvedValue([
        { id: 'b3', key: 'perfect_score', name: 'Chef-d\'œuvre', icon: '👑', description: '' },
        { id: 'b4', key: 'first_rating', name: 'Premier avis', icon: '⭐', description: '' },
      ]);

      const result = await checkAndAwardBadges('user1', 'rating', prisma, { score: 5 });

      const keys = result.map((b) => b.key);
      expect(keys).toContain('perfect_score');
      expect(keys).toContain('first_rating');
    });

    it('ne propose pas perfect_score pour un score < 5', async () => {
      vi.mocked(prisma.rating.count).mockResolvedValue(1);
      vi.mocked(prisma.badge.findMany).mockResolvedValue([
        { id: 'b4', key: 'first_rating', name: 'Premier avis', icon: '⭐', description: '' },
      ]);

      const result = await checkAndAwardBadges('user1', 'rating', prisma, { score: 4 });

      expect(result.map((b) => b.key)).not.toContain('perfect_score');
    });

    it('n\'attribue pas ten_ratings si seulement 5 votes', async () => {
      vi.mocked(prisma.rating.count).mockResolvedValue(5);
      vi.mocked(prisma.badge.findMany).mockResolvedValue([
        { id: 'b1', key: 'first_rating', name: 'Premier avis', icon: '⭐', description: '' },
      ]);

      const result = await checkAndAwardBadges('user1', 'rating', prisma, { score: 3 });

      expect(result.map((b) => b.key)).not.toContain('ten_ratings');
    });
  });

  // ─── Context: comment ──────────────────────────────────────────────────

  describe('context: comment', () => {
    it('attribue first_review au premier commentaire', async () => {
      vi.mocked(prisma.comment.count).mockResolvedValue(1);
      vi.mocked(prisma.badge.findMany).mockResolvedValue([
        { id: 'c1', key: 'first_review', name: 'Critique en herbe', icon: '✏️', description: '' },
      ]);

      const result = await checkAndAwardBadges('user1', 'comment', prisma);

      expect(result[0].key).toBe('first_review');
    });

    it('n\'attribue pas first_review si déjà acquis', async () => {
      vi.mocked(prisma.userBadge.findMany).mockResolvedValue([
        { userId: 'user1', badgeId: 'c1', earnedAt: new Date(), badge: { key: 'first_review' } } as any,
      ]);
      vi.mocked(prisma.comment.count).mockResolvedValue(5);

      const result = await checkAndAwardBadges('user1', 'comment', prisma);
      expect(result).toHaveLength(0);
    });
  });

  // ─── Context: list_favorite ────────────────────────────────────────────

  describe('context: list_favorite', () => {
    it('attribue first_favorite au premier favori', async () => {
      vi.mocked(prisma.userAnimeList.count).mockResolvedValue(1);
      vi.mocked(prisma.badge.findMany).mockResolvedValue([
        { id: 'l1', key: 'first_favorite', name: 'Coup de cœur', icon: '❤️', description: '' },
      ]);

      const result = await checkAndAwardBadges('user1', 'list_favorite', prisma);
      expect(result[0].key).toBe('first_favorite');
    });

    it('attribue ten_favorites à 10 favoris', async () => {
      vi.mocked(prisma.userAnimeList.count).mockResolvedValue(10);
      vi.mocked(prisma.badge.findMany).mockResolvedValue([
        { id: 'l2', key: 'ten_favorites', name: 'Collectionneur', icon: '💎', description: '' },
      ]);

      const result = await checkAndAwardBadges('user1', 'list_favorite', prisma);
      expect(result.map((b) => b.key)).toContain('ten_favorites');
    });
  });

  // ─── Context: profile ──────────────────────────────────────────────────

  describe('context: profile', () => {
    it('attribue profile_complete si avatar ET bio renseignés', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: 'user1', avatar: 'https://example.com/avatar.jpg', bio: 'Ma bio',
      } as any);
      vi.mocked(prisma.badge.findMany).mockResolvedValue([
        { id: 'p1', key: 'profile_complete', name: 'Profil complet', icon: '👤', description: '' },
      ]);

      const result = await checkAndAwardBadges('user1', 'profile', prisma);
      expect(result[0].key).toBe('profile_complete');
    });

    it('n\'attribue pas profile_complete si bio manquante', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: 'user1', avatar: 'https://example.com/avatar.jpg', bio: null,
      } as any);
      vi.mocked(prisma.badge.findMany).mockResolvedValue([]);

      const result = await checkAndAwardBadges('user1', 'profile', prisma);
      expect(result).toHaveLength(0);
    });

    it('n\'attribue pas profile_complete si avatar manquant', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: 'user1', avatar: null, bio: 'Ma bio',
      } as any);
      vi.mocked(prisma.badge.findMany).mockResolvedValue([]);

      const result = await checkAndAwardBadges('user1', 'profile', prisma);
      expect(result).toHaveLength(0);
    });
  });

  // ─── Contexte inconnu ──────────────────────────────────────────────────

  it('retourne [] pour un contexte sans candidats (list_wishlist sans badge DB)', async () => {
    vi.mocked(prisma.userAnimeList.count).mockResolvedValue(1);
    vi.mocked(prisma.badge.findMany).mockResolvedValue([]);

    const result = await checkAndAwardBadges('user1', 'list_wishlist', prisma);
    expect(result).toHaveLength(0);
  });
});
