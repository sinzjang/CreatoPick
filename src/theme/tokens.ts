/**
 * CreatoPick Design Tokens v0
 * 디자인 시스템의 모든 토큰을 중앙 집중화
 * 라이트 베이지 테마 기반 크리에이티브/AI 툴 감성
 */

export const Theme = {
  // Colors - CreatoPick v0 Palette
  Colors: {
    // Primary (Brand) - 보라-블루 계열, 크리에이티브/AI 툴 감성
    primary: {
      50: '#F0EBFF',
      100: '#E0D4FF',
      200: '#C9A9FF',
      300: '#B27EFF',
      400: '#9B53FF',
      500: '#6C5CE7', // Main primary
      600: '#5847CC', // Primary Dark
      700: '#4736A6',
      800: '#362580',
      900: '#251459',
    },
    
    // Secondary (Accent) - 민트-시안, 하이라이트/포커스
    secondary: {
      50: '#E6FFF9',
      100: '#CCFFF3',
      200: '#99FFE7',
      300: '#66FFDB',
      400: '#33FFCF',
      500: '#00D1B2', // Main secondary
      600: '#00A68E',
      700: '#007B6A',
      800: '#005046',
      900: '#002522',
    },
    
    // Background Colors - 라이트 테마
    background: {
      primary: '#fbf5f0', // 새로운 기본 백그라운드 (라이트 베이지)
      secondary: '#0B0D12', // 딥 다크 (보조)
      tertiary: '#141824', // Surface 색상과 유사
    },
    
    // Surface Colors - 카드, 섹션 등
    surface: {
      primary: '#FFFFFF', // Card / Section 바탕 (화이트)
      secondary: '#F7FAFC', // Surface Elevated (라이트 그레이)
      tertiary: '#EDF2F7', // Border 색상과 유사
      elevated: '#F7FAFC', // Surface Elevated
    },
    
    // Text Colors - 라이트 테마 가독성
    text: {
      primary: '#2D3748', // 메인 텍스트 (다크 그레이)
      secondary: '#4A5568', // 보조 텍스트
      tertiary: '#718096', // 텍스트 Muted
      inverse: '#fbf5f0', // 배경색 (역색)
      muted: '#718096', // Text Muted
    },
    
    // Border Colors
    border: {
      primary: '#E2E8F0', // Border / Divider (라이트)
      secondary: '#CBD5E0',
      tertiary: '#A0AEC0',
    },
    
    // Status Colors
    success: {
      light: '#2ECC71',
      main: '#27AE60',
      dark: '#229954',
    },
    
    warning: {
      light: '#F5A623',
      main: '#F39C12',
      dark: '#E67E22',
    },
    
    error: {
      light: '#FF5C5C',
      main: '#E74C3C',
      dark: '#C0392B',
    },
    
    info: {
      light: '#6C5CE7',
      main: '#5847CC',
      dark: '#4736A6',
    },
  },
  
  // Typography
  Typography: {
    fontFamily: {
      regular: 'System',
      medium: 'System',
      semibold: 'System',
      bold: 'System',
    },
    
    fontSize: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
      '4xl': 36,
      '5xl': 48,
      '6xl': 64,
    },
    
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  
  // Spacing
  Spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
    '3xl': 64,
    '4xl': 96,
    '5xl': 128,
  },
  
  // Border Radius
  Radius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 20,
    '3xl': 24,
    full: 9999,
  },
  
  // Shadows - Black alpha 기반
  Shadow: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 1,
    },
    
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 3,
    },
    
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 6,
    },
    
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.25,
      shadowRadius: 16,
      elevation: 10,
    },
  },
  
  // Icon Sizes
  Icon: {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 28,
    '2xl': 32,
    '3xl': 40,
    '4xl': 48,
  },
  
  // Z-Index
  ZIndex: {
    base: 0,
    overlay: 10,
    modal: 20,
    toast: 30,
    tooltip: 40,
  },
  
  // Animation
  Animation: {
    duration: {
      fast: 150,
      normal: 300,
      slow: 500,
    },
    
    easing: {
      ease: 'ease',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
    },
  },
} as const;

export default Theme;