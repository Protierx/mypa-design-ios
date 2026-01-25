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

interface Message {
  id: string;
  sender: string;
  initials: string;
  preview: string;
  time: string;
  unread: boolean;
  avatar: string;
}

interface Notification {
  id: string;
  type: 'achievement' | 'reminder' | 'social' | 'system';
  title: string;
  description: string;
  time: string;
  icon: string;
}

const messages: Message[] = [
  { id: '1', sender: 'Sarah Chen', initials: 'SC', preview: 'Great job on completing the challenge! 🎉', time: '2m ago', unread: true, avatar: '#FF2D55' },
  { id: '2', sender: 'Team Wellness', initials: 'TW', preview: 'New weekly challenge: 10k steps daily', time: '1h ago', unread: true, avatar: '#5856D6' },
  { id: '3', sender: 'Mike Johnson', initials: 'MJ', preview: 'Are you joining the group workout tomorrow?', time: '2h ago', unread: false, avatar: '#007AFF' },
  { id: '4', sender: 'Alex Rivera', initials: 'AR', preview: 'Thanks for the motivation boost!', time: '5h ago', unread: false, avatar: '#34C759' },
  { id: '5', sender: 'Circle: Morning Runners', initials: 'MR', preview: 'Emma shared a new route for Saturday', time: '1d ago', unread: false, avatar: '#FF9500' },
];

const notifications: Notification[] = [
  { id: '1', type: 'achievement', title: 'New Badge Earned!', description: 'You completed a 7-day streak', time: '10m ago', icon: '🏆' },
  { id: '2', type: 'reminder', title: 'Upcoming Task', description: 'Team standup in 30 minutes', time: '30m ago', icon: '⏰' },
  { id: '3', type: 'social', title: 'Circle Activity', description: '3 new posts in Morning Runners', time: '2h ago', icon: '👥' },
  { id: '4', type: 'system', title: 'Weekly Summary Ready', description: 'Check your progress report', time: '1d ago', icon: '📊' },
];

export function InboxScreen() {
  const [activeTab, setActiveTab] = useState<'messages' | 'notifications'>('messages');
  const unreadCount = messages.filter(m => m.unread).length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Inbox</Text>
        {unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadBadgeText}>{unreadCount} new</Text>
          </View>
        )}
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'messages' && styles.tabActive]}
          onPress={() => setActiveTab('messages')}
        >
          <Text style={[styles.tabText, activeTab === 'messages' && styles.tabTextActive]}>Messages</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'notifications' && styles.tabActive]}
          onPress={() => setActiveTab('notifications')}
        >
          <Text style={[styles.tabText, activeTab === 'notifications' && styles.tabTextActive]}>Notifications</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {activeTab === 'messages' ? (
          <View style={styles.messageList}>
            {messages.map((message) => (
              <TouchableOpacity key={message.id} style={styles.messageItem}>
                <View style={[styles.avatar, { backgroundColor: message.avatar }]}>
                  <Text style={styles.avatarText}>{message.initials}</Text>
                </View>
                <View style={styles.messageContent}>
                  <View style={styles.messageHeader}>
                    <Text style={[styles.senderName, message.unread && styles.unreadText]}>{message.sender}</Text>
                    <Text style={styles.messageTime}>{message.time}</Text>
                  </View>
                  <Text style={[styles.messagePreview, message.unread && styles.unreadText]} numberOfLines={1}>
                    {message.preview}
                  </Text>
                </View>
                {message.unread && <View style={styles.unreadDot} />}
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.notificationList}>
            {notifications.map((notification) => (
              <TouchableOpacity key={notification.id} style={styles.notificationItem}>
                <View style={styles.notificationIcon}>
                  <Text style={styles.notificationIconText}>{notification.icon}</Text>
                </View>
                <View style={styles.notificationContent}>
                  <Text style={styles.notificationTitle}>{notification.title}</Text>
                  <Text style={styles.notificationDescription}>{notification.description}</Text>
                  <Text style={styles.notificationTime}>{notification.time}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  unreadBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  unreadBadgeText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  messageList: {
    gap: 1,
  },
  messageItem: {
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
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  senderName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  unreadText: {
    fontWeight: '600',
  },
  messageTime: {
    fontSize: 12,
    color: colors.textTertiary,
  },
  messagePreview: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
    marginLeft: 8,
  },
  notificationList: {
    gap: 12,
  },
  notificationItem: {
    flexDirection: 'row',
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
  notificationIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notificationIconText: {
    fontSize: 24,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  notificationDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: colors.textTertiary,
  },
});
