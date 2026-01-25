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

interface MenuItem {
  id: string;
  icon: string;
  title: string;
  subtitle?: string;
  screen?: string;
  value?: string;
}

const menuItems: MenuItem[] = [
  { id: '1', icon: '✏️', title: 'Edit Profile', subtitle: 'Update your information' },
  { id: '2', icon: '🔔', title: 'Notifications', subtitle: 'Manage alerts' },
  { id: '3', icon: '🔒', title: 'Privacy Controls', subtitle: 'Manage your data' },
  { id: '4', icon: '📍', title: 'Saved Places', subtitle: '5 locations' },
  { id: '5', icon: '💳', title: 'Payment Methods', subtitle: '2 cards' },
  { id: '6', icon: '⚙️', title: 'Settings', subtitle: 'App preferences' },
  { id: '7', icon: '❓', title: 'Help & Support', subtitle: 'Get assistance' },
];

const achievements = [
  { id: '1', icon: '🔥', title: 'Hot Streak', description: '30 days' },
  { id: '2', icon: '🏃', title: 'Runner', description: '100 km' },
  { id: '3', icon: '🧘', title: 'Zen Master', description: '50 sessions' },
  { id: '4', icon: '🎯', title: 'Goal Getter', description: '25 goals' },
];

export function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>AJ</Text>
              </View>
              <View style={styles.onlineIndicator} />
            </View>
            <Text style={styles.profileName}>Alex Johnson</Text>
            <Text style={styles.profileEmail}>alex.johnson@email.com</Text>
            <Text style={styles.memberSince}>Member since January 2024</Text>
          </View>
        </View>

        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <Text style={styles.statIcon}>🔥</Text>
            </View>
            <Text style={styles.statValue}>156</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <Text style={styles.statIcon}>⭐</Text>
            </View>
            <Text style={styles.statValue}>Level 12</Text>
            <Text style={styles.statLabel}>Current</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <Text style={styles.statIcon}>💰</Text>
            </View>
            <Text style={styles.statValue}>$250</Text>
            <Text style={styles.statLabel}>Wallet</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Achievements</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.achievementsScroll}>
          {achievements.map((achievement) => (
            <View key={achievement.id} style={styles.achievementCard}>
              <Text style={styles.achievementIcon}>{achievement.icon}</Text>
              <Text style={styles.achievementTitle}>{achievement.title}</Text>
              <Text style={styles.achievementDescription}>{achievement.description}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.levelProgress}>
          <View style={styles.levelHeader}>
            <Text style={styles.levelTitle}>Level 12 Progress</Text>
            <Text style={styles.levelXP}>2,450 / 3,000 XP</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '82%' }]} />
          </View>
          <Text style={styles.levelHint}>550 XP to Level 13</Text>
        </View>

        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.menuCard}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.menuItem,
                index < menuItems.length - 1 && styles.menuItemBorder,
              ]}
            >
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                {item.subtitle && <Text style={styles.menuSubtitle}>{item.subtitle}</Text>}
              </View>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.signOutButton}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

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
  },
  header: {
    backgroundColor: colors.primary,
    paddingBottom: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  profileHeader: {
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.primary,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.success,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  memberSince: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: colors.cardBackground,
    marginHorizontal: 20,
    marginTop: -20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: 8,
  },
  statIconContainer: {
    marginBottom: 8,
  },
  statIcon: {
    fontSize: 24,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 12,
  },
  achievementsScroll: {
    paddingLeft: 20,
    marginBottom: 8,
  },
  achievementCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginRight: 12,
    width: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  achievementIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  achievementTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
    textAlign: 'center',
  },
  achievementDescription: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  levelProgress: {
    backgroundColor: colors.cardBackground,
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  levelTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  levelXP: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  levelHint: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  menuCard: {
    backgroundColor: colors.cardBackground,
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  menuSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  menuArrow: {
    fontSize: 24,
    color: colors.textTertiary,
  },
  signOutButton: {
    marginHorizontal: 20,
    marginTop: 24,
    padding: 16,
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.danger,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.danger,
  },
});
