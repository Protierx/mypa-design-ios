import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { colors } from '../styles/colors';

interface HubScreenProps {
  navigation: any;
}

interface CardData {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  screen?: string;
}

const cards: CardData[] = [
  { id: '1', title: 'Plan', subtitle: 'Your daily schedule', icon: '📅', color: '#007AFF', screen: 'Plan' },
  { id: '2', title: 'Tasks', subtitle: '12 pending', icon: '✅', color: '#34C759', screen: 'Tasks' },
  { id: '3', title: 'Challenges', subtitle: '3 active', icon: '🎯', color: '#FF3B30', screen: 'Challenges' },
  { id: '4', title: 'Circles', subtitle: '5 groups', icon: '👥', color: '#5856D6', screen: 'Circles' },
  { id: '5', title: 'Wallet', subtitle: '$250.00', icon: '💰', color: '#FF9500', screen: 'Wallet' },
  { id: '6', title: 'Settings', subtitle: 'Preferences', icon: '⚙️', color: '#8E8E93', screen: 'Settings' },
];

const quickActions = [
  { id: '1', label: 'Add Task', icon: '➕' },
  { id: '2', label: 'Quick Note', icon: '📝' },
  { id: '3', label: 'Set Reminder', icon: '⏰' },
  { id: '4', label: 'Start Focus', icon: '🎧' },
];

export function HubScreen({ navigation }: HubScreenProps) {
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.greeting}>{greeting}!</Text>
          <Text style={styles.title}>Your Hub</Text>
        </View>

        <View style={styles.streakCard}>
          <View style={styles.streakLeft}>
            <Text style={styles.streakIcon}>🔥</Text>
            <View>
              <Text style={styles.streakTitle}>156 Day Streak</Text>
              <Text style={styles.streakSubtitle}>Keep it going!</Text>
            </View>
          </View>
          <View style={styles.streakBadge}>
            <Text style={styles.streakBadgeText}>Level 12</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickActionsScroll}>
          {quickActions.map((action) => (
            <TouchableOpacity key={action.id} style={styles.quickAction}>
              <Text style={styles.quickActionIcon}>{action.icon}</Text>
              <Text style={styles.quickActionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>Dashboard</Text>
        <View style={styles.cardGrid}>
          {cards.map((card) => (
            <TouchableOpacity
              key={card.id}
              style={styles.card}
              onPress={() => card.screen && navigation.navigate(card.screen)}
            >
              <View style={[styles.cardIconContainer, { backgroundColor: card.color + '15' }]}>
                <Text style={styles.cardIcon}>{card.icon}</Text>
              </View>
              <Text style={styles.cardTitle}>{card.title}</Text>
              <Text style={styles.cardSubtitle}>{card.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.todayCard}>
          <Text style={styles.todayTitle}>Today's Focus</Text>
          <View style={styles.todayItem}>
            <View style={styles.todayDot} />
            <Text style={styles.todayText}>Complete morning workout</Text>
            <Text style={styles.todayCheck}>✓</Text>
          </View>
          <View style={styles.todayItem}>
            <View style={[styles.todayDot, { backgroundColor: colors.warning }]} />
            <Text style={styles.todayText}>Team standup at 10:30 AM</Text>
          </View>
          <View style={styles.todayItem}>
            <View style={[styles.todayDot, { backgroundColor: colors.textTertiary }]} />
            <Text style={styles.todayText}>Review project proposal</Text>
          </View>
        </View>

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
  greeting: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  streakCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  streakLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakIcon: {
    fontSize: 40,
    marginRight: 12,
  },
  streakTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  streakSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  streakBadge: {
    backgroundColor: colors.primary + '15',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  streakBadgeText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  quickActionsScroll: {
    marginBottom: 24,
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  quickAction: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginRight: 12,
    minWidth: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  quickActionLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  card: {
    width: '48%',
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  cardIcon: {
    fontSize: 24,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  todayCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  todayTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  todayItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  todayDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
    marginRight: 12,
  },
  todayText: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
  },
  todayCheck: {
    fontSize: 16,
    color: colors.success,
    fontWeight: '600',
  },
});
