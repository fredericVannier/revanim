import { useRouter } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import type { Anime } from '@revanim/types';

type Props = { anime: Anime };

export function AnimeCard({ anime }: Props) {
  const router = useRouter();

  return (
    <Pressable
      style={styles.card}
      onPress={() => router.push(`/anime/${anime.anilistId}`)}
    >
      {anime.coverImage ? (
        <Image source={{ uri: anime.coverImage }} style={styles.cover} />
      ) : (
        <View style={[styles.cover, styles.coverPlaceholder]} />
      )}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>{anime.title}</Text>
        <View style={styles.meta}>
          {anime.score != null && (
            <Text style={styles.score}>★ {anime.score.toFixed(1)}</Text>
          )}
          {anime.year && <Text style={styles.year}>{anime.year}</Text>}
        </View>
        {anime.genres.length > 0 && (
          <Text style={styles.genres} numberOfLines={1}>
            {anime.genres.slice(0, 3).join(' · ')}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#12121F',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    overflow: 'hidden',
  },
  cover: {
    width: 80,
    height: 110,
  },
  coverPlaceholder: {
    backgroundColor: '#1A1A2E',
  },
  info: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
    gap: 4,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  score: {
    color: '#C9A84C',
    fontSize: 13,
    fontWeight: '700',
  },
  year: {
    color: '#555570',
    fontSize: 12,
  },
  genres: {
    color: '#555570',
    fontSize: 12,
  },
});
