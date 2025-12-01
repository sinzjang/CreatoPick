/**
 * Library Screen
 * 저장된 라이브러리 아이템을 관리하는 전용 화면
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Animated,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Theme } from '@/theme/tokens';
import { LibraryGrid } from '../../src/components/LibraryGrid';
import AddUrlLibraryItem from '../../src/components/AddUrlLibraryItem';
import { mockLibraryItems, LibraryItem } from '@/data/mock';
import { EnhancedLibraryItem } from '../../src/types/library';

const LIBRARY_KEY = '@creatopick_library';

export default function LibraryScreen() {
  const router = useRouter();
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFabMenu, setShowFabMenu] = useState(false);
  
  // 애니메이션 값
  const fabRotation = useRef(new Animated.Value(0)).current;
  const fabButton1Scale = useRef(new Animated.Value(0)).current;
  const fabButton2Scale = useRef(new Animated.Value(0)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  // 화면 포커스 시 라이브러리 새로고침
  useFocusEffect(
    useCallback(() => {
      loadLibraryItems();
    }, [])
  );

  // FAB 메뉴 애니메이션
  useEffect(() => {
    if (showFabMenu) {
      Animated.parallel([
        Animated.timing(fabRotation, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.stagger(50, [
          Animated.spring(fabButton1Scale, {
            toValue: 1,
            friction: 5,
            useNativeDriver: true,
          }),
          Animated.spring(fabButton2Scale, {
            toValue: 1,
            friction: 5,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fabRotation, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fabButton1Scale, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(fabButton2Scale, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [showFabMenu]);

  // 라이브러리 아이템 로드
  const loadLibraryItems = async () => {
    try {
      const stored = await AsyncStorage.getItem(LIBRARY_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setItems(parsed);
      } else {
        // 초기 데이터 설정
        setItems(mockLibraryItems);
        await AsyncStorage.setItem(LIBRARY_KEY, JSON.stringify(mockLibraryItems));
      }
    } catch (error) {
      console.error('Load library items error:', error);
      Alert.alert('오류', '라이브러리 아이템을 불러오는데 실패했습니다.');
    }
  };

  // URL 라이브러리 아이템 저장 핸들러
  const handleSaveLibraryItem = async (item: EnhancedLibraryItem) => {
    try {
      // EnhancedLibraryItem을 LibraryItem으로 변환
      const newItem: LibraryItem = {
        id: item.id,
        title: item.title,
        source: item.siteName || 'Web',
        imageUrl: item.images[0]?.localUri || item.images[0]?.url || '',
        createdAt: item.createdAt.toISOString(),
        tags: item.tags,
        description: item.description,
        url: item.url,
        memo: item.userMemo,
      };

      const updated = [...items, newItem];
      setItems(updated);
      await AsyncStorage.setItem(LIBRARY_KEY, JSON.stringify(updated));

      console.log('Library item saved:', newItem);
      Alert.alert('성공', '라이브러리 아이템이 저장되었습니다!');
    } catch (error) {
      console.error('Save library item error:', error);
      Alert.alert('오류', '라이브러리 아이템 저장에 실패했습니다.');
    }
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
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Library</Text>
        <Text style={styles.headerSubtitle}>
          {items.length}개의 아이템
        </Text>
      </View>

      {/* Library Grid */}
      <ScrollView style={styles.content}>
        <LibraryGrid
          items={items}
          onItemPress={handleItemPress}
        />
      </ScrollView>

      {/* Floating Action Button Menu */}
      {showFabMenu && (
        <>
          {/* Overlay */}
          <Animated.View
            style={[
              styles.fabOverlay,
              { opacity: overlayOpacity }
            ]}
          >
            <TouchableOpacity
              style={{ flex: 1 }}
              activeOpacity={1}
              onPress={() => setShowFabMenu(false)}
            />
          </Animated.View>

          {/* 사진 추가 버튼 */}
          <Animated.View
            style={[
              styles.fabSubButton,
              styles.fabSubButton1,
              {
                transform: [{ scale: fabButton1Scale }],
              }
            ]}
          >
            <TouchableOpacity
              style={styles.fabSubButtonInner}
              onPress={() => {
                setShowFabMenu(false);
                router.push('/create-library-item');
              }}
              activeOpacity={0.8}
            >
              <Ionicons name="image-outline" size={24} color="white" />
            </TouchableOpacity>
          </Animated.View>

          {/* URL 추가 버튼 */}
          <Animated.View
            style={[
              styles.fabSubButton,
              styles.fabSubButton2,
              {
                transform: [{ scale: fabButton2Scale }],
              }
            ]}
          >
            <TouchableOpacity
              style={styles.fabSubButtonInner}
              onPress={() => {
                setShowFabMenu(false);
                setShowAddModal(true);
              }}
              activeOpacity={0.8}
            >
              <Ionicons name="link-outline" size={24} color="white" />
            </TouchableOpacity>
          </Animated.View>
        </>
      )}

      {/* Main Floating Add Button */}
      <Animated.View
        style={[
          styles.floatingButton,
          {
            transform: [{
              rotate: fabRotation.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '45deg']
              })
            }]
          }
        ]}
      >
        <TouchableOpacity
          style={styles.fabMainButtonInner}
          onPress={() => setShowFabMenu(!showFabMenu)}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={32} color="white" />
        </TouchableOpacity>
      </Animated.View>

      {/* Add URL Library Item Modal */}
      <AddUrlLibraryItem
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleSaveLibraryItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.Colors.background.primary,
  },

  header: {
    paddingHorizontal: Theme.Spacing.lg,
    paddingTop: Theme.Spacing.xl,
    paddingBottom: Theme.Spacing.md,
    backgroundColor: Theme.Colors.background.primary,
  },

  headerTitle: {
    fontSize: 32,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.text.primary,
    marginBottom: Theme.Spacing.xs,
  },

  headerSubtitle: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.text.secondary,
  },

  content: {
    flex: 1,
  },

  floatingButton: {
    position: 'absolute',
    right: Theme.Spacing.lg,
    bottom: Theme.Spacing.xl,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Theme.Colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
    ...Theme.Shadow.lg,
    elevation: 8,
    zIndex: 1000,
  },

  fabOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 998,
  },

  fabSubButton: {
    position: 'absolute',
    right: Theme.Spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Theme.Colors.primary[600],
    alignItems: 'center',
    justifyContent: 'center',
    ...Theme.Shadow.md,
    elevation: 6,
    zIndex: 999,
  },

  fabSubButton1: {
    bottom: Theme.Spacing.xl + 80, // 메인 버튼 위 80px
  },

  fabSubButton2: {
    bottom: Theme.Spacing.xl + 150, // 메인 버튼 위 150px
  },

  fabSubButtonInner: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  fabMainButtonInner: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
