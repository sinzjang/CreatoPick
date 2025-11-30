/**
 * Root Layout - Expo Router
 * 전체 앱의 Stack 네비게이션 관리
 */

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack>
        <Stack.Screen 
          name="index" 
          options={{ 
            headerShown: false, // Welcome 페이지는 헤더 없음
          }} 
        />
        <Stack.Screen 
          name="(tabs)" 
          options={{ 
            headerShown: false, // Tab 내부에서 개별 관리
          }} 
        />
      </Stack>
    </>
  );
}
