import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  value: number;        // 0 = non noté
  onChange: (score: number) => void;
  loading?: boolean;
};

export function StarRating({ value, onChange, loading }: Props) {
  return (
    <View style={styles.row}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Pressable
          key={star}
          onPress={() => !loading && onChange(star)}
          style={styles.star}
          hitSlop={8}
        >
          <Text style={[styles.starText, star <= value && styles.starActive]}>
            ★
          </Text>
        </Pressable>
      ))}
      {value > 0 && (
        <Text style={styles.label}>{value}/5</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  star: {
    padding: 4,
  },
  starText: {
    fontSize: 28,
    color: '#2A2A3E',
  },
  starActive: {
    color: '#C9A84C',
  },
  label: {
    color: '#C9A84C',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 8,
  },
});
