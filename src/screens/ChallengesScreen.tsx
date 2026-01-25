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

interface Challenge {
  id: string;
  title: string;
  description: string;
  progress: number;
  reward: string;
  deadline: string;
  icon: string;
  color: string;
  participants: number;
}

const activeChallenges: Challenge[] = [
  { id: '1', title: '10K Steps Daily', description: 'Walk 10,000 steps every day for a week', progress: 71, reward: '$15', deadline: '3 days left', icon: '🚶', color: '#007AFF', participants: 234 },
  { id: '2', title: 'Morning Meditation', description: 'Meditate for 10 minutes each morning', progress: 40, reward: '$10', deadline: '5 days left', icon: '🧘', color: '#5856D6', participants: 156 },
  { id: '3', title: 'Hydration Hero', description: 'Drink 8 glasses of water daily', progress: 85, reward: '$8', deadline: '2 days left', icon: '💧', color: '#34C759', participants: 312 },
];

const availableChallenges: Challenge[] = [
  { id: '4', title: 'Early Riser', description: 'Wake up before 6 AM for 5 days', progress: 0, reward: '$20', deadline: 'Starts Monday', icon: '🌅', color: '#FF9500', participants: 89 },
  { id: '5', title: 'Book Club', description: 'Read for 30 minutes daily', progress: 0, reward: '$12', deadline: 'Starts Monday', icon: '📚', color: '#FF2D55', participants: 67 },
  { id: '6', title: 'Fitness Friday', description: 'Complete a workout every Friday', progress: 0, reward: '$25', deadline: '4 weeks', icon: '💪', color: '#FF3B30', participants: 198 },
];

export function ChallengesScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Challenges</Text>
        </View>

        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>$142</Text>
            <Text style={styles.statLabel}>Earned</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Active Challenges</Text>
        {activeChallenges.map((challenge) => (
          <TouchableOpacity key={challenge.id} style={styles.challengeCard}>
            <View style={styles.challengeHeader}>
              <View style={[styles.challengeIcon, { backgroundColor: challenge.color + '20' }]}>
                <Text style={styles.challengeIconText}>{challenge.icon}</Text>
              </View>
              <View style={styles.challengeInfo}>
                <Text style={styles.challengeTitle}>{challenge.title}</Text>
                <Text style={styles.challengeDescription}>{challenge.description}</Text>
              </View>
              <View style={styles.rewardBadge}>
                <Text style={styles.rewardText}>{challenge.reward}</Text>
              </View>
            </View>
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${challenge.progress}%`, backgroundColor: challenge.color }]} />
              </View>
              <Text style={styles.progressText}>{challenge.progress}%</Text>
            </View>
            <View style={styles.challengeFooter}>
              <Text style={styles.participantsText}>👥 {challenge.participants} participants</Text>
              <Text style={styles.deadlineText}>{challenge.deadline}</Text>
            </View>
          </TouchableOpacity>
        ))}

        <Text style={styles.sectionTitle}>Available Challenges</Text>
        {availableChallenges.map((challenge) => (
          <TouchableOpacity key={challenge.id} style={styles.challengeCard}>
            <View style={styles.challengeHeader}>
              <View style={[styles.challengeIcon, { backgroundColor: challenge.color + '20' }]}>
                <Text style={styles.challengeIconText}>{challenge.icon}</Text>
              </View>
              <View style={styles.challengeInfo}>
                <Text style={styles.challengeTitle}>{challenge.title}</Text>
                <Text style={styles.challengeDescription}>{challenge.description}</Text>
              </View>
              <View style={styles.rewardBadge}>
                <Text style={styles.rewardText}>{challenge.reward}</Text>
              </View>
            </View>
            <View style={styles.challengeFooter}>
              <Text style={styles.participantsText}>👥 {challenge.participants} joined</Text>
              <TouchableOpacity style={[styles.joinButton, { backgroundColor: challenge.color }]}>
                <Text style={styles.joinButtonText}>Join</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
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
  statsCard: {
    flexDirection: 'row',
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
  },
  statValue: {
    fontSize: 24,
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
    marginBottom: 16,
  },
  challengeCard: {
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
  challengeHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  challengeIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  challengeIconText: {
    fontSize: 24,
  },
  challengeInfo: {
    flex: 1,
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  challengeDescription: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  rewardBadge: {
    backgroundColor: colors.success + '20',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  rewardText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.success,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    width: 40,
    textAlign: 'right',
  },
  challengeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  participantsText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  deadlineText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '500',
  },
  joinButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  joinButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
});
