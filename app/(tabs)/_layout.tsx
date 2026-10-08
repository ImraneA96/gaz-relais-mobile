import { COLORTHEME } from '@/.expo/utils';
import { NativeTabs } from 'expo-router/unstable-native-tabs';

export default function TabsLayout() {
  return (
    <NativeTabs
      backgroundColor={COLORTHEME}
      tintColor="#FFF"
      labelStyle={{ fontSize: 11, fontWeight: '500' }}
    >
      <NativeTabs.Trigger name="dashboard-view">
        <NativeTabs.Trigger.Label>Tableau de bord</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="chart.bar.fill" md="dashboard" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="detecteur-view">
        <NativeTabs.Trigger.Label>Détecteurs</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="sensor.fill" md="sensors" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="commande-view">
        <NativeTabs.Trigger.Label>Commandes</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="cube.box.fill" md="inventory_2" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="livreur-view">
        <NativeTabs.Trigger.Label>Livreurs</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="bicycle" md="delivery_dining" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}