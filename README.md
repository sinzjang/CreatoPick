# CreatoPick

크리에이티브 레퍼런스 탐색/저장/학습 플랫폼

## 🎨 프로젝트 개요

CreatoPick은 디자이너와 크리에이터를 위한 레퍼런스 관리 플랫폼입니다. 정돈된 실험실/스튜디오 느낌의 모던한 UI로 영감을 탐색하고 저장할 수 있습니다.

## 🚀 기술 스택

- **Expo SDK 52** - 최신 React Native 프레임워크
- **TypeScript** - 타입 안정성
- **Expo Router** - 파일 기반 라우팅
- **React Native** - 크로스 플랫폼 개발

## 📁 프로젝트 구조

```
CreatoPick/
├── app/                          # Expo Router 라우팅
│   ├── _layout.tsx              # Root Stack Layout
│   ├── index.tsx                # Welcome 페이지
│   └── (tabs)/                  # Tab Navigation
│       ├── _layout.tsx          # Bottom Tabs Layout
│       ├── home.tsx             # Dashboard (메인 홈)
│       ├── search.tsx           # 검색 (placeholder)
│       ├── bookmark.tsx         # 북마크 (placeholder)
│       └── settings.tsx         # 설정 (placeholder)
├── src/
│   ├── theme/
│   │   └── tokens.ts            # 디자인 토큰 시스템
│   ├── components/
│   │   ├── Header.tsx           # 사용자 헤더
│   │   ├── SearchHistoryList.tsx  # 검색 기록
│   │   └── BookmarkGrid.tsx     # 북마크 그리드
│   └── data/
│       └── mock.ts              # Mock 데이터
├── package.json
├── tsconfig.json
└── app.json
```

## 🎯 구현된 기능

### ✅ 완료된 페이지

1. **Welcome 페이지**
   - 심플한 로고와 브랜드 네임
   - Start 버튼으로 Dashboard 진입
   - 중앙 정렬 레이아웃

2. **Dashboard (Home)**
   - 사용자 헤더 (이름 + 아바타)
   - Recent Searches (최근 검색어 5개, Pill 형태)
   - Bookmarks (저장된 이미지 2열 그리드)
   - 스크롤 가능한 단일 화면

3. **Bottom Tab Navigation**
   - Home / Search / Bookmark / Settings
   - 브랜드 컬러 적용
   - 아이콘 기반 네비게이션

### 🎨 디자인 시스템

- **Primary Color**: 차분한 블루 (#0ea5e9)
- **Typography**: System 폰트, 명확한 계층 구조
- **Spacing**: 8px 기반 스케일
- **Radius**: 4px ~ 20px
- **Shadow**: 3단계 깊이

## 📦 설치 및 실행

### 1. 패키지 설치

```bash
cd CreatoPick
npm install
```

### 2. 개발 서버 시작

```bash
npm start
```

또는 특정 플랫폼:

```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

### 3. Expo Go 앱에서 실행

1. 스마트폰에 Expo Go 앱 설치
2. QR 코드 스캔
3. 앱 실행

## 🔧 개발 가이드

### 디자인 토큰 사용

```typescript
import { Theme } from '@/theme/tokens';

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.Colors.background.primary,
    padding: Theme.Spacing.md,
    borderRadius: Theme.Radius.lg,
    ...Theme.Shadow.md,
  },
});
```

### Mock 데이터 확장

`src/data/mock.ts`에서 데이터 구조 확인 및 수정:

```typescript
export interface BookmarkItem {
  id: string;
  title: string;
  source?: string;
  imageUrl: string;
  createdAt: string;
  tags?: string[];
}
```

### 컴포넌트 재사용

```typescript
import { Header } from '@/components/Header';
import { SearchHistoryList } from '@/components/SearchHistoryList';
import { BookmarkGrid } from '@/components/BookmarkGrid';
```

## 🚧 다음 단계 제안

### 1. 검색 화면 구현
- 검색 입력 필드
- 실시간 검색 결과
- 필터링 옵션
- API 연동 준비

### 2. 북마크 상세 화면
- 이미지 확대 보기
- 메타 정보 표시
- 태그 관리
- 공유 기능

### 3. 스토리지 연동
- AsyncStorage로 로컬 저장
- 검색 기록 저장/삭제
- 북마크 추가/제거
- 사용자 설정 저장

### 4. API 통합
- 이미지 검색 API (Unsplash, Pexels 등)
- 백엔드 연동
- 인증 시스템
- 클라우드 동기화

### 5. 추가 기능
- 컬렉션 관리
- 태그 시스템
- 공유 기능
- 오프라인 모드

## 📝 주요 파일 설명

- **`app/_layout.tsx`**: 전체 앱의 Stack 네비게이션 설정
- **`app/index.tsx`**: Welcome 화면 (첫 진입점)
- **`app/(tabs)/_layout.tsx`**: 하단 탭 네비게이션 설정
- **`app/(tabs)/home.tsx`**: Dashboard 메인 화면
- **`src/theme/tokens.ts`**: 디자인 시스템 토큰 (색상, 타이포그래피, 간격 등)
- **`src/data/mock.ts`**: Mock 데이터 및 타입 정의
- **`src/components/`**: 재사용 가능한 컴포넌트들

## 🎯 브랜드 감성

- **정돈된 실험실/스튜디오 느낌**
- **과하지 않은 모던함**
- **레퍼런스 탐색/저장/학습 루틴**
- **깔끔하고 직관적인 UX**

## 📱 지원 플랫폼

- iOS
- Android
- Web (PWA 지원 가능)

## 🔗 유용한 링크

- [Expo 문서](https://docs.expo.dev/)
- [Expo Router 가이드](https://docs.expo.dev/router/introduction/)
- [React Native 문서](https://reactnative.dev/)

---

**CreatoPick** - Discover • Save • Create
