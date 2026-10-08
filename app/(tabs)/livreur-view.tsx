import { Image } from "expo-image";
import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    ImageSourcePropType,
    RefreshControl,
    StyleSheet,
    View,
} from "react-native";
import { url_api } from "../../.expo/utils";
import MyText from "../components/MyText";

// ---- Types ----------------------------------------------------------------

interface CommandeEnCours {
    reference: string;
    positionActuelle?: string;
}

interface Livreur {
    idLivreur: string;
    nom: string;
    prenom: string;
    telephone: string;
    vehicule: string;
    disponible: boolean;
    zoneCouverture: string;
    positionActuelle?: string;
    commandeEnCours?: CommandeEnCours;
}

// ---- Sous-composants --------------------------------------------------------

function StatutLivreur({ isDisponible }: { isDisponible: boolean }) {
    const style = isDisponible
        ? { border: '#1bcc30', background: '#e3f7e5', label: 'Disponible' }
        : { border: '#FFA500', background: '#fdf1de', label: 'En livraison' };

    return (
        <View style={[styles.badge, { borderColor: style.border, backgroundColor: style.background }]}>
            <View style={[styles.badgeDot, { backgroundColor: style.border }]} />
            <MyText style={[styles.badgeText, { color: style.border }]}>{style.label}</MyText>
        </View>
    );
}

interface LivreurProps {
    source?: ImageSourcePropType;
    label?: string;
    info?: string;
    unite?: string;
    isFirst?: boolean;
}

function Livreur({ source, info, label = 'Quantité', unite, isFirst = false }: LivreurProps) {
    return (
        <View style={[styles.row, !isFirst && styles.rowSeparator]}>
            {source && <Image source={source} style={styles.icon} />}
            <MyText style={styles.rowLabel}>{label}</MyText>
            <MyText style={styles.rowValue}>
                {info ?? '—'} {unite ?? ''}
            </MyText>
        </View>
    );
}

function LivreurCard({ item }: { item: Livreur }) {
    return (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <MyText style={styles.clientName}>
                    {item.nom} {item.prenom}
                </MyText>
                <StatutLivreur isDisponible={item.disponible} />
            </View>

            <View style={styles.infoRow}>
                <Image source={require('@/assets/images/icons/call.svg')} style={styles.iconSmall} />
                <MyText style={styles.infoText}>{item.telephone}</MyText>
            </View>

            <View style={styles.detailsSection}>
                <Livreur
                    source={require('@/assets/images/icons/livreur.svg')}
                    label="Véhicule"
                    info={item.vehicule}
                    isFirst
                />
                <Livreur
                    source={require('@/assets/images/icons/person.svg')}
                    label="Zone"
                    info={item.zoneCouverture}
                />
                <Livreur
                    source={require('@/assets/images/icons/location.svg')}
                    label="Position actuelle"
                    info={item.positionActuelle}
                />
                {!item.disponible && (
                    <>
                        <Livreur label="Commande en cours" info={item.commandeEnCours?.reference} />
                    </>
                )}
            </View>
        </View>
    );
}

function EmptyState() {
    return (
        <View style={styles.emptyContainer}>
            <MyText style={styles.emptyTitle}>Aucun livreur</MyText>
            <MyText style={styles.emptySubtitle}>
                Les livreurs actifs apparaîtront ici dès qu'ils seront enregistrés.
            </MyText>
        </View>
    );
}

// ---- Écran principal ---------------------------------------------------------

export default function LivreurView() {
    const [livreurs, setLivreurs] = useState<Livreur[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getLivreurs = useCallback(async (isRefresh = false) => {
        isRefresh ? setRefreshing(true) : setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${url_api}/livreurs`);
            if (!response.ok) throw new Error(`Erreur ${response.status}`);
            const data = await response.json();
            setLivreurs(data);
        } catch (err) {
            console.log(err);
            setError("Impossible de charger les livreurs.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        getLivreurs();
    }, [getLivreurs]);

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <MyText style={styles.headerTitle}>Livreurs</MyText>
                <View style={styles.countBadge}>
                    <MyText style={styles.countText}>{livreurs.length} livreurs</MyText>
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
                    data={livreurs}
                    renderItem={({ item }) => <LivreurCard item={item} />}
                    keyExtractor={(item) => item.idLivreur}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={EmptyState}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={() => getLivreurs(true)} />
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
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
        marginBottom: 12,
    },
    iconSmall: {
        width: 16,
        height: 16,
        marginRight: 6,
    },
    infoText: {
        fontSize: 14,
        color: '#3a3a3a',
    },
    detailsSection: {
        borderTopWidth: 1,
        borderTopColor: '#EFEFEF',
        paddingTop: 4,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
        paddingVertical: 8,
    },
    rowSeparator: {
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#EFEFEF',
    },
    icon: {
        width: 16,
        height: 16,
        marginRight: 3,
        tintColor: '#666666',
    },
    rowLabel: {
        fontSize: 14,
        color: '#666666',
    },
    rowValue: {
        flex: 1,
        textAlign: 'right',
        marginEnd: 4,
        fontWeight: '600',
        fontSize: 14,
        color: '#1a1a1a',
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