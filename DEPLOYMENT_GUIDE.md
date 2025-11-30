# Vercel 배포 가이드

## 🚀 Vercel 환경 변수 설정

### 1. API 키 환경 변수로 이동

현재 임시로 하드코딩된 API 키를 Vercel 환경 변수로 옮기세요:

**Vercel Dashboard → Project Settings → Environment Variables**

```
Variable Name: OPENAI_API_KEY
Value: your-openai-api-key-here
Environment: Production, Preview, Development
```

### 2. 코드 수정 ( 배포 전)

하드코딩된 키를 제거하고 환경 변수만 사용하도록 수정:

```javascript
// src/services/openai.js
constructor() {
  // Vercel 배포 후에는 이 줄만 남기고 하드코딩된 키 제거
  this.apiKey = Constants.expoConfig?.extra?.OPENAI_API_KEY;
  this.baseUrl = 'https://api.openai.com/v1';
  this.model = 'gpt-4o-mini';
  
  // Rate limiting
  this.lastRequestTime = 0;
  this.minRequestInterval = 1000;
}
```

### 3. Vercel 배포 단계

1. **GitHub 연결**: Vercel에 레포지토리 연결
2. **환경 변수 설정**: 위에서 설정한 OPENAI_API_KEY 확인
3. **빌드 설정**: Expo 웹 빌드 설정 확인
4. **배포**: 자동 배포 진행

### 4. 배포 후 테스트

- 배포된 사이트에서 PresetCreationModal 접근
- 필드 선택 → 역할 선택 → AI 주제 생성 테스트
- 콘솔에서 API 연결 로그 확인

## 🔧 현재 상태

### ✅ 개발 환경 ( 지원
- 하드코딩된 API 키로 즉시 테스트 가능
- 개발 경고 메시지 표시
- 환경 변수 우선 적용

### 🔄 배포 준비
- 환경 변수 설정 후 하드코딩된 키 제거 필요
- Vercel 환경 변수 설정 필요
- 보안 강화 완료

### ⚠️ 보안 참고사항
- 현재 하드코딩된 키는 개발용 임시 키
- 배포 전에는 반드시 환경 변수로 이전
- Git에 커밋하지 않도록 주의

## 📱 테스트 방법

### 로컬 테스트 ( 지금 바로 가능
1. `npm start` 실행
2. PresetCreationModal에서 필드/역할 선택
3. AI 주제 생성 테스트
4. 콘솔 로그에서 연결 상태 확인

### 배포 테스트 ( Vercel 배포 후
1. Vercel 배포된 URL 접근
2. 동일한 테스트 진행
3. API 키가 환경 변수에서 로드되는지 확인
