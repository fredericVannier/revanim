import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useApi } from '../lib/api';

type Badge = {
  key: string;
  name: string;
  description: string;
  icon: string;
};

type UserBadge = {
  badge: Badge;
  earnedAt: string;
};

type UserProfile = {
  badges: UserBadge[];
};

// Catalogue complet des 14 badges (même ordre que le seed)
const ALL_BADGES: Badge[] = [
  { key: 'first_rating', name: 'Premier avis', description: 'Noter ton premier anime', icon: '⭐' },
  { key: 'ten_ratings', name: 'Cinéphile', description: 'Noter 10 animes', icon: '🎬' },
  { key: 'fifty_ratings', name: 'Expert du genre', description: 'Noter 50 animes', icon: '🏆' },
  { key: 'hundred_ratings', name: 'Légende', description: 'Noter 100 animes', icon: '🌟' },
  { key: 'perfect_score', name: 'Chef-d\'œuvre', description: 'Donner un 5/5 à un anime', icon: '👑' },
  { key: 'first_review', name: 'Critique en herbe', description: 'Écrire ton premier commentaire', icon: '✏️' },
  { key: 'ten_reviews', name: 'Plume affûtée', description: 'Écrire 10 commentaires', icon: '🖊️' },
  { key: 'fifty_reviews', name: 'Rédacteur confirmé', description: 'Écrire 50 commentaires', icon: '📝' },
  { key: 'first_favorite', name: 'Coup de cœur', description: 'Ajouter un anime en favori', icon: '❤️' },
  { key: 'ten_favorites', name: 'Collectionneur', description: 'Avoir 10 animes en favoris', icon: '💎' },
  { key: 'first_wishlist', name: 'Liste de souhaits', description: 'Ajouter un anime à ta wishlist', icon: '📋' },
  { key: 'profile_complete', name: 'Profil complet', description: 'Compléter ton profil (avatar + bio)', icon: '👤' },
  { key: 'social_sharer', name: 'Ambassadeur', description: 'Partager un anime', icon: '📣' },
  { key: 'early_adopter', name: 'Early Adopter', description: 'Parmi les 1000 premiers utilisateurs', icon: '🚀' },
];

export default function BadgesScreen() {
  const api = useApi();
  const router = useRouter();
  const [earnedKeys, setEarnedKeys] = useState<Set<string>>(new Set());
  const [earnedDates, setEarnedDates] = useState<Map<string, string>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<UserProfile>('/api/users/me')
      .then((profile) => {
        const keys = new Set(profile.badges.map((b) => b.badge.key));
        const dates = new Map(profile.badges.map((b) => [b.badge.key, b.earnedAt]));
        setEarnedKeys(keys);
        setEarnedDates(dates);
      })
      .finally(() => setLoading(false));
  }, []);

  const earned = ALL_BADGES.filter((b) => earnedKeys.has(b.key));
  const locked = ALL_BADGES.filter((b) => !earnedKeys.has(b.key));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>←</Text>
        </Pressable>
        <View>
          <Text style={styles.title}>Badges</Text>
          <Text style={styles.subtitle}>{earned.length}/{ALL_BADGES.length} débloqués</Text>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator color="#C9A84C" style={{ marginTop: 40 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.scroll}>
          {earned.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Débloqués</Text>
              <View style={styles.grid}>
                {earned.map((badge) => {
                  const date = earnedDates.get(badge.key);
                  return (
                    <BadgeCard key={badge.key} badge={badge} earnedAt={date} locked={false} />
                  );
                })}
              </View>
            </>
          )}

          <Text style={styles.sectionTitle}>À débloquer</Text>
          <View style={styles.grid}>
            {locked.map((badge) => (
              <BadgeCard key={badge.key} badge={badge} locked />
            ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function BadgeCard({
  badge,
  locked,
  earnedAt,
}: {
  badge: Badge;
  locked: boolean;
  earnedAt?: string;
}) {
  const date = earnedAt
    ? new Date(earnedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
    : null;

  return (
    <View style={[styles.card, locked && styles.cardLocked]}>
      <Text style={[styles.cardIcon, locked && styles.cardIconLocked]}>{badge.icon}</Text>
      <Text style={[styles.cardName, locked && styles.cardNameLocked]} numberOfLines={2}>
        {badge.name}
      </Text>
      <Text style={styles.cardDesc} numberOfLines={2}>{badge.description}</Text>
      {date && <Text style={styles.cardDate}>{date}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A14' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    gap: 12,
  },
  backBtn: {
    backgroundColor: '#12121F',
    borderRadius: 10,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backText: { color: '#FFFFFF', fontSize: 18 },
  title: { color: '#C9A84C', fontSize: 24, fontWeight: '700' },
  subtitle: { color: '#555570', fontSize: 12, marginTop: 1 },

  scroll: { paddingHorizontal: 16, paddingBottom: 32 },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  card: {
    width: '30%',
    flexGrow: 1,
    backgroundColor: '#12121F',
    borderWidth: 1,
    borderColor: '#C9A84C44',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    gap: 5,
  },
  cardLocked: {
    borderColor: '#1A1A2E',
    opacity: 0.5,
  },
  cardIcon: { fontSize: 28 },
  cardIconLocked: { opacity: 0.4 },
  cardName: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 14,
  },
  cardNameLocked: { color: '#555570' },
  cardDesc: {
    color: '#555570',
    fontSize: 10,
    textAlign: 'center',
    lineHeight: 13,
  },
  cardDate: {
    color: '#C9A84C',
    fontSize: 9,
    marginTop: 2,
  },
});
