/**
 * Dashboard Header Component
 * 사용자 이름과 프로필 아바타를 표시
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Theme } from '@/theme/tokens';
import { UserProfile } from '@/data/mock';

interface HeaderProps {
  user: UserProfile;
}

export const Header: React.FC<HeaderProps> = ({ user }) => {
  return (
    <View style={styles.container}>
      {/* 사용자 이름 */}
      <Text style={styles.greeting}>{user.name}</Text>
      
      {/* 프로필 아바타 */}
      <View style={styles.avatar}>
        {user.avatar ? (
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>IMG</Text>
          </View>
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>
              {user.name.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Theme.Spacing.lg,
    paddingVertical: Theme.Spacing.md,
    backgroundColor: Theme.Colors.background.primary, // 딥 다크
    borderBottomWidth: 1,
    borderBottomColor: Theme.Colors.border.primary, // 252B3A
  },
  
  greetingContainer: {
    flex: 1,
  },
  
  greeting: {
    fontSize: Theme.Typography.fontSize.lg,
    fontWeight: Theme.Typography.fontWeight.semibold,
    color: Theme.Colors.text.primary, // E9ECF5
    marginBottom: Theme.Spacing.xs,
  },
  
  subGreeting: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.text.secondary, // AAB0C0
  },
  
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Theme.Colors.primary[500], // 6C5CE7
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Theme.Spacing.md,
  },
  
  avatarText: {
    fontSize: Theme.Typography.fontSize.base,
    fontWeight: Theme.Typography.fontWeight.semibold,
    color: Theme.Colors.text.primary, // E9ECF5
  },
  
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: Theme.Spacing.md,
  },
  
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    backgroundColor: Theme.Colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
  },
});
