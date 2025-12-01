/**
 * Bookmark Detail Screen
 * 북마크 상세 및 메모 작성 화면 (UX/UI 프리셋 필드)
 * URL 북마크와 이미지 북마크 모두 사용
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
  Modal,
  Dimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Theme } from '@/theme/tokens';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// UX/UI 카테고리 프리셋 필드
const UX_UI_FIELDS = [
  {
    id: 'target-user',
    label: '타겟 사용자',
    placeholder: '예: 20-30대 직장인, 디자이너',
    icon: 'people-outline',
  },
  {
    id: 'key-feature',
    label: '핵심 기능',
    placeholder: '주요 기능이나 특징을 설명하세요',
    icon: 'star-outline',
  },
  {
    id: 'ui-pattern',
    label: 'UI 패턴',
    placeholder: '예: 카드 레이아웃, 탭 네비게이션',
    icon: 'grid-outline',
  },
  {
    id: 'color-scheme',
    label: '컬러 스킴',
    placeholder: '예: 다크 모드, 파스텔 톤',
    icon: 'color-palette-outline',
  },
  {
    id: 'interaction',
    label: '인터랙션',
    placeholder: '애니메이션, 제스처 등',
    icon: 'hand-left-outline',
  },
  {
    id: 'why-saved',
    label: '저장 이유',
    placeholder: '이 레퍼런스를 저장한 이유',
    icon: 'bookmark-outline',
    multiline: true,
  },
];

export default function BookmarkDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const imageUri = params.imageUri as string;
  const category = params.category as string;
  const title = params.title as string;
  const source = params.source as string;

  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [showImageModal, setShowImageModal] = useState(false);

  const handleFieldChange = (fieldId: string, value: string) => {
    setFieldValues(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleSave = () => {
    // TODO: 북마크 저장 로직
    const bookmark = {
      imageUri,
      category,
      title,
      source,
      memo: fieldValues,
      createdAt: new Date().toISOString(),
    };

    console.log('Saving bookmark:', bookmark);
    Alert.alert('저장 완료', '북마크가 저장되었습니다!', [
      {
        text: '확인',
        onPress: () => router.push('/(tabs)/bookmarks'),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={28} color={Theme.Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>메모 작성</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>저장</Text>
        </TouchableOpacity>
      </View>

      {/* 상단 고정 이미지 썸네일 */}
      <TouchableOpacity
        style={styles.imageThumbnailContainer}
        onPress={() => setShowImageModal(true)}
        activeOpacity={0.8}
      >
        <Image source={{ uri: imageUri }} style={styles.imageThumbnail} />
        <View style={styles.thumbnailOverlay}>
          <View style={styles.thumbnailInfo}>
            <Text style={styles.thumbnailTitle} numberOfLines={1}>{title}</Text>
            {source && <Text style={styles.thumbnailSource}>{source}</Text>}
          </View>
          <Ionicons name="expand-outline" size={20} color="white" />
        </View>
      </TouchableOpacity>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

        {/* 메모 필드 */}
        <View style={styles.memoSection}>
          <Text style={styles.sectionTitle}>UX/UI 분석</Text>
          <Text style={styles.sectionSubtitle}>
            레퍼런스를 분석하고 메모를 남겨보세요
          </Text>

          {UX_UI_FIELDS.map((field) => (
            <View key={field.id} style={styles.fieldContainer}>
              <View style={styles.fieldHeader}>
                <Ionicons
                  name={field.icon as any}
                  size={20}
                  color={Theme.Colors.primary[500]}
                />
                <Text style={styles.fieldLabel}>{field.label}</Text>
              </View>
              <TextInput
                style={[
                  styles.fieldInput,
                  field.multiline && styles.fieldInputMultiline,
                ]}
                placeholder={field.placeholder}
                placeholderTextColor={Theme.Colors.text.tertiary}
                value={fieldValues[field.id] || ''}
                onChangeText={(value) => handleFieldChange(field.id, value)}
                multiline={field.multiline}
                numberOfLines={field.multiline ? 4 : 1}
                textAlignVertical={field.multiline ? 'top' : 'center'}
              />
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Save Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.bottomSaveButton}
          onPress={handleSave}
          activeOpacity={0.8}
        >
          <Ionicons name="checkmark-circle" size={24} color="white" />
          <Text style={styles.bottomSaveButtonText}>저장하기</Text>
        </TouchableOpacity>
      </View>

      {/* 전체 화면 이미지 모달 */}
      <Modal
        visible={showImageModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowImageModal(false)}
      >
        <View style={styles.imageModalContainer}>
          <TouchableOpacity
            style={styles.imageModalBackground}
            activeOpacity={1}
            onPress={() => setShowImageModal(false)}
          >
            <Image
              source={{ uri: imageUri }}
              style={styles.fullScreenImage}
              resizeMode="contain"
            />
          </TouchableOpacity>

          {/* 닫기 버튼 */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowImageModal(false)}
            activeOpacity={0.8}
          >
            <Ionicons name="close" size={32} color="white" />
          </TouchableOpacity>
        </View>
      </Modal>
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

  saveButton: {
    paddingHorizontal: Theme.Spacing.md,
    paddingVertical: Theme.Spacing.xs,
  },

  saveButtonText: {
    fontSize: Theme.Typography.fontSize.base,
    fontWeight: Theme.Typography.fontWeight.semibold,
    color: Theme.Colors.primary[500],
  },

  content: {
    flex: 1,
  },

  // 상단 고정 썸네일
  imageThumbnailContainer: {
    height: 120,
    marginHorizontal: Theme.Spacing.lg,
    marginVertical: Theme.Spacing.md,
    borderRadius: Theme.Radius.lg,
    overflow: 'hidden',
    position: 'relative',
  },

  imageThumbnail: {
    width: '100%',
    height: '100%',
  },

  thumbnailOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Theme.Spacing.md,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },

  thumbnailInfo: {
    flex: 1,
    marginRight: Theme.Spacing.sm,
  },

  thumbnailTitle: {
    fontSize: Theme.Typography.fontSize.base,
    fontWeight: Theme.Typography.fontWeight.semibold,
    color: 'white',
    marginBottom: 2,
  },

  thumbnailSource: {
    fontSize: Theme.Typography.fontSize.xs,
    color: 'rgba(255,255,255,0.8)',
  },

  // 전체 화면 이미지 모달
  imageModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
  },

  imageModalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  fullScreenImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },

  closeButton: {
    position: 'absolute',
    top: 50,
    right: Theme.Spacing.lg,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  memoSection: {
    padding: Theme.Spacing.lg,
  },

  sectionTitle: {
    fontSize: Theme.Typography.fontSize.lg,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.text.primary,
    marginBottom: Theme.Spacing.xs,
  },

  sectionSubtitle: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.text.secondary,
    marginBottom: Theme.Spacing.xl,
  },

  fieldContainer: {
    marginBottom: Theme.Spacing.lg,
  },

  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.Spacing.xs,
    marginBottom: Theme.Spacing.sm,
  },

  fieldLabel: {
    fontSize: Theme.Typography.fontSize.sm,
    fontWeight: Theme.Typography.fontWeight.medium,
    color: Theme.Colors.text.primary,
  },

  fieldInput: {
    backgroundColor: Theme.Colors.background.secondary,
    borderRadius: Theme.Radius.md,
    paddingHorizontal: Theme.Spacing.md,
    paddingVertical: Theme.Spacing.md,
    fontSize: Theme.Typography.fontSize.base,
    color: Theme.Colors.text.primary,
    borderWidth: 1,
    borderColor: Theme.Colors.border,
  },

  fieldInputMultiline: {
    minHeight: 100,
    paddingTop: Theme.Spacing.md,
  },

  footer: {
    padding: Theme.Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Theme.Colors.border,
  },

  bottomSaveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.Colors.primary[500],
    paddingVertical: Theme.Spacing.md,
    borderRadius: Theme.Radius.lg,
    gap: Theme.Spacing.sm,
  },

  bottomSaveButtonText: {
    fontSize: Theme.Typography.fontSize.base,
    fontWeight: Theme.Typography.fontWeight.semibold,
    color: 'white',
  },
});
