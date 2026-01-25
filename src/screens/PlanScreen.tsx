import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { colors } from '../styles/colors';

interface Task {
  id: string;
  time: string;
  title: string;
  description: string;
  category: string;
  completed: boolean;
  color: string;
}

const initialTasks: Task[] = [
  { id: '1', time: '6:30 AM', title: 'Morning Routine', description: 'Meditation & stretching', category: 'Wellness', completed: true, color: '#5856D6' },
  { id: '2', time: '7:00 AM', title: 'Workout Session', description: '45 min strength training', category: 'Fitness', completed: true, color: '#FF3B30' },
  { id: '3', time: '8:30 AM', title: 'Breakfast', description: 'Healthy meal prep', category: 'Health', completed: true, color: '#34C759' },
  { id: '4', time: '9:00 AM', title: 'Deep Work Block', description: 'Focus on project development', category: 'Work', completed: false, color: '#007AFF' },
  { id: '5', time: '10:30 AM', title: 'Team Standup', description: 'Weekly sync-up meeting', category: 'Work', completed: false, color: '#007AFF' },
  { id: '6', time: '12:00 PM', title: 'Lunch Break', description: 'Rest and recharge', category: 'Health', completed: false, color: '#34C759' },
  { id: '7', time: '1:00 PM', title: 'Client Call', description: 'Project review meeting', category: 'Work', completed: false, color: '#007AFF' },
  { id: '8', time: '3:00 PM', title: 'Creative Time', description: 'Design exploration', category: 'Creative', completed: false, color: '#FF9500' },
  { id: '9', time: '5:00 PM', title: 'Evening Walk', description: '30 min outdoor activity', category: 'Wellness', completed: false, color: '#5856D6' },
  { id: '10', time: '7:00 PM', title: 'Family Dinner', description: 'Quality time', category: 'Personal', completed: false, color: '#FF2D55' },
];

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const dates = [20, 21, 22, 23, 24, 25, 26];

export function PlanScreen() {
  const [tasks, setTasks] = useState(initialTasks);
  const [selectedDay, setSelectedDay] = useState(3);

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const progress = (completedCount / tasks.length) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Plan</Text>
          <Text style={styles.subtitle}>Thursday, January 23</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daySelector}>
          {days.map((day, index) => (
            <TouchableOpacity
              key={day}
              style={[styles.dayItem, selectedDay === index && styles.dayItemSelected]}
              onPress={() => setSelectedDay(index)}
            >
              <Text style={[styles.dayName, selectedDay === index && styles.dayNameSelected]}>{day}</Text>
              <Text style={[styles.dayDate, selectedDay === index && styles.dayDateSelected]}>{dates[index]}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Daily Progress</Text>
            <Text style={styles.progressPercent}>{Math.round(progress)}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>{completedCount} of {tasks.length} tasks completed</Text>
        </View>

        <Text style={styles.sectionTitle}>Today's Schedule</Text>

        {tasks.map((task, index) => (
          <TouchableOpacity 
            key={task.id} 
            style={styles.taskItem}
            onPress={() => toggleTask(task.id)}
          >
            <View style={styles.taskTime}>
              <Text style={styles.taskTimeText}>{task.time}</Text>
              {index < tasks.length - 1 && <View style={styles.timeline} />}
            </View>
            <View style={[styles.taskCard, task.completed && styles.taskCardCompleted]}>
              <View style={styles.taskHeader}>
                <View style={[styles.categoryBadge, { backgroundColor: task.color + '20' }]}>
                  <Text style={[styles.categoryText, { color: task.color }]}>{task.category}</Text>
                </View>
                <View style={[styles.checkbox, task.completed && styles.checkboxCompleted]}>
                  {task.completed && <Text style={styles.checkmark}>✓</Text>}
                </View>
              </View>
              <Text style={[styles.taskTitle, task.completed && styles.taskTitleCompleted]}>{task.title}</Text>
              <Text style={styles.taskDescription}>{task.description}</Text>
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
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 4,
  },
  daySelector: {
    marginBottom: 20,
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  dayItem: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 8,
    borderRadius: 16,
    backgroundColor: colors.cardBackground,
  },
  dayItemSelected: {
    backgroundColor: colors.primary,
  },
  dayName: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  dayNameSelected: {
    color: colors.white,
  },
  dayDate: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  dayDateSelected: {
    color: colors.white,
  },
  progressCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  progressPercent: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
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
  progressText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  taskItem: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  taskTime: {
    width: 70,
    alignItems: 'flex-end',
    paddingRight: 16,
  },
  taskTimeText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  timeline: {
    position: 'absolute',
    top: 20,
    right: 7,
    width: 2,
    height: 80,
    backgroundColor: colors.border,
  },
  taskCard: {
    flex: 1,
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  taskCardCompleted: {
    opacity: 0.7,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxCompleted: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  checkmark: {
    color: colors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textSecondary,
  },
  taskDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
