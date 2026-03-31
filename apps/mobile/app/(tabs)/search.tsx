import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { Anime } from '@revanim/types';
import { AnimeCard } from '../../components/AnimeCard';
import { useApi } from '../../lib/api';

type PagedResponse = { data: Anime[]; total: number; hasNextPage: boolean; page: number; perPage: number };

type AnimeStatus = 'FINISHED' | 'RELEASING' | 'NOT_YET_RELEASED' | 'CANCELLED';

const GENRES = [
  'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy',
  'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Slice of Life',
  'Sports', 'Supernatural', 'Thriller',
];

const STATUSES: { key: AnimeStatus; label: string }[] = [
  { key: 'FINISHED', label: 'Terminé' },
  { key: 'RELEASING', label: 'En cours' },
  { key: 'NOT_YET_RELEASED', label: 'À venir' },
];

export default function SearchScreen() {
  const api = useApi();
  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState<string | null>(null);
  const [status, setStatus] = useState<AnimeStatus | null>(null);
  const [results, setResults] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const search = useCallback(
    async (q: string, g: string | null, s: AnimeStatus | null) => {
      setLoading(true);
      setSearched(true);
      try {
        const params = new URLSearchParams({ perPage: '20' });
        if (q.trim()) params.set('q', q.trim());
        if (g) params.set('genre', g);
        if (s) params.set('status', s);
        const res = await api.get<PagedResponse>(`/api/animes?${params}`);
        setResults(res.data);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  function handleSubmit() {
    search(query, genre, status);
  }

  function toggleGenre(g: string) {
    const next = genre === g ? null : g;
    setGenre(next);
    if (searched) search(query, next, status);
  }

  function toggleStatus(s: AnimeStatus) {
    const next = status === s ? null : s;
    setStatus(next);
    if (searched) search(query, genre, next);
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Search input */}
      <View style={styles.header}>
        <Text style={styles.title}>Recherche</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Titre d'anime..."
            placeholderTextColor="#555570"
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSubmit}
            returnKeyType="search"
            autoCorrect={false}
          />
          <Pressable style={styles.searchBtn} onPress={handleSubmit}>
            <Text style={styles.searchBtnText}>→</Text>
          </Pressable>
        </View>
      </View>

      {/* Status filter — KAN-46 */}
      <View style={styles.filterRow}>
        {STATUSES.map((s) => (
          <Pressable
            key={s.key}
            style={[styles.chip, status === s.key && styles.chipActive]}
            onPress={() => toggleStatus(s.key)}
          >
            <Text style={[styles.chipText, status === s.key && styles.chipTextActive]}>
              {s.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Genre filter — KAN-45 */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.genreScroll}
        contentContainerStyle={styles.genreList}
      >
        {GENRES.map((g) => (
          <Pressable
            key={g}
            style={[styles.genreChip, genre === g && styles.genreChipActive]}
            onPress={() => toggleGenre(g)}
          >
            <Text style={[styles.genreText, genre === g && styles.genreTextActive]}>{g}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Results */}
      {loading ? (
        <ActivityIndicator color="#C9A84C" style={styles.loader} />
      ) : searched && results.length === 0 ? (
        <Text style={styles.empty}>Aucun résultat</Text>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <AnimeCard anime={item} />}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A14' },
  header: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8, gap: 10 },
  title: { color: '#C9A84C', fontSize: 28, fontWeight: '700' },
  inputRow: { flexDirection: 'row', gap: 8 },
  input: {
    flex: 1,
    backgroundColor: '#12121F',
    borderWidth: 1,
    borderColor: '#1A1A2E',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 15,
  },
  searchBtn: {
    backgroundColor: '#C9A84C',
    borderRadius: 12,
    width: 46,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBtnText: { color: '#0A0A14', fontSize: 20, fontWeight: '700' },

  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 6,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1A1A2E',
  },
  chipActive: { borderColor: '#7C3AED', backgroundColor: 'rgba(124,58,237,0.12)' },
  chipText: { color: '#555570', fontSize: 12, fontWeight: '600' },
  chipTextActive: { color: '#7C3AED' },

  genreScroll: { maxHeight: 42, marginBottom: 4 },
  genreList: { paddingHorizontal: 16, gap: 8, alignItems: 'center' },
  genreChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#12121F',
    borderWidth: 1,
    borderColor: '#1A1A2E',
  },
  genreChipActive: { borderColor: '#C9A84C', backgroundColor: 'rgba(201,168,76,0.1)' },
  genreText: { color: '#555570', fontSize: 12 },
  genreTextActive: { color: '#C9A84C', fontWeight: '600' },

  loader: { marginTop: 40 },
  empty: { color: '#555570', textAlign: 'center', marginTop: 40, fontSize: 14, fontStyle: 'italic' },
  list: { paddingBottom: 16 },
});
