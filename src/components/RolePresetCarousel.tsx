/**
 * Role Preset Carousel Component
 * Role Preset들을 가로로 스크롤 가능한 캐러셀 형태로 표시
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '@/theme/tokens';
import { RolePreset } from '@/data/mock';

interface RolePresetCarouselProps {
  presets: RolePreset[];
  onPresetPress?: (preset: RolePreset) => void;
  onAddPress?: () => void;
}

export const RolePresetCarousel: React.FC<RolePresetCarouselProps> = ({ 
  presets, 
  onPresetPress,
  onAddPress 
}) => {
  const renderPreset = (preset: RolePreset) => (
    <TouchableOpacity
      key={preset.id}
      style={styles.presetItem}
      onPress={() => onPresetPress?.(preset)}
      activeOpacity={0.8}
    >
      {/* 동그라미 컨테이너 */}
      <View style={[styles.circle, { backgroundColor: preset.color || Theme.Colors.primary[500] }]}>
        <Text style={styles.presetName}>{preset.name}</Text>
      </View>
      
      {/* Preset 정보 */}
      <Text style={styles.field}>{preset.field}</Text>
      <Text style={styles.role}>{preset.role}</Text>
    </TouchableOpacity>
  );

  const renderAddButton = () => (
    <TouchableOpacity
      style={styles.addButton}
      onPress={onAddPress}
      activeOpacity={0.8}
    >
      <View style={[styles.circle, styles.addCircle]}>
        <Ionicons 
          name="add" 
          size={Theme.Icon.lg} 
          color={Theme.Colors.text.primary} 
        />
      </View>
      <Text style={styles.addText}>추가</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* 섹션 타이틀 */}
      <Text style={styles.title}>Role Presets</Text>
      
      {/* 캐러셀 */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carouselContent}
      >
        {presets.map(renderPreset)}
        {renderAddButton()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Theme.Spacing.lg,
    paddingVertical: Theme.Spacing.md,
    backgroundColor: Theme.Colors.background.primary, // 라이트 베이지
  },
  
  title: {
    fontSize: Theme.Typography.fontSize.lg,
    fontWeight: Theme.Typography.fontWeight.semibold,
    color: Theme.Colors.text.primary, // 다크 그레이
    marginBottom: Theme.Spacing.md,
  },
  
  carouselContent: {
    paddingRight: Theme.Spacing.lg,
  },
  
  presetItem: {
    alignItems: 'center',
    marginRight: Theme.Spacing.lg,
    minWidth: 80,
  },
  
  circle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Theme.Spacing.sm,
    ...Theme.Shadow.md,
  },
  
  addCircle: {
    backgroundColor: Theme.Colors.surface.primary, // 화이트
    borderWidth: 2,
    borderColor: Theme.Colors.border.primary, // 라이트 그레이
  },
  
  presetName: {
    fontSize: Theme.Typography.fontSize.sm,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.text.primary, // 다크 그레이
  },
  
  field: {
    fontSize: Theme.Typography.fontSize.xs,
    fontWeight: Theme.Typography.fontWeight.medium,
    color: Theme.Colors.text.secondary, // 미디엄 그레이
    marginBottom: 2,
  },
  
  role: {
    fontSize: Theme.Typography.fontSize.xs,
    color: Theme.Colors.text.muted, // 뮤티드 그레이
    textAlign: 'center',
  },
  
  addButton: {
    alignItems: 'center',
    minWidth: 80,
  },
  
  addText: {
    fontSize: Theme.Typography.fontSize.xs,
    fontWeight: Theme.Typography.fontWeight.medium,
    color: Theme.Colors.text.secondary, // 미디엄 그레이
    marginTop: 2,
  },
});
