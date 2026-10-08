import { COLORTHEME } from '@/.expo/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CreditCard, LogOut, Mail, MapPin, Phone, Settings, User } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


export default function ProfileView() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('@user_profile');
        setUserData(jsonValue != null ? JSON.parse(jsonValue) : null);
      } catch (e) {
        console.error('Erreur de chargement', e);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {userData && <><View style={styles.headerBlock}>
        <Text style={styles.headerTitle}>Mon profil</Text>
        <Text style={styles.headerSubtitle}>Gérez vos informations personnelles</Text>
      </View>
      <View style={styles.card}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <User size={32} color={COLORTHEME} />
          </View>
          <View>
            <Text style={styles.userName}>{userData["nom"]} {userData["prenom"]}</Text>
            <Text style={styles.userId}>Client #{userData["idClient"]}</Text>
          </View>
        </View>

        <View style={{ gap: 12 }}>
          <View style={styles.infoRow}>
            <Mail size={20} color="#6b7280" style={{ marginTop: 2 }} />
            <View>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{userData["email"]}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Phone size={20} color="#6b7280" style={{ marginTop: 2 }} />
            <View>
              <Text style={styles.infoLabel}>Telephone</Text>
              <Text style={styles.infoValue}>{userData["telephones"]}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <MapPin size={20} color="#6b7280" style={{ marginTop: 2 }} />
            <View>
              <Text style={styles.infoLabel}>Adresse de livraison</Text>
              <Text style={styles.infoValue}>{userData["adresse"]["quartier"]}</Text>
              <Text style={styles.infoSubValue}>{userData["adresse"]["rue"]}</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Abonnement</Text>
        <View style={{ gap: 12 }}>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Statut</Text>
            <Text style={styles.statusValueGreen}>{userData["statutAbonnement"]}</Text>
          </View>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Type</Text>
            <Text style={styles.statusValue}>Détection automatique</Text>
          </View>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Capteur</Text>
            <Text style={styles.statusValue}>Connecté</Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Paiement</Text>
        <View style={styles.paymentRow}>
          <CreditCard size={20} color="#6b7280" style={{ marginTop: 2 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.paymentTitle}>Carte bancaire</Text>
            <Text style={styles.paymentSubtitle}>•••• •••• •••• 4242</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.editLink}>Modifier</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.actionsBlock}>
        <TouchableOpacity style={styles.outlineButton}>
          <Settings size={20} color="#374151" />
          <Text style={styles.outlineButtonText}>Paramètres</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton}>
          <LogOut size={20} color="#dc2626" />
          <Text style={styles.logoutButtonText}>Se déconnecter</Text>
        </TouchableOpacity>
      </View></>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
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
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  cardTitle: {
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
    fontSize: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  userId: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
  },
  infoLabel: {
    fontSize: 13,
    color: '#6b7280',
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
    marginTop: 2,
  },
  infoSubValue: {
    fontSize: 13,
    color: '#4b5563',
    marginTop: 2,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusLabel: {
    fontSize: 14,
    color: '#4b5563',
  },
  statusValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  statusValueGreen: {
    fontSize: 14,
    fontWeight: '500',
    color: '#16a34a',
  },
  paymentRow: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    alignItems: 'center',
  },
  paymentTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
  },
  paymentSubtitle: {
    fontSize: 13,
    color: '#4b5563',
    marginTop: 2,
  },
  editLink: {
    fontSize: 14,
    color: COLORTHEME,
    fontWeight: '500',
  },
  actionsBlock: {
    gap: 8,
    marginTop: 8,
  },
  outlineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  outlineButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#fecaca',
    backgroundColor: '#fef2f2',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#dc2626',
  },
});