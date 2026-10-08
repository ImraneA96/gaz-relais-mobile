import { url_api } from '@/.expo/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AlertCircle, Clock, Gauge, Package } from 'lucide-react-native';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import EventSource from "react-native-sse";
import Svg, { Circle } from 'react-native-svg';

const SIZE = 160;
const RADIUS = 70;
const STROKE_WIDTH = 12;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function HomeView() {
  const [gazLevel, setGazLevel] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string | undefined>(undefined);
  const pendingOrder = true;

  const getStatusColor = () => {
    if (gazLevel <= 20) return '#dc2626';
    if (gazLevel <= 40) return '#d97706';
    return '#16a34a';
  };


  const getGaugeColor = () => {
    if (gazLevel <= 20) return '#ef4444';
    if (gazLevel <= 40) return '#f59e0b';
    return '#22c55e';
  };

  const getStatusLabel = () => {
    if (gazLevel <= 20) return 'Critique';
    if (gazLevel <= 40) return 'Attention';
    return 'Normal';
  };

  const getBadgeStyle = () => {
    if (gazLevel <= 20) return { backgroundColor: '#fee2e2', borderColor: '#fecaca', color: '#991b1b' };
    if (gazLevel <= 40) return { backgroundColor: '#fef3c7', borderColor: '#fde68a', color: '#92400e' };
    return { backgroundColor: '#dcfce7', borderColor: '#bbf7d0', color: '#166534' };
  };

  const badgeStyle = getBadgeStyle();
  const strokeDashoffset = CIRCUMFERENCE * (1 - gazLevel / 100);

  const getDetecteur = useCallback(async (isRefresh = false) => {
      isRefresh ? setRefreshing(true) : setLoading(true);
      setError(null);
      try {
          const jsonValue = await AsyncStorage.getItem('@user_profile');
          
          if(jsonValue) {
            const idClient = JSON.parse(jsonValue)["idClient"];
            const response = await fetch(`${url_api}/detecteurs/client/${idClient}`);

            if (!response.ok) throw new Error(`Erreur ${response.status}`);

            const data = await response.json();
            setGazLevel(data.niveauGaz);
            setLastUpdate(data.derniereCommunication);
          }
      } catch (err) {
          console.log(err);
          setError("Impossible de charger le détecteur.");
      } finally {
          setLoading(false);
          setRefreshing(false);
      }
  }, []);
  
  useEffect(() => {
      getDetecteur();
  }, [getDetecteur]);


  // Flux SSE
  useEffect(() => {
    const es = new EventSource(`${url_api}/telemetry/poids`);

    es.addEventListener("message", (event) => {
      if (!event.data) return;
      try {
        const data = JSON.parse(event.data);
        console.log(data);
        if (typeof data.poids === "number" && typeof data.horodatage === "string") {
          setGazLevel(data.poids);
          setLastUpdate(data.horodatage);
        }
      } catch {
        console.error("Message invalide :", event.data);
      }
    });

    return () => {
        es.removeAllEventListeners();
        es.close();
    };
  }, []);


  return (
    <View style={styles.container}>
      <View style={styles.headerBlock}>
        <Text style={styles.headerTitle}>Mon espace</Text>
        <Text style={styles.headerSubtitle}>Suivi de votre bouteille de gaz</Text>
      </View>

      <View style={styles.mainCard}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardTitle}>Niveau de gaz actuel</Text>
          <View style={[styles.badge, { backgroundColor: badgeStyle.backgroundColor, borderColor: badgeStyle.borderColor }]}>
            <Text style={[styles.badgeText, { color: badgeStyle.color }]}>{getStatusLabel()}</Text>
          </View>
        </View>

        <View style={styles.gaugeWrapper}>
          <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
            <Circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              stroke="#e5e7eb"
              strokeWidth={STROKE_WIDTH}
              fill="none"
            />
            <Circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              stroke={getGaugeColor()}
              strokeWidth={STROKE_WIDTH}
              fill="none"
              strokeDasharray={`${CIRCUMFERENCE}`}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              rotation="-90"
              origin={`${SIZE / 2}, ${SIZE / 2}`}
            />
          </Svg>
          <View style={styles.gaugeCenter}>
            <Text style={[styles.gaugeValue, { color: getStatusColor() }]}>{gazLevel}%</Text>
            <Text style={styles.gaugeLabel}>restant</Text>
          </View>
        </View>

        <View style={styles.infoList}>
          <View style={styles.infoRow}>
            <View style={styles.infoRowLeft}>
              <Clock size={16} color="#6b7280" />
              <Text style={styles.infoRowText}>Dernière mise à jour : </Text>
            </View>
            <Text style={styles.infoRowValue}>{lastUpdate}</Text>
          </View>

          {pendingOrder && (
            <View style={styles.alertBoxBlue}>
              <Package size={16} color="#1d4ed8" />
              <Text style={styles.alertTextBlue}>Commande en cours de livraison</Text>
            </View>
          )}

          {gazLevel <= 30 && !pendingOrder && (
            <View style={styles.alertBoxAmber}>
              <AlertCircle size={16} color="#b45309" />
              <Text style={styles.alertTextAmber}>Niveau bas - Pensez à commander</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <View style={styles.statContent}>
            <View style={[styles.iconCircle, { backgroundColor: '#dbeafe' }]}>
              <Package size={20} color="#2563eb" />
            </View>
            <View>
              <Text style={styles.statLabel}>Abonnement</Text>
              <Text style={styles.statValue}>Actif</Text>
            </View>
          </View>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statContent}>
            <View style={[styles.iconCircle, { backgroundColor: '#dcfce7' }]}>
              <Gauge size={20} color="#16a34a" />
            </View>
            <View>
              <Text style={styles.statLabel}>Capteur</Text>
              <Text style={styles.statValue}>Connecté</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  headerBlock: {
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  mainCard: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 12,
    padding: 24,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  badge: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  gaugeWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  gaugeCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugeValue: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  gaugeLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  infoList: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  infoRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoRowText: {
    fontSize: 14,
    color: '#6b7280',
  },
  infoRowValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  alertBoxBlue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 8,
  },
  alertTextBlue: {
    fontSize: 14,
    color: '#1d4ed8',
    flex: 1,
  },
  alertBoxAmber: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: '#fffbeb',
    borderWidth: 1,
    borderColor: '#fde68a',
    borderRadius: 8,
  },
  alertTextAmber: {
    fontSize: 14,
    color: '#b45309',
    flex: 1,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabel: {
    fontSize: 13,
    color: '#6b7280',
  },
  statValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
});
