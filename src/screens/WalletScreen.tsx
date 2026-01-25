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

interface Transaction {
  id: string;
  type: 'earned' | 'spent' | 'received';
  title: string;
  description: string;
  amount: string;
  date: string;
  icon: string;
}

const transactions: Transaction[] = [
  { id: '1', type: 'earned', title: 'Challenge Completed', description: '7-day streak bonus', amount: '+$15.00', date: 'Today', icon: '🏆' },
  { id: '2', type: 'spent', title: 'Premium Feature', description: 'Advanced analytics', amount: '-$4.99', date: 'Yesterday', icon: '📊' },
  { id: '3', type: 'received', title: 'Friend Referral', description: 'Sarah joined via your link', amount: '+$10.00', date: 'Jan 21', icon: '🎁' },
  { id: '4', type: 'earned', title: 'Daily Goal', description: 'Completed all tasks', amount: '+$2.00', date: 'Jan 20', icon: '✅' },
  { id: '5', type: 'earned', title: 'Workout Bonus', description: '30 min cardio session', amount: '+$3.00', date: 'Jan 19', icon: '💪' },
  { id: '6', type: 'spent', title: 'Reward Redemption', description: 'Coffee voucher', amount: '-$5.00', date: 'Jan 18', icon: '☕' },
];

export function WalletScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Wallet</Text>
        </View>

        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceAmount}>$250.00</Text>
          <View style={styles.balanceActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>↑</Text>
              <Text style={styles.actionText}>Send</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>↓</Text>
              <Text style={styles.actionText}>Receive</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>🎁</Text>
              <Text style={styles.actionText}>Redeem</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>$127.00</Text>
            <Text style={styles.statLabel}>Earned this month</Text>
            <Text style={styles.statTrend}>↑ 23% vs last month</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>$14.99</Text>
            <Text style={styles.statLabel}>Spent this month</Text>
            <Text style={[styles.statTrend, { color: colors.success }]}>↓ 12% vs last month</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        {transactions.map((transaction) => (
          <View key={transaction.id} style={styles.transactionItem}>
            <View style={styles.transactionIcon}>
              <Text style={styles.transactionIconText}>{transaction.icon}</Text>
            </View>
            <View style={styles.transactionContent}>
              <Text style={styles.transactionTitle}>{transaction.title}</Text>
              <Text style={styles.transactionDescription}>{transaction.description}</Text>
            </View>
            <View style={styles.transactionRight}>
              <Text style={[
                styles.transactionAmount,
                transaction.type === 'spent' ? styles.amountSpent : styles.amountEarned
              ]}>
                {transaction.amount}
              </Text>
              <Text style={styles.transactionDate}>{transaction.date}</Text>
            </View>
          </View>
        ))}

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
  balanceCard: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
  },
  balanceLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 48,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 24,
  },
  balanceActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  actionIcon: {
    fontSize: 20,
    color: colors.white,
    marginBottom: 4,
  },
  actionText: {
    fontSize: 12,
    color: colors.white,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  statTrend: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '500',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  seeAll: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  transactionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionIconText: {
    fontSize: 20,
  },
  transactionContent: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  transactionDescription: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  amountEarned: {
    color: colors.success,
  },
  amountSpent: {
    color: colors.danger,
  },
  transactionDate: {
    fontSize: 12,
    color: colors.textTertiary,
  },
});
