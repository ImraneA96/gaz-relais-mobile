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

type StatutCommande = 'ASSIGNEE' | 'EN_ATTENTE' | 'LIVREE' | 'ANNULEE';

interface Adresse {
    rue: string;
    quartier: string;
}

interface Commande {
    idCommande: string;
    clientNom: string;
    clientPrenom: string;
    clientAdresse: Adresse;
    statut: StatutCommande;
    Commande: number;
    livreurNom?: string;
    livreurPrenom?: string;
    dateDeclenchement: string;
    dateLivraisonSouhaitee: string;
}

// ---- Palette centralisée ----------------------------------------------------

const STATUT_STYLES: Record<StatutCommande, { border: string; background: string; label: string }> = {
    ASSIGNEE:   { border: '#1bcc30', background: '#e3f7e5', label: 'Assignée' },
    LIVREE:     { border: '#1bcc30', background: '#e3f7e5', label: 'Livrée' },
    EN_ATTENTE: { border: '#FFA500', background: '#fdf1de', label: 'En attente' },
    ANNULEE:    { border: '#e02b2b', background: '#fbe0e0', label: 'Annulée' },
};

function getStatutStyle(statut: StatutCommande) {
    return STATUT_STYLES[statut] ?? STATUT_STYLES.ANNULEE;
}

function formatDate(dateIso?: string) {
    if (!dateIso) return '—';
    const date = new Date(dateIso);
    if (isNaN(date.getTime())) return dateIso; // déjà formaté côté API
    return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
}

// ---- Sous-composants --------------------------------------------------------

function StatutLivraison({ statut }: { statut: StatutCommande }) {
    const style = getStatutStyle(statut);
    return (
        <View style={[styles.badge, { borderColor: style.border, backgroundColor: style.background }]}>
            <View style={[styles.badgeDot, { backgroundColor: style.border }]} />
            <MyText style={[styles.badgeText, { color: style.border }]}>{style.label}</MyText>
        </View>
    );
}

interface CommandeProps {
    source?: ImageSourcePropType;
    qte?: number;
    label?: string;
    info?: string;
    unite?: string;
    isLast?: boolean;
}

function Commande({ source, qte, info, label = 'Quantité', unite, isLast = false }: CommandeProps) {
    const valeur = qte !== undefined ? qte : info;
    return (
        <View style={[styles.row, !isLast && styles.rowSeparator]}>
            {source && <Image source={source} style={styles.icon} />}
            <MyText style={styles.rowLabel}>{label}</MyText>
            <MyText style={styles.rowValue}>
                {valeur ?? '—'} {unite ?? ''}
            </MyText>
        </View>
    );
}

function CommandeCard({ item }: { item: Commande }) {
    return (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <MyText style={styles.clientName}>
                    {item.clientNom} {item.clientPrenom}
                </MyText>
                <StatutLivraison statut={item.statut} />
            </View>

            <View style={styles.infoRow}>
                <Image source={require('@/assets/images/icons/location.svg')} style={styles.iconSmall} />
                <MyText style={styles.infoText}>
                    {item.clientAdresse?.rue}, {item.clientAdresse?.quartier}
                </MyText>
            </View>

            <View style={styles.detailsSection}>
                <Commande
                    source={require('@/assets/images/icons/cube.svg')}
                    qte={item.Commande}
                    label="Quantité"
                    unite="bouteilles"
                />
                <Commande
                    source={require('@/assets/images/icons/person.svg')}
                    label="Livreur"
                    info={item.livreurNom ? `${item.livreurNom} ${item.livreurPrenom ?? ''}` : 'Non assigné'}
                />
                <Commande
                    source={require('@/assets/images/icons/schedule.svg')}
                    label="Commandée"
                    info={formatDate(item.dateDeclenchement)}
                />
                <Commande
                    label="Attendue"
                    info={formatDate(item.dateLivraisonSouhaitee)}
                    isLast
                />
            </View>
        </View>
    );
}

function EmptyState() {
    return (
        <View style={styles.emptyContainer}>
            <MyText style={styles.emptyTitle}>Aucune commande</MyText>
            <MyText style={styles.emptySubtitle}>
                Les nouvelles commandes apparaîtront ici dès leur création.
            </MyText>
        </View>
    );
}

// ---- Écran principal ---------------------------------------------------------

export default function CommandeView() {
    const [commandes, setCommandes] = useState<Commande[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getCommandes = useCallback(async (isRefresh = false) => {
        isRefresh ? setRefreshing(true) : setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${url_api}/commandes`);
            if (!response.ok) throw new Error(`Erreur ${response.status}`);
            const data = await response.json();
            setCommandes(data);
        } catch (err) {
            console.log(err);
            setError("Impossible de charger les commandes.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        getCommandes();
    }, [getCommandes]);

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <MyText style={styles.headerTitle}>Commandes</MyText>
                <View style={styles.countBadge}>
                    <MyText style={styles.countText}>{commandes.length} commandes</MyText>
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
                    data={commandes}
                    renderItem={({ item }) => <CommandeCard item={item} />}
                    keyExtractor={(item) => item.idCommande}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={EmptyState}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={() => getCommandes(true)} />
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
        flexShrink: 1,
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
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#EFEFEF',
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