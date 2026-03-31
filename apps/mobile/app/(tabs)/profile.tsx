import { useAuth, useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useApi } from '../../lib/api';

type Badge = {
  badge: { key: string; name: string; icon: string; description: string };
  earnedAt: string;
};

type UserProfile = {
  id: string;
  username: string;
  avatar: string | null;
  bio: string | null;
  createdAt: string;
  badges: Badge[];
  _count: { ratings: number; animeList: number };
};

export default function ProfileScreen() {
  const { signOut } = useAuth();
  const { user: clerkUser } = useUser();
  const api = useApi();
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');

  useEffect(() => {
    api.get<UserProfile>('/api/users/me')
      .then((p) => {
        setProfile(p);
        setUsername(p.username);
        setBio(p.bio ?? '');
        setAvatar(p.avatar ?? '');
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      const updated = await api.patch<UserProfile>('/api/users/me', {
        username: username.trim() || undefined,
        bio: bio.trim() || undefined,
        avatar: avatar.trim() || undefined,
      });
      setProfile((prev) => prev ? { ...prev, ...updated } : prev);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  }

  async function handleSignOut() {
    await signOut();
    router.replace('/(auth)/sign-in');
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color="#C9A84C" size="large" />
      </View>
    );
  }

  if (!profile) return null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          {profile.avatar ? (
            <Image source={{ uri: profile.avatar }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Text style={styles.avatarInitial}>
                {profile.username[0]?.toUpperCase() ?? '?'}
              </Text>
            </View>
          )}

          <View style={styles.headerInfo}>
            <Text style={styles.username}>{profile.username}</Text>
            {clerkUser?.primaryEmailAddress && (
              <Text style={styles.email}>{clerkUser.primaryEmailAddress.emailAddress}</Text>
            )}
            {profile.bio ? (
              <Text style={styles.bio}>{profile.bio}</Text>
            ) : (
              <Text style={styles.bioPh}>Pas encore de bio</Text>
            )}
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{profile._count.ratings}</Text>
            <Text style={styles.statLabel}>Notes</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>{profile._count.animeList}</Text>
            <Text style={styles.statLabel}>En liste</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>{profile.badges.length}</Text>
            <Text style={styles.statLabel}>Badges</Text>
          </View>
        </View>

        {/* Badges */}
        {profile.badges.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Badges</Text>
            <View style={styles.badgesRow}>
              {profile.badges.map(({ badge }) => (
                <View key={badge.key} style={styles.badgeChip}>
                  <Text style={styles.badgeIcon}>{badge.icon}</Text>
                  <Text style={styles.badgeName}>{badge.name}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Edit form — KAN-42 */}
        {editing ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Modifier le profil</Text>
            <TextInput
              style={styles.input}
              placeholder="Nom d'utilisateur"
              placeholderTextColor="#555570"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
            <TextInput
              style={[styles.input, styles.inputMultiline]}
              placeholder="Bio (max 500 caractères)"
              placeholderTextColor="#555570"
              value={bio}
              onChangeText={setBio}
              multiline
              maxLength={500}
            />
            <TextInput
              style={styles.input}
              placeholder="URL de l'avatar"
              placeholderTextColor="#555570"
              value={avatar}
              onChangeText={setAvatar}
              autoCapitalize="none"
              keyboardType="url"
            />
            <View style={styles.editActions}>
              <Pressable style={styles.cancelButton} onPress={() => setEditing(false)}>
                <Text style={styles.cancelText}>Annuler</Text>
              </Pressable>
              <Pressable
                style={[styles.saveButton, saving && styles.buttonDisabled]}
                onPress={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#0A0A14" size="small" />
                ) : (
                  <Text style={styles.saveText}>Enregistrer</Text>
                )}
              </Pressable>
            </View>
          </View>
        ) : (
          <Pressable style={styles.editButton} onPress={() => setEditing(true)}>
            <Text style={styles.editButtonText}>Modifier le profil</Text>
          </Pressable>
        )}

        {/* Sign out */}
        <Pressable style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Se déconnecter</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A14' },
  centered: { flex: 1, backgroundColor: '#0A0A14', justifyContent: 'center', alignItems: 'center' },
  scroll: { paddingHorizontal: 16, paddingTop: 24, paddingBottom: 40, gap: 24 },

  header: { flexDirection: 'row', gap: 16, alignItems: 'flex-start' },
  avatar: { width: 72, height: 72, borderRadius: 36 },
  avatarPlaceholder: {
    backgroundColor: '#1A1A2E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: { color: '#C9A84C', fontSize: 28, fontWeight: '700' },
  headerInfo: { flex: 1, gap: 3 },
  username: { color: '#FFFFFF', fontSize: 20, fontWeight: '700' },
  email: { color: '#555570', fontSize: 12 },
  bio: { color: '#AAAABC', fontSize: 13, lineHeight: 18, marginTop: 4 },
  bioPh: { color: '#333344', fontSize: 13, fontStyle: 'italic', marginTop: 4 },

  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#12121F',
    borderRadius: 14,
    padding: 16,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  stat: { alignItems: 'center', gap: 3 },
  statValue: { color: '#C9A84C', fontSize: 22, fontWeight: '700' },
  statLabel: { color: '#555570', fontSize: 12 },
  statDivider: { width: 1, height: 32, backgroundColor: '#1A1A2E' },

  section: { gap: 12 },
  sectionTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },

  badgesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  badgeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A2E',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  badgeIcon: { fontSize: 14 },
  badgeName: { color: '#C9A84C', fontSize: 12, fontWeight: '600' },

  input: {
    backgroundColor: '#12121F',
    borderWidth: 1,
    borderColor: '#1A1A2E',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 14,
  },
  inputMultiline: { minHeight: 80, textAlignVertical: 'top' },
  editActions: { flexDirection: 'row', gap: 10 },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#1A1A2E',
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
  },
  cancelText: { color: '#555570', fontWeight: '600' },
  saveButton: {
    flex: 1,
    backgroundColor: '#C9A84C',
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
  },
  saveText: { color: '#0A0A14', fontWeight: '700' },
  buttonDisabled: { opacity: 0.5 },

  editButton: {
    borderWidth: 1,
    borderColor: '#C9A84C',
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
  },
  editButtonText: { color: '#C9A84C', fontWeight: '600', fontSize: 14 },

  signOutButton: {
    borderWidth: 1,
    borderColor: '#FF6B6B',
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
  },
  signOutText: { color: '#FF6B6B', fontWeight: '600', fontSize: 14 },
});
