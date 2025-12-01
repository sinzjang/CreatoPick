/**
 * Tabs Layout - Bottom Tab Navigation
 * Home/Search/Bookmark/Settings 4개 탭
 */

import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Theme } from '@/theme/tokens';

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Theme.Colors.primary[500], // 6C5CE7
        tabBarInactiveTintColor: Theme.Colors.text.muted, // 7B8193
        tabBarStyle: {
          backgroundColor: Theme.Colors.background.primary, // 딥 다크
          borderTopWidth: 1,
          borderTopColor: Theme.Colors.border.primary, // 252B3A
          paddingBottom: insets.bottom || Theme.Spacing.sm,
          paddingTop: Theme.Spacing.sm,
          height: 60 + (insets.bottom || 0),
        },
        tabBarLabelStyle: {
          fontSize: Theme.Typography.fontSize.xs,
          fontWeight: Theme.Typography.fontWeight.medium,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="bookmark"
        options={{
          title: 'Library',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="library-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="packs"
        options={{
          title: 'Packs',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="albums-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
