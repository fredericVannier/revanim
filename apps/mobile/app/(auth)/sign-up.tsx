import { useSignUp } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function SignUpScreen() {
  const { signUp, setActive, isLoaded } = useSignUp();
  const router = useRouter();

  const [step, setStep] = useState<'form' | 'verify'>('form');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignUp() {
    if (!isLoaded) return;
    setError('');
    setLoading(true);

    try {
      await signUp.create({ username, emailAddress: email, password });
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setStep('verify');
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'errors' in err
          ? (err as { errors: { message: string }[] }).errors[0]?.message
          : 'Erreur lors de l\'inscription';
      setError(message ?? 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify() {
    if (!isLoaded) return;
    setError('');
    setLoading(true);

    try {
      const result = await signUp.attemptEmailAddressVerification({ code });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        router.replace('/(tabs)/');
      }
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'errors' in err
          ? (err as { errors: { message: string }[] }).errors[0]?.message
          : 'Code invalide';
      setError(message ?? 'Code invalide');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.inner}>
        <Text style={styles.logo}>revAnim</Text>
        <Text style={styles.subtitle}>
          {step === 'form' ? 'Crée ton compte' : 'Vérifie ton email'}
        </Text>

        {step === 'form' ? (
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Nom d'utilisateur"
              placeholderTextColor="#555570"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoComplete="username-new"
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#555570"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
            />
            <TextInput
              style={styles.input}
              placeholder="Mot de passe"
              placeholderTextColor="#555570"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="new-password"
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Pressable
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSignUp}
              disabled={loading || !username || !email || !password}
            >
              {loading ? (
                <ActivityIndicator color="#0A0A14" />
              ) : (
                <Text style={styles.buttonText}>S'inscrire</Text>
              )}
            </Pressable>
          </View>
        ) : (
          <View style={styles.form}>
            <Text style={styles.verifyHint}>
              Un code de vérification a été envoyé à {email}
            </Text>
            <TextInput
              style={[styles.input, styles.codeInput]}
              placeholder="Code de vérification"
              placeholderTextColor="#555570"
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
              maxLength={6}
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Pressable
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleVerify}
              disabled={loading || code.length < 6}
            >
              {loading ? (
                <ActivityIndicator color="#0A0A14" />
              ) : (
                <Text style={styles.buttonText}>Vérifier</Text>
              )}
            </Pressable>
          </View>
        )}

        <Link href="/(auth)/sign-in" asChild>
          <Pressable>
            <Text style={styles.link}>
              Déjà un compte ?{' '}
              <Text style={styles.linkAccent}>Se connecter</Text>
            </Text>
          </Pressable>
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A14',
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  logo: {
    fontSize: 42,
    fontWeight: '700',
    color: '#C9A84C',
    letterSpacing: 1,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#555570',
    marginBottom: 48,
  },
  form: {
    width: '100%',
    gap: 12,
    marginBottom: 32,
  },
  input: {
    backgroundColor: '#12121F',
    borderWidth: 1,
    borderColor: '#1A1A2E',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#FFFFFF',
    fontSize: 15,
  },
  codeInput: {
    textAlign: 'center',
    fontSize: 24,
    letterSpacing: 8,
  },
  verifyHint: {
    color: '#888899',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 4,
  },
  error: {
    color: '#FF6B6B',
    fontSize: 13,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#C9A84C',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#0A0A14',
    fontWeight: '700',
    fontSize: 16,
  },
  link: {
    color: '#555570',
    fontSize: 14,
  },
  linkAccent: {
    color: '#C9A84C',
    fontWeight: '600',
  },
});
