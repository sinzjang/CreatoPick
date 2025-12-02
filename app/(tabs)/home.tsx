/**
 * Dashboard Screen - Home Tab
 * 최근 검색어와 라이브러리 아이템을 보여주는 메인 홈 화면
 */

import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
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
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Header with Avatar */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Welcome back, {mockUser.name}</Text>
          </View>
          <Image
            source={{ uri: mockUser.avatar }}
            style={styles.avatar}
          />
        </View>

        {/* Add Reference Button */}
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/library')}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={20} color="white" />
          <Text style={styles.addButtonText}>Add Reference</Text>
        </TouchableOpacity>

        {/* Recently Added */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recently Added</Text>
          <View style={styles.grid}>
            {items.slice(0, 4).map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={styles.card}
                onPress={() => handleItemPress(item)}
                activeOpacity={0.9}
              >
                <Image
                  source={{ uri: item.imageUrl }}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.cardSubtitle} numberOfLines={1}>
                    {item.source || 'Reference'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recently Opened Packs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recently Opened Packs</Text>
          <View style={styles.packsList}>
            <TouchableOpacity style={styles.packItem} activeOpacity={0.8}>
              <View style={[styles.packIcon, { backgroundColor: '#FFA726' }]}>
                <Ionicons name="folder" size={24} color="white" />
              </View>
              <View style={styles.packInfo}>
                <Text style={styles.packName}>Inspiration</Text>
                <Text style={styles.packCount}>8 references</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.packItem} activeOpacity={0.8}>
              <View style={[styles.packIcon, { backgroundColor: '#5C6BC0' }]}>
                <Ionicons name="briefcase" size={24} color="white" />
              </View>
              <View style={styles.packInfo}>
                <Text style={styles.packName}>Project Alpha</Text>
                <Text style={styles.packCount}>12 references</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  
  scrollView: {
    flex: 1,
  },
  
  contentContainer: {
    padding: 20,
  },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  
  welcomeText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
  },
  
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E0E0E0',
  },
  
  addButton: {
    backgroundColor: '#4C6FFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 32,
    gap: 8,
  },
  
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  
  section: {
    marginBottom: 32,
  },
  
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 16,
  },
  
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  
  card: {
    width: (width - 52) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  
  cardImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#F5F5F5',
  },
  
  cardContent: {
    padding: 12,
  },
  
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  
  cardSubtitle: {
    fontSize: 12,
    color: '#757575',
  },
  
  packsList: {
    gap: 12,
  },
  
  packItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  
  packIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  packInfo: {
    flex: 1,
  },
  
  packName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
  },
  
  packCount: {
    fontSize: 14,
    color: '#757575',
  },
});
