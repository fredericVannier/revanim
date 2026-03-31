import { useAuth, useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

export default function ProfileScreen() {
  const { signOut, isLoaded } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.replace('/(auth)/sign-in');
  }

  if (!isLoaded) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color="#C9A84C" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.username}>{user?.username ?? user?.firstName ?? 'Utilisateur'}</Text>
      <Text style={styles.email}>{user?.primaryEmailAddress?.emailAddress}</Text>

      <View style={styles.spacer} />

      <Pressable style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.signOutText}>Se déconnecter</Text>
      </Pressable>

      <Text style={styles.hint}>Profil complet — KAN-37 à KAN-42</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A14',
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 32,
  },
  username: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  email: {
    color: '#555570',
    fontSize: 14,
  },
  spacer: {
    flex: 1,
  },
  signOutButton: {
    borderWidth: 1,
    borderColor: '#FF6B6B',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
    marginBottom: 16,
    width: '100%',
    alignItems: 'center',
  },
  signOutText: {
    color: '#FF6B6B',
    fontWeight: '600',
    fontSize: 15,
  },
  hint: {
    color: '#333344',
    fontSize: 12,
    marginBottom: 32,
  },
});
