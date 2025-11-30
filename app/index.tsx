/**
 * Welcome Screen - 첫 페이지
 * 심플한 로고와 Start 버튼으로 구성
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Theme } from '@/theme/tokens';

export default function WelcomeScreen() {
  const router = useRouter();

  const handleStart = () => {
    console.log('Start button pressed!');
    
    // 버튼 피드백을 위한 약간 지연 후 네비게이션
    setTimeout(() => {
      try {
        router.replace('/(tabs)/home');
      } catch (error) {
        console.error('Navigation error:', error);
      }
    }, 100);
  };

  return (
    <View style={styles.container}>
      {/* 로고 영역 - 중앙 정렬 */}
      <View style={styles.logoContainer}>
        {/* 메인 이미지 */}
        <Image 
          source={require('../assets/imgs/creatoPick_Main.png')}
          style={styles.mainImage}
          resizeMode="contain"
        />
        <Text style={styles.brandName}>CreatoPick</Text>
        <Text style={styles.tagline}>Creative Reference Platform</Text>
      </View>

      {/* Start 버튼 */}
      <TouchableOpacity
        style={styles.startButton}
        onPress={handleStart}
        activeOpacity={0.8}
        pressRetentionOffset={{ top: 20, bottom: 20, left: 20, right: 20 }}
        delayPressIn={0}
      >
        <Text style={styles.startButtonText}>Start Exploring</Text>
      </TouchableOpacity>

      {/* 하단 정보 */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Discover • Save • Create</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.Colors.background.primary, // 딥 다크
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Theme.Spacing.xl,
    paddingVertical: Theme.Spacing['3xl'],
  },
  
  logoContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  
  mainImage: {
    width: 200,
    height: 200,
    marginBottom: Theme.Spacing.lg,
    ...Theme.Shadow.lg,
  },
  
  brandName: {
    fontSize: Theme.Typography.fontSize['3xl'],
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.text.primary, // 다크 그레이 (라이트 테마)
    marginBottom: Theme.Spacing.sm,
  },
  
  tagline: {
    fontSize: Theme.Typography.fontSize.base,
    fontWeight: Theme.Typography.fontWeight.normal,
    color: Theme.Colors.text.secondary, // 미디엄 그레이 (라이트 테마)
    textAlign: 'center',
  },
  
  startButton: {
    backgroundColor: Theme.Colors.primary[500], // 6C5CE7
    paddingHorizontal: Theme.Spacing['2xl'],
    paddingVertical: Theme.Spacing.md,
    borderRadius: Theme.Radius.full,
    minWidth: 200,
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
    ...Theme.Shadow.md,
    elevation: 4, // Android용 그림자
  },
  
  startButtonText: {
    fontSize: Theme.Typography.fontSize.lg,
    fontWeight: Theme.Typography.fontWeight.semibold,
    color: Theme.Colors.text.inverse, // 라이트 텍스트 (화이트)
  },
  
  footer: {
    alignItems: 'center',
  },
  
  footerText: {
    fontSize: Theme.Typography.fontSize.sm,
    fontWeight: Theme.Typography.fontWeight.medium,
    color: Theme.Colors.text.muted, // 7B8193
  },
});
