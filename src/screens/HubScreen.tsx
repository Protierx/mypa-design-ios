import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Animated,
} from 'react-native';
import { colors } from '../styles/colors';

interface HubScreenProps {
  navigation: any;
}

interface Task {
  id: number;
  title: string;
  time: string;
  icon: string;
  category: 'Work' | 'Health' | 'Personal';
  duration: string;
  priority: boolean;
}

const categoryStyles = {
  Work: { bg: '#3B82F6', light: '#EFF6FF', text: '#2563EB', border: '#BFDBFE' },
  Health: { bg: '#10B981', light: '#ECFDF5', text: '#059669', border: '#A7F3D0' },
  Personal: { bg: '#8B5CF6', light: '#F5F3FF', text: '#7C3AED', border: '#DDD6FE' },
};

export function HubScreen({ navigation }: HubScreenProps) {
  const [greeting, setGreeting] = useState({ text: 'Good morning', icon: '☀️' });
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);
  const [xpEarned, setXpEarned] = useState(0);
  const [showXpPopup, setShowXpPopup] = useState(false);
  const [lastXpGain, setLastXpGain] = useState(0);
  const [activeInsightIndex, setActiveInsightIndex] = useState(0);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting({ text: 'Good morning', icon: '☀️' });
    } else if (hour < 17) {
      setGreeting({ text: 'Good afternoon', icon: '🌤️' });
    } else if (hour < 21) {
      setGreeting({ text: 'Good evening', icon: '🌅' });
    } else {
      setGreeting({ text: 'Good night', icon: '🌙' });
    }
  }, []);

  const insights = [
    { icon: '🎯', text: 'Peak focus hours: 9-11am', color: colors.primary },
    { icon: '⚡', text: "You're 67% more productive today", color: colors.success },
    { icon: '🔥', text: '7-day streak active!', color: '#F97316' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveInsightIndex(prev => (prev + 1) % insights.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const today = {
    userName: 'Alex',
    streak: 7,
    level: 12,
    xp: 2460 + xpEarned,
    xpToNext: 340 - xpEarned,
  };

  const tasks: Task[] = [
    { id: 1, title: 'Review Q1 metrics', time: '5:00 PM', icon: '📊', category: 'Work', duration: '15m', priority: true },
    { id: 2, title: 'Gym Session', time: '6:00 PM', icon: '💪', category: 'Health', duration: '1h', priority: true },
    { id: 3, title: 'Call Mom', time: 'Evening', icon: '📞', category: 'Personal', duration: '15m', priority: false },
  ];

  const toggleTask = (taskId: number) => {
    if (completedTasks.includes(taskId)) {
      setCompletedTasks(prev => prev.filter(id => id !== taskId));
    } else {
      setCompletedTasks(prev => [...prev, taskId]);
      awardXp(15);
    }
  };

  const awardXp = (amount: number) => {
    setLastXpGain(amount);
    setShowXpPopup(true);
    setXpEarned(prev => prev + amount);
    setTimeout(() => setShowXpPopup(false), 2000);
  };

  const quickActions = [
    { icon: '📅', label: 'Plan', color: ['#3B82F6', '#06B6D4'], screen: 'Plan' },
    { icon: '🧠', label: 'Dump', color: ['#374151', '#1F2937'], screen: 'Tasks' },
    { icon: '🏆', label: 'Compete', color: ['#F97316', '#F59E0B'], screen: 'Challenges' },
    { icon: '💰', label: 'Wallet', color: ['#10B981', '#14B8A6'], screen: 'Wallet' },
  ];

  const progressPercent = Math.round((completedTasks.length / tasks.length) * 100);

  return (
    <SafeAreaView style={styles.container}>
      {showXpPopup && (
        <View style={styles.xpPopup}>
          <Text style={styles.xpPopupText}>⭐ +{lastXpGain} XP</Text>
        </View>
      )}

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting.text}</Text>
            <Text style={styles.userName}>{today.userName}</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity 
              style={styles.inboxButton}
              onPress={() => navigation.navigate('Inbox')}
            >
              <Text style={styles.inboxIcon}>📬</Text>
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationText}>3</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.avatarButton}
              onPress={() => navigation.navigate('Profile')}
            >
              <Text style={styles.avatarText}>{today.userName[0]}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.content}>
          {/* MYPA AI Briefing Card */}
          <TouchableOpacity style={styles.briefingCard} activeOpacity={0.9}>
            <View style={styles.briefingContent}>
              <View style={styles.orbContainer}>
                <View style={styles.orbGlow} />
                <View style={styles.orb}>
                  <Text style={styles.orbIcon}>✨</Text>
                </View>
              </View>
              <View style={styles.briefingText}>
                <View style={styles.briefingHeader}>
                  <Text style={styles.briefingTitle}>MYPA</Text>
                  <View style={styles.aiBadge}>
                    <Text style={styles.aiBadgeText}>AI</Text>
                  </View>
                </View>
                <Text style={styles.briefingSubtitle}>Tap for your daily briefing</Text>
              </View>
              <View style={styles.playButton}>
                <Text style={styles.playIcon}>▶️</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Streak & Level Row */}
          <View style={styles.statsRow}>
            <TouchableOpacity 
              style={styles.streakCard}
              onPress={() => navigation.navigate('Profile')}
            >
              <View style={styles.streakIcon}>
                <Text style={styles.streakEmoji}>🔥</Text>
              </View>
              <View>
                <Text style={styles.streakValue}>{today.streak} days</Text>
                <Text style={styles.streakBonus}>1.5x XP boost</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.levelCard}
              onPress={() => navigation.navigate('Profile')}
            >
              <View style={styles.levelIcon}>
                <Text style={styles.levelEmoji}>⭐</Text>
              </View>
              <View>
                <Text style={styles.levelValue}>Level {today.level}</Text>
                <Text style={styles.levelXp}>{today.xpToNext > 0 ? today.xpToNext : 0} XP to next</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Today's Focus */}
          <View style={styles.focusSection}>
            <View style={styles.focusHeader}>
              <View style={styles.focusTitleRow}>
                <View style={styles.focusIconContainer}>
                  <Text style={styles.focusIcon}>🎯</Text>
                </View>
                <View>
                  <Text style={styles.focusTitle}>Today's Focus</Text>
                  <Text style={styles.focusSubtitle}>{completedTasks.length}/{tasks.length} completed</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('Plan')}>
                <Text style={styles.fullPlanLink}>Full Plan →</Text>
              </TouchableOpacity>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
              </View>
              <Text style={styles.progressText}>{progressPercent}%</Text>
            </View>

            {/* Task List */}
            {tasks.map((task, index) => {
              const isCompleted = completedTasks.includes(task.id);
              const isNextUp = !isCompleted && !tasks.slice(0, index).some(t => !completedTasks.includes(t.id));
              const catStyle = categoryStyles[task.category];

              return (
                <TouchableOpacity
                  key={task.id}
                  style={[
                    styles.taskCard,
                    isCompleted && styles.taskCardCompleted,
                    isNextUp && { backgroundColor: catStyle.light, borderColor: catStyle.border, borderWidth: 1 },
                  ]}
                  onPress={() => !isCompleted && navigation.navigate('Plan')}
                >
                  {/* Category Accent */}
                  <View style={[styles.taskAccent, { backgroundColor: isCompleted ? '#CBD5E1' : catStyle.bg }]} />
                  
                  {/* Next Badge */}
                  {isNextUp && (
                    <View style={[styles.nextBadge, { backgroundColor: catStyle.bg }]}>
                      <Text style={styles.nextBadgeText}>NEXT</Text>
                    </View>
                  )}

                  <View style={styles.taskContent}>
                    {/* Time */}
                    <View style={styles.taskTimeContainer}>
                      <Text style={[styles.taskTime, isNextUp && { color: catStyle.text }]}>
                        {task.time.replace(':00', '').replace(' PM', 'PM').replace(' AM', 'AM')}
                      </Text>
                    </View>

                    {/* Checkbox */}
                    <TouchableOpacity
                      style={[
                        styles.checkbox,
                        isCompleted && styles.checkboxCompleted,
                        isNextUp && { borderColor: catStyle.text },
                      ]}
                      onPress={() => toggleTask(task.id)}
                    >
                      {isCompleted && <Text style={styles.checkmark}>✓</Text>}
                    </TouchableOpacity>

                    {/* Task Info */}
                    <View style={styles.taskInfo}>
                      <View style={styles.taskTitleRow}>
                        <Text style={[styles.taskTitle, isCompleted && styles.taskTitleCompleted]}>
                          {task.title}
                        </Text>
                        {task.priority && !isCompleted && (
                          <View style={styles.priorityBadge}>
                            <Text style={styles.priorityText}>!</Text>
                          </View>
                        )}
                      </View>
                      <View style={styles.taskMeta}>
                        <Text style={styles.taskDuration}>⏱️ {task.duration}</Text>
                        <Text style={styles.taskMetaDot}>·</Text>
                        <Text style={[styles.taskCategory, { color: catStyle.text }]}>{task.category}</Text>
                      </View>
                    </View>

                    {/* Arrow/Play */}
                    {!isCompleted && (
                      isNextUp ? (
                        <View style={[styles.playTaskButton, { backgroundColor: catStyle.bg }]}>
                          <Text style={styles.playTaskIcon}>▶</Text>
                        </View>
                      ) : (
                        <Text style={styles.taskArrow}>›</Text>
                      )
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}

            {/* Add Task Button */}
            <TouchableOpacity 
              style={styles.addTaskButton}
              onPress={() => navigation.navigate('Tasks')}
            >
              <View style={styles.addTaskIcon}>
                <Text style={styles.addTaskPlus}>+</Text>
              </View>
              <Text style={styles.addTaskText}>Add task</Text>
            </TouchableOpacity>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActionsSection}>
            <Text style={styles.quickActionsTitle}>QUICK ACTIONS</Text>
            <View style={styles.quickActionsGrid}>
              {quickActions.map((action, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.quickActionCard}
                  onPress={() => navigation.navigate(action.screen)}
                >
                  <View style={[styles.quickActionIcon, { backgroundColor: action.color[0] }]}>
                    <Text style={styles.quickActionEmoji}>{action.icon}</Text>
                  </View>
                  <Text style={styles.quickActionLabel}>{action.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Rotating Insight */}
          <View style={[styles.insightCard, { backgroundColor: insights[activeInsightIndex].color + '10' }]}>
            <Text style={styles.insightIcon}>{insights[activeInsightIndex].icon}</Text>
            <Text style={[styles.insightText, { color: insights[activeInsightIndex].color }]}>
              {insights[activeInsightIndex].text}
            </Text>
          </View>

          {/* More Cards Row */}
          <View style={styles.moreCardsRow}>
            <TouchableOpacity 
              style={styles.circlesCard}
              onPress={() => navigation.navigate('Circles')}
            >
              <Text style={styles.cardEmoji}>👥</Text>
              <Text style={styles.cardLabel}>Circles</Text>
              <Text style={styles.cardValue}>5 groups</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.settingsCard}
              onPress={() => navigation.navigate('Settings')}
            >
              <Text style={styles.cardEmoji}>⚙️</Text>
              <Text style={styles.cardLabel}>Settings</Text>
              <Text style={styles.cardValue}>Preferences</Text>
            </TouchableOpacity>
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
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 8,
  },
  greeting: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  inboxButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inboxIcon: {
    fontSize: 16,
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  avatarButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  content: {
    paddingHorizontal: 20,
    gap: 12,
  },
  xpPopup: {
    position: 'absolute',
    top: 80,
    left: '50%',
    transform: [{ translateX: -50 }],
    zIndex: 100,
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  xpPopupText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  briefingCard: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#1E1B4B',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  briefingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
  },
  orbContainer: {
    position: 'relative',
  },
  orbGlow: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#8B5CF6',
    opacity: 0.3,
  },
  orb: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  orbIcon: {
    fontSize: 20,
  },
  briefingText: {
    flex: 1,
  },
  briefingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  briefingTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  aiBadge: {
    backgroundColor: 'rgba(139, 92, 246, 0.3)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  aiBadgeText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#C4B5FD',
  },
  briefingSubtitle: {
    fontSize: 12,
    color: 'rgba(196, 181, 253, 0.8)',
    marginTop: 2,
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  playIcon: {
    fontSize: 14,
    marginLeft: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  streakCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 16,
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: 'rgba(251, 146, 60, 0.3)',
  },
  streakIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F97316',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#F97316',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  streakEmoji: {
    fontSize: 20,
  },
  streakValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  streakBonus: {
    fontSize: 10,
    color: '#EA580C',
    fontWeight: '500',
  },
  levelCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 16,
    backgroundColor: '#F5F3FF',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  levelIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  levelEmoji: {
    fontSize: 20,
  },
  levelValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  levelXp: {
    fontSize: 10,
    color: '#7C3AED',
    fontWeight: '500',
  },
  focusSection: {
    marginTop: 8,
  },
  focusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  focusTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  focusIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  focusIcon: {
    fontSize: 16,
  },
  focusTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  focusSubtitle: {
    fontSize: 12,
    color: '#64748B',
  },
  fullPlanLink: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8B5CF6',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0F172A',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  taskCard: {
    position: 'relative',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  taskCardCompleted: {
    backgroundColor: '#F8FAFC',
    opacity: 0.6,
  },
  taskAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  nextBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  nextBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  taskContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    paddingLeft: 16,
    gap: 12,
  },
  taskTimeContainer: {
    width: 48,
    alignItems: 'center',
  },
  taskTime: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#475569',
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxCompleted: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  taskInfo: {
    flex: 1,
  },
  taskTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  },
  priorityBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 1,
  },
  priorityText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  taskDuration: {
    fontSize: 11,
    color: '#64748B',
  },
  taskMetaDot: {
    color: '#CBD5E1',
  },
  taskCategory: {
    fontSize: 11,
    fontWeight: '600',
  },
  playTaskButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  playTaskIcon: {
    fontSize: 12,
    color: '#FFFFFF',
    marginLeft: 2,
  },
  taskArrow: {
    fontSize: 24,
    color: '#CBD5E1',
  },
  addTaskButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 14,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 4,
  },
  addTaskIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addTaskPlus: {
    fontSize: 14,
    color: '#64748B',
  },
  addTaskText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  quickActionsSection: {
    marginTop: 16,
  },
  quickActionsTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#475569',
    letterSpacing: 0.5,
    marginBottom: 12,
    marginLeft: 4,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  quickActionCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionEmoji: {
    fontSize: 20,
  },
  quickActionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 16,
    marginTop: 8,
  },
  insightIcon: {
    fontSize: 20,
  },
  insightText: {
    fontSize: 13,
    fontWeight: '600',
  },
  moreCardsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  circlesCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  settingsCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 2,
  },
  cardValue: {
    fontSize: 12,
    color: '#64748B',
  },
});
