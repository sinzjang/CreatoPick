/**
 * Packs Screen
 * 북마크 팩/컬렉션 관리 화면
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Theme } from '@/theme/tokens';

export default function PacksScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Packs</Text>
        <Text style={styles.subtitle}>북마크 컬렉션을 관리하세요</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.emptyText}>곧 추가될 예정입니다</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.Colors.background.primary,
  },
  
  header: {
    padding: Theme.Spacing.lg,
    paddingTop: Theme.Spacing.xl,
  },
  
  title: {
    fontSize: Theme.Typography.fontSize['3xl'],
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.text.primary,
    marginBottom: Theme.Spacing.xs,
  },
  
  subtitle: {
    fontSize: Theme.Typography.fontSize.base,
    color: Theme.Colors.text.secondary,
  },
  
  content: {
    padding: Theme.Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 300,
  },
  
  emptyText: {
    fontSize: Theme.Typography.fontSize.base,
    color: Theme.Colors.text.tertiary,
  },
});
