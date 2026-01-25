# MYPA iOS App - React Native Expo

## Overview
This is a React Native mobile app built with Expo, designed as an iOS-style personal assistant application. The app runs on web, iOS, and Android platforms.

## Project Architecture
- **Framework**: React Native with Expo SDK 52
- **Navigation**: React Navigation (Bottom Tabs)
- **Bundler**: Metro (Expo's bundler)
- **Port**: 5000 (web preview)

## Key Screens
- **Hub (Home)**: Main dashboard with cards for Plan, Tasks, Challenges, Circles, Wallet, Settings
- **Plan**: Daily schedule and task management
- **Inbox**: Messages and notifications
- **Profile**: User profile, stats, and settings

## Running the App
- **Web**: `npm run web` (runs on port 5000)
- **iOS**: `npm run ios`
- **Android**: `npm run android`

## File Structure
```
/
├── App.tsx          # Main app component with navigation
├── app.json         # Expo configuration
├── package.json     # Dependencies
├── babel.config.js  # Babel configuration
├── tsconfig.json    # TypeScript configuration
└── assets/          # App icons and splash screens
```

## Recent Changes
- January 25, 2026: Converted from React web app to React Native Expo app
- Set up bottom tab navigation with 4 main screens
- Configured for web preview on port 5000
