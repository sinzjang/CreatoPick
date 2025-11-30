# InAppBrowser 검색어 전달 예제

## ✅ 네, 검색어를 함께 보낼 수 있습니다!

InAppBrowser는 URL을 받기 때문에, 검색어를 URL에 포함시켜 전달할 수 있습니다.

---

## 📝 기본 사용법

### **1. 설치**
```bash
npm install react-native-inappbrowser-reborn --legacy-peer-deps
```

### **2. 기본 예제**
```typescript
import InAppBrowser from 'react-native-inappbrowser-reborn';

// 단순 URL 열기
const openBrowser = async () => {
  const url = 'https://www.google.com';
  
  if (await InAppBrowser.isAvailable()) {
    await InAppBrowser.open(url, {
      // iOS 옵션
      dismissButtonStyle: 'close',
      preferredBarTintColor: '#4285F4',
      preferredControlTintColor: 'white',
      
      // Android 옵션
      toolbarColor: '#4285F4',
      showTitle: true,
      enableUrlBarHiding: true,
      enableDefaultShare: true,
    });
  }
};
```

---

## 🔍 검색어 포함 예제

### **Google Images 검색**
```typescript
import InAppBrowser from 'react-native-inappbrowser-reborn';

const openGoogleImagesSearch = async (searchQuery: string) => {
  // 검색어를 URL에 포함
  const encodedQuery = encodeURIComponent(searchQuery + ' design inspiration');
  const url = `https://www.google.com/search?q=${encodedQuery}&tbm=isch`;
  
  console.log('Opening:', url);
  // 예: https://www.google.com/search?q=모바일%20앱%20UI%20디자인&tbm=isch
  
  try {
    if (await InAppBrowser.isAvailable()) {
      const result = await InAppBrowser.open(url, {
        // iOS 설정
        dismissButtonStyle: 'close',
        preferredBarTintColor: '#4285F4',
        preferredControlTintColor: 'white',
        readerMode: false,
        animated: true,
        modalPresentationStyle: 'fullScreen',
        
        // Android 설정
        toolbarColor: '#4285F4',
        secondaryToolbarColor: 'white',
        showTitle: true,
        enableUrlBarHiding: true,
        enableDefaultShare: true,
        forceCloseOnRedirection: false,
      });
      
      console.log('Browser closed:', result);
    } else {
      console.log('InAppBrowser not available');
    }
  } catch (error) {
    console.error('Error opening browser:', error);
  }
};

// 사용 예시
openGoogleImagesSearch('모바일 앱 UI 디자인');
```

---

## 🎨 CreatoPick 적용 예제

### **PresetCreationModal에 통합**
```typescript
import InAppBrowser from 'react-native-inappbrowser-reborn';

const handleComplete = async () => {
  const finalTopic = step === 'custom' ? customTopic : selectedTopic;
  
  // 1. Preset 저장
  onComplete({
    name: `${selectedField} - ${selectedRole}`,
    field: selectedField,
    role: selectedRole,
    topic: finalTopic,
  });
  
  // 2. InAppBrowser로 검색 열기
  if (finalTopic && finalTopic.trim()) {
    const searchQuery = encodeURIComponent(finalTopic + ' design inspiration');
    const url = `https://www.google.com/search?q=${searchQuery}&tbm=isch`;
    
    try {
      if (await InAppBrowser.isAvailable()) {
        await InAppBrowser.open(url, {
          // iOS
          dismissButtonStyle: 'close',
          preferredBarTintColor: '#4285F4',
          preferredControlTintColor: 'white',
          
          // Android
          toolbarColor: '#4285F4',
          showTitle: true,
          enableUrlBarHiding: true,
          enableDefaultShare: true,
        });
      }
    } catch (error) {
      console.error('Browser error:', error);
    }
  }
};
```

---

## 🎯 다양한 검색 엔진 예제

### **1. Google Images**
```typescript
const searchGoogleImages = async (query: string) => {
  const url = `https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=isch`;
  await InAppBrowser.open(url);
};
```

### **2. Pinterest (InAppBrowser는 작동!)**
```typescript
const searchPinterest = async (query: string) => {
  const url = `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(query)}`;
  await InAppBrowser.open(url);
};
```

### **3. Dribbble**
```typescript
const searchDribbble = async (query: string) => {
  const url = `https://dribbble.com/search/${encodeURIComponent(query)}`;
  await InAppBrowser.open(url);
};
```

### **4. Behance**
```typescript
const searchBehance = async (query: string) => {
  const url = `https://www.behance.net/search/projects?search=${encodeURIComponent(query)}`;
  await InAppBrowser.open(url);
};
```

---

## 🔧 고급 옵션

### **완전한 설정 예제**
```typescript
const openWithFullOptions = async (url: string) => {
  await InAppBrowser.open(url, {
    // iOS 옵션
    dismissButtonStyle: 'close', // 'done', 'close', 'cancel'
    preferredBarTintColor: '#4285F4', // 툴바 배경색
    preferredControlTintColor: 'white', // 버튼 색상
    readerMode: false, // 리더 모드
    animated: true, // 애니메이션
    modalPresentationStyle: 'fullScreen', // 'fullScreen', 'pageSheet', 'formSheet', 'overFullScreen'
    modalTransitionStyle: 'coverVertical', // 'coverVertical', 'flipHorizontal', 'crossDissolve', 'partialCurl'
    modalEnabled: true,
    enableBarCollapsing: false,
    
    // Android 옵션
    showTitle: true, // 제목 표시
    toolbarColor: '#4285F4', // 툴바 색상
    secondaryToolbarColor: 'white',
    navigationBarColor: 'black',
    navigationBarDividerColor: 'white',
    enableUrlBarHiding: true, // URL 바 숨김
    enableDefaultShare: true, // 공유 버튼
    forceCloseOnRedirection: false,
    
    // 공통 옵션
    headers: {
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)',
    },
  });
};
```

---

## 📊 WebView vs InAppBrowser 비교

### **검색어 전달 방식**

#### **WebView (현재 방식)**
```typescript
<WebView 
  source={{ 
    uri: `https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=isch` 
  }} 
/>
```
✅ 검색어 전달 가능
✅ 메모 UI와 함께 표시
❌ SSL 에러 발생 가능

#### **InAppBrowser**
```typescript
await InAppBrowser.open(
  `https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=isch`
);
```
✅ 검색어 전달 가능
✅ SSL 에러 없음
❌ 메모 UI와 함께 표시 불가

---

## 🎯 CreatoPick에 적용 시 문제점

### **현재 요구사항:**
```typescript
<DesignReferenceBrowser>
  <WebView /> ← 상단: 검색 결과
  <MemoInput /> ← 하단: 메모 입력 (200px)
</DesignReferenceBrowser>
```

### **InAppBrowser 사용 시:**
```typescript
// 전체 화면 브라우저만 열림
await InAppBrowser.open(url);

// ❌ 메모 입력 UI를 함께 표시할 수 없음
// ❌ 브라우저가 닫히면 앱으로 복귀
// ❌ 브라우저 내부에서 메모 작성 불가
```

---

## 💡 하이브리드 솔루션

만약 InAppBrowser를 사용하고 싶다면:

### **옵션 1: 버튼으로 선택**
```typescript
<DesignReferenceBrowser>
  {/* WebView로 기본 표시 */}
  <WebView source={{ uri: url }} />
  <MemoInput />
  
  {/* 외부 브라우저로 열기 버튼 */}
  <Button 
    title="외부 브라우저로 열기"
    onPress={() => InAppBrowser.open(url)}
  />
</DesignReferenceBrowser>
```

### **옵션 2: 메모 분리**
```typescript
// 1단계: InAppBrowser로 검색
await InAppBrowser.open(url);

// 2단계: 브라우저 닫힌 후 메모 화면
navigation.navigate('MemoScreen', { topic: selectedTopic });
```

---

## 🚀 실제 구현 예제

### **완전한 컴포넌트**
```typescript
import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import InAppBrowser from 'react-native-inappbrowser-reborn';

interface DesignSearchProps {
  searchQuery: string;
}

export default function DesignSearch({ searchQuery }: DesignSearchProps) {
  const [isLoading, setIsLoading] = useState(false);

  const openInAppBrowser = async () => {
    setIsLoading(true);
    
    const encodedQuery = encodeURIComponent(searchQuery + ' design inspiration');
    const url = `https://www.google.com/search?q=${encodedQuery}&tbm=isch`;
    
    try {
      if (await InAppBrowser.isAvailable()) {
        const result = await InAppBrowser.open(url, {
          // iOS
          dismissButtonStyle: 'close',
          preferredBarTintColor: '#4285F4',
          preferredControlTintColor: 'white',
          animated: true,
          
          // Android
          toolbarColor: '#4285F4',
          showTitle: true,
          enableUrlBarHiding: true,
          enableDefaultShare: true,
        });
        
        console.log('Browser result:', result);
        // result.type: 'cancel' | 'dismiss'
      } else {
        console.log('InAppBrowser not available');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.button}
        onPress={openInAppBrowser}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? '열리는 중...' : `"${searchQuery}" 검색`}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  button: {
    backgroundColor: '#4285F4',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
```

---

## 📝 요약

### **검색어 전달: ✅ 가능합니다!**

```typescript
// 방법 1: 직접 URL 생성
const url = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}&tbm=isch`;
await InAppBrowser.open(url);

// 방법 2: 함수로 래핑
const searchWithInAppBrowser = async (query: string) => {
  const url = `https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=isch`;
  await InAppBrowser.open(url);
};

// 사용
searchWithInAppBrowser('모바일 앱 UI 디자인');
```

### **하지만 CreatoPick에는:**
- ❌ 메모 UI와 함께 사용 불가
- ❌ 전체 화면을 차지
- ❌ 브라우저 내부에서 앱 기능 사용 불가

### **권장:**
- ✅ WebView 유지 (메모 기능 필수)
- ✅ SSL 에러는 자동 복구로 해결됨
- ✅ 필요시 "외부 브라우저로 열기" 버튼 추가
