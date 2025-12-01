/**
 * Search Screen - AI Reference Search
 * AI 기반 레퍼런스 검색어 추천 시스템
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { Theme } from '@/theme/tokens';
import { generateSearchKeywords } from '../../src/services/searchKeywordGenerator';

const FIELDS = [
  { id: 'design', label: '디자인', icon: 'color-palette-outline' },
  { id: 'development', label: '개발', icon: 'code-slash-outline' },
  { id: 'marketing', label: '마케팅', icon: 'megaphone-outline' },
  { id: 'content', label: '콘텐츠', icon: 'document-text-outline' },
];

const ROLES = {
  design: [
    { id: 'ui-ux', label: 'UI/UX 디자이너' },
    { id: 'graphic', label: '그래픽 디자이너' },
    { id: 'product', label: '프로덕트 디자이너' },
    { id: 'brand', label: '브랜드 디자이너' },
  ],
  development: [
    { id: 'frontend', label: '프론트엔드 개발자' },
    { id: 'backend', label: '백엔드 개발자' },
    { id: 'fullstack', label: '풀스택 개발자' },
    { id: 'mobile', label: '모바일 개발자' },
  ],
  marketing: [
    { id: 'digital', label: '디지털 마케터' },
    { id: 'growth', label: '그로스 마케터' },
    { id: 'content-marketing', label: '콘텐츠 마케터' },
    { id: 'sns', label: 'SNS 마케터' },
  ],
  content: [
    { id: 'writer', label: '콘텐츠 라이터' },
    { id: 'video', label: '비디오 크리에이터' },
    { id: 'photo', label: '포토그래퍼' },
    { id: 'editor', label: '에디터' },
  ],
};

export default function SearchScreen() {
  const [selectedField, setSelectedField] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [topic, setTopic] = useState<string>('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateKeywords = async () => {
    if (!selectedField || !selectedRole) {
      Alert.alert('알림', '분야와 Role을 선택해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      const fieldLabel = FIELDS.find(f => f.id === selectedField)?.label || '';
      const roleLabel = ROLES[selectedField as keyof typeof ROLES]?.find(r => r.id === selectedRole)?.label || '';
      
      const generatedKeywords = await generateSearchKeywords({
        field: fieldLabel,
        role: roleLabel,
        topic: topic || undefined,
      });
      
      setKeywords(generatedKeywords);
    } catch (error) {
      console.error('Generate keywords error:', error);
      Alert.alert('오류', '검색어 생성에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeywordPress = async (keyword: string) => {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(keyword)}`;
    
    try {
      await WebBrowser.openBrowserAsync(searchUrl, {
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.AUTOMATIC,
        controlsColor: Theme.Colors.primary[500],
        toolbarColor: Theme.Colors.background.primary,
      });
    } catch (error) {
      console.error('Open browser error:', error);
      Alert.alert('오류', '브라우저를 열 수 없습니다.');
    }
  };

  const currentRoles = selectedField ? ROLES[selectedField as keyof typeof ROLES] : [];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>AI Reference Search</Text>
          <Text style={styles.subtitle}>분야와 Role을 선택하면 AI가 최적의 레퍼런스 검색어를 추천해드려요</Text>
        </View>

        {/* 분야 선택 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>분야 *</Text>
          <View style={styles.fieldGrid}>
            {FIELDS.map((field) => (
              <TouchableOpacity
                key={field.id}
                style={[
                  styles.fieldCard,
                  selectedField === field.id && styles.fieldCardSelected,
                ]}
                onPress={() => {
                  setSelectedField(field.id);
                  setSelectedRole('');
                }}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={field.icon as any}
                  size={32}
                  color={selectedField === field.id ? Theme.Colors.primary[500] : Theme.Colors.text.secondary}
                />
                <Text style={[
                  styles.fieldLabel,
                  selectedField === field.id && styles.fieldLabelSelected,
                ]}>
                  {field.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Role 선택 */}
        {selectedField && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Role *</Text>
            <View style={styles.roleList}>
              {currentRoles.map((role) => (
                <TouchableOpacity
                  key={role.id}
                  style={[
                    styles.roleChip,
                    selectedRole === role.id && styles.roleChipSelected,
                  ]}
                  onPress={() => setSelectedRole(role.id)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.roleLabel,
                    selectedRole === role.id && styles.roleLabelSelected,
                  ]}>
                    {role.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* 주제 입력 (선택사항) */}
        {selectedRole && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>주제 (선택사항)</Text>
            <TextInput
              style={styles.topicInput}
              placeholder="예: 모바일 앱 디자인, 로그인 화면, 대시보드 UI..."
              placeholderTextColor={Theme.Colors.text.tertiary}
              value={topic}
              onChangeText={setTopic}
              multiline
              numberOfLines={3}
            />
          </View>
        )}

        {/* 검색어 생성 버튼 */}
        {selectedRole && (
          <TouchableOpacity
            style={styles.generateButton}
            onPress={handleGenerateKeywords}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Ionicons name="sparkles" size={20} color="white" />
                <Text style={styles.generateButtonText}>AI 검색어 추천 받기</Text>
              </>
            )}
          </TouchableOpacity>
        )}

        {/* 추천 검색어 목록 */}
        {keywords.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>추천 검색어</Text>
            <Text style={styles.keywordHint}>검색어를 탭하면 브라우저에서 검색됩니다</Text>
            <View style={styles.keywordList}>
              {keywords.map((keyword, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.keywordCard}
                  onPress={() => handleKeywordPress(keyword)}
                  activeOpacity={0.7}
                >
                  <View style={styles.keywordContent}>
                    <Ionicons name="search-outline" size={20} color={Theme.Colors.primary[500]} />
                    <Text style={styles.keywordText}>{keyword}</Text>
                  </View>
                  <Ionicons name="open-outline" size={18} color={Theme.Colors.text.tertiary} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.Colors.background.primary,
  },
  
  content: {
    flex: 1,
  },
  
  header: {
    padding: Theme.Spacing.lg,
    paddingTop: Theme.Spacing.xl,
  },
  
  title: {
    fontSize: Theme.Typography.fontSize['3xl'],
    fontWeight: Theme.Typography.fontWeight.bold,
    color: '#1A202C',
    marginBottom: Theme.Spacing.xs,
  },
  
  subtitle: {
    fontSize: Theme.Typography.fontSize.base,
    color: Theme.Colors.text.secondary,
    lineHeight: 22,
  },
  
  section: {
    padding: Theme.Spacing.lg,
    paddingTop: 0,
  },
  
  sectionTitle: {
    fontSize: Theme.Typography.fontSize.lg,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: '#1A202C',
    marginBottom: Theme.Spacing.md,
  },
  
  fieldGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.Spacing.md,
  },
  
  fieldCard: {
    width: '47%',
    backgroundColor: Theme.Colors.surface.primary,
    borderRadius: Theme.Radius.lg,
    padding: Theme.Spacing.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    ...Theme.Shadow.sm,
  },
  
  fieldCardSelected: {
    borderColor: Theme.Colors.primary[500],
    backgroundColor: Theme.Colors.primary[50],
  },
  
  fieldLabel: {
    fontSize: Theme.Typography.fontSize.sm,
    fontWeight: Theme.Typography.fontWeight.semibold,
    color: Theme.Colors.text.secondary,
    marginTop: Theme.Spacing.sm,
  },
  
  fieldLabelSelected: {
    color: Theme.Colors.primary[500],
  },
  
  roleList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.Spacing.sm,
  },
  
  roleChip: {
    backgroundColor: Theme.Colors.surface.primary,
    paddingHorizontal: Theme.Spacing.md,
    paddingVertical: Theme.Spacing.sm,
    borderRadius: Theme.Radius.full,
    borderWidth: 1,
    borderColor: Theme.Colors.border.primary,
  },
  
  roleChipSelected: {
    backgroundColor: Theme.Colors.primary[500],
    borderColor: Theme.Colors.primary[500],
  },
  
  roleLabel: {
    fontSize: Theme.Typography.fontSize.sm,
    fontWeight: Theme.Typography.fontWeight.medium,
    color: Theme.Colors.text.primary,
  },
  
  roleLabelSelected: {
    color: 'white',
  },
  
  topicInput: {
    backgroundColor: Theme.Colors.surface.primary,
    borderRadius: Theme.Radius.lg,
    padding: Theme.Spacing.md,
    fontSize: Theme.Typography.fontSize.base,
    color: Theme.Colors.text.primary,
    borderWidth: 1,
    borderColor: Theme.Colors.border.primary,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  
  generateButton: {
    backgroundColor: Theme.Colors.primary[500],
    marginHorizontal: Theme.Spacing.lg,
    marginTop: Theme.Spacing.md,
    padding: Theme.Spacing.md,
    borderRadius: Theme.Radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Theme.Spacing.sm,
    ...Theme.Shadow.md,
  },
  
  generateButtonText: {
    fontSize: Theme.Typography.fontSize.base,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: 'white',
  },
  
  keywordHint: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.text.tertiary,
    marginBottom: Theme.Spacing.md,
  },
  
  keywordList: {
    gap: Theme.Spacing.sm,
  },
  
  keywordCard: {
    backgroundColor: Theme.Colors.surface.primary,
    borderRadius: Theme.Radius.lg,
    padding: Theme.Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Theme.Colors.border.primary,
  },
  
  keywordContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.Spacing.sm,
    flex: 1,
  },
  
  keywordText: {
    fontSize: Theme.Typography.fontSize.base,
    fontWeight: Theme.Typography.fontWeight.medium,
    color: '#1A202C',
    flex: 1,
  },
});
