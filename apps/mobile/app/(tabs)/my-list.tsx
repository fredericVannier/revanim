import { StyleSheet, Text, View } from 'react-native';

export default function MyListScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Ma liste</Text>
      <Text style={styles.hint}>À implémenter — KAN-37</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A14',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#C9A84C',
    fontSize: 24,
    fontWeight: '700',
  },
  hint: {
    color: '#555570',
    fontSize: 13,
    marginTop: 8,
  },
});
