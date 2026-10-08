import { Image } from "expo-image";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, View } from "react-native";
import * as Progress from 'react-native-progress';
import { url_api } from "../../.expo/utils";
import MyText from "../components/MyText";

interface Adresse {
    rue: string;
    quartier: string;
}

interface Detecteur {
    idDetecteur: string;
    clientActuelNom: string;
    clientActuelPrenom: string;
    adresse: Adresse;
    niveauBatterie: number;
    niveauGaz: number; // adapte le nom si ton API renvoie autre chose
    derniereMiseAJour?: string; // ISO date, optionnel
}

const NIVEAU_COLORS = {
    normal:   { border: '#1bcc30', background: '#e3f7e5', label: 'Normal' },
    moyen:    { border: '#FFA500', background: '#fdf1de', label: 'Moyen' },
    critique: { border: '#e02b2b', background: '#fbe0e0', label: 'Critique' },
};

function getNiveauStatus(niveau: number) {
    if (niveau > 50) return NIVEAU_COLORS.normal;
    if (niveau > 20) return NIVEAU_COLORS.moyen;
    return NIVEAU_COLORS.critique;
}

function formatMiseAJour(dateIso?: string) {
    if (!dateIso) return "Mise à jour inconnue";
    const diffMs = Date.now() - new Date(dateIso).getTime();
    const minutes = Math.max(0, Math.round(diffMs / 60000));
    if (minutes < 1) return "Mise à jour à l'instant";
    if (minutes < 60) return `Mise à jour il y a ${minutes} min`;
    const heures = Math.round(minutes / 60);
    return `Mise à jour il y a ${heures} h`;
}

// ---- Sous-composants --------------------------------------------------------

function EtatGaz({ niveau }: { niveau: number }) {
    const status = getNiveauStatus(niveau);
    return (
        <View style={[styles.badge, { borderColor: status.border, backgroundColor: status.background }]}>
            <View style={[styles.badgeDot, { backgroundColor: status.border }]} />
            <MyText style={[styles.badgeText, { color: status.border }]}>{status.label}</MyText>
        </View>
    );
}

function ProgressBar({ niveau }: { niveau: number }) {
    const status = getNiveauStatus(niveau);
    return (
        <Progress.Bar
            progress={niveau / 100}
            width={null}
            style={styles.progressBar}
            color={status.border}
            unfilledColor="#EEF0F2"
            borderColor="transparent"
            borderRadius={6}
            height={8}
        />
    );
}

function DetecteurCard({ item }: { item: Detecteur }) {
    return (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <MyText style={styles.clientName}>
                    {item.clientActuelNom} {item.clientActuelPrenom}
                </MyText>
                <EtatGaz niveau={item.niveauGaz ?? item.niveauBatterie} />
            </View>

            <View style={styles.infoRow}>
                <Image
                    source={require('@/assets/images/icons/location.svg')}
                    style={styles.iconSmall}
                />
                <MyText style={styles.infoText}>
                    {item.adresse?.rue}, {item.adresse?.quartier}
                </MyText>
            </View>

            <MyText style={styles.timestamp}>
                • {formatMiseAJour(item.derniereMiseAJour)}
            </MyText>

            <View style={styles.gasSection}>
                <View style={styles.gasHeaderRow}>
                    <Image
                        source={require('@/assets/images/icons/detecteur.svg')}
                        style={[styles.iconSmall, { tintColor: '#666666' }]}
                    />
                    <MyText style={styles.gasLabel}>Niveau de gaz</MyText>
                    <MyText style={styles.gasValue}>{item.niveauGaz ?? item.niveauBatterie} %</MyText>
                </View>
                <ProgressBar niveau={item.niveauGaz ?? item.niveauBatterie} />
            </View>
        </View>
    );
}

function EmptyState() {
    return (
        <View style={styles.emptyContainer}>
            <MyText style={styles.emptyTitle}>Aucun détecteur</MyText>
            <MyText style={styles.emptySubtitle}>
                Les détecteurs actifs apparaîtront ici dès qu'ils seront détectés.
            </MyText>
        </View>
    );
}

// ---- Écran principal ---------------------------------------------------------

export default function DetecteurView() {
    const [detecteurs, setDetecteurs] = useState<Detecteur[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getDetecteurs = useCallback(async (isRefresh = false) => {
        isRefresh ? setRefreshing(true) : setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${url_api}/detecteurs`);
            if (!response.ok) throw new Error(`Erreur ${response.status}`);
            const data = await response.json();
            setDetecteurs(data);
        } catch (err) {
            console.log(err);
            setError("Impossible de charger les détecteurs.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        getDetecteurs();
    }, [getDetecteurs]);

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <MyText style={styles.headerTitle}>Détecteurs</MyText>
                <View style={styles.countBadge}>
                    <MyText style={styles.countText}>{detecteurs.length} actifs</MyText>
                </View>
            </View>

            {loading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#1bcc30" />
                </View>
            ) : error ? (
                <View style={styles.centerContainer}>
                    <MyText style={styles.errorText}>{error}</MyText>
                </View>
            ) : (
                <FlatList
                    data={detecteurs}
                    renderItem={({ item }) => <DetecteurCard item={item} />}
                    keyExtractor={(item) => item.idDetecteur}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={EmptyState}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={() => getDetecteurs(true)} />
                    }
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
}

// ---- Styles ------------------------------------------------------------------

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 12,
        paddingTop: 12,
        backgroundColor: '#F5F6F8',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1a1a1a',
    },
    countBadge: {
        backgroundColor: '#EAECEF',
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    countText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#4a4a4a',
    },
    listContent: {
        paddingBottom: 100,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 14,
        padding: 14,
        marginBottom: 12,
        // ombre iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        // élévation Android
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    clientName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1a1a1a',
        flexShrink: 1,
        marginRight: 8,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 3,
        gap: 5,
    },
    badgeDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '600',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    iconSmall: {
        width: 16,
        height: 16,
        marginRight: 6,
    },
    infoText: {
        fontSize: 14,
        color: '#3a3a3a',
        flexShrink: 1,
    },
    timestamp: {
        fontSize: 12,
        color: '#8a8a8a',
        marginTop: 6,
        marginLeft: 22,
    },
    gasSection: {
        marginTop: 16,
    },
    gasHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    gasLabel: {
        fontSize: 13,
        color: '#4a4a4a',
    },
    gasValue: {
        marginLeft: 'auto',
        fontSize: 13,
        fontWeight: '700',
        color: '#1a1a1a',
    },
    progressBar: {
        width: '100%',
    },
    centerContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    errorText: {
        fontSize: 14,
        color: '#e02b2b',
        textAlign: 'center',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 80,
        paddingHorizontal: 24,
    },
    emptyTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#3a3a3a',
        marginBottom: 6,
    },
    emptySubtitle: {
        fontSize: 13,
        color: '#8a8a8a',
        textAlign: 'center',
    },
});