// components/ClientOrder.tsx
import { COLORTHEME } from '@/.expo/utils';
import { Clock, Info, MapPin, Package } from 'lucide-react-native';
import { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ClientOrderProps {
  address: string;
  zone: string;
  gasLevel: number;
  hasActiveOrder: boolean;
}

export default function CommandeView({ address, zone, gasLevel, hasActiveOrder }: ClientOrderProps) {
  const [quantity, setQuantity] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [deliveryType, setDeliveryType] = useState<'standard' | 'express'>('standard');

  const pricePerBottle = 35;
  const expressPrice = 10;
  const totalPrice = quantity * pricePerBottle + (deliveryType === 'express' ? expressPrice : 0);

  const handleOrderConfirm = () => {
    // remplace par ton toast (react-native-toast-message) si tu en ajoutes un
    setShowConfirmation(false);
    setQuantity(1);
    setDeliveryType('standard');
  };

  return (
    <ScrollView >
      <View style={styles.container}>
        <View style={styles.headerBlock}>
          <Text style={styles.headerTitle}>Nouvelle commande</Text>
          <Text style={styles.headerSubtitle}>Commandez vos bouteilles de gaz</Text>
        </View>

        {hasActiveOrder && (
          <View style={styles.infoBoxBlue}>
            <Info size={20} color="#2563eb" style={{ marginTop: 2 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.infoTitleBlue}>Commande en cours</Text>
              <Text style={styles.infoTextBlue}>
                Vous avez déjà une commande en cours de livraison.
              </Text>
            </View>
          </View>
        )}

        {gasLevel > 30 && !hasActiveOrder && (
          <View style={styles.infoBoxGreen}>
            <Info size={20} color="#16a34a" style={{ marginTop: 2 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.infoTitleGreen}>Niveau suffisant</Text>
              <Text style={styles.infoTextGreen}>
                Votre niveau de gaz est encore suffisant ({gasLevel}%). Une commande sera
                automatiquement déclenchée si nécessaire.
              </Text>
            </View>
          </View>
        )}

        <View style={styles.card}>
          <View style={styles.addressRow}>
            <MapPin size={20} color="#6b7280" style={{ marginTop: 2 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.cardLabel}>Adresse de livraison</Text>
              <Text style={styles.addressText}>{address}</Text>
              <Text style={styles.zoneText}>Zone {zone}</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Quantité</Text>
          <View style={styles.quantityRow}>
            <TouchableOpacity
              style={[styles.qtyButton, hasActiveOrder && styles.disabled]}
              onPress={() => !hasActiveOrder && setQuantity(Math.max(1, quantity - 1))}
              disabled={hasActiveOrder}
            >
              <Text style={styles.qtyButtonText}>-</Text>
            </TouchableOpacity>

            <View style={styles.qtyDisplay}>
              <Text style={styles.qtyValue}>{quantity}</Text>
              <Text style={styles.qtyUnit}>bouteille{quantity > 1 ? 's' : ''}</Text>
            </View>

            <TouchableOpacity
              style={[styles.qtyButton, hasActiveOrder && styles.disabled]}
              onPress={() => !hasActiveOrder && setQuantity(Math.min(5, quantity + 1))}
              disabled={hasActiveOrder}
            >
              <Text style={styles.qtyButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Mode de livraison</Text>
          <View style={{ gap: 12 }}>
            <TouchableOpacity
              onPress={() => !hasActiveOrder && setDeliveryType('standard')}
              disabled={hasActiveOrder}
              style={[
                styles.deliveryOption,
                deliveryType === 'standard' && styles.deliveryOptionActive,
                hasActiveOrder && styles.disabled,
              ]}
            >
              <View style={styles.deliveryLeft}>
                <Clock size={20} color="#4b5563" style={{ marginTop: 2 }} />
                <View>
                  <Text style={styles.deliveryTitle}>Standard</Text>
                  <Text style={styles.deliverySubtitle}>Livraison sous 24-48h</Text>
                </View>
              </View>
              <View style={styles.badgeGreen}>
                <Text style={styles.badgeGreenText}>Gratuit</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => !hasActiveOrder && setDeliveryType('express')}
              disabled={hasActiveOrder}
              style={[
                styles.deliveryOption,
                deliveryType === 'express' && styles.deliveryOptionActive,
                hasActiveOrder && styles.disabled,
              ]}
            >
              <View style={styles.deliveryLeft}>
                <Package size={20} color="#4b5563" style={{ marginTop: 2 }} />
                <View>
                  <Text style={styles.deliveryTitle}>Express</Text>
                  <Text style={styles.deliverySubtitle}>Livraison sous 4h</Text>
                </View>
              </View>
              <View style={styles.badgeBlue}>
                <Text style={styles.badgeBlueText}>+{expressPrice}€</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.card, styles.summaryCard]}>
          <View style={{ gap: 8 }}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                Sous-total ({quantity} bouteille{quantity > 1 ? 's' : ''})
              </Text>
              <Text style={styles.summaryValue}>{quantity * pricePerBottle}€</Text>
            </View>
            {deliveryType === 'express' && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Livraison express</Text>
                <Text style={styles.summaryValue}>{expressPrice}€</Text>
              </View>
            )}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{totalPrice}€</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, hasActiveOrder && styles.disabled]}
          onPress={() => !hasActiveOrder && setShowConfirmation(true)}
          disabled={hasActiveOrder}
        >
          <Text style={styles.submitButtonText}>Passer la commande</Text>
        </TouchableOpacity>

        {/* Modal de confirmation (équivalent AlertDialog) */}
        <Modal
          visible={showConfirmation}
          transparent
          animationType="fade"
          onRequestClose={() => setShowConfirmation(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Confirmer la commande</Text>

              <View style={styles.modalSummaryBox}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Quantité</Text>
                  <Text style={styles.modalSummaryValue}>
                    {quantity} bouteille{quantity > 1 ? 's' : ''}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Livraison</Text>
                  <Text style={styles.modalSummaryValue}>
                    {deliveryType === 'standard' ? 'Standard (24-48h)' : 'Express (4h)'}
                  </Text>
                </View>
                <View style={styles.modalTotalRow}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.totalValue}>{totalPrice}€</Text>
                </View>
              </View>

              <Text style={styles.modalNote}>
                Vous recevrez un SMS avec l'heure de livraison estimée.
              </Text>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={() => setShowConfirmation(false)}
                >
                  <Text style={styles.modalCancelText}>Annuler</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalConfirmButton} onPress={handleOrderConfirm}>
                  <Text style={styles.modalConfirmText}>Confirmer</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
    
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 16 },
  headerBlock: { marginBottom: 8 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#111827' },
  headerSubtitle: { fontSize: 14, color: '#6b7280', marginTop: 4 },

  infoBoxBlue: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 8,
  },
  infoTitleBlue: { fontWeight: '600', color: '#1e3a8a' },
  infoTextBlue: { fontSize: 14, color: '#1d4ed8', marginTop: 4 },

  infoBoxGreen: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    borderRadius: 8,
  },
  infoTitleGreen: { fontWeight: '600', color: '#14532d' },
  infoTextGreen: { fontSize: 14, color: '#15803d', marginTop: 4 },

  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  cardTitle: { fontWeight: '600', color: '#111827', marginBottom: 16, fontSize: 16 },
  cardLabel: { fontWeight: '500', color: '#111827' },

  addressRow: { flexDirection: 'row', gap: 12 },
  addressText: { fontSize: 14, color: '#4b5563', marginTop: 4 },
  zoneText: { fontSize: 12, color: '#6b7280', marginTop: 4 },

  quantityRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  qtyButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyButtonText: { fontSize: 20, color: '#111827' },
  qtyDisplay: { flex: 1, alignItems: 'center' },
  qtyValue: { fontSize: 30, fontWeight: 'bold', color: '#111827' },
  qtyUnit: { fontSize: 13, color: '#6b7280', marginTop: 2 },

  deliveryOption: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  deliveryOptionActive: {
    borderColor: '#3b82f6',
    backgroundColor: '#eff6ff',
  },
  deliveryLeft: { flexDirection: 'row', gap: 12, flexShrink: 1 },
  deliveryTitle: { fontWeight: '500', color: '#111827' },
  deliverySubtitle: { fontSize: 13, color: '#4b5563', marginTop: 2 },

  badgeGreen: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  badgeGreenText: { color: '#15803d', fontSize: 12, fontWeight: '600' },
  badgeBlue: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  badgeBlueText: { color: '#1d4ed8', fontSize: 12, fontWeight: '600' },

  summaryCard: { backgroundColor: '#f9fafb' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryLabel: { fontSize: 14, color: '#4b5563' },
  summaryValue: { fontSize: 14, color: '#111827' },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  totalLabel: { fontWeight: '600', color: '#111827', fontSize: 16 },
  totalValue: { fontSize: 24, fontWeight: 'bold', color: COLORTHEME },

  submitButton: {
    backgroundColor: COLORTHEME,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  disabled: { opacity: 0.5 },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 12 },
  modalSummaryBox: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  modalSummaryValue: { fontSize: 14, fontWeight: '500', color: '#111827' },
  modalTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  modalNote: { fontSize: 13, color: '#4b5563', marginTop: 12 },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
  },
  modalCancelText: { color: '#374151', fontWeight: '500' },
  modalConfirmButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#2563eb',
    alignItems: 'center',
  },
  modalConfirmText: { color: '#fff', fontWeight: '600' },
});