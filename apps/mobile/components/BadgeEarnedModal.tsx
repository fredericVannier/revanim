import { useEffect } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

export type NewBadge = { key: string; name: string; icon: string };

type Props = {
  badges: NewBadge[];
  onDismiss: () => void;
};

export function BadgeEarnedModal({ badges, onDismiss }: Props) {
  const opacity = new Animated.Value(0);
  const translateY = new Animated.Value(60);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.spring(translateY, { toValue: 0, tension: 60, friction: 8, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, []);

  if (badges.length === 0) return null;

  return (
    <Animated.View style={[styles.container, { opacity, transform: [{ translateY }] }]}>
      {badges.map((badge) => (
        <Pressable key={badge.key} style={styles.toast} onPress={onDismiss}>
          <Text style={styles.icon}>{badge.icon}</Text>
          <View style={styles.text}>
            <Text style={styles.label}>Badge débloqué !</Text>
            <Text style={styles.name}>{badge.name}</Text>
          </View>
        </Pressable>
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 90,
    left: 16,
    right: 16,
    gap: 8,
    zIndex: 999,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A2E',
    borderWidth: 1,
    borderColor: '#C9A84C',
    borderRadius: 14,
    padding: 14,
    gap: 12,
  },
  icon: { fontSize: 28 },
  text: { flex: 1 },
  label: { color: '#C9A84C', fontSize: 11, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase' },
  name: { color: '#FFFFFF', fontSize: 15, fontWeight: '700', marginTop: 2 },
});
