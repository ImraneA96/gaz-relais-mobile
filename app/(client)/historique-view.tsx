// components/ClientHistory.tsx
import { Calendar, CheckCircle, Clock, Package, Truck } from 'lucide-react-native';
import { FlatList, StyleSheet, Text, View } from 'react-native';

interface Order {
  id: string;
  date: string;
  quantity: number;
  status: 'delivered' | 'in_delivery' | 'pending';
  total: number;
  deliveryType: string;
  deliveredAt?: string;
}

const orders: Order[] = [
  {
    id: 'CMD-1024',
    date: '2026-05-26',
    quantity: 2,
    status: 'in_delivery',
    total: 70,
    deliveryType: 'Standard',
  },
  {
    id: 'CMD-0987',
    date: '2026-05-15',
    quantity: 1,
    status: 'delivered',
    total: 35,
    deliveryType: 'Standard',
    deliveredAt: '2026-05-16 14:30',
  },
  {
    id: 'CMD-0856',
    date: '2026-05-01',
    quantity: 2,
    status: 'delivered',
    total: 80,
    deliveryType: 'Express',
    deliveredAt: '2026-05-01 18:45',
  },
  {
    id: 'CMD-0723',
    date: '2026-04-18',
    quantity: 1,
    status: 'delivered',
    total: 35,
    deliveryType: 'Standard',
    deliveredAt: '2026-04-19 10:15',
  },
];

function StatusBadge({ status }: { status: Order['status'] }) {
  switch (status) {
    case 'delivered':
      return (
        <View style={[styles.badge, styles.badgeGreen]}>
          <CheckCircle size={12} color="#166534" />
          <Text style={[styles.badgeText, { color: '#166534' }]}>Livrée</Text>
        </View>
      );
    case 'in_delivery':
      return (
        <View style={[styles.badge, styles.badgeBlue]}>
          <Truck size={12} color="#1e40af" />
          <Text style={[styles.badgeText, { color: '#1e40af' }]}>En livraison</Text>
        </View>
      );
    case 'pending':
      return (
        <View style={[styles.badge, styles.badgeAmber]}>
          <Clock size={12} color="#92400e" />
          <Text style={[styles.badgeText, { color: '#92400e' }]}>En attente</Text>
        </View>
      );
    default:
      return null;
  }
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function OrderCard({ order }: { order: Order }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <View style={styles.idRow}>
            <Text style={styles.orderId}>#{order.id}</Text>
            <StatusBadge status={order.status} />
          </View>
          <View style={styles.dateRow}>
            <Calendar size={12} color="#6b7280" />
            <Text style={styles.dateText}>{formatDate(order.date)}</Text>
          </View>
        </View>
        <Text style={styles.totalText}>{order.total}€</Text>
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <View style={styles.detailLeft}>
            <Package size={16} color="#4b5563" />
            <Text style={styles.detailLabel}>Quantité</Text>
          </View>
          <Text style={styles.detailValue}>
            {order.quantity} bouteille{order.quantity > 1 ? 's' : ''}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Livraison</Text>
          <Text style={styles.detailValue}>{order.deliveryType}</Text>
        </View>

        {order.deliveredAt && (
          <View style={styles.deliveredRow}>
            <Text style={styles.detailLabel}>Livrée le</Text>
            <Text style={styles.detailValue}>{order.deliveredAt}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

export default function HistoriqueView() {
  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      data={orders}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <View style={styles.headerBlock}>
          <Text style={styles.headerTitle}>Historique</Text>
          <Text style={styles.headerSubtitle}>Vos commandes passées</Text>
        </View>
      }
      renderItem={({ item }) => <OrderCard order={item} />}
      ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  headerBlock: {
    marginBottom: 16,
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
    padding: 16,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  idRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  orderId: {
    fontSize: 13,
    color: '#4b5563',
    fontFamily: 'monospace',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 13,
    color: '#6b7280',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  details: {
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  detailLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#4b5563',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  deliveredRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  badgeGreen: {
    backgroundColor: '#dcfce7',
    borderColor: '#bbf7d0',
  },
  badgeBlue: {
    backgroundColor: '#dbeafe',
    borderColor: '#bfdbfe',
  },
  badgeAmber: {
    backgroundColor: '#fef3c7',
    borderColor: '#fde68a',
  },
});