/**
 * Add URL Library Item Component
 * URL을 입력받아 크롤링하고 라이브러리 아이템을 생성하는 컴포넌트
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Theme } from '@/theme/tokens';
import { smartCrawl, CrawledData } from '@/services/urlCrawler';
import { downloadImage } from '@/services/imageDownloader';
import { EnhancedLibraryItem, ImageData } from '@/types/library';

interface AddUrlLibraryItemProps {
  visible: boolean;
  onClose: () => void;
  onSave: (item: EnhancedLibraryItem) => void;
}

export default function AddUrlLibraryItem({ visible, onClose, onSave }: AddUrlLibraryItemProps) {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [crawledData, setCrawledData] = useState<CrawledData | null>(null);
  const [selectedImages, setSelectedImages] = useState<number[]>([]);
  const [memo, setMemo] = useState('');

  const handleCrawl = async () => {
    if (!url.trim()) {
      Alert.alert('오류', 'URL을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    
    try {
      // URL 크롤링
      const data = await smartCrawl(url);
      setCrawledData(data);
      
      // 첫 번째 이미지 자동 선택
      if (data.images.length > 0) {
        setSelectedImages([0]);
      }
      
      Alert.alert('성공', `${data.images.length}개의 이미지를 찾았습니다!`);
    } catch (error) {
      console.error('Crawl error:', error);
      Alert.alert('오류', 'URL 크롤링에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleImageSelection = (index: number) => {
    setSelectedImages(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  const handleSave = async () => {
    if (!crawledData) {
      Alert.alert('오류', '먼저 URL을 크롤링해주세요.');
      return;
    }

    if (selectedImages.length === 0) {
      Alert.alert('오류', '최소 1개의 이미지를 선택해주세요.');
      return;
    }

    setIsLoading(true);
    
    try {
      // 선택된 이미지 URL들
      const selectedImageUrls = selectedImages.map(index => crawledData.images[index]);
      
      console.log('Downloading images...', selectedImageUrls);
      
      // 이미지 다운로드 (병렬 처리)
      const downloadPromises = selectedImageUrls.map(async (url) => {
        const result = await downloadImage(url);
        if (result.success && result.localUri) {
          return {
            url,
            localUri: result.localUri,
          };
        } else {
          // 다운로드 실패 시 URL만 저장
          console.warn('Failed to download image:', url, result.error);
          return {
            url,
          };
        }
      });

      const images: ImageData[] = await Promise.all(downloadPromises);
      
      const successCount = images.filter(img => img.localUri).length;
      console.log(`Downloaded ${successCount}/${images.length} images successfully`);

      const item: EnhancedLibraryItem = {
        id: Date.now().toString(),
        url: crawledData.url,
        title: crawledData.title,
        description: crawledData.description,
        siteName: crawledData.siteName,
        images,
        userMemo: memo,
        conversations: [],
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      onSave(item);
      
      Alert.alert(
        '성공', 
        `${images.length}개의 이미지 중 ${successCount}개가 다운로드되었습니다!`
      );
      
      // 초기화
      setUrl('');
      setCrawledData(null);
      setSelectedImages([]);
      setMemo('');
      onClose();
    } catch (error) {
      console.error('Save error:', error);
      Alert.alert('오류', '북마크 저장에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setUrl('');
    setCrawledData(null);
    setSelectedImages([]);
    setMemo('');
    onClose();
  };

  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={[styles.container, { paddingBottom: insets.bottom }]}>
          {/* Header */}
          <View style={[styles.header, { paddingTop: insets.top }]}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="close" size={28} color={Theme.Colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>URL 아이템 추가</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content}>
          {/* URL Input */}
          <View style={styles.section}>
            <Text style={styles.label}>URL</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="https://www.pinterest.com/pin/..."
                placeholderTextColor={Theme.Colors.text.muted}
                value={url}
                onChangeText={setUrl}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
              />
              <TouchableOpacity
                style={styles.crawlButton}
                onPress={handleCrawl}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.crawlButtonText}>검색</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Crawled Data */}
          {crawledData && (
            <>
              {/* Page Info */}
              <View style={styles.section}>
                <Text style={styles.label}>페이지 정보</Text>
                <View style={styles.infoCard}>
                  <Text style={styles.infoTitle}>{crawledData.title}</Text>
                  {crawledData.description && (
                    <Text style={styles.infoDescription}>
                      {crawledData.description}
                    </Text>
                  )}
                  {crawledData.siteName && (
                    <Text style={styles.infoSite}>출처: {crawledData.siteName}</Text>
                  )}
                </View>
              </View>

              {/* Images */}
              <View style={styles.section}>
                <Text style={styles.label}>
                  이미지 선택 ({selectedImages.length}/{crawledData.images.length})
                </Text>
                <View style={styles.imagesGrid}>
                  {crawledData.images.map((imageUrl, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.imageCard,
                        selectedImages.includes(index) && styles.imageCardSelected,
                      ]}
                      onPress={() => toggleImageSelection(index)}
                    >
                      <Image
                        source={{ uri: imageUrl }}
                        style={styles.imagePreview}
                        resizeMode="cover"
                      />
                      {selectedImages.includes(index) && (
                        <View style={styles.imageCheckmark}>
                          <Ionicons name="checkmark-circle" size={32} color={Theme.Colors.primary[500]} />
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Memo */}
              <View style={styles.section}>
                <Text style={styles.label}>메모 (선택)</Text>
                <TextInput
                  style={styles.memoInput}
                  placeholder="이 디자인에 대한 메모를 작성하세요..."
                  placeholderTextColor={Theme.Colors.text.muted}
                  value={memo}
                  onChangeText={setMemo}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>

              {/* Save Button */}
              <TouchableOpacity
                style={[
                  styles.saveButton,
                  (isLoading || selectedImages.length === 0) && styles.saveButtonDisabled,
                ]}
                onPress={handleSave}
                disabled={isLoading || selectedImages.length === 0}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.saveButtonText}>저장</Text>
                )}
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
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
    borderBottomColor: Theme.Colors.border.primary,
  },

  closeButton: {
    padding: Theme.Spacing.xs,
  },

  headerTitle: {
    fontSize: Theme.Typography.fontSize.xl,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.text.primary,
  },

  placeholder: {
    width: 44,
  },

  content: {
    flex: 1,
    padding: Theme.Spacing.lg,
  },

  section: {
    marginBottom: Theme.Spacing.xl,
  },

  label: {
    fontSize: Theme.Typography.fontSize.md,
    fontWeight: Theme.Typography.fontWeight.semibold,
    color: Theme.Colors.text.primary,
    marginBottom: Theme.Spacing.sm,
  },

  inputContainer: {
    flexDirection: 'row',
    gap: Theme.Spacing.sm,
  },

  input: {
    flex: 1,
    backgroundColor: Theme.Colors.surface.primary,
    borderRadius: Theme.Radius.md,
    paddingHorizontal: Theme.Spacing.md,
    paddingVertical: Theme.Spacing.sm,
    fontSize: Theme.Typography.fontSize.md,
    color: Theme.Colors.text.primary,
    borderWidth: 1,
    borderColor: Theme.Colors.border.primary,
  },

  crawlButton: {
    backgroundColor: Theme.Colors.primary[500],
    borderRadius: Theme.Radius.md,
    paddingHorizontal: Theme.Spacing.lg,
    paddingVertical: Theme.Spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 80,
  },

  crawlButtonText: {
    color: 'white',
    fontSize: Theme.Typography.fontSize.md,
    fontWeight: Theme.Typography.fontWeight.semibold,
  },

  infoCard: {
    backgroundColor: Theme.Colors.surface.primary,
    borderRadius: Theme.Radius.lg,
    padding: Theme.Spacing.md,
    borderWidth: 1,
    borderColor: Theme.Colors.border.primary,
  },

  infoTitle: {
    fontSize: Theme.Typography.fontSize.lg,
    fontWeight: Theme.Typography.fontWeight.semibold,
    color: Theme.Colors.text.primary,
    marginBottom: Theme.Spacing.xs,
  },

  infoDescription: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.text.secondary,
    marginBottom: Theme.Spacing.xs,
    lineHeight: Theme.Typography.lineHeight.normal,
  },

  infoSite: {
    fontSize: Theme.Typography.fontSize.xs,
    color: Theme.Colors.text.muted,
  },

  imagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.Spacing.md,
  },

  imageCard: {
    width: '47%',
    aspectRatio: 1,
    borderRadius: Theme.Radius.md,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },

  imageCardSelected: {
    borderColor: Theme.Colors.primary[500],
  },

  imagePreview: {
    width: '100%',
    height: '100%',
    backgroundColor: Theme.Colors.surface.primary,
  },

  imageCheckmark: {
    position: 'absolute',
    top: Theme.Spacing.sm,
    right: Theme.Spacing.sm,
    backgroundColor: 'white',
    borderRadius: 16,
  },

  memoInput: {
    backgroundColor: Theme.Colors.surface.primary,
    borderRadius: Theme.Radius.md,
    padding: Theme.Spacing.md,
    fontSize: Theme.Typography.fontSize.md,
    color: Theme.Colors.text.primary,
    borderWidth: 1,
    borderColor: Theme.Colors.border.primary,
    minHeight: 100,
  },

  saveButton: {
    backgroundColor: Theme.Colors.primary[500],
    borderRadius: Theme.Radius.md,
    paddingVertical: Theme.Spacing.md,
    alignItems: 'center',
    marginBottom: Theme.Spacing.xl,
  },

  saveButtonDisabled: {
    backgroundColor: Theme.Colors.surface.secondary,
  },

  saveButtonText: {
    color: 'white',
    fontSize: Theme.Typography.fontSize.lg,
    fontWeight: Theme.Typography.fontWeight.bold,
  },
});
