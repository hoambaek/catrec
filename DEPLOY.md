# 🚀 Vercel 배포 가이드

## 배포 전 준비

### 1. Git 저장소 초기화 (이미 되어있음)
프로젝트는 이미 Git이 초기화되어 있습니다.

### 2. 변경사항 커밋
```bash
git add .
git commit -m "Initial commit - Real-time Filter Camera App"
```

### 3. GitHub에 Push (선택사항)
```bash
# GitHub에서 새 저장소 생성 후
git remote add origin https://github.com/your-username/catrec.git
git branch -M main
git push -u origin main
```

---

## 방법 1: Vercel CLI로 배포 (가장 빠름)

### 설치
```bash
npm install -g vercel
```

### 배포
```bash
# 프로젝트 디렉토리에서 실행
vercel

# 프로덕션 배포
vercel --prod
```

**질문에 답하기:**
- Set up and deploy? **Y**
- Which scope? (본인 계정 선택)
- Link to existing project? **N**
- What's your project's name? **catrec** (또는 원하는 이름)
- In which directory is your code located? **./** (엔터)
- Want to override the settings? **N**

배포 완료! URL이 표시됩니다: `https://catrec-xxx.vercel.app`

---

## 방법 2: Vercel Dashboard (GUI)

### 1. Vercel 계정 생성
https://vercel.com/signup

### 2. GitHub 연동
- "Add New Project" 클릭
- GitHub 저장소 연동
- catrec 저장소 선택

### 3. 배포 설정
프레임워크가 자동으로 감지됩니다:
- Framework Preset: **Next.js**
- Build Command: `npm run build`
- Output Directory: `.next`

**추가 설정 불필요!** 바로 Deploy 클릭

### 4. 배포 완료
- 2-3분 후 배포 완료
- 자동 HTTPS 도메인 생성: `https://catrec.vercel.app`

---

## 방법 3: Vercel Import (가장 간단)

1. https://vercel.com/new 접속
2. "Import Git Repository" 선택
3. GitHub URL 입력
4. Deploy 클릭

---

## 배포 후 확인사항

### ✅ 체크리스트
- [ ] HTTPS로 접속되는지 확인 (자동)
- [ ] 카메라 권한 요청이 나오는지
- [ ] 모바일에서 테스트 (iPhone/Android)
- [ ] AI 모델이 로드되는지 (2-3초)
- [ ] 필터 전환이 작동하는지
- [ ] 녹화 기능이 작동하는지
- [ ] 비디오 다운로드가 되는지

### 📱 모바일 테스트
배포된 URL을 모바일 브라우저에서 열어보세요:
- **iOS**: Safari에서 테스트
- **Android**: Chrome에서 테스트

---

## 환경 변수 (필요 시)

현재 프로젝트는 환경 변수가 필요하지 않습니다.
모든 처리가 클라이언트 측에서 진행됩니다.

---

## 도메인 설정 (선택사항)

### 커스텀 도메인 연결
1. Vercel Dashboard → 프로젝트 선택
2. Settings → Domains
3. 도메인 입력 및 DNS 설정

---

## 자동 배포

GitHub 저장소와 연동한 경우:
- **main 브랜치**에 push하면 자동 배포
- **PR 생성**하면 프리뷰 배포 생성

---

## 성능 최적화 (이미 적용됨)

### ✅ 현재 최적화 상태
- Next.js App Router 사용
- TensorFlow.js WebGL 백엔드
- Canvas 기반 실시간 렌더링
- 클라이언트 사이드 처리 (서버 부하 없음)

### 추가 최적화 (선택사항)

#### 1. Image Optimization
Vercel은 자동으로 이미지 최적화를 제공합니다.

#### 2. Analytics 추가
```bash
npm install @vercel/analytics
```

\`\`\`tsx
// src/app/layout.tsx에 추가
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
\`\`\`

---

## 예상 배포 시간

- **첫 배포**: 2-3분
- **이후 배포**: 1-2분

---

## 비용

- **Hobby Plan (무료)**:
  - 무제한 배포
  - 100GB 대역폭/월
  - HTTPS 자동
  - 본 프로젝트에 충분!

---

## 문제 해결

### 배포 실패 시
```bash
# 로컬에서 빌드 테스트
npm run build

# 에러가 없으면 배포 재시도
vercel --prod
```

### 카메라 작동 안 함
- HTTPS 확인 (Vercel은 자동 HTTPS)
- 브라우저 콘솔 확인
- 모바일 브라우저 권한 확인

### AI 모델 로딩 느림
- 첫 로딩은 2-3초 정상
- CDN 캐싱으로 이후 빨라짐

---

## 배포 후 공유

배포 완료 후 URL을 공유하세요:
- **데스크톱**: Chrome, Safari, Edge
- **모바일**: iOS Safari, Android Chrome

친구들에게 보내서 바로 테스트 가능! 📱✨

---

## 참고 자료

- [Vercel 공식 문서](https://vercel.com/docs)
- [Next.js 배포 가이드](https://nextjs.org/docs/deployment)
- [Vercel CLI 문서](https://vercel.com/docs/cli)

