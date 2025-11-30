# CreatoPick 앱 구동 플로우

## 📱 전체 앱 구조

```
CreatoPick App
├── Home Tab (홈 화면)
│   ├── Header (사용자 정보)
│   ├── Role Preset Carousel (역할 프리셋)
│   ├── Search History (최근 검색어)
│   └── Bookmark Grid (북마크)
├── Search Tab (검색)
├── Bookmark Tab (북마크)
└── Settings Tab (설정)
```

## 🎯 디자인 레퍼런스 브라우저 작동 플로우

### 1️⃣ **시작점: Home 화면**
파일: `app/(tabs)/home.tsx`

```typescript
// 사용자가 "+" 버튼 클릭
<RolePresetCarousel onAddPress={handleAddPreset} />
  ↓
handleAddPreset() 실행
  ↓
setShowPresetModal(true) // PresetCreationModal 열기
```

---

### 2️⃣ **Preset 생성 모달 (4단계)**
파일: `src/components/PresetCreationModal.tsx`

#### **Step 1: 분야 선택**
```typescript
renderFieldStep()
  ↓
사용자가 분야 선택 (예: "UX/UI")
  ↓
handleFieldSelect(field)
  ↓
setStep('role') // 다음 단계로
```

#### **Step 2: 역할 선택**
```typescript
renderRoleStep()
  ↓
사용자가 역할 선택 (예: "UX/UI Designer")
  ↓
handleRoleSelect(role)
  ↓
setStep('topic') // 다음 단계로
```

#### **Step 3: AI 주제 생성 및 선택**
```typescript
renderTopicStep()
  ↓
useEffect로 자동 실행: loadAITopics()
  ↓
OpenAI API 호출 (openaiService.generateTopics)
  ↓
AI가 8개 주제 생성
  ↓
사용자가 주제 선택 (예: "모바일 앱 UI 디자인 트렌드")
  ↓
handleTopicSelect(topic)
  ↓
"레퍼런스 검색" 버튼 표시
```

#### **Step 4: 완료 및 레퍼런스 검색**
```typescript
사용자가 "레퍼런스 검색" 버튼 클릭
  ↓
handleComplete() 실행
  ↓
1. Preset 데이터 저장
   onComplete({
     name: "UX/UI - UX/UI Designer",
     field: "UX/UI",
     role: "UX/UI Designer",
     topic: "모바일 앱 UI 디자인 트렌드"
   })
  ↓
2. 디자인 레퍼런스 브라우저 열기
   setPinterestSearchQuery("모바일 앱 UI 디자인 트렌드")
   setShowPinterestBrowser(true)
```

---

### 3️⃣ **디자인 레퍼런스 브라우저**
파일: `src/components/DesignReferenceBrowser.tsx`

```typescript
<Modal visible={showPinterestBrowser}>
  <DesignReferenceBrowser
    searchQuery="모바일 앱 UI 디자인 트렌드"
    onClose={handlePinterestClose}
    onSaveMemo={(memo) => console.log('Memo saved:', memo)}
  />
</Modal>
```

#### **브라우저 구조:**

```
┌─────────────────────────────────────┐
│ [X] 모바일 앱 UI 디자인 트렌드       │ ← Header
│     디자인 레퍼런스                  │
├─────────────────────────────────────┤
│ [←] [→] [↻] Google Images          │ ← Navigation
├─────────────────────────────────────┤
│                                     │
│                                     │
│   WebView (Google Images)           │ ← 상단 영역 (flex: 1)
│   검색어: "모바일 앱 UI 디자인       │
│           트렌드 design inspiration" │
│                                     │
│                                     │
├─────────────────────────────────────┤
│ 📝 디자인 메모              [저장]  │ ← 메모 헤더
├─────────────────────────────────────┤
│                                     │
│ 레퍼런스에 대한 메모를 작성하세요... │ ← 메모 입력 (200px)
│                                     │
└─────────────────────────────────────┘
```

#### **WebView URL 생성:**
```typescript
const searchQuery = "모바일 앱 UI 디자인 트렌드";
const imageSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery + ' design inspiration')}&tbm=isch`;

// 실제 URL:
// https://www.google.com/search?q=모바일%20앱%20UI%20디자인%20트렌드%20design%20inspiration&tbm=isch
```

---

### 4️⃣ **사용자 인터랙션**

#### **WebView 네비게이션:**
```typescript
handleBack()    // 뒤로 가기
handleForward() // 앞으로 가기
handleRefresh() // 새로고침
```

#### **메모 작성:**
```typescript
<TextInput
  value={memo}
  onChangeText={setMemo}
  multiline
  placeholder="레퍼런스에 대한 메모를 작성하세요..."
/>
  ↓
사용자가 메모 입력
  ↓
"저장" 버튼 클릭
  ↓
handleSaveMemo()
  ↓
onSaveMemo(memo) // 콜백 실행
  ↓
console.log('Design memo saved:', memo)
```

#### **브라우저 닫기:**
```typescript
사용자가 [X] 버튼 클릭
  ↓
onClose() 실행
  ↓
handlePinterestClose() (PresetCreationModal)
  ↓
1. setShowPinterestBrowser(false)
2. setPinterestSearchQuery('')
3. handleClose() // 모달 전체 닫기
  ↓
Home 화면으로 복귀
```

---

## 🔄 전체 플로우 다이어그램

```
[Home 화면]
    ↓ "+" 버튼 클릭
[PresetCreationModal 열림]
    ↓
[Step 1: 분야 선택] → "UX/UI" 선택
    ↓
[Step 2: 역할 선택] → "UX/UI Designer" 선택
    ↓
[Step 3: AI 주제 생성]
    ↓ OpenAI API 호출
    ↓ 8개 주제 생성
    ↓ "모바일 앱 UI 디자인 트렌드" 선택
    ↓
["레퍼런스 검색" 버튼 표시]
    ↓ 클릭
[handleComplete 실행]
    ↓
    ├─ Preset 저장 (Home 화면에 추가)
    └─ DesignReferenceBrowser 열기
        ↓
[DesignReferenceBrowser 표시]
    ↓
    ├─ 상단: Google Images WebView
    │   └─ 검색: "모바일 앱 UI 디자인 트렌드 design inspiration"
    │
    └─ 하단: 메모 입력 영역 (200px)
        ↓ 메모 작성
        ↓ "저장" 클릭
        ↓ 메모 저장 (콘솔 로그)
    ↓
[X 버튼으로 닫기]
    ↓
[Home 화면으로 복귀]
    └─ 새로운 Preset이 캐러셀에 추가됨
```

---

## 🎨 주요 컴포넌트 역할

### **1. home.tsx (메인 화면)**
- 역할: 앱의 홈 화면, 모든 플로우의 시작점
- 상태 관리:
  - `showPresetModal`: PresetCreationModal 표시 여부
  - `presets`: 저장된 Role Preset 목록

### **2. PresetCreationModal.tsx (프리셋 생성)**
- 역할: 4단계 프리셋 생성 프로세스 관리
- 상태 관리:
  - `step`: 현재 단계 ('field' | 'role' | 'topic' | 'custom')
  - `selectedField`, `selectedRole`, `selectedTopic`: 선택된 값
  - `aiTopics`: OpenAI가 생성한 주제 목록
  - `showPinterestBrowser`: 레퍼런스 브라우저 표시 여부
  - `pinterestSearchQuery`: 검색 쿼리

### **3. DesignReferenceBrowser.tsx (레퍼런스 브라우저)**
- 역할: Google Images WebView + 메모 기능 제공
- Props:
  - `searchQuery`: 검색할 주제
  - `onClose`: 닫기 콜백
  - `onSaveMemo`: 메모 저장 콜백
- 상태 관리:
  - `loading`: WebView 로딩 상태
  - `canGoBack`, `canGoForward`: 네비게이션 상태
  - `memo`: 메모 텍스트

---

## 🔧 기술 스택

### **WebView 설정:**
```typescript
<WebView
  source={{ uri: imageSearchUrl }}
  javaScriptEnabled={true}
  domStorageEnabled={true}
  startInLoadingState={true}
  onLoadStart={() => setLoading(true)}
  onLoadEnd={() => setLoading(false)}
  onError={(error) => console.error(error)}
/>
```

### **KeyboardAvoidingView:**
```typescript
<KeyboardAvoidingView 
  behavior={Platform.OS === 'ios' ? 'padding' : undefined}
>
  {/* 메모 입력 시 키보드가 올라와도 UI 유지 */}
</KeyboardAvoidingView>
```

### **AI 통합 (OpenAI):**
```typescript
// src/services/openai.ts
const topics = await openaiService.generateTopics(field, role);
// → 8개의 관련 주제 생성
```

---

## 📝 데이터 흐름

```
사용자 입력
    ↓
[분야] → selectedField
    ↓
[역할] → selectedRole
    ↓
[OpenAI API] → aiTopics[]
    ↓
[주제 선택] → selectedTopic
    ↓
[완료] → Preset 객체 생성
    ↓
    ├─ Home 화면: presets 배열에 추가
    └─ DesignReferenceBrowser: searchQuery로 전달
        ↓
        [Google Images] 검색 실행
        ↓
        [메모 작성] → memo 상태
        ↓
        [저장] → onSaveMemo(memo) 콜백
```

---

## 🎯 핵심 기능

1. **AI 기반 주제 생성**: OpenAI API로 맞춤형 주제 추천
2. **Google Images 통합**: WebView로 디자인 레퍼런스 검색
3. **메모 기능**: 레퍼런스 보면서 즉시 메모 작성
4. **Preset 저장**: 자주 사용하는 역할/주제 조합 저장

---

## 🚀 향후 개선 가능 사항

1. **메모 영구 저장**: AsyncStorage 또는 데이터베이스 연동
2. **북마크 기능**: 특정 이미지 URL 저장
3. **검색 히스토리**: 이전 검색 기록 관리
4. **다중 소스**: Unsplash, Pexels 등 선택 가능
5. **공유 기능**: 메모와 레퍼런스 공유
