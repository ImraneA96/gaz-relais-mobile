import { COLORTHEME, url_api } from '@/.expo/utils/responsive.utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { AlertCircle, Lock, User } from 'lucide-react-native';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function Index() {
  const router = useRouter();
  const [login, setLogin] = useState(null);
  const [telephone, setTelephone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const saveUser = async(userData: any)  =>  {
    try {
      const jsonValue = JSON.stringify(userData);
      await AsyncStorage.setItem('@user_profile', jsonValue);
    } catch(e) {
      console.error('Erreur de sauvegarde', e);
    }
  }

  const getLogin = () => {
      const URL = `${url_api}/clients/telephone/${telephone}`;

      return fetch(URL)
        .then(response => {
          return response.json();
        })
        .then(loginData => {
          setLogin(loginData);
          return loginData;
        })
        .catch(error => {
          console.error('Erreur dans getLogin:', error);
      });
  };


  const handleLogin = async () => {
    setError('');

    getLogin().then(data => {
      if (!data) {
        setError('Email ou mot de passe incorrect');
        return;
      } else if(data["telephones"] && data["typeClient"]=="PARTICULIER") {
        router.replace('/(client)/home-view');
        saveUser(data);
      } else {
        router.replace('/(tabs)/dashboard-view');
      }
    })
    .catch(error => console.error('Erreur:', error));
  };

  const handleDemoLogin = (type: 'client' | 'admin') => {
    if (type === 'client') {
      setTelephone('0612345678');
      setPassword('client123');
    } else {
      setTelephone('0634567890');
      setPassword('admin123');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <Lock size={32} color="#fff" />
            </View>
            <Text style={styles.title}>GazRelais</Text>
            <Text style={styles.subtitle}>Connexion à votre espace</Text>
          </View>

          <View style={styles.form}>
            <View>
              <Text style={styles.label}>Email ou Téléphone</Text>
              <View style={styles.inputWrapper}>
                <User size={16} color="#9ca3af" style={styles.inputIcon} />
                <TextInput
                  value={telephone}
                  onChangeText={setTelephone}
                  placeholder="votre@email.com"
                  placeholderTextColor="#9ca3af"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  style={styles.input}
                  returnKeyType="next"
                />
              </View>
            </View>

            <View>
              <Text style={styles.label}>Mot de passe</Text>
              <View style={styles.inputWrapper}>
                <Lock size={16} color="#9ca3af" style={styles.inputIcon} />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor="#9ca3af"
                  secureTextEntry
                  style={styles.input}
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                />
              </View>
            </View>

            {error !== '' && (
              <View style={styles.errorBox}>
                <AlertCircle size={16} color="#dc2626" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Se connecter</Text>
            </TouchableOpacity>

            <View style={styles.separator}>
              <View style={styles.separatorLine} />
              <Text style={styles.separatorText}>Comptes de démonstration</Text>
              <View style={styles.separatorLine} />
            </View>

            <View style={styles.demoRow}>
              <TouchableOpacity
                style={styles.outlineButton}
                onPress={() => handleDemoLogin('client')}
              >
                <Text style={styles.outlineButtonText}>Client</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.outlineButton}
                onPress={() => handleDemoLogin('admin')}
              >
                <Text style={styles.outlineButtonText}>Admin</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eff6ff',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORTHEME,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
  },
  form: {
    gap: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: 12,
    zIndex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingVertical: 10,
    paddingLeft: 36,
    paddingRight: 12,
    fontSize: 16,
    color: '#111827',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#dc2626',
    flex: 1,
  },
  button: {
    backgroundColor: COLORTHEME,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    gap: 12,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#d1d5db',
  },
  separatorText: {
    fontSize: 12,
    color: '#6b7280',
  },
  demoRow: {
    flexDirection: 'row',
    gap: 12,
  },
  outlineButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  outlineButtonText: {
    color: '#374151',
    fontWeight: '500',
  },
});