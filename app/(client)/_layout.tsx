import { COLORTHEME } from '@/.expo/utils';
import { NativeTabs } from 'expo-router/unstable-native-tabs';

export default function TabsLayout() {
  return (
    <NativeTabs backgroundColor={COLORTHEME}>
      <NativeTabs.Trigger name="home-view">
        <NativeTabs.Trigger.Label>Accueil</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="house.fill" md="home" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="commande-view">
        <NativeTabs.Trigger.Label>Commande</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="cart.fill" md="shopping_cart" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="historique-view">
        <NativeTabs.Trigger.Label>Historique</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="clock.fill" md="history" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="profile-view">
        <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="person.fill" md="person" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}