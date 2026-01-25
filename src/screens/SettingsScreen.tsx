import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Switch,
} from 'react-native';
import { colors } from '../styles/colors';

interface SettingItem {
  id: string;
  icon: string;
  title: string;
  type: 'toggle' | 'navigation' | 'value';
  value?: string | boolean;
}

const settingsSections = [
  {
    title: 'Preferences',
    items: [
      { id: '1', icon: '🔔', title: 'Push Notifications', type: 'toggle' as const, value: true },
      { id: '2', icon: '🌙', title: 'Dark Mode', type: 'toggle' as const, value: false },
      { id: '3', icon: '🔊', title: 'Sound Effects', type: 'toggle' as const, value: true },
      { id: '4', icon: '📍', title: 'Location Services', type: 'toggle' as const, value: true },
    ],
  },
  {
    title: 'Account',
    items: [
      { id: '5', icon: '👤', title: 'Personal Information', type: 'navigation' as const },
      { id: '6', icon: '🔒', title: 'Password & Security', type: 'navigation' as const },
      { id: '7', icon: '📧', title: 'Email Preferences', type: 'navigation' as const },
      { id: '8', icon: '🔗', title: 'Connected Accounts', type: 'value' as const, value: '3 connected' },
    ],
  },
  {
    title: 'App Settings',
    items: [
      { id: '9', icon: '🌍', title: 'Language', type: 'value' as const, value: 'English' },
      { id: '10', icon: '📏', title: 'Units', type: 'value' as const, value: 'Metric' },
      { id: '11', icon: '🕐', title: 'Time Format', type: 'value' as const, value: '12-hour' },
      { id: '12', icon: '📅', title: 'Week Start', type: 'value' as const, value: 'Monday' },
    ],
  },
  {
    title: 'Support',
    items: [
      { id: '13', icon: '❓', title: 'Help Center', type: 'navigation' as const },
      { id: '14', icon: '💬', title: 'Contact Support', type: 'navigation' as const },
      { id: '15', icon: '⭐', title: 'Rate App', type: 'navigation' as const },
      { id: '16', icon: '📄', title: 'Terms & Privacy', type: 'navigation' as const },
    ],
  },
];

export function SettingsScreen({ navigation }: any) {
  const [toggles, setToggles] = useState<{ [key: string]: boolean }>({
    '1': true,
    '2': false,
    '3': true,
    '4': true,
  });

  const handleToggle = (id: string) => {
    setToggles((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Settings</Text>
        </View>

        {settingsSections.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionCard}>
              {section.items.map((item, index) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.settingItem,
                    index < section.items.length - 1 && styles.settingItemBorder,
                  ]}
                >
                  <Text style={styles.settingIcon}>{item.icon}</Text>
                  <Text style={styles.settingTitle}>{item.title}</Text>
                  {item.type === 'toggle' && (
                    <Switch
                      value={toggles[item.id]}
                      onValueChange={() => handleToggle(item.id)}
                      trackColor={{ false: colors.border, true: colors.primary + '50' }}
                      thumbColor={toggles[item.id] ? colors.primary : colors.textTertiary}
                    />
                  )}
                  {item.type === 'navigation' && (
                    <Text style={styles.settingArrow}>›</Text>
                  )}
                  {item.type === 'value' && (
                    <View style={styles.valueContainer}>
                      <Text style={styles.settingValue}>{item.value}</Text>
                      <Text style={styles.settingArrow}>›</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.signOutButton}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Version 1.0.0 (Build 156)</Text>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 20,
    marginBottom: 20,
  },
  backButton: {
    fontSize: 16,
    color: colors.primary,
    marginBottom: 8,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  settingItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  settingTitle: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
  },
  settingArrow: {
    fontSize: 24,
    color: colors.textTertiary,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    fontSize: 14,
    color: colors.textSecondary,
    marginRight: 8,
  },
  signOutButton: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.danger,
    marginBottom: 16,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.danger,
  },
  versionText: {
    fontSize: 12,
    color: colors.textTertiary,
    textAlign: 'center',
    marginBottom: 16,
  },
});
