import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { Anime } from '@revanim/types';
import { useApi } from '../../lib/api';

const STATUS_LABELS: Record<string, string> = {
  FINISHED: 'Terminé',
  RELEASING: 'En cours',
  NOT_YET_RELEASED: 'À venir',
  CANCELLED: 'Annulé',
};

export default function AnimeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const api = useApi();
  const router = useRouter();

  const [anime, setAnime] = useState<Anime | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get<Anime>(`/api/animes/${id}`)
      .then(setAnime)
      .catch(() => setError('Anime introuvable'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color="#C9A84C" size="large" />
      </View>
    );
  }

  if (error || !anime) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{error || 'Erreur inconnue'}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Banner / Cover */}
        <View style={styles.bannerContainer}>
          {anime.bannerImage ? (
            <Image source={{ uri: anime.bannerImage }} style={styles.banner} />
          ) : anime.coverImage ? (
            <Image source={{ uri: anime.coverImage }} style={styles.banner} blurRadius={8} />
          ) : (
            <View style={[styles.banner, styles.bannerPlaceholder]} />
          )}
          <View style={styles.bannerOverlay} />

          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backText}>←</Text>
          </Pressable>

          {anime.coverImage && (
            <Image source={{ uri: anime.coverImage }} style={styles.cover} />
          )}
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{anime.title}</Text>
          {anime.titleJapanese && (
            <Text style={styles.titleJa}>{anime.titleJapanese}</Text>
          )}

          {/* Stats row */}
          <View style={styles.stats}>
            {anime.score != null && (
              <View style={styles.stat}>
                <Text style={styles.statValue}>★ {anime.score.toFixed(1)}</Text>
                <Text style={styles.statLabel}>Score</Text>
              </View>
            )}
            {anime.episodes != null && (
              <View style={styles.stat}>
                <Text style={styles.statValue}>{anime.episodes}</Text>
                <Text style={styles.statLabel}>Épisodes</Text>
              </View>
            )}
            {anime.year && (
              <View style={styles.stat}>
                <Text style={styles.statValue}>{anime.year}</Text>
                <Text style={styles.statLabel}>Année</Text>
              </View>
            )}
            <View style={styles.stat}>
              <Text style={styles.statValue}>{STATUS_LABELS[anime.status] ?? anime.status}</Text>
              <Text style={styles.statLabel}>Statut</Text>
            </View>
          </View>

          {/* Genres */}
          {anime.genres.length > 0 && (
            <View style={styles.genres}>
              {anime.genres.map((g) => (
                <View key={g} style={styles.genreTag}>
                  <Text style={styles.genreText}>{g}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Synopsis */}
          {anime.synopsis && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Synopsis</Text>
              <Text style={styles.synopsis}>{anime.synopsis}</Text>
            </View>
          )}

          {/* Placeholder actions — KAN-48/49 */}
          <View style={styles.actions}>
            <Pressable style={styles.rateButton}>
              <Text style={styles.rateButtonText}>★ Noter</Text>
            </Pressable>
            <Pressable style={styles.listButton}>
              <Text style={styles.listButtonText}>+ Ma liste</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A14',
  },
  centered: {
    flex: 1,
    backgroundColor: '#0A0A14',
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: '#FF6B6B',
    fontSize: 15,
  },
  bannerContainer: {
    height: 220,
    position: 'relative',
  },
  banner: {
    width: '100%',
    height: '100%',
  },
  bannerPlaceholder: {
    backgroundColor: '#12121F',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10,10,20,0.55)',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(10,10,20,0.7)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 20,
  },
  cover: {
    position: 'absolute',
    bottom: -40,
    left: 16,
    width: 90,
    height: 125,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#0A0A14',
  },
  content: {
    paddingTop: 52,
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 16,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 28,
  },
  titleJa: {
    color: '#555570',
    fontSize: 13,
    marginTop: -10,
  },
  stats: {
    flexDirection: 'row',
    gap: 20,
    flexWrap: 'wrap',
  },
  stat: {
    alignItems: 'center',
    gap: 2,
  },
  statValue: {
    color: '#C9A84C',
    fontSize: 16,
    fontWeight: '700',
  },
  statLabel: {
    color: '#555570',
    fontSize: 11,
  },
  genres: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  genreTag: {
    backgroundColor: '#1A1A2E',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  genreText: {
    color: '#7C3AED',
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  synopsis: {
    color: '#AAAABC',
    fontSize: 14,
    lineHeight: 22,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  rateButton: {
    flex: 1,
    backgroundColor: '#C9A84C',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  rateButtonText: {
    color: '#0A0A14',
    fontWeight: '700',
    fontSize: 15,
  },
  listButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#7C3AED',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  listButtonText: {
    color: '#7C3AED',
    fontWeight: '700',
    fontSize: 15,
  },
});
