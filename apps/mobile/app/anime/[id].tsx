import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { Anime } from '@revanim/types';
import { CommentData, CommentItem } from '../../components/CommentItem';
import { StarRating } from '../../components/StarRating';
import { useApi } from '../../lib/api';

const STATUS_LABELS: Record<string, string> = {
  FINISHED: 'Terminé',
  RELEASING: 'En cours',
  NOT_YET_RELEASED: 'À venir',
  CANCELLED: 'Annulé',
};

type CommentsResponse = {
  comments: CommentData[];
  total: number;
  page: number;
  hasNextPage: boolean;
};

export default function AnimeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const api = useApi();
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);

  const [anime, setAnime] = useState<Anime | null>(null);
  const [loadingAnime, setLoadingAnime] = useState(true);
  const [error, setError] = useState('');

  // Rating
  const [userRating, setUserRating] = useState(0);
  const [ratingLoading, setRatingLoading] = useState(false);
  const [ratingAvg, setRatingAvg] = useState<{ average: number | null; count: number } | null>(null);

  // Comments
  const [comments, setComments] = useState<CommentData[]>([]);
  const [commentText, setCommentText] = useState('');
  const [sendingComment, setSendingComment] = useState(false);
  const [likingId, setLikingId] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<Anime>(`/api/animes/${id}`)
      .then((a) => {
        setAnime(a);
        fetchComments(a.id);
        fetchRatings(a.id);
      })
      .catch(() => setError('Anime introuvable'))
      .finally(() => setLoadingAnime(false));
  }, [id]);

  async function fetchComments(animeId: string) {
    try {
      const res = await api.get<CommentsResponse>(
        `/api/comments?animeId=${animeId}&page=1`,
      );
      setComments(res.comments);
    } catch {
      // silently ignore
    }
  }

  async function fetchRatings(animeId: string) {
    try {
      const res = await api.get<{ average: number | null; count: number }>(
        `/api/ratings?animeId=${animeId}&page=1`,
      );
      setRatingAvg({ average: res.average, count: res.count });
    } catch {
      // silently ignore
    }
  }

  async function handleRate(score: number) {
    if (!anime) return;
    setRatingLoading(true);
    try {
      await api.post('/api/ratings', { animeId: anime.id, score });
      setUserRating(score);
      await fetchRatings(anime.id);
    } finally {
      setRatingLoading(false);
    }
  }

  async function handleSendComment() {
    if (!anime || !commentText.trim()) return;
    setSendingComment(true);
    try {
      const newComment = await api.post<CommentData>('/api/comments', {
        animeId: anime.id,
        content: commentText.trim(),
      });
      setComments((prev) => [newComment, ...prev]);
      setCommentText('');
    } finally {
      setSendingComment(false);
    }
  }

  async function handleLike(commentId: string) {
    setLikingId(commentId);
    try {
      await api.post(`/api/comments/${commentId}/like`, {});
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId
            ? { ...c, likes: c.likes + 1 }
            : c,
        ),
      );
    } finally {
      setLikingId(null);
    }
  }

  if (loadingAnime) {
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
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <ScrollView ref={scrollRef}>
          {/* Banner */}
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
            {/* Title */}
            <Text style={styles.title}>{anime.title}</Text>
            {anime.titleJapanese && (
              <Text style={styles.titleJa}>{anime.titleJapanese}</Text>
            )}

            {/* Stats */}
            <View style={styles.stats}>
              {ratingAvg?.average != null && (
                <View style={styles.stat}>
                  <Text style={styles.statValue}>★ {ratingAvg.average.toFixed(1)}</Text>
                  <Text style={styles.statLabel}>{ratingAvg.count} avis</Text>
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

            {/* Rating — KAN-48 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Ta note</Text>
              <StarRating
                value={userRating}
                onChange={handleRate}
                loading={ratingLoading}
              />
              {ratingLoading && (
                <ActivityIndicator color="#C9A84C" size="small" style={{ marginTop: 4 }} />
              )}
            </View>

            {/* Comments — KAN-49 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Commentaires ({comments.length})</Text>

              {comments.map((c) => (
                <CommentItem
                  key={c.id}
                  comment={c}
                  onLike={handleLike}
                  liking={likingId === c.id}
                />
              ))}

              {comments.length === 0 && (
                <Text style={styles.empty}>Sois le premier à commenter !</Text>
              )}
            </View>
          </View>
        </ScrollView>

        {/* Comment input bar — KAN-49 */}
        <View style={styles.commentBar}>
          <TextInput
            style={styles.commentInput}
            placeholder="Ton commentaire..."
            placeholderTextColor="#555570"
            value={commentText}
            onChangeText={setCommentText}
            multiline
            maxLength={1000}
          />
          <Pressable
            style={[styles.sendButton, (!commentText.trim() || sendingComment) && styles.sendDisabled]}
            onPress={handleSendComment}
            disabled={!commentText.trim() || sendingComment}
          >
            {sendingComment ? (
              <ActivityIndicator color="#0A0A14" size="small" />
            ) : (
              <Text style={styles.sendText}>↑</Text>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
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
    paddingBottom: 16,
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
    gap: 10,
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
  empty: {
    color: '#555570',
    fontSize: 13,
    fontStyle: 'italic',
  },
  commentBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#1A1A2E',
    backgroundColor: '#0A0A14',
    gap: 10,
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#12121F',
    borderWidth: 1,
    borderColor: '#1A1A2E',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#FFFFFF',
    fontSize: 14,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#C9A84C',
    borderRadius: 12,
    width: 42,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendDisabled: {
    opacity: 0.4,
  },
  sendText: {
    color: '#0A0A14',
    fontSize: 20,
    fontWeight: '700',
  },
});
