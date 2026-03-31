import { useRouter } from 'expo-router';
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
import { useApi } from '../lib/api';

type TabKey = 'top' | 'trending';

type RankAnime = Anime & { _rank?: number };

export default function RankingsScreen() {
  const api = useApi();
  const router = useRouter();
  const [tab, setTab] = useState<TabKey>('top');
  const [topAnimes, setTopAnimes] = useState<RankAnime[]>([]);
  const [trendingAnimes, setTrendingAnimes] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, [tab]);

  async function loadData() {
    setLoading(true);
    try {
      if (tab === 'top') {
        const res = await api.get<{ data: Anime[] }>('/api/animes?page=1&perPage=50');
        setTopAnimes(res.data.map((a, i) => ({ ...a, _rank: i + 1 })));
      } else {
        const data = await api.get<Anime[]>('/api/animes/trending');
        setTrendingAnimes(data);
      }
    } finally {
      setLoading(false);
    }
  }

  const items = tab === 'top' ? topAnimes : trendingAnimes;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </Pressable>
        <Text style={styles.title}>Classements</Text>
      </View>

      {/* Tabs — KAN-53/55 */}
      <View style={styles.tabBar}>
        <Pressable
          style={[styles.tab, tab === 'top' && styles.tabActive]}
          onPress={() => setTab('top')}
        >
          <Text style={[styles.tabText, tab === 'top' && styles.tabTextActive]}>🏆 Top All-Time</Text>
        </Pressable>
        <Pressable
          style={[styles.tab, tab === 'trending' && styles.tabActive]}
          onPress={() => setTab('trending')}
        >
          <Text style={[styles.tabText, tab === 'trending' && styles.tabTextActive]}>🔥 Tendances</Text>
        </Pressable>
      </View>

      {loading ? (
        <ActivityIndicator color="#C9A84C" style={styles.loader} />
      ) : (
        <ScrollView contentContainerStyle={styles.list}>
          {items.map((anime, index) => (
            <Pressable
              key={anime.id}
              style={styles.row}
              onPress={() => router.push(`/anime/${anime.anilistId}`)}
            >
              {/* Rank */}
              <View style={[styles.rankBadge, index < 3 && styles.rankBadgePodium]}>
                <Text style={[styles.rankText, index < 3 && styles.rankTextPodium]}>
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                </Text>
              </View>

              {/* Cover */}
              {anime.coverImage ? (
                <Image source={{ uri: anime.coverImage }} style={styles.cover} />
              ) : (
                <View style={[styles.cover, styles.coverPlaceholder]} />
              )}

              {/* Info */}
              <View style={styles.info}>
                <Text style={styles.animeTitle} numberOfLines={2}>{anime.title}</Text>
                <View style={styles.meta}>
                  {anime.score != null && (
                    <Text style={styles.score}>★ {anime.score.toFixed(1)}</Text>
                  )}
                  {anime.year && <Text style={styles.year}>{anime.year}</Text>}
                </View>
                {anime.genres.length > 0 && (
                  <Text style={styles.genres} numberOfLines={1}>
                    {anime.genres.slice(0, 2).join(' · ')}
                  </Text>
                )}
              </View>
            </Pressable>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
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

  tabBar: { flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginBottom: 8 },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1A1A2E',
    alignItems: 'center',
  },
  tabActive: { borderColor: '#C9A84C', backgroundColor: 'rgba(201,168,76,0.08)' },
  tabText: { color: '#555570', fontSize: 13, fontWeight: '600' },
  tabTextActive: { color: '#C9A84C' },

  loader: { marginTop: 40 },
  list: { paddingHorizontal: 16, paddingBottom: 32, gap: 8 },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#12121F',
    borderRadius: 12,
    padding: 10,
    gap: 10,
  },
  rankBadge: {
    width: 36,
    alignItems: 'center',
  },
  rankBadgePodium: {},
  rankText: { color: '#555570', fontSize: 13, fontWeight: '700' },
  rankTextPodium: { fontSize: 20 },
  cover: { width: 48, height: 66, borderRadius: 6 },
  coverPlaceholder: { backgroundColor: '#1A1A2E' },
  info: { flex: 1, gap: 3 },
  animeTitle: { color: '#FFFFFF', fontSize: 14, fontWeight: '600', lineHeight: 18 },
  meta: { flexDirection: 'row', gap: 8 },
  score: { color: '#C9A84C', fontSize: 12, fontWeight: '700' },
  year: { color: '#555570', fontSize: 12 },
  genres: { color: '#555570', fontSize: 11 },
});
