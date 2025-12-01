/**
 * Bookmarks Screen
 * 저장된 북마크를 관리하는 전용 화면
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
import { BookmarkGrid } from '@/components/BookmarkGrid';
import AddUrlBookmark from '@/components/AddUrlBookmark';
import { mockBookmarks, BookmarkItem } from '@/data/mock';
import { EnhancedBookmark } from '@/types/bookmark';

const BOOKMARKS_KEY = '@creatopick_bookmarks';

export default function BookmarksScreen() {
  const router = useRouter();
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFabMenu, setShowFabMenu] = useState(false);
  
  // 애니메이션 값
  const fabRotation = useRef(new Animated.Value(0)).current;
  const fabButton1Scale = useRef(new Animated.Value(0)).current;
  const fabButton2Scale = useRef(new Animated.Value(0)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  // 화면 포커스 시 북마크 새로고침
  useFocusEffect(
    useCallback(() => {
      loadBookmarks();
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

  const loadBookmarks = async () => {
    try {
      const saved = await AsyncStorage.getItem(BOOKMARKS_KEY);
      if (saved) {
        const savedBookmarks = JSON.parse(saved);
        // Mock 데이터와 저장된 데이터 합치기
        setBookmarks([...savedBookmarks, ...mockBookmarks]);
      } else {
        // 저장된 데이터가 없으면 Mock 데이터만 표시
        setBookmarks(mockBookmarks);
      }
    } catch (error) {
      console.error('Load bookmarks error:', error);
      // 에러 발생 시에도 Mock 데이터 표시
      setBookmarks(mockBookmarks);
    }
  };

  // 새 북마크 저장
  const handleSaveBookmark = async (bookmark: EnhancedBookmark) => {
    try {
      // EnhancedBookmark를 BookmarkItem으로 변환
      // localUri가 있으면 우선 사용, 없으면 URL 사용
      const firstImage = bookmark.images[0];
      const imageUrl = firstImage?.localUri || firstImage?.url || '';
      
      const newBookmark: BookmarkItem = {
        id: bookmark.id,
        title: bookmark.title,
        source: bookmark.siteName || 'Web',
        imageUrl,
        createdAt: bookmark.createdAt.toISOString(),
        tags: bookmark.tags,
        description: bookmark.description,
        url: bookmark.url,
        memo: bookmark.userMemo,
      };

      // 기존 북마크에 추가
      const updatedBookmarks = [newBookmark, ...bookmarks];
      setBookmarks(updatedBookmarks);

      // AsyncStorage에 저장 (Mock 데이터 제외)
      const bookmarksToSave = updatedBookmarks.filter(
        b => !mockBookmarks.find(m => m.id === b.id)
      );
      await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarksToSave));

      console.log('Bookmark saved:', newBookmark);
    } catch (error) {
      console.error('Save bookmark error:', error);
      Alert.alert('오류', '북마크 저장에 실패했습니다.');
    }
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
          {bookmarks.length}개의 북마크
        </Text>
      </View>

      {/* Bookmarks Grid */}
      <ScrollView style={styles.content}>
        <BookmarkGrid
          bookmarks={bookmarks}
          onBookmarkPress={handleBookmarkPress}
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
                router.push('/create-bookmark');
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

      {/* Add URL Modal */}
      <AddUrlBookmark
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleSaveBookmark}
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
