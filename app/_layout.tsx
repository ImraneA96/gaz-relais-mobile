import { COLORTHEME } from '@/.expo/utils';
import { Stack, useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { Text, TouchableOpacity } from 'react-native';


WebBrowser.maybeCompleteAuthSession();

const KEYCLOAK_URL = 'http://192.168.11.112:8080';
const REALM        = 'GazRelais';
const CLIENT_ID    = 'gaz-relais-app';

export const unstable_settings = { anchor: '(tabs)' };

export default function RootLayout() {
  const router = useRouter();

 /* const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken,     setAccessToken]     = useState<string | null>(null);
  const [refreshToken,    setRefreshToken]     = useState<string | null>(null);

  const hasOpenedRef    = useRef(false);
  const hasExchangedRef = useRef(false);

  const discovery   = useAutoDiscovery(`${KEYCLOAK_URL}/realms/${REALM}`);
  const redirectUri = makeRedirectUri();

  const [request, response, promptAsync] = useAuthRequest(
    { clientId: CLIENT_ID, scopes: ['openid', 'profile', 'email'], redirectUri, usePKCE: true },
    discovery
  );

  // ─── Ouverture initiale de Keycloak ──────────────────────────────────────
  useEffect(() => {
    if (request && !hasOpenedRef.current && !isAuthenticated) {
      hasOpenedRef.current = true;
      promptAsync();
    }
  }, [request]);

  // ─── Traitement de la réponse ─────────────────────────────────────────────
  useEffect(() => {
    if (response?.type === 'success' && !hasExchangedRef.current) {
      hasExchangedRef.current = true;
      echangerCodeContreTokens(response.params.code);
    } else if (response?.type === 'dismiss' || response?.type === 'cancel') {
      hasOpenedRef.current = false;
    }
  }, [response]);

  // ─── Échange code → tokens ────────────────────────────────────────────────
  const echangerCodeContreTokens = async (authCode: string) => {
    if (!discovery?.tokenEndpoint || !request) return;
    try {
      const res    = await fetch(discovery.tokenEndpoint, {
        method : 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body   : new URLSearchParams({
          grant_type   : 'authorization_code',
          client_id    : CLIENT_ID,
          code         : authCode,
          redirect_uri : redirectUri,
          code_verifier: request.codeVerifier!,
        }).toString(),
      });
      const tokens = await res.json();

      if (tokens.access_token) {
        console.log('✅ Authentifié !');
        setAccessToken(tokens.access_token);
        setRefreshToken(tokens.refresh_token ?? null);
        setIsAuthenticated(true);
      }
    } catch (e) {
      console.error('❌ Erreur:', e);
      hasExchangedRef.current = false;
      hasOpenedRef.current    = false;
    }
  };

  // ─── Logout ───────────────────────────────────────────────────────────────
  const handleLogout = async () => {
    try {
      if (discovery?.revocationEndpoint && refreshToken) {
        await fetch(discovery.revocationEndpoint, {
          method : 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body   : new URLSearchParams({
            client_id    : CLIENT_ID,
            refresh_token: refreshToken,
          }).toString(),
        });
        console.log('✅ Session révoquée');
      }
    } catch (e) {
      console.error('❌ Erreur logout:', e);
    } finally {
      // Reset état
      setIsAuthenticated(false);
      setAccessToken(null);
      setRefreshToken(null);
      hasExchangedRef.current = false;
      hasOpenedRef.current    = true; // ← true pour éviter la condition du useEffect

      // ← Appel direct sans passer par un useEffect
      setTimeout(() => promptAsync(), 300);
    }
  };

  // ─── Navigation après auth ────────────────────────────────────────────────
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)/dashboard-view' as any);
    }
  }, [isAuthenticated]);

*/

  const handleLogout = async () => {
    router.replace('/');
  }
  
  // ─── Layout principal ─────────────────────────────────────────────────────
  return (
    <Stack screenOptions={{
      title           : 'Gaz Relais',
      headerStyle     : { backgroundColor: COLORTHEME },
      headerTitleStyle: { fontWeight: 'bold', color: '#fff' },
      headerTintColor : '#fff',
      headerRight     : () => (
        <TouchableOpacity onPress={handleLogout} style={{ marginRight: 16 }}>
          <Text style={{ color: '#fff', fontWeight: '600' }}>Déconnexion</Text>
        </TouchableOpacity>
      ),
    }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: true, title: 'Gaz Relais' }}
      />
      <Stack.Screen
        name="(client)"
        options={{ headerShown: true, title: 'Gaz Relais' }}
      />
    </Stack>
  );
}