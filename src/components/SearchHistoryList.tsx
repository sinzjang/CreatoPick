/**
 * Search History List Component
 * 최근 검색어를 Pill 형태로 표시
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '@/theme/tokens';
import { SearchHistoryItem } from '@/data/mock';

interface SearchHistoryListProps {
  searches: SearchHistoryItem[];
  onSearchPress?: (query: string) => void;
}

export const SearchHistoryList: React.FC<SearchHistoryListProps> = ({ 
  searches, 
  onSearchPress 
}) => {
  return (
    <View style={styles.container}>
      {/* 섹션 타이틀 */}
      <Text style={styles.title}>Recent Searches</Text>
      
      {/* 검색어 리스트 - 가로 스크롤 */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.pillsContainer}
      >
        {searches.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.pill}
            onPress={() => onSearchPress?.(item.query)}
            activeOpacity={0.7}
          >
            <Ionicons 
              name="time-outline" 
              size={Theme.Icon.sm} 
              color={Theme.Colors.text.muted} 
            />
            <Text style={styles.pillText} numberOfLines={1}>
              {item.query}
            </Text>
            {item.resultCount && (
              <Text style={styles.pillCount}>{item.resultCount}</Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Theme.Spacing.lg,
    paddingVertical: Theme.Spacing.md,
    backgroundColor: Theme.Colors.background.primary, // 딥 다크
  },
  
  title: {
    fontSize: Theme.Typography.fontSize.lg,
    fontWeight: Theme.Typography.fontWeight.semibold,
    color: Theme.Colors.text.primary, // E9ECF5
    marginBottom: Theme.Spacing.md,
  },
  
  scrollView: {
    flexGrow: 0,
  },
  
  pillsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.Colors.surface.primary, // 141824
    paddingHorizontal: Theme.Spacing.md,
    paddingVertical: Theme.Spacing.sm,
    borderRadius: Theme.Radius.full,
    marginRight: Theme.Spacing.sm,
    borderWidth: 1,
    borderColor: Theme.Colors.border.primary, // 252B3A
    ...Theme.Shadow.sm,
  },
  
  pillText: {
    fontSize: Theme.Typography.fontSize.sm,
    fontWeight: Theme.Typography.fontWeight.medium,
    color: Theme.Colors.text.primary, // E9ECF5
    marginRight: Theme.Spacing.xs,
  },
  
  pillCount: {
    fontSize: Theme.Typography.fontSize.xs,
    fontWeight: Theme.Typography.fontWeight.normal,
    color: Theme.Colors.text.secondary, // AAB0C0
    backgroundColor: Theme.Colors.background.tertiary,
    paddingHorizontal: Theme.Spacing.xs,
    paddingVertical: 2,
    borderRadius: Theme.Radius.sm,
  },
});
