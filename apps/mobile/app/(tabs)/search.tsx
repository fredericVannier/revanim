import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { Anime } from '@revanim/types';
import { AnimeCard } from '../../components/AnimeCard';
import { useApi } from '../../lib/api';

type PagedResponse = { data: Anime[]; total: number; hasNextPage: boolean; page: number; perPage: number };

export default function SearchScreen() {
  const api = useApi();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const search = useCallback(
    async (q: string) => {
      if (!q.trim()) {
        setResults([]);
        setSearched(false);
        return;
      }
      setLoading(true);
      setSearched(true);
      try {
        const res = await api.get<PagedResponse>(
          `/api/animes?q=${encodeURIComponent(q.trim())}&perPage=20`,
        );
        setResults(res.data);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  function handleChangeText(text: string) {
    setQuery(text);
    if (text.length === 0) {
      setResults([]);
      setSearched(false);
    }
  }

  function handleSubmit() {
    search(query);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recherche</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Titre, genre..."
            placeholderTextColor="#555570"
            value={query}
            onChangeText={handleChangeText}
            onSubmitEditing={handleSubmit}
            returnKeyType="search"
            autoCorrect={false}
          />
        </View>
      </View>

      {loading ? (
        <ActivityIndicator color="#C9A84C" style={styles.loader} />
      ) : searched && results.length === 0 ? (
        <Text style={styles.empty}>Aucun résultat pour « {query} »</Text>
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
  container: {
    flex: 1,
    backgroundColor: '#0A0A14',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    gap: 12,
  },
  title: {
    color: '#C9A84C',
    fontSize: 28,
    fontWeight: '700',
  },
  inputWrapper: {
    backgroundColor: '#12121F',
    borderWidth: 1,
    borderColor: '#1A1A2E',
    borderRadius: 12,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 15,
  },
  list: {
    paddingBottom: 16,
  },
  loader: {
    marginTop: 40,
  },
  empty: {
    color: '#555570',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 14,
  },
});
