/**
 * Dashboard Screen - Home Tab
 * 최근 검색어와 라이브러리 아이템을 보여주는 메인 홈 화면
 */

import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Text, FlatList, Dimensions } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Header } from '@/components/Header';
import { SearchHistoryList } from '@/components/SearchHistoryList';
import { LibraryGrid } from '../../src/components/LibraryGrid';
import { Theme } from '@/theme/tokens';
import { mockUser, mockLibraryItems, LibraryItem } from '@/data/mock';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.7;
const CARD_MARGIN = 12;

const LIBRARY_KEY = '@creatopick_library';
const SEARCH_HISTORY_KEY = '@creatopick_search_history';

export default function DashboardScreen() {
  const router = useRouter();
  const [items, setItems] = useState<LibraryItem[]>(mockLibraryItems);
  const [searchHistory, setSearchHistory] = useState<any[]>([]);

  const loadLibraryItems = useCallback(async () => {
    try {
      const saved = await AsyncStorage.getItem(LIBRARY_KEY);
      if (saved) {
        const savedItems = JSON.parse(saved);
        // Mock 데이터와 저장된 데이터 합치기 (최대 6개만 표시)
        setItems([...savedItems, ...mockLibraryItems].slice(0, 6));
      } else {
        setItems(mockLibraryItems);
      }
    } catch (error) {
      console.error('Load library items error:', error);
      setItems(mockLibraryItems);
    }
  }, []);

  const loadSearchHistory = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(SEARCH_HISTORY_KEY);
      if (stored) {
        const history = JSON.parse(stored);
        setSearchHistory(history.slice(0, 5)); // 최대 5개만 표시
      }
    } catch (error) {
      console.error('Load search history error:', error);
    }
  }, []);

  // 화면 포커스 시 라이브러리 및 검색 히스토리 새로고침
  useFocusEffect(
    useCallback(() => {
      loadLibraryItems();
      loadSearchHistory();
    }, [loadLibraryItems, loadSearchHistory])
  );

  // 검색어 클릭 핸들러 (나중에 검색 화면으로 이동)
  const handleSearchPress = (query: string) => {
    console.log('Search pressed:', query);
  };

  // 라이브러리 아이템 클릭 핸들러 - 상세 페이지로 이동
  const handleItemPress = (item: LibraryItem) => {
    console.log('Library item pressed:', item);
    router.push({
      pathname: '/library-detail',
      params: {
        id: item.id,
        imageUri: item.imageUrl,
        title: item.title,
        source: item.source || '',
        category: 'ux-ui', // TODO: 실제 카테고리 저장 필요
      },
    });
  };


  return (
    <View style={styles.container}>
      {/* 상단 헤더 - 사용자 이름과 아바타 */}
      <Header user={mockUser} />
      
      {/* 스크롤 가능한 콘텐츠 */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* 최근 검색어 */}
        {searchHistory.length > 0 && (
          <SearchHistoryList 
            searches={searchHistory}
            onSearchPress={handleSearchPress}
          />
        )}
        
        {/* Library 캐러셀 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Library</Text>
          <FlatList
            data={items}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={CARD_WIDTH + CARD_MARGIN * 2}
            decelerationRate="fast"
            contentContainerStyle={styles.carouselContent}
            renderItem={({ item }) => (
              <LibraryGrid
                items={[item]}
                onItemPress={handleItemPress}
              />
            )}
            keyExtractor={(item) => item.id}
          />
        </View>
        
        {/* Packs 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Packs</Text>
          <View style={styles.packsPlaceholder}>
            <Text style={styles.placeholderText}>곧 추가될 예정입니다</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.Colors.background.primary, // 라이트 베이지
  },
  
  scrollView: {
    flex: 1,
  },
  
  section: {
    marginTop: Theme.Spacing.lg,
    paddingHorizontal: Theme.Spacing.lg,
  },
  
  sectionTitle: {
    fontSize: Theme.Typography.fontSize.xl,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: '#1A202C',
    marginBottom: Theme.Spacing.md,
  },
  
  carouselContent: {
    paddingRight: Theme.Spacing.lg,
  },
  
  packsPlaceholder: {
    backgroundColor: Theme.Colors.surface.primary,
    borderRadius: Theme.Radius.lg,
    padding: Theme.Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 150,
    borderWidth: 1,
    borderColor: Theme.Colors.border.primary,
    borderStyle: 'dashed',
  },
  
  placeholderText: {
    fontSize: Theme.Typography.fontSize.base,
    color: Theme.Colors.text.tertiary,
  },
});
