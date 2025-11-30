/**
 * Tabs Layout - Bottom Tab Navigation
 * Home/Search/Bookmark/Settings 4개 탭
 */

import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '@/theme/tokens';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Theme.Colors.primary[500], // 6C5CE7
        tabBarInactiveTintColor: Theme.Colors.text.muted, // 7B8193
        tabBarStyle: {
          backgroundColor: Theme.Colors.background.primary, // 딥 다크
          borderTopWidth: 1,
          borderTopColor: Theme.Colors.border.primary, // 252B3A
          paddingBottom: Theme.Spacing.sm,
          paddingTop: Theme.Spacing.sm,
          height: 80,
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
          title: 'Bookmarks',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bookmark-outline" size={size} color={color} />
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
