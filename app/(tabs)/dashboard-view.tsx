import { Image } from "expo-image";
import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    ImageSourcePropType,
    RefreshControl,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";
import { url_api } from "../../.expo/utils";
import MyText from "../components/MyText";

// ---- Types ----------------------------------------------------------------

interface DashboardTailles {
    detecteursActif?: number;
    niveauxCritique?: number;
    commandesEnCours?: number;
    livreursDispo?: number;
}

interface StatCardConfig {
    key: keyof DashboardTailles;
    label: string;
    icon: ImageSourcePropType;
    accent: string;      // couleur du texte / bordure
    background: string;  // fond de la carte
    iconBackground: string; // fond du cercle icône
}

const STAT_CARDS: StatCardConfig[] = [
    {
        key: 'detecteursActif',
        label: 'Détecteurs actifs',
        icon: require('@/assets/images/icons/fleche.svg'),
        accent: '#3B82F6',
        background: '#EFF6FF',
        iconBackground: '#BFDBFE',
    },
    {
        key: 'niveauxCritique',
        label: 'Niveaux critiques',
        icon: require('@/assets/images/icons/danger.svg'),
        accent: '#EF4444',
        background: '#FEF2F2',
        iconBackground: '#FECACA',
    },
    {
        key: 'commandesEnCours',
        label: 'Commandes en cours',
        icon: require('@/assets/images/icons/order.svg'),
        accent: '#EAB308',
        background: '#FEFCE8',
        iconBackground: '#FEF08A',
    },
    {
        key: 'livreursDispo',
        label: 'Livreurs disponibles',
        icon: require('@/assets/images/icons/persons.svg'),
        accent: '#22C55E',
        background: '#F0FDF4',
        iconBackground: '#BBF7D0',
    },
];


function StatCard({ config, value }: { config: StatCardConfig; value?: number }) {
    return (
        <View style={[styles.statCard, { backgroundColor: config.background, borderColor: `${config.accent}33` }]}>
            <View style={styles.statCardHeader}>
                <MyText style={[styles.statLabel, { color: config.accent }]}>
                    {config.label}
                </MyText>
                <View style={[styles.iconCircle, { backgroundColor: config.iconBackground }]}>
                    <Image source={config.icon} style={styles.icon} />
                </View>
            </View>
            <MyText style={[styles.statValue, { color: config.accent }]}>
                {value ?? '—'}
            </MyText>
        </View>
    );
}

// ---- Écran principal ---------------------------------------------------------

export default function DashboardView() {
    const [dashboard, setDashboard] = useState<DashboardTailles>({});
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getTailles = useCallback(async (isRefresh = false) => {
        isRefresh ? setRefreshing(true) : setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${url_api}/dashboard/tailles`);
            if (!response.ok) throw new Error(`Erreur ${response.status}`);
            const data = await response.json();
            setDashboard(data);
        } catch (err) {
            console.log(err);
            setError("Impossible de charger le tableau de bord.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        getTailles();
    }, [getTailles]);

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#1bcc30" />
            </View>
        );
    }

    return (
        <ScrollView
            contentContainerStyle={styles.container}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => getTailles(true)} />}
        >
            <MyText style={styles.headerTitle}>Tableau de bord</MyText>

            {error && <MyText style={styles.errorText}>{error}</MyText>}

            <View style={styles.grid}>
                {STAT_CARDS.map((config) => (
                    <StatCard key={config.key} config={config} value={dashboard[config.key]} />
                ))}
            </View>

            {/* Espace réservé pour de futurs graphiques / listes récentes */}
            <View style={styles.placeholder} />
        </ScrollView>
    );
}

// ---- Styles ------------------------------------------------------------------

const styles = StyleSheet.create({
    container: {
        padding: 12,
        paddingTop: 20,
        backgroundColor: '#F5F6F8',
        flexGrow: 1,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1a1a1a',
        marginBottom: 16,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    statCard: {
        flexBasis: '47%',
        flexGrow: 1,
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
        justifyContent: 'space-between',
        minHeight: 100,
    },
    statCardHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 8,
    },
    statLabel: {
        fontWeight: '600',
        fontSize: 13,
        flexShrink: 1,
    },
    iconCircle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        width: 18,
        height: 18,
    },
    statValue: {
        fontWeight: '700',
        fontSize: 28,
        marginTop: 12,
    },
    placeholder: {
        flex: 1,
        minHeight: 120,
    },
    centerContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F5F6F8',
    },
    errorText: {
        fontSize: 14,
        color: '#e02b2b',
        marginBottom: 12,
    },
});