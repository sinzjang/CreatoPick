/**
 * Dashboard Screen - Home Tab
 * 최근 검색어와 북마크를 보여주는 메인 홈 화면
 */

import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Header } from '@/components/Header';
import { SearchHistoryList } from '@/components/SearchHistoryList';
import { BookmarkGrid } from '@/components/BookmarkGrid';
import { RolePresetCarousel } from '@/components/RolePresetCarousel';
import { PresetCreationModal } from '@/components/PresetCreationModal';
import { Theme } from '@/theme/tokens';
import { mockUser, mockSearchHistory, mockBookmarks, mockRolePresets, RolePreset, BookmarkItem } from '@/data/mock';

const BOOKMARKS_KEY = '@creatopick_bookmarks';

export default function DashboardScreen() {
  const router = useRouter();
  const [showPresetModal, setShowPresetModal] = useState(false);
  const [presets, setPresets] = useState(mockRolePresets);
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(mockBookmarks);

  const loadBookmarks = useCallback(async () => {
    try {
      const saved = await AsyncStorage.getItem(BOOKMARKS_KEY);
      if (saved) {
        const savedBookmarks = JSON.parse(saved);
        // Mock 데이터와 저장된 데이터 합치기 (최대 6개만 표시)
        setBookmarks([...savedBookmarks, ...mockBookmarks].slice(0, 6));
      } else {
        setBookmarks(mockBookmarks);
      }
    } catch (error) {
      console.error('Load bookmarks error:', error);
      setBookmarks(mockBookmarks);
    }
  }, []);

  // 화면 포커스 시 북마크 새로고침
  useFocusEffect(
    useCallback(() => {
      loadBookmarks();
    }, [loadBookmarks])
  );

  // 검색어 클릭 핸들러 (나중에 검색 화면으로 이동)
  const handleSearchPress = (query: string) => {
    console.log('Search pressed:', query);
  };

  // 북마크 클릭 핸들러 - 상세 페이지로 이동
  const handleBookmarkPress = (bookmark: BookmarkItem) => {
    console.log('Bookmark pressed:', bookmark);
    router.push({
      pathname: '/bookmark-detail',
      params: {
        id: bookmark.id,
        imageUri: bookmark.imageUrl,
        title: bookmark.title,
        source: bookmark.source || '',
        category: 'ux-ui',
      },
    });
  };

  // Role Preset 클릭 핸들러
  const handlePresetPress = (preset: RolePreset) => {
    console.log('Preset pressed:', preset);
  };

  // Preset 추가 핸들러
  const handleAddPreset = () => {
    setShowPresetModal(true);
  };

  // Preset 생성 완료 핸들러
  const handlePresetComplete = (newPreset: {
    name: string;
    field: string;
    role: string;
    topic?: string;
  }) => {
    const preset: RolePreset = {
      id: Date.now().toString(),
      name: newPreset.name,
      field: newPreset.field,
      role: newPreset.role,
      color: Theme.Colors.primary[500], // 기본 색상
    };
    setPresets([...presets, preset]);
    console.log('New preset created:', preset);
  };

  // 모달 닫기 핸들러
  const handleCloseModal = () => {
    setShowPresetModal(false);
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
        {/* Role Preset 캐러셀 */}
        <RolePresetCarousel 
          presets={presets}
          onPresetPress={handlePresetPress}
          onAddPress={handleAddPreset}
        />
        
        {/* 최근 검색어 */}
        <SearchHistoryList 
          searches={mockSearchHistory}
          onSearchPress={handleSearchPress}
        />
        
        {/* 북마크 그리드 */}
        <BookmarkGrid 
          bookmarks={bookmarks}
          onBookmarkPress={handleBookmarkPress}
        />
      </ScrollView>
      
      {/* Preset Creation Modal */}
      <PresetCreationModal
        visible={showPresetModal}
        onClose={handleCloseModal}
        onComplete={handlePresetComplete}
      />
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
});
