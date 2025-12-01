/**
 * Bookmark Grid Component
 * 저장된 이미지를 2열 그리드로 표시
 */

import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Theme } from '@/theme/tokens';
import { BookmarkItem } from '@/data/mock';

interface BookmarkGridProps {
  bookmarks: BookmarkItem[];
  title?: string;
  onBookmarkPress?: (bookmark: BookmarkItem) => void;
}

export const BookmarkGrid: React.FC<BookmarkGridProps> = ({ 
  bookmarks, 
  title,
  onBookmarkPress 
}) => {
  const renderItem = ({ item }: { item: BookmarkItem }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onBookmarkPress?.(item)}
      activeOpacity={0.8}
    >
      {/* 이미지 */}
      <Image 
        source={{ 
          uri: item.imageUrl,
          cache: 'force-cache', // 캐시 강제 사용
        }} 
        style={styles.image}
        resizeMode="contain" // 이미지 전체가 보이도록
        fadeDuration={300} // 페이드 인 효과
      />
      
      {/* 카드 정보 */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        {item.source && (
          <Text style={styles.source}>{item.source}</Text>
        )}
        
        {/* 설명 */}
        {item.description && (
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
        )}
        
        {/* 메모 표시 */}
        {item.memo && (
          <View style={styles.memoIndicator}>
            <Text style={styles.memoText}>📝 메모 있음</Text>
          </View>
        )}
        
        {/* 태그 */}
        {item.tags && item.tags.length > 0 && (
          <View style={styles.tags}>
            {item.tags.slice(0, 2).map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
            {item.tags.length > 2 && (
              <Text style={styles.moreText}>+{item.tags.length - 2}</Text>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* 섹션 타이틀 */}
      <Text style={styles.sectionTitle}>Bookmarks</Text>
      
      {/* 그리드 */}
      <FlatList
        data={bookmarks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.grid}
        scrollEnabled={false}
        contentContainerStyle={styles.gridContent}
        removeClippedSubviews={true} // 화면 밖 뷰 제거
        maxToRenderPerBatch={10} // 한 번에 렌더링할 최대 아이템 수
        updateCellsBatchingPeriod={50} // 배치 업데이트 주기
        initialNumToRender={6} // 초기 렌더링 아이템 수
        windowSize={5} // 렌더링 윈도우 크기
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Theme.Spacing.lg,
    paddingVertical: Theme.Spacing.md,
    backgroundColor: Theme.Colors.background.primary, // 딥 다크
  },
  
  sectionTitle: {
    fontSize: Theme.Typography.fontSize.xl,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: '#1A202C',
    marginBottom: Theme.Spacing.md,
  },
  
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  
  gridContent: {
    paddingBottom: Theme.Spacing.md,
  },
  
  card: {
    width: '48%',
    backgroundColor: Theme.Colors.surface.primary,
    borderRadius: Theme.Radius.lg,
    marginBottom: Theme.Spacing.md,
    overflow: 'hidden',
    ...Theme.Shadow.md,
  },
  
  image: {
    width: '100%',
    height: 120, // 이미지 높이를 절반으로 축소
    backgroundColor: Theme.Colors.border.primary,
  },
  
  content: {
    padding: Theme.Spacing.lg,
  },
  
  title: {
    fontSize: Theme.Typography.fontSize.base,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: '#1A202C',
    marginBottom: Theme.Spacing.sm,
    lineHeight: 20, // 명시적 lineHeight
  },
  
  source: {
    fontSize: Theme.Typography.fontSize.sm,
    color: '#4A5568',
    marginBottom: Theme.Spacing.sm,
    fontWeight: Theme.Typography.fontWeight.medium,
    lineHeight: 18,
  },
  
  description: {
    fontSize: Theme.Typography.fontSize.sm,
    color: '#4A5568',
    marginBottom: Theme.Spacing.md,
    lineHeight: 20, // 명시적 lineHeight
  },
  
  memoIndicator: {
    backgroundColor: Theme.Colors.primary[700],
    paddingHorizontal: Theme.Spacing.sm,
    paddingVertical: 4,
    borderRadius: Theme.Radius.sm,
    alignSelf: 'flex-start',
    marginBottom: Theme.Spacing.sm,
  },
  
  memoText: {
    fontSize: Theme.Typography.fontSize.xs,
    color: '#FFFFFF',
    fontWeight: Theme.Typography.fontWeight.semibold,
  },
  
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.Spacing.xs,
    marginTop: Theme.Spacing.xs,
  },
  
  tag: {
    backgroundColor: Theme.Colors.primary[500],
    paddingHorizontal: Theme.Spacing.sm,
    paddingVertical: 6,
    borderRadius: Theme.Radius.md,
    marginBottom: Theme.Spacing.xs,
  },
  
  tagText: {
    fontSize: Theme.Typography.fontSize.xs,
    fontWeight: Theme.Typography.fontWeight.semibold,
    color: '#FFFFFF',
  },
  
  moreText: {
    fontSize: Theme.Typography.fontSize.xs,
    fontWeight: Theme.Typography.fontWeight.medium,
    color: '#718096',
  },
});
