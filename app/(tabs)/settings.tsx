/**
 * Settings Screen - Placeholder
 * 설정 관리 (나중에 구현)
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Theme } from '@/theme/tokens';

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.subtitle}>Coming soon...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.Colors.background.primary, // 딥 다크
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  title: {
    fontSize: Theme.Typography.fontSize['2xl'],
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.text.primary, // E9ECF5
    marginBottom: Theme.Spacing.sm,
  },
  
  subtitle: {
    fontSize: Theme.Typography.fontSize.base,
    color: Theme.Colors.text.secondary, // AAB0C0
  },
});
