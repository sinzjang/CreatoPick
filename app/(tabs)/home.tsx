/**
 * Dashboard Screen - Home Tab
 * 최근 검색어와 라이브러리 아이템을 보여주는 메인 홈 화면
 */

import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Header } from '@/components/Header';
import { SearchHistoryList } from '@/components/SearchHistoryList';
import { LibraryGrid } from '../../src/components/LibraryGrid';
import { RolePresetCarousel } from '@/components/RolePresetCarousel';
import { PresetCreationModal } from '@/components/PresetCreationModal';
import { Theme } from '@/theme/tokens';
import { mockUser, mockSearchHistory, mockLibraryItems, mockRolePresets, RolePreset, LibraryItem } from '@/data/mock';

const LIBRARY_KEY = '@creatopick_library';

export default function DashboardScreen() {
  const router = useRouter();
  const [showPresetModal, setShowPresetModal] = useState(false);
  const [presets, setPresets] = useState(mockRolePresets);
  const [items, setItems] = useState<LibraryItem[]>(mockLibraryItems);

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

  // 화면 포커스 시 라이브러리 새로고침
  useFocusEffect(
    useCallback(() => {
      loadLibraryItems();
    }, [loadLibraryItems])
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
        
        {/* 라이브러리 그리드 */}
        <LibraryGrid
          items={items}
          onItemPress={handleItemPress}
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
