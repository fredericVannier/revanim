import type { PrismaClient } from '@prisma/client';

type BadgeContext = 'rating' | 'comment' | 'list_favorite' | 'list_wishlist' | 'profile';

/**
 * Vérifie et attribue les badges mérités selon l'action effectuée.
 * Retourne les nouveaux badges gagnés (pour notifier le client).
 */
export async function checkAndAwardBadges(
  userId: string,
  context: BadgeContext,
  prisma: PrismaClient,
  extra?: { score?: number; listType?: string },
): Promise<{ key: string; name: string; icon: string }[]> {
  const candidateKeys = getCandidateKeys(context, extra);
  if (candidateKeys.length === 0) return [];

  // Badges déjà acquis
  const already = await prisma.userBadge.findMany({
    where: { userId, badge: { key: { in: candidateKeys } } },
    select: { badge: { select: { key: true } } },
  });
  const alreadyKeys = new Set(already.map((b) => b.badge.key));
  const toCheck = candidateKeys.filter((k) => !alreadyKeys.has(k));
  if (toCheck.length === 0) return [];

  const earned: string[] = [];

  for (const key of toCheck) {
    if (await isEarned(key, userId, prisma, extra)) {
      earned.push(key);
    }
  }

  if (earned.length === 0) return [];

  // Récupérer les objets Badge
  const badges = await prisma.badge.findMany({ where: { key: { in: earned } } });

  // Créer les UserBadge
  await prisma.userBadge.createMany({
    data: badges.map((b) => ({ userId, badgeId: b.id })),
    skipDuplicates: true,
  });

  return badges.map((b) => ({ key: b.key, name: b.name, icon: b.icon }));
}

function getCandidateKeys(
  context: BadgeContext,
  extra?: { score?: number; listType?: string },
): string[] {
  switch (context) {
    case 'rating':
      return [
        'first_rating',
        'ten_ratings',
        'fifty_ratings',
        'hundred_ratings',
        ...(extra?.score === 5 ? ['perfect_score'] : []),
      ];
    case 'comment':
      return ['first_review', 'ten_reviews', 'fifty_reviews'];
    case 'list_favorite':
      return ['first_favorite', 'ten_favorites'];
    case 'list_wishlist':
      return ['first_wishlist'];
    case 'profile':
      return ['profile_complete'];
    default:
      return [];
  }
}

async function isEarned(
  key: string,
  userId: string,
  prisma: PrismaClient,
  extra?: { score?: number },
): Promise<boolean> {
  switch (key) {
    case 'first_rating': {
      const count = await prisma.rating.count({ where: { userId } });
      return count >= 1;
    }
    case 'ten_ratings': {
      const count = await prisma.rating.count({ where: { userId } });
      return count >= 10;
    }
    case 'fifty_ratings': {
      const count = await prisma.rating.count({ where: { userId } });
      return count >= 50;
    }
    case 'hundred_ratings': {
      const count = await prisma.rating.count({ where: { userId } });
      return count >= 100;
    }
    case 'perfect_score':
      return extra?.score === 5;
    case 'first_review': {
      const count = await prisma.comment.count({ where: { userId } });
      return count >= 1;
    }
    case 'ten_reviews': {
      const count = await prisma.comment.count({ where: { userId } });
      return count >= 10;
    }
    case 'fifty_reviews': {
      const count = await prisma.comment.count({ where: { userId } });
      return count >= 50;
    }
    case 'first_favorite': {
      const count = await prisma.userAnimeList.count({ where: { userId, type: 'FAVORITE' } });
      return count >= 1;
    }
    case 'ten_favorites': {
      const count = await prisma.userAnimeList.count({ where: { userId, type: 'FAVORITE' } });
      return count >= 10;
    }
    case 'first_wishlist': {
      const count = await prisma.userAnimeList.count({ where: { userId, type: 'WISHLIST' } });
      return count >= 1;
    }
    case 'profile_complete': {
      const user = await prisma.user.findUnique({ where: { id: userId }, select: { avatar: true, bio: true } });
      return Boolean(user?.avatar && user?.bio);
    }
    default:
      return false;
  }
}
