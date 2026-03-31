import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { Anime } from '@revanim/types';
import { AnimeCard } from '../../components/AnimeCard';
import { useApi } from '../../lib/api';

type ListType = 'FAVORITE' | 'WISHLIST' | 'COUP_DE_COEUR';

type ListItem = { anime: Anime; type: ListType; addedAt: string };

const TABS: { key: ListType; label: string; icon: string }[] = [
  { key: 'FAVORITE', label: 'Favoris', icon: '❤️' },
  { key: 'WISHLIST', label: 'Wishlist', icon: '📋' },
  { key: 'COUP_DE_COEUR', label: 'Coups de cœur', icon: '💎' },
];

export default function MyListScreen() {
  const api = useApi();
  const [active, setActive] = useState<ListType>('FAVORITE');
  const [items, setItems] = useState<ListItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .get<ListItem[]>(`/api/lists?type=${active}`)
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [active]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ma liste</Text>
      </View>

      {/* Tab bar */}
      <View style={styles.tabBar}>
        {TABS.map((tab) => (
          <Pressable
            key={tab.key}
            style={[styles.tab, active === tab.key && styles.tabActive]}
            onPress={() => setActive(tab.key)}
          >
            <Text style={styles.tabIcon}>{tab.icon}</Text>
            <Text style={[styles.tabLabel, active === tab.key && styles.tabLabelActive]}>
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator color="#C9A84C" style={styles.loader} />
      ) : items.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>
            {active === 'FAVORITE' && 'Aucun favori pour l\'instant'}
            {active === 'WISHLIST' && 'Ta wishlist est vide'}
            {active === 'COUP_DE_COEUR' && 'Aucun coup de cœur'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.anime.id}
          renderItem={({ item }) => <AnimeCard anime={item.anime} />}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A14' },
  header: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  title: { color: '#C9A84C', fontSize: 28, fontWeight: '700' },

  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1A1A2E',
    gap: 3,
  },
  tabActive: {
    borderColor: '#C9A84C',
    backgroundColor: 'rgba(201,168,76,0.08)',
  },
  tabIcon: { fontSize: 16 },
  tabLabel: { color: '#555570', fontSize: 11, fontWeight: '600' },
  tabLabelActive: { color: '#C9A84C' },

  loader: { marginTop: 40 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#555570', fontSize: 14, fontStyle: 'italic' },
  list: { paddingBottom: 16 },
});
