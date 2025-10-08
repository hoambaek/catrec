# 🎥 실시간 필터 카메라 웹 애플리케이션

모바일 브라우저에서 AI 기반 실시간 필터를 적용하여 동영상을 촬영하고 저장할 수 있는 웹 애플리케이션입니다.

## ✨ 주요 기능

### 📷 카메라 기능
- **실시간 카메라 스트림**: MediaDevices API를 통한 카메라 접근
- **전면/후면 카메라 지원**: 카메라 전환 기능 (구현 예정)
- **권한 관리**: 직관적인 카메라 권한 요청 및 에러 처리

### 🎨 AI 기반 필터 시스템
- **실시간 인물 세그멘테이션**: TensorFlow.js BodyPix (MobileNetV1) 활용
- **10가지 프리미엄 컬러 필터**:
  - 🥂 골드 톤 3가지 (샴페인 컬러)
  - 🌊 딥 블루/그린 톤 3가지 (프리미엄)
  - 🌿 그린 톤 3가지 (자연/우아함)
  - 💚 크로마키 그린 1가지

- **필터 효과**: 인물 영역은 블랙(#000000), 배경은 선택된 컬러로 처리
- **실시간 필터 전환**: 촬영 전 자유롭게 필터 변경 가능

### 🎬 녹화 기능
- **필터 적용 녹화**: 실시간 필터가 적용된 상태로 동영상 녹화
- **MediaRecorder API**: WebM/MP4 포맷 지원
- **녹화 컨트롤**:
  - 직관적인 녹화 시작/정지 버튼
  - 실시간 타이머 표시 (MM:SS)
  - 녹화 상태 인디케이터

- **자동 저장**: 촬영 완료 시 자동 다운로드
- **파일명 자동 생성**: `filter_video_YYYYMMDD_HHMMSS.webm`

### ⚡ 성능 모니터링
- **FPS 카운터**: 실시간 성능 확인
- **최적화된 렌더링**: Canvas 기반 고속 처리
- **모바일 최적화**: 저사양 디바이스 대응

## 🛠️ 기술 스택

- **프레임워크**: [Next.js 15](https://nextjs.org/) (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS
- **AI/ML**: 
  - [TensorFlow.js](https://www.tensorflow.org/js) (WebGL 백엔드)
  - [@tensorflow-models/body-pix](https://github.com/tensorflow/tfjs-models/tree/master/body-pix) (인물 세그멘테이션)
- **미디어 처리**: 
  - MediaDevices API
  - MediaRecorder API
  - Canvas API

## 📦 설치 및 실행

### 요구사항
- Node.js 18.17 이상
- npm 또는 yarn

### 설치

\`\`\`bash
# 저장소 클론
git clone https://github.com/yourusername/catrec.git
cd catrec

# 의존성 설치
npm install
\`\`\`

### 개발 서버 실행

\`\`\`bash
npm run dev
\`\`\`

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 프로덕션 빌드

\`\`\`bash
# 빌드
npm run build

# 프로덕션 서버 실행
npm start
\`\`\`

### Vercel 배포 (권장)

가장 간단한 배포 방법:

\`\`\`bash
# Vercel CLI 설치
npm install -g vercel

# 배포
vercel

# 프로덕션 배포
vercel --prod
\`\`\`

자세한 배포 가이드는 [DEPLOY.md](./DEPLOY.md)를 참고하세요.

## 📱 지원 브라우저

### 권장 환경
- **iOS**: Safari 15+ (iPhone, iPad)
- **Android**: Chrome 90+ (Galaxy, Pixel 등)
- **Desktop**: Chrome, Edge, Safari 최신 버전

### 최소 사양
- **iOS**: 14+
- **Android**: 9+
- **RAM**: 2GB 이상 (권장: 4GB+)

## 🎯 사용 방법

1. **카메라 권한 허용**: 최초 접속 시 카메라 권한 요청에 동의
2. **필터 선택**: 화면 하단의 10가지 필터 중 원하는 컬러 선택
3. **실시간 프리뷰**: 필터가 적용된 모습을 실시간으로 확인
4. **녹화 시작**: 중앙 하단의 빨간 버튼 탭
5. **녹화 중지**: 녹화 중 버튼을 다시 탭하여 중지
6. **자동 저장**: 촬영된 비디오가 자동으로 다운로드됨

## 📂 프로젝트 구조

\`\`\`
catrec/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # 메인 페이지
│   │   ├── layout.tsx         # 루트 레이아웃
│   │   └── globals.css        # 전역 스타일
│   ├── components/
│   │   ├── camera/            # 카메라 관련 컴포넌트
│   │   │   ├── CameraView.tsx
│   │   │   ├── VideoStream.tsx
│   │   │   ├── CanvasOverlay.tsx
│   │   │   └── RecordingControls.tsx
│   │   └── filters/           # 필터 관련 컴포넌트
│   ├── lib/                   # 유틸리티 함수
│   │   ├── camera.ts          # 카메라 관련 유틸
│   │   ├── segmentation.ts    # AI 세그멘테이션
│   │   └── recorder.ts        # 녹화 관련 유틸
│   ├── types/                 # TypeScript 타입 정의
│   │   └── index.ts
│   └── constants/             # 상수 정의
│       ├── filters.ts         # 필터 색상
│       └── camera.ts          # 카메라 설정
├── public/                    # 정적 파일
├── PRD.md                     # 제품 요구사항 문서
├── history.md                 # 개발 진행사항
└── README.md                  # 프로젝트 문서 (이 파일)
\`\`\`

## 🎨 컬러 팔레트

### 골드 톤
- **Gold Light**: `#A87932`
- **Gold Medium**: `#C89B55`
- **Gold Dark**: `#705430`

### 딥 블루/그린 톤
- **Midnight Blue**: `#191970`
- **Deep Teal**: `#004D40`
- **Navy Blue**: `#003153`

### 그린 톤
- **Forest Green**: `#228B22`
- **Olive Green**: `#556B2F`
- **Dark Cyan**: `#005B4B`

### 크로마키
- **Chroma Green**: `#00FF00`

## ⚙️ 환경 설정

현재 프로젝트는 환경 변수 없이 작동합니다. 모든 처리는 클라이언트 측에서 진행되며, 서버로 데이터를 전송하지 않습니다.

## 🔒 보안 및 프라이버시

- ✅ **로컬 처리**: 모든 비디오 및 AI 처리는 사용자의 브라우저에서만 진행
- ✅ **서버 전송 없음**: 촬영된 비디오는 서버로 전송되지 않음
- ✅ **GDPR 준수**: 개인정보보호법 준수
- ✅ **투명한 권한 요청**: 카메라 접근 시 명확한 안내

## 📊 성능 지표

- **세그멘테이션 FPS**: 평균 15-30fps (디바이스에 따라 다름)
- **녹화 FPS**: 30fps
- **초기 로딩 시간**: 약 2-3초 (AI 모델 로드 포함)

## 🚀 향후 계획

### 단기 목표
- [ ] 전면/후면 카메라 전환 기능
- [ ] 녹화 중 필터 변경 기능 (optional)
- [ ] 사진 촬영 모드
- [ ] 성능 프로파일링 및 최적화

### 중기 목표
- [ ] 필터 프리셋 (미리 정의된 조합)
- [ ] 브랜드 로고/텍스트 오버레이
- [ ] 소셜 미디어 직접 공유
- [ ] PWA 지원 (오프라인 사용)

### 장기 목표
- [ ] AR 효과 (얼굴 인식 기반)
- [ ] 배경 음악 삽입
- [ ] 더 정교한 세그멘테이션 모델
- [ ] WebGPU 지원

## 🐛 알려진 이슈

1. **iOS Safari WebM 지원 제한**: MP4 fallback으로 대응 중
2. **저사양 디바이스 성능**: 해상도 자동 조정 기능 필요 (구현 예정)
3. **MediaPipe 모델 로딩 시간**: 첫 로드 시 2-3초 소요

## 🤝 기여하기

이 프로젝트는 개발 중입니다. 버그 리포트나 기능 제안은 환영합니다!

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다.

## 📚 참고 문서

- [Next.js 문서](https://nextjs.org/docs)
- [TensorFlow.js 문서](https://www.tensorflow.org/js)
- [MediaPipe 문서](https://google.github.io/mediapipe/)
- [MDN Web Docs - MediaDevices](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices)
- [MDN Web Docs - MediaRecorder](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder)

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 등록해주세요.

---

Made with ❤️ using Next.js, TensorFlow.js, and MediaPipe
