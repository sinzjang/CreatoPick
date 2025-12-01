/**
 * CreatoPick Mock Data
 * API 연동을 위한 확장 가능한 데이터 구조
 */

// Type Definitions
export interface UserProfile {
  id: string;
  name: string;
  avatar?: string;
}

export interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: string;
  resultCount?: number;
}

export interface LibraryItem {
  id: string;
  title: string;
  source?: string;
  imageUrl: string;
  createdAt: string;
  tags?: string[];
  description?: string;
  url?: string;
  memo?: string;
}

export interface RolePreset {
  id: string;
  name: string;
  field: string;
  role: string;
  color?: string;
}

// Mock User Profile
export const mockUser: UserProfile = {
  id: '1',
  name: 'Phillip',
  avatar: undefined, // 나중에 이미지 URL로 대체
};

// Role Preset Mock 데이터
export const mockRolePresets: RolePreset[] = [
  {
    id: '1',
    name: 'Preset1',
    field: '디자인',
    role: 'UI/UX 디자이너',
    color: '#6C5CE7',
  },
];

// Mock Search History (최근 5개)
export const mockSearchHistory: SearchHistoryItem[] = [
  {
    id: '1',
    query: 'modern logo design',
    timestamp: '2024-01-20T10:30:00Z',
    resultCount: 156,
  },
  {
    id: '2',
    query: 'minimalist branding',
    timestamp: '2024-01-19T15:45:00Z',
    resultCount: 89,
  },
  {
    id: '3',
    query: 'color palette inspiration',
    timestamp: '2024-01-18T09:20:00Z',
    resultCount: 234,
  },
  {
    id: '4',
    query: 'typography trends 2024',
    timestamp: '2024-01-17T14:15:00Z',
    resultCount: 67,
  },
  {
    id: '5',
    query: 'UI design patterns',
    timestamp: '2024-01-16T11:00:00Z',
    resultCount: 412,
  },
];

// Mock Library Items (저장된 이미지)
export const mockLibraryItems: LibraryItem[] = [
  {
    id: '1',
    title: 'Gamification App Design',
    source: 'Pinterest',
    imageUrl: 'https://i.pinimg.com/736x/81/03/a1/8103a1ba5505740655c9fd6df51601e3.jpg',
    createdAt: '2024-11-30T12:00:00Z',
    tags: ['gamification', 'app', 'ui', 'design'],
    description: 'Gamification app design with modern interface and engaging user experience',
    url: 'https://www.pinterest.com/pin/841891724128763931/',
    memo: '게임화 요소가 잘 적용된 디자인. 사용자 참여를 높이는 UI 패턴 참고하기',
  },
  {
    id: '2',
    title: 'Modern UI Design Collection',
    source: 'Pinterest',
    imageUrl: 'https://i.pinimg.com/736x/7e/4c/fd/7e4cfd2849972e5bf6d5ff16ce907d98.jpg',
    createdAt: '2024-11-30T12:20:00Z',
    tags: ['ui', 'design', 'modern', 'collection'],
    description: 'Modern UI design collection with clean interface and contemporary style',
    url: 'https://www.pinterest.com/pin/8514686788843909/',
    memo: '모던한 UI 디자인 컬렉션. 깔끔한 인터페이스와 현대적인 스타일 참고',
  },
  {
    id: '3',
    title: 'Creative Design Inspiration',
    source: 'Pinterest',
    imageUrl: 'https://i.pinimg.com/736x/85/12/d2/8512d26d3607072b3d5c950c3f4571e0.jpg',
    createdAt: '2024-11-30T12:25:00Z',
    tags: ['creative', 'design', 'inspiration', 'art'],
    description: 'Creative design inspiration with unique artistic approach',
    url: 'https://www.pinterest.com/pin/4714774604269668/',
    memo: '독특한 예술적 접근이 돋보이는 크리에이티브 디자인',
  },
  {
    id: '4',
    title: 'Modern Web Layouts',
    source: 'Awwwards',
    imageUrl: 'https://picsum.photos/300/400?random=4',
    createdAt: '2024-01-17T10:45:00Z',
    tags: ['layout', 'web'],
  },
  {
    id: '5',
    title: 'Brand Identity Systems',
    source: 'Behance',
    imageUrl: 'https://picsum.photos/300/400?random=5',
    createdAt: '2024-01-16T14:20:00Z',
    tags: ['branding', 'identity'],
  },
  {
    id: '6',
    title: 'Icon Design Trends',
    source: 'Iconfinder',
    imageUrl: 'https://picsum.photos/300/400?random=6',
    createdAt: '2024-01-15T09:30:00Z',
    tags: ['icons', 'ui'],
  },
];
