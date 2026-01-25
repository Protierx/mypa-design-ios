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

interface Circle {
  id: string;
  name: string;
  description: string;
  members: number;
  activity: string;
  icon: string;
  color: string;
  lastActive: string;
}

const myCircles: Circle[] = [
  { id: '1', name: 'Morning Runners', description: 'Early morning running group', members: 28, activity: 'Very Active', icon: '🏃', color: '#FF3B30', lastActive: '5 min ago' },
  { id: '2', name: 'Wellness Warriors', description: 'Mental health & self-care', members: 45, activity: 'Active', icon: '🧘', color: '#5856D6', lastActive: '1 hour ago' },
  { id: '3', name: 'Tech Team', description: 'Work colleagues & friends', members: 12, activity: 'Moderate', icon: '💻', color: '#007AFF', lastActive: '2 hours ago' },
  { id: '4', name: 'Family Circle', description: 'Close family members', members: 8, activity: 'Active', icon: '👨‍👩‍👧‍👦', color: '#FF2D55', lastActive: '30 min ago' },
  { id: '5', name: 'Book Club', description: 'Monthly book discussions', members: 15, activity: 'Moderate', icon: '📚', color: '#FF9500', lastActive: '1 day ago' },
];

const suggestedCircles: Circle[] = [
  { id: '6', name: 'Healthy Eaters', description: 'Share recipes & meal prep tips', members: 156, activity: 'Very Active', icon: '🥗', color: '#34C759', lastActive: '' },
  { id: '7', name: 'Meditation Masters', description: 'Daily mindfulness practice', members: 89, activity: 'Active', icon: '🧠', color: '#5856D6', lastActive: '' },
];

export function CirclesScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Circles</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>👥</Text>
            <Text style={styles.statValue}>5</Text>
            <Text style={styles.statLabel}>My Circles</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>🤝</Text>
            <Text style={styles.statValue}>108</Text>
            <Text style={styles.statLabel}>Connections</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>💬</Text>
            <Text style={styles.statValue}>23</Text>
            <Text style={styles.statLabel}>New Posts</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.createButton}>
          <Text style={styles.createButtonIcon}>+</Text>
          <Text style={styles.createButtonText}>Create New Circle</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>My Circles</Text>
        {myCircles.map((circle) => (
          <TouchableOpacity key={circle.id} style={styles.circleCard}>
            <View style={[styles.circleIcon, { backgroundColor: circle.color + '20' }]}>
              <Text style={styles.circleIconText}>{circle.icon}</Text>
            </View>
            <View style={styles.circleInfo}>
              <Text style={styles.circleName}>{circle.name}</Text>
              <Text style={styles.circleDescription}>{circle.description}</Text>
              <View style={styles.circleMeta}>
                <Text style={styles.circleMembers}>{circle.members} members</Text>
                <View style={[styles.activityBadge, { backgroundColor: circle.activity === 'Very Active' ? colors.success + '20' : colors.primary + '20' }]}>
                  <Text style={[styles.activityText, { color: circle.activity === 'Very Active' ? colors.success : colors.primary }]}>{circle.activity}</Text>
                </View>
              </View>
            </View>
            <Text style={styles.lastActive}>{circle.lastActive}</Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.sectionTitle}>Suggested for You</Text>
        {suggestedCircles.map((circle) => (
          <TouchableOpacity key={circle.id} style={styles.circleCard}>
            <View style={[styles.circleIcon, { backgroundColor: circle.color + '20' }]}>
              <Text style={styles.circleIconText}>{circle.icon}</Text>
            </View>
            <View style={styles.circleInfo}>
              <Text style={styles.circleName}>{circle.name}</Text>
              <Text style={styles.circleDescription}>{circle.description}</Text>
              <Text style={styles.circleMembers}>{circle.members} members</Text>
            </View>
            <TouchableOpacity style={[styles.joinButton, { backgroundColor: circle.color }]}>
              <Text style={styles.joinButtonText}>Join</Text>
            </TouchableOpacity>
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
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  createButtonIcon: {
    fontSize: 20,
    color: colors.white,
    marginRight: 8,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  circleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  circleIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  circleIconText: {
    fontSize: 28,
  },
  circleInfo: {
    flex: 1,
  },
  circleName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  circleDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  circleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  circleMembers: {
    fontSize: 12,
    color: colors.textTertiary,
  },
  activityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  activityText: {
    fontSize: 11,
    fontWeight: '500',
  },
  lastActive: {
    fontSize: 11,
    color: colors.textTertiary,
  },
  joinButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  joinButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
});
