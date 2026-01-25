import { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, ScrollView, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

function HubScreen({ navigation }: any) {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.screenContent}>
      <Text style={styles.greeting}>Good morning!</Text>
      <Text style={styles.title}>Your Hub</Text>
      
      <View style={styles.cardGrid}>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Plan')}>
          <Text style={styles.cardEmoji}>📅</Text>
          <Text style={styles.cardTitle}>Plan</Text>
          <Text style={styles.cardSubtitle}>Your daily schedule</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardEmoji}>✅</Text>
          <Text style={styles.cardTitle}>Tasks</Text>
          <Text style={styles.cardSubtitle}>12 pending</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardEmoji}>🎯</Text>
          <Text style={styles.cardTitle}>Challenges</Text>
          <Text style={styles.cardSubtitle}>3 active</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardEmoji}>👥</Text>
          <Text style={styles.cardTitle}>Circles</Text>
          <Text style={styles.cardSubtitle}>5 groups</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardEmoji}>💰</Text>
          <Text style={styles.cardTitle}>Wallet</Text>
          <Text style={styles.cardSubtitle}>$250.00</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardEmoji}>⚙️</Text>
          <Text style={styles.cardTitle}>Settings</Text>
          <Text style={styles.cardSubtitle}>Preferences</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function PlanScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.screenContent}>
      <Text style={styles.title}>Your Plan</Text>
      <Text style={styles.subtitle}>Today's Schedule</Text>
      
      <View style={styles.taskList}>
        <View style={styles.taskItem}>
          <View style={styles.taskTime}>
            <Text style={styles.taskTimeText}>9:00 AM</Text>
          </View>
          <View style={styles.taskContent}>
            <Text style={styles.taskTitle}>Morning Workout</Text>
            <Text style={styles.taskDescription}>30 min cardio session</Text>
          </View>
        </View>
        
        <View style={styles.taskItem}>
          <View style={styles.taskTime}>
            <Text style={styles.taskTimeText}>10:30 AM</Text>
          </View>
          <View style={styles.taskContent}>
            <Text style={styles.taskTitle}>Team Meeting</Text>
            <Text style={styles.taskDescription}>Weekly sync-up</Text>
          </View>
        </View>
        
        <View style={styles.taskItem}>
          <View style={styles.taskTime}>
            <Text style={styles.taskTimeText}>1:00 PM</Text>
          </View>
          <View style={styles.taskContent}>
            <Text style={styles.taskTitle}>Lunch Break</Text>
            <Text style={styles.taskDescription}>Healthy meal prep</Text>
          </View>
        </View>
        
        <View style={styles.taskItem}>
          <View style={styles.taskTime}>
            <Text style={styles.taskTimeText}>3:00 PM</Text>
          </View>
          <View style={styles.taskContent}>
            <Text style={styles.taskTitle}>Project Work</Text>
            <Text style={styles.taskDescription}>Focus time</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

function InboxScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.screenContent}>
      <Text style={styles.title}>Inbox</Text>
      <Text style={styles.subtitle}>Recent Messages</Text>
      
      <View style={styles.messageList}>
        <View style={styles.messageItem}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>JD</Text>
          </View>
          <View style={styles.messageContent}>
            <Text style={styles.messageSender}>John Doe</Text>
            <Text style={styles.messagePreview}>Hey, are you coming to the meetup?</Text>
          </View>
          <Text style={styles.messageTime}>2m ago</Text>
        </View>
        
        <View style={styles.messageItem}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>SM</Text>
          </View>
          <View style={styles.messageContent}>
            <Text style={styles.messageSender}>Sarah Miller</Text>
            <Text style={styles.messagePreview}>Great job on the challenge!</Text>
          </View>
          <Text style={styles.messageTime}>1h ago</Text>
        </View>
        
        <View style={styles.messageItem}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>TW</Text>
          </View>
          <View style={styles.messageContent}>
            <Text style={styles.messageSender}>Team Wellness</Text>
            <Text style={styles.messagePreview}>New weekly challenge available</Text>
          </View>
          <Text style={styles.messageTime}>3h ago</Text>
        </View>
      </View>
    </ScrollView>
  );
}

function ProfileScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.screenContent}>
      <View style={styles.profileHeader}>
        <View style={styles.profileAvatar}>
          <Text style={styles.profileAvatarText}>ME</Text>
        </View>
        <Text style={styles.profileName}>Alex Johnson</Text>
        <Text style={styles.profileEmail}>alex.johnson@email.com</Text>
      </View>
      
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>156</Text>
          <Text style={styles.statLabel}>Days Streak</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>Level 12</Text>
          <Text style={styles.statLabel}>Current Level</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>$250</Text>
          <Text style={styles.statLabel}>Wallet</Text>
        </View>
      </View>
      
      <View style={styles.menuList}>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>✏️</Text>
          <Text style={styles.menuText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>🔔</Text>
          <Text style={styles.menuText}>Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>🔒</Text>
          <Text style={styles.menuText}>Privacy Controls</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>❓</Text>
          <Text style={styles.menuText}>Help & Support</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" />
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: '#8E8E93',
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            borderTopWidth: 1,
            borderTopColor: '#E5E5EA',
            paddingBottom: 8,
            paddingTop: 8,
            height: 80,
          },
          headerStyle: {
            backgroundColor: '#F2F2F7',
          },
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HubScreen}
          options={{
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>🏠</Text>,
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="Plan"
          component={PlanScreen}
          options={{
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>📅</Text>,
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="Inbox"
          component={InboxScreen}
          options={{
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>📬</Text>,
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>👤</Text>,
            headerShown: false,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  screenContent: {
    padding: 20,
    paddingTop: 60,
  },
  greeting: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 4,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    color: '#8E8E93',
    marginBottom: 16,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
  },
  taskList: {
    gap: 16,
  },
  taskItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  taskTime: {
    marginRight: 16,
  },
  taskTimeText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  taskDescription: {
    fontSize: 14,
    color: '#8E8E93',
  },
  messageList: {
    gap: 12,
  },
  messageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  messageContent: {
    flex: 1,
  },
  messageSender: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  messagePreview: {
    fontSize: 14,
    color: '#8E8E93',
  },
  messageTime: {
    fontSize: 12,
    color: '#8E8E93',
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileAvatarText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '600',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: '#8E8E93',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
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
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#8E8E93',
  },
  menuList: {
    backgroundColor: '#FFFFFF',
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
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  menuText: {
    fontSize: 16,
    color: '#000000',
  },
});
