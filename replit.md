# MYPA iOS App - React Native Expo

## Overview
This is a React Native mobile app built with Expo, designed as an iOS-style personal assistant application. The app runs on web, iOS, and Android platforms.

## Project Architecture
- **Framework**: React Native with Expo SDK 52
- **Navigation**: React Navigation (Bottom Tabs + Native Stack)
- **Icons**: @expo/vector-icons (Ionicons, MaterialCommunityIcons, Feather)
- **Bundler**: Metro (Expo's bundler)
- **Port**: 5000 (web preview)

## Key Screens
- **Hub (Home)**: Main dashboard with streak tracker, quick actions, and cards for Plan, Tasks, Challenges, Circles, Wallet, Settings
- **Plan**: Daily schedule with interactive task timeline, day selector, and progress tracking
- **Inbox**: Messages and notifications with tabs for direct messages and system notifications
- **Profile**: User profile with achievements, level progress, stats, and account settings
- **Wallet**: Balance display, transactions history, send/receive/redeem actions
- **Challenges**: Active and available challenges with progress tracking and rewards
- **Circles**: Social groups with activity tracking and member counts
- **Settings**: App preferences, account settings, and support options
- **Tasks**: Task management with priority filtering and completion tracking

## Running the App
- **Web**: `npm run web` (runs on port 5000)
- **iOS**: `npm run ios`
- **Android**: `npm run android`

## File Structure
```
/
├── App.tsx                      # Main app component with navigation
├── app.json                     # Expo configuration
├── package.json                 # Dependencies
├── babel.config.js              # Babel configuration
├── tsconfig.json                # TypeScript configuration
├── assets/                      # App icons and splash screens
└── src/
    ├── screens/                 # Screen components
    │   ├── HubScreen.tsx        # Home dashboard
    │   ├── PlanScreen.tsx       # Daily schedule
    │   ├── InboxScreen.tsx      # Messages & notifications
    │   ├── ProfileScreen.tsx    # User profile
    │   ├── WalletScreen.tsx     # Wallet & transactions
    │   ├── ChallengesScreen.tsx # Challenges
    │   ├── CirclesScreen.tsx    # Social circles
    │   ├── SettingsScreen.tsx   # App settings
    │   └── TasksScreen.tsx      # Task management
    ├── components/              # Reusable UI components
    │   ├── MYPAOrb.tsx          # Animated MYPA AI orb
    │   ├── FloatingMYPAButton.tsx # Floating voice access button
    │   ├── IOSStatusBar.tsx     # iOS-style status bar
    │   ├── MissionCard.tsx      # Mission/task status card
    │   ├── ToggleSwitch.tsx     # Toggle switch component
    │   ├── VoicePill.tsx        # Voice input pill
    │   ├── TabBar.tsx           # Custom tab bar with center orb
    │   └── index.ts             # Component exports
    └── styles/
        └── colors.ts            # App color palette
```

## Reusable Components
- **MYPAOrb**: Animated AI assistant orb with sparkle icon and glow effect
- **FloatingMYPAButton**: Floating action button for voice access from any screen
- **IOSStatusBar**: iOS-style status bar with time and system icons
- **MissionCard**: Card component for displaying mission/task status
- **ToggleSwitch**: Custom iOS-style toggle switch
- **VoicePill**: Voice input pill that transforms to orb when recording
- **TabBar**: Custom tab navigation bar with center voice button

## Color Palette
- Primary: #8B5CF6 (Purple)
- Work: #3B82F6 (Blue)
- Health: #10B981 (Green)
- Fitness: #F43F5E (Red)
- Wellness: #8B5CF6 (Purple)
- Creative: #F59E0B (Orange)
- Personal: #EC4899 (Pink)

## Recent Changes
- January 25, 2026: Added reusable UI components (MYPAOrb, FloatingMYPAButton, VoicePill, TabBar, etc.)
- January 25, 2026: Replaced all emoji icons with vector icons from @expo/vector-icons
- January 25, 2026: Added detailed screens with full iOS-style UI
- Added navigation with stack navigator for sub-screens
- Created 9 fully styled screens with interactive elements
- Added streak tracking, achievements, progress bars
- Implemented message inbox with tabs for messages and notifications
- Added wallet with transaction history
- Created challenges with progress tracking
- Added social circles management
- Implemented task management with priority filtering
