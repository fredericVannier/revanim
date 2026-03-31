import { Pressable, StyleSheet, Text, View } from 'react-native';

export type CommentData = {
  id: string;
  content: string;
  likes: number;
  createdAt: string;
  user: { username: string; avatar: string | null };
};

type Props = {
  comment: CommentData;
  onLike: (id: string) => void;
  liking?: boolean;
};

export function CommentItem({ comment, onLike, liking }: Props) {
  const date = new Date(comment.createdAt).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.username}>{comment.user.username}</Text>
        <Text style={styles.date}>{date}</Text>
      </View>
      <Text style={styles.content}>{comment.content}</Text>
      <Pressable
        style={styles.likeRow}
        onPress={() => !liking && onLike(comment.id)}
        hitSlop={8}
      >
        <Text style={styles.likeIcon}>♥</Text>
        <Text style={styles.likeCount}>{comment.likes}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#12121F',
    borderRadius: 12,
    padding: 14,
    gap: 8,
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  username: {
    color: '#C9A84C',
    fontWeight: '700',
    fontSize: 13,
  },
  date: {
    color: '#555570',
    fontSize: 11,
  },
  content: {
    color: '#CCCCDD',
    fontSize: 14,
    lineHeight: 20,
  },
  likeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
  },
  likeIcon: {
    color: '#7C3AED',
    fontSize: 14,
  },
  likeCount: {
    color: '#555570',
    fontSize: 12,
  },
});
