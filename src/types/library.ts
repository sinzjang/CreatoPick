/**
 * Library Types
 * 라이브러리 아이템 관련 타입 정의
 */

export interface ImageData {
  url: string;
  localUri?: string;
  width?: number;
  height?: number;
  analysis?: ImageAnalysis;
}

export interface ImageAnalysis {
  description: string;
  designElements: string[];
  colorPalette: string[];
  suggestions: string[];
  style: string;
}

export interface Conversation {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface EnhancedLibraryItem {
  id: string;
  url: string;
  title: string;
  description?: string;
  siteName?: string;
  images: ImageData[];
  overallAnalysis?: string;
  userMemo?: string;
  conversations: Conversation[];
  topic?: string;
  field?: string;
  role?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type LibraryItemType = 'url' | 'screenshot' | 'manual';

export interface LibraryFilter {
  type?: LibraryItemType;
  tags?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
}
