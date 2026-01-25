import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { colors } from '../styles/colors';

interface Task {
  id: string;
  time: string;
  title: string;
  description: string;
  category: string;
  completed: boolean;
  color: string;
  iconName: string;
  duration?: string;
}

const initialTasks: Task[] = [
  { id: '1', time: '6:30 AM', title: 'Morning Routine', description: 'Meditation & stretching', category: 'Wellness', completed: true, color: '#8B5CF6', iconName: 'spa', duration: '30 min' },
  { id: '2', time: '7:00 AM', title: 'Workout Session', description: '45 min strength training', category: 'Fitness', completed: true, color: '#F43F5E', iconName: 'dumbbell', duration: '45 min' },
  { id: '3', time: '8:30 AM', title: 'Breakfast', description: 'Healthy meal prep', category: 'Health', completed: true, color: '#10B981', iconName: 'nutrition', duration: '30 min' },
  { id: '4', time: '9:00 AM', title: 'Deep Work Block', description: 'Focus on project development', category: 'Work', completed: false, color: '#3B82F6', iconName: 'laptop', duration: '90 min' },
  { id: '5', time: '10:30 AM', title: 'Team Standup', description: 'Weekly sync-up meeting', category: 'Work', completed: false, color: '#3B82F6', iconName: 'people', duration: '30 min' },
  { id: '6', time: '12:00 PM', title: 'Lunch Break', description: 'Rest and recharge', category: 'Health', completed: false, color: '#10B981', iconName: 'restaurant', duration: '60 min' },
  { id: '7', time: '1:00 PM', title: 'Client Call', description: 'Project review meeting', category: 'Work', completed: false, color: '#3B82F6', iconName: 'videocam', duration: '45 min' },
  { id: '8', time: '3:00 PM', title: 'Creative Time', description: 'Design exploration', category: 'Creative', completed: false, color: '#F59E0B', iconName: 'color-palette', duration: '120 min' },
  { id: '9', time: '5:00 PM', title: 'Evening Walk', description: '30 min outdoor activity', category: 'Wellness', completed: false, color: '#8B5CF6', iconName: 'walk', duration: '30 min' },
  { id: '10', time: '7:00 PM', title: 'Family Dinner', description: 'Quality time', category: 'Personal', completed: false, color: '#EC4899', iconName: 'heart', duration: '90 min' },
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

  const renderIcon = (iconName: string, size: number, color: string) => {
    switch (iconName) {
      case 'spa':
        return <MaterialCommunityIcons name="spa" size={size} color={color} />;
      case 'dumbbell':
        return <MaterialCommunityIcons name="dumbbell" size={size} color={color} />;
      case 'nutrition':
        return <Ionicons name="nutrition" size={size} color={color} />;
      case 'laptop':
        return <Ionicons name="laptop" size={size} color={color} />;
      case 'people':
        return <Ionicons name="people" size={size} color={color} />;
      case 'restaurant':
        return <Ionicons name="restaurant" size={size} color={color} />;
      case 'videocam':
        return <Ionicons name="videocam" size={size} color={color} />;
      case 'color-palette':
        return <Ionicons name="color-palette" size={size} color={color} />;
      case 'walk':
        return <MaterialCommunityIcons name="walk" size={size} color={color} />;
      case 'heart':
        return <Ionicons name="heart" size={size} color={color} />;
      default:
        return <Ionicons name="ellipse" size={size} color={color} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Your Plan</Text>
            <Text style={styles.subtitle}>Thursday, January 23</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.headerButton}>
              <Ionicons name="add" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Day Selector */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daySelector}>
          {days.map((day, index) => (
            <TouchableOpacity
              key={day}
              style={[styles.dayItem, selectedDay === index && styles.dayItemSelected]}
              onPress={() => setSelectedDay(index)}
            >
              <Text style={[styles.dayName, selectedDay === index && styles.dayNameSelected]}>{day}</Text>
              <Text style={[styles.dayDate, selectedDay === index && styles.dayDateSelected]}>{dates[index]}</Text>
              {selectedDay === index && <View style={styles.dayDot} />}
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Progress Card */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <View style={styles.progressLeft}>
              <View style={styles.progressIconContainer}>
                <Ionicons name="stats-chart" size={20} color="#FFFFFF" />
              </View>
              <View>
                <Text style={styles.progressTitle}>Daily Progress</Text>
                <Text style={styles.progressSubtitle}>{completedCount} of {tasks.length} tasks</Text>
              </View>
            </View>
            <View style={styles.progressRight}>
              <Text style={styles.progressPercent}>{Math.round(progress)}%</Text>
            </View>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
        </View>

        {/* Focus Timer */}
        <TouchableOpacity style={styles.focusCard}>
          <View style={styles.focusLeft}>
            <View style={styles.focusIconContainer}>
              <MaterialCommunityIcons name="timer-outline" size={24} color="#F59E0B" />
            </View>
            <View>
              <Text style={styles.focusTitle}>Focus Timer</Text>
              <Text style={styles.focusSubtitle}>Start a Pomodoro session</Text>
            </View>
          </View>
          <View style={styles.focusButton}>
            <Ionicons name="play" size={16} color="#FFFFFF" />
            <Text style={styles.focusButtonText}>Start</Text>
          </View>
        </TouchableOpacity>

        {/* Today's Schedule */}
        <View style={styles.scheduleHeader}>
          <View style={styles.scheduleLeft}>
            <Ionicons name="calendar" size={18} color="#64748B" />
            <Text style={styles.scheduleTitle}>Today's Schedule</Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="filter" size={18} color="#64748B" />
          </TouchableOpacity>
        </View>

        {tasks.map((task, index) => (
          <TouchableOpacity 
            key={task.id} 
            style={styles.taskItem}
            onPress={() => toggleTask(task.id)}
          >
            <View style={styles.taskTime}>
              <Text style={styles.taskTimeText}>{task.time}</Text>
              {index < tasks.length - 1 && <View style={[styles.timeline, { backgroundColor: task.completed ? '#E2E8F0' : task.color + '40' }]} />}
            </View>
            <View style={[styles.taskCard, task.completed && styles.taskCardCompleted]}>
              <View style={styles.taskHeader}>
                <View style={[styles.taskIconContainer, { backgroundColor: task.color + '20' }]}>
                  {renderIcon(task.iconName, 18, task.completed ? '#94A3B8' : task.color)}
                </View>
                <View style={styles.taskInfo}>
                  <Text style={[styles.taskTitle, task.completed && styles.taskTitleCompleted]}>{task.title}</Text>
                  <Text style={styles.taskDescription}>{task.description}</Text>
                </View>
                <TouchableOpacity 
                  style={[styles.checkbox, task.completed && styles.checkboxCompleted, { borderColor: task.color }]}
                  onPress={() => toggleTask(task.id)}
                >
                  {task.completed && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
                </TouchableOpacity>
              </View>
              <View style={styles.taskFooter}>
                <View style={[styles.categoryBadge, { backgroundColor: task.color + '15' }]}>
                  <Text style={[styles.categoryText, { color: task.color }]}>{task.category}</Text>
                </View>
                {task.duration && (
                  <View style={styles.durationBadge}>
                    <Ionicons name="time-outline" size={12} color="#94A3B8" />
                    <Text style={styles.durationText}>{task.duration}</Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollView: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#0F172A' },
  subtitle: { fontSize: 14, color: '#64748B', marginTop: 2 },
  headerRight: { flexDirection: 'row', gap: 8 },
  headerButton: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#0F172A', alignItems: 'center', justifyContent: 'center' },
  daySelector: { marginBottom: 16, paddingHorizontal: 20 },
  dayItem: { alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16, marginRight: 8, borderRadius: 16, backgroundColor: '#FFFFFF', minWidth: 56, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  dayItemSelected: { backgroundColor: '#0F172A' },
  dayName: { fontSize: 12, color: '#64748B', marginBottom: 4 },
  dayNameSelected: { color: 'rgba(255,255,255,0.7)' },
  dayDate: { fontSize: 18, fontWeight: '600', color: '#0F172A' },
  dayDateSelected: { color: '#FFFFFF' },
  dayDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#8B5CF6', marginTop: 4 },
  progressCard: { backgroundColor: '#FFFFFF', marginHorizontal: 20, borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  progressLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  progressIconContainer: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#8B5CF6', alignItems: 'center', justifyContent: 'center' },
  progressTitle: { fontSize: 15, fontWeight: '600', color: '#0F172A' },
  progressSubtitle: { fontSize: 12, color: '#64748B' },
  progressRight: {},
  progressPercent: { fontSize: 24, fontWeight: '700', color: '#8B5CF6' },
  progressBar: { height: 8, backgroundColor: '#F1F5F9', borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#8B5CF6', borderRadius: 4 },
  focusCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFFBEB', marginHorizontal: 20, borderRadius: 16, padding: 14, marginBottom: 16, borderWidth: 1, borderColor: '#FDE68A' },
  focusLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  focusIconContainer: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#FEF3C7', alignItems: 'center', justifyContent: 'center' },
  focusTitle: { fontSize: 15, fontWeight: '600', color: '#92400E' },
  focusSubtitle: { fontSize: 12, color: '#B45309' },
  focusButton: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#F59E0B', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  focusButtonText: { fontSize: 13, fontWeight: '600', color: '#FFFFFF' },
  scheduleHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 12 },
  scheduleLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  scheduleTitle: { fontSize: 16, fontWeight: '600', color: '#475569' },
  taskItem: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 4 },
  taskTime: { width: 70, alignItems: 'flex-end', paddingRight: 16, paddingTop: 4 },
  taskTimeText: { fontSize: 11, color: '#64748B', fontWeight: '500' },
  timeline: { position: 'absolute', top: 24, right: 8, width: 2, height: 80, borderRadius: 1 },
  taskCard: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14, marginBottom: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  taskCardCompleted: { opacity: 0.7 },
  taskHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  taskIconContainer: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  taskInfo: { flex: 1 },
  taskTitle: { fontSize: 15, fontWeight: '600', color: '#0F172A', marginBottom: 2 },
  taskTitleCompleted: { textDecorationLine: 'line-through', color: '#94A3B8' },
  taskDescription: { fontSize: 12, color: '#64748B' },
  checkbox: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  checkboxCompleted: { backgroundColor: '#10B981', borderColor: '#10B981' },
  taskFooter: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  categoryBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  categoryText: { fontSize: 11, fontWeight: '600' },
  durationBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  durationText: { fontSize: 11, color: '#94A3B8' },
});
