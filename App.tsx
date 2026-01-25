import React from 'react';
import { StyleSheet, Text, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { HubScreen } from './src/screens/HubScreen';
import { PlanScreen } from './src/screens/PlanScreen';
import { InboxScreen } from './src/screens/InboxScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { WalletScreen } from './src/screens/WalletScreen';
import { ChallengesScreen } from './src/screens/ChallengesScreen';
import { CirclesScreen } from './src/screens/CirclesScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { TasksScreen } from './src/screens/TasksScreen';
import { colors } from './src/styles/colors';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Hub" component={HubScreen} />
      <Stack.Screen name="Wallet" component={WalletScreen} />
      <Stack.Screen name="Challenges" component={ChallengesScreen} />
      <Stack.Screen name="Circles" component={CirclesScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Tasks" component={TasksScreen} />
    </Stack.Navigator>
  );
}

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return (
    <Text style={{ fontSize: 24, opacity: focused ? 1 : 0.5 }}>{emoji}</Text>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" />
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarStyle: {
            backgroundColor: colors.white,
            borderTopWidth: 1,
            borderTopColor: colors.border,
            paddingBottom: 8,
            paddingTop: 8,
            height: 80,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
          },
          headerShown: false,
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeStack}
          options={{
            tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" focused={focused} />,
          }}
        />
        <Tab.Screen
          name="Plan"
          component={PlanScreen}
          options={{
            tabBarIcon: ({ focused }) => <TabIcon emoji="📅" focused={focused} />,
          }}
        />
        <Tab.Screen
          name="Inbox"
          component={InboxScreen}
          options={{
            tabBarIcon: ({ focused }) => <TabIcon emoji="📬" focused={focused} />,
            tabBarBadge: 2,
            tabBarBadgeStyle: {
              backgroundColor: colors.danger,
              fontSize: 10,
            },
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ focused }) => <TabIcon emoji="👤" focused={focused} />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
