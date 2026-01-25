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
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  dueDate: string;
  completed: boolean;
}

const initialTasks: Task[] = [
  { id: '1', title: 'Complete project proposal', description: 'Draft and review Q1 project proposal', priority: 'high', category: 'Work', dueDate: 'Today', completed: false },
  { id: '2', title: 'Morning workout', description: '45 min strength training session', priority: 'medium', category: 'Fitness', dueDate: 'Today', completed: true },
  { id: '3', title: 'Call with Sarah', description: 'Discuss partnership opportunity', priority: 'high', category: 'Work', dueDate: 'Today', completed: false },
  { id: '4', title: 'Grocery shopping', description: 'Weekly groceries for meal prep', priority: 'low', category: 'Personal', dueDate: 'Today', completed: false },
  { id: '5', title: 'Read book chapter', description: 'Finish chapter 5 of current book', priority: 'low', category: 'Learning', dueDate: 'Tomorrow', completed: false },
  { id: '6', title: 'Team meeting prep', description: 'Prepare slides for Monday meeting', priority: 'medium', category: 'Work', dueDate: 'Tomorrow', completed: false },
  { id: '7', title: 'Dentist appointment', description: 'Regular checkup at 3 PM', priority: 'medium', category: 'Health', dueDate: 'Jan 25', completed: false },
  { id: '8', title: 'Pay bills', description: 'Electricity and internet bills', priority: 'high', category: 'Finance', dueDate: 'Jan 26', completed: false },
];

const priorityColors = {
  high: colors.danger,
  medium: colors.warning,
  low: colors.success,
};

export function TasksScreen({ navigation }: any) {
  const [tasks, setTasks] = useState(initialTasks);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'pending') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const pendingCount = tasks.filter(t => !t.completed).length;
  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Tasks</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{pendingCount}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, { color: colors.success }]}>{completedCount}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, { color: colors.danger }]}>
            {tasks.filter(t => t.priority === 'high' && !t.completed).length}
          </Text>
          <Text style={styles.statLabel}>High Priority</Text>
        </View>
      </View>

      <View style={styles.filterContainer}>
        {(['all', 'pending', 'completed'] as const).map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterButton, filter === f && styles.filterButtonActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {filteredTasks.map((task) => (
          <TouchableOpacity
            key={task.id}
            style={[styles.taskCard, task.completed && styles.taskCardCompleted]}
            onPress={() => toggleTask(task.id)}
          >
            <View style={styles.taskLeft}>
              <View style={[styles.checkbox, task.completed && styles.checkboxCompleted]}>
                {task.completed && <Text style={styles.checkmark}>✓</Text>}
              </View>
            </View>
            <View style={styles.taskContent}>
              <View style={styles.taskHeader}>
                <Text style={[styles.taskTitle, task.completed && styles.taskTitleCompleted]}>
                  {task.title}
                </Text>
                <View style={[styles.priorityBadge, { backgroundColor: priorityColors[task.priority] + '20' }]}>
                  <View style={[styles.priorityDot, { backgroundColor: priorityColors[task.priority] }]} />
                  <Text style={[styles.priorityText, { color: priorityColors[task.priority] }]}>
                    {task.priority}
                  </Text>
                </View>
              </View>
              <Text style={styles.taskDescription}>{task.description}</Text>
              <View style={styles.taskMeta}>
                <Text style={styles.taskCategory}>{task.category}</Text>
                <Text style={styles.taskDue}>Due: {task.dueDate}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>

      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>+ Add Task</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
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
    paddingHorizontal: 20,
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
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: colors.cardBackground,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
  },
  filterText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  filterTextActive: {
    color: colors.white,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  taskCard: {
    flexDirection: 'row',
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
  taskCardCompleted: {
    opacity: 0.7,
  },
  taskLeft: {
    marginRight: 12,
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
  taskContent: {
    flex: 1,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textSecondary,
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  taskDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  taskMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  taskCategory: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  taskDue: {
    fontSize: 12,
    color: colors.textTertiary,
  },
  addButton: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  addButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
