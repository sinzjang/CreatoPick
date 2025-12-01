/**
 * Create Bookmark Screen
 * 이미지 선택 및 북마크 정보 입력 화면
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Theme } from '@/theme/tokens';
import { BookmarkItem } from '@/data/mock';

const REFERENCE_CATEGORIES = [
  { id: 'ux-ui', label: 'UX/UI', icon: 'phone-portrait-outline' },
  { id: 'graphic', label: 'Graphic Design', icon: 'color-palette-outline' },
  { id: 'app', label: 'App Design', icon: 'apps-outline' },
  { id: 'web', label: 'Web Design', icon: 'globe-outline' },
  { id: 'branding', label: 'Branding', icon: 'ribbon-outline' },
  { id: 'illustration', label: 'Illustration', icon: 'brush-outline' },
];

export default function CreateBookmarkScreen() {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [title, setTitle] = useState('');
  const [source, setSource] = useState('');

  // 이미지 선택
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (!permissionResult.granted) {
      Alert.alert('권한 필요', '사진 라이브러리 접근 권한이 필요합니다.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  // 북마크 저장
  const handleSave = async () => {
    if (!selectedImage) {
      Alert.alert('오류', '이미지를 선택해주세요.');
      return;
    }
    if (!selectedCategory) {
      Alert.alert('오류', '카테고리를 선택해주세요.');
      return;
    }
    if (!title.trim()) {
      Alert.alert('오류', '제목을 입력해주세요.');
      return;
    }

    try {
      // 새 북마크 생성
      const newBookmark: BookmarkItem = {
        id: Date.now().toString(),
        title: title.trim(),
        source: source.trim() || '직접 추가',
        imageUrl: selectedImage,
        createdAt: new Date().toISOString(),
        tags: [selectedCategory],
      };

      // 기존 북마크 불러오기
      const BOOKMARKS_KEY = '@creatopick_bookmarks';
      const saved = await AsyncStorage.getItem(BOOKMARKS_KEY);
      const existingBookmarks = saved ? JSON.parse(saved) : [];

      // 새 북마크 추가
      const updatedBookmarks = [newBookmark, ...existingBookmarks];
      await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updatedBookmarks));

      console.log('Bookmark saved:', newBookmark);
      
      Alert.alert('저장 완료', '북마크가 저장되었습니다!', [
        {
          text: '확인',
          onPress: () => router.push('/(tabs)/bookmarks'),
        },
      ]);
    } catch (error) {
      console.error('Save bookmark error:', error);
      Alert.alert('오류', '북마크 저장에 실패했습니다.');
    }
  };

  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="close" size={28} color={Theme.Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>새 북마크</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 이미지 선택 영역 */}
        <TouchableOpacity
          style={styles.imageContainer}
          onPress={pickImage}
          activeOpacity={0.8}
        >
          {selectedImage ? (
            <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="image-outline" size={64} color={Theme.Colors.text.tertiary} />
              <Text style={styles.imagePlaceholderText}>이미지 선택</Text>
            </View>
          )}
          {selectedImage && (
            <View style={styles.changeImageButton}>
              <Ionicons name="camera-outline" size={20} color="white" />
            </View>
          )}
        </TouchableOpacity>

        {/* Source Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Source Information</Text>

          {/* 제목 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>제목</Text>
            <TextInput
              style={styles.input}
              placeholder="북마크 제목을 입력하세요"
              placeholderTextColor={Theme.Colors.text.tertiary}
              value={title}
              onChangeText={setTitle}
            />
          </View>

          {/* 출처 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>출처 (선택)</Text>
            <TextInput
              style={styles.input}
              placeholder="예: Dribbble, Behance, Pinterest"
              placeholderTextColor={Theme.Colors.text.tertiary}
              value={source}
              onChangeText={setSource}
            />
          </View>

          {/* 카테고리 선택 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>레퍼런스 용도</Text>
            <View style={styles.categoryGrid}>
              {REFERENCE_CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryItem,
                    selectedCategory === category.id && styles.categoryItemSelected,
                  ]}
                  onPress={() => setSelectedCategory(category.id)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={category.icon as any}
                    size={24}
                    color={
                      selectedCategory === category.id
                        ? Theme.Colors.primary[500]
                        : Theme.Colors.text.secondary
                    }
                  />
                  <Text
                    style={[
                      styles.categoryLabel,
                      selectedCategory === category.id && styles.categoryLabelSelected,
                    ]}
                  >
                    {category.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Save Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.saveButton,
            (!selectedImage || !selectedCategory || !title.trim()) && styles.saveButtonDisabled,
          ]}
          onPress={handleSave}
          disabled={!selectedImage || !selectedCategory || !title.trim()}
          activeOpacity={0.8}
        >
          <Ionicons name="checkmark-circle" size={24} color="white" />
          <Text style={styles.saveButtonText}>저장하기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.Colors.background.primary,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Theme.Spacing.lg,
    paddingTop: Theme.Spacing.xl,
    paddingBottom: Theme.Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Theme.Colors.border,
  },

  backButton: {
    padding: Theme.Spacing.xs,
  },

  headerTitle: {
    fontSize: Theme.Typography.fontSize.xl,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.text.primary,
  },

  content: {
    flex: 1,
  },

  imageContainer: {
    margin: Theme.Spacing.lg,
    aspectRatio: 3 / 4,
    borderRadius: Theme.Radius.lg,
    overflow: 'hidden',
    backgroundColor: Theme.Colors.background.secondary,
  },

  selectedImage: {
    width: '100%',
    height: '100%',
  },

  imagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: Theme.Colors.border,
    borderRadius: Theme.Radius.lg,
  },

  imagePlaceholderText: {
    marginTop: Theme.Spacing.md,
    fontSize: Theme.Typography.fontSize.base,
    color: Theme.Colors.text.tertiary,
  },

  changeImageButton: {
    position: 'absolute',
    bottom: Theme.Spacing.md,
    right: Theme.Spacing.md,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Theme.Colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
    ...Theme.Shadow.md,
  },

  section: {
    paddingHorizontal: Theme.Spacing.lg,
    paddingBottom: Theme.Spacing.xl,
  },

  sectionTitle: {
    fontSize: Theme.Typography.fontSize.lg,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.text.primary,
    marginBottom: Theme.Spacing.lg,
  },

  inputGroup: {
    marginBottom: Theme.Spacing.lg,
  },

  label: {
    fontSize: Theme.Typography.fontSize.sm,
    fontWeight: Theme.Typography.fontWeight.medium,
    color: Theme.Colors.text.secondary,
    marginBottom: Theme.Spacing.sm,
  },

  input: {
    backgroundColor: Theme.Colors.background.secondary,
    borderRadius: Theme.Radius.md,
    paddingHorizontal: Theme.Spacing.md,
    paddingVertical: Theme.Spacing.md,
    fontSize: Theme.Typography.fontSize.base,
    color: Theme.Colors.text.primary,
    borderWidth: 1,
    borderColor: Theme.Colors.border,
  },

  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.Spacing.sm,
  },

  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.Spacing.md,
    paddingVertical: Theme.Spacing.sm,
    borderRadius: Theme.Radius.full,
    backgroundColor: Theme.Colors.background.secondary,
    borderWidth: 1,
    borderColor: Theme.Colors.border,
    gap: Theme.Spacing.xs,
  },

  categoryItemSelected: {
    backgroundColor: Theme.Colors.primary[50],
    borderColor: Theme.Colors.primary[500],
  },

  categoryLabel: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.text.secondary,
  },

  categoryLabelSelected: {
    color: Theme.Colors.primary[500],
    fontWeight: Theme.Typography.fontWeight.medium,
  },

  footer: {
    padding: Theme.Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Theme.Colors.border,
  },

  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.Colors.primary[500],
    paddingVertical: Theme.Spacing.md,
    borderRadius: Theme.Radius.lg,
    gap: Theme.Spacing.sm,
  },

  saveButtonDisabled: {
    backgroundColor: Theme.Colors.text.tertiary,
    opacity: 0.5,
  },

  saveButtonText: {
    fontSize: Theme.Typography.fontSize.base,
    fontWeight: Theme.Typography.fontWeight.semibold,
    color: 'white',
  },
});
