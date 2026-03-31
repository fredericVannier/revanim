import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import type { Anime } from '@revanim/types';
import { AnimeCard } from '../../components/AnimeCard';
import { useApi } from '../../lib/api';

type PagedResponse = {
  data: Anime[];
  total: number;
  page: number;
  perPage: number;
  hasNextPage: boolean;
};

export default function CatalogueScreen() {
  const api = useApi();
  const router = useRouter();
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchPage = useCallback(
    async (p: number, reset = false) => {
      if (loading) return;
      setLoading(true);
      setError('');
      try {
        const res = await api.get<PagedResponse>(`/api/animes?page=${p}&perPage=20`);
        setAnimes((prev) => (reset ? res.data : [...prev, ...res.data]));
        setHasNextPage(res.hasNextPage);
        setPage(p);
      } catch {
        setError('Impossible de charger le catalogue');
      } finally {
        setLoading(false);
      }
    },
    [loading],
  );

  useEffect(() => {
    fetchPage(1, true);
  }, []);

  function loadMore() {
    if (hasNextPage && !loading) fetchPage(page + 1);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Catalogue</Text>
        <Pressable style={styles.rankingsBtn} onPress={() => router.push('/rankings')}>
          <Text style={styles.rankingsBtnText}>🏆 Classements</Text>
        </Pressable>
      </View>

      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={animes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <AnimeCard anime={item} />}
          onEndReached={loadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            loading ? <ActivityIndicator color="#C9A84C" style={styles.loader} /> : null
          }
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A14',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: '#C9A84C',
    fontSize: 28,
    fontWeight: '700',
  },
  rankingsBtn: {
    backgroundColor: '#12121F',
    borderWidth: 1,
    borderColor: '#1A1A2E',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  rankingsBtnText: {
    color: '#C9A84C',
    fontSize: 12,
    fontWeight: '600',
  },
  list: {
    paddingBottom: 16,
  },
  loader: {
    marginVertical: 20,
  },
  error: {
    color: '#FF6B6B',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 14,
  },
});
