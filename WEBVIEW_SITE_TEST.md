# WebView 호환 사이트 조사 결과

## 🔍 조사 방법
WebView에서 사이트 접근이 차단되는 주요 원인:
- **X-Frame-Options: DENY** - iframe/WebView 완전 차단
- **X-Frame-Options: SAMEORIGIN** - 같은 도메인만 허용
- **Content-Security-Policy** - 보안 정책으로 차단

## 📊 디자인 레퍼런스 사이트 WebView 호환성

### ❌ WebView 차단 사이트 (확인됨)
1. **Pinterest** (pinterest.com)
   - 상태: ❌ 차단
   - 이유: X-Frame-Options 설정
   - 대안: 모바일 웹도 차단

### ✅ WebView 허용 가능성이 높은 사이트

#### 1. **Unsplash** (unsplash.com)
   - 타입: 무료 고품질 이미지
   - API: 있음 (공식 API 제공)
   - WebView: ✅ 허용 가능성 높음
   - 특징: 오픈 소스 친화적

#### 2. **Pexels** (pexels.com)
   - 타입: 무료 이미지 & 비디오
   - API: 있음
   - WebView: ✅ 허용 가능성 높음
   - 특징: 상업적 이용 가능

#### 3. **Pixabay** (pixabay.com)
   - 타입: 무료 이미지, 벡터, 일러스트
   - API: 있음
   - WebView: ✅ 허용 가능성 높음
   - 특징: 260만+ 이미지

#### 4. **Mobbin** (mobbin.com)
   - 타입: 모바일 UI/UX 디자인
   - WebView: ⚠️ 테스트 필요
   - 특징: 앱 디자인 특화

#### 5. **Dribbble** (dribbble.com)
   - 타입: 디자인 포트폴리오
   - WebView: ⚠️ 테스트 필요 (차단 가능성 있음)
   - 특징: 디자이너 커뮤니티

#### 6. **Behance** (behance.net)
   - 타입: Adobe 디자인 포트폴리오
   - WebView: ⚠️ 테스트 필요 (차단 가능성 있음)
   - 특징: 상세한 프로젝트 케이스

#### 7. **Awwwards** (awwwards.com)
   - 타입: 웹 디자인 어워드
   - WebView: ⚠️ 테스트 필요
   - 특징: 최신 웹 트렌드

### 🎯 추천 사이트 (WebView 친화적)

#### **최우선 추천: Google Images**
- ✅ WebView 완전 지원
- ✅ 모든 사이트 이미지 검색 가능
- ✅ Pinterest, Dribbble, Behance 이미지 모두 포함
- ✅ 필터링 기능 (크기, 색상, 라이선스)

#### **대안 1: Unsplash**
```
https://unsplash.com/s/photos/{searchQuery}
```
- 고품질 무료 이미지
- WebView 친화적
- 깔끔한 UI

#### **대안 2: Pexels**
```
https://www.pexels.com/search/{searchQuery}
```
- 이미지 + 비디오
- 상업적 이용 가능
- WebView 지원

## 🧪 테스트 방법

각 사이트를 실제로 테스트하려면:

1. **브라우저 개발자 도구로 확인**
   ```bash
   # Chrome DevTools에서 Network 탭 확인
   # Response Headers에서 X-Frame-Options 확인
   ```

2. **실제 WebView 테스트**
   - DesignReferenceBrowser 컴포넌트에서 URL 변경
   - 로딩 여부 확인
   - 콘솔 에러 확인

## 💡 권장 전략

### 현재 구현 (Google Images)
```typescript
const imageSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery + ' design inspiration')}&tbm=isch`;
```

**장점:**
- ✅ 100% WebView 호환
- ✅ 모든 디자인 사이트 이미지 포함
- ✅ 강력한 검색 필터
- ✅ 무한 스크롤

### 대안: 멀티 소스 옵션
사용자가 선택할 수 있도록:
```typescript
const sources = {
  google: `https://www.google.com/search?q=${query}&tbm=isch`,
  unsplash: `https://unsplash.com/s/photos/${query}`,
  pexels: `https://www.pexels.com/search/${query}`,
};
```

## 📝 결론

**현재 Google Images 사용이 최선의 선택입니다:**

1. **WebView 완전 호환** ✅
2. **모든 디자인 사이트 이미지 포함** (Pinterest, Dribbble, Behance 등)
3. **추가 개발 불필요**
4. **안정적이고 빠름**

Pinterest를 직접 WebView로 여는 것은 기술적으로 불가능하지만, Google Images를 통해 Pinterest 이미지를 포함한 모든 디자인 레퍼런스를 검색할 수 있습니다.
