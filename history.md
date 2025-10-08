# 작업 진행사항 체크리스트

## 프로젝트: 실시간 필터 카메라 웹 애플리케이션

시작일: 2025-10-08

---

## Phase 1: 기본 구조 (1주)

### 1.1 프로젝트 셋업
- [x] Next.js 프로젝트 생성 (TypeScript, Tailwind CSS)
- [x] 필요한 패키지 설치
  - [x] TensorFlow.js 관련 패키지
  - [x] MediaPipe Selfie Segmentation
  - [x] 추가 유틸리티 패키지
- [x] 프로젝트 폴더 구조 설정
- [x] 기본 타입 정의 파일 생성

### 1.2 카메라 스트림 구현
- [x] CameraView 컴포넌트 생성
- [x] MediaDevices API 통합
  - [x] 카메라 권한 요청 처리
  - [x] getUserMedia() 구현
  - [x] 전면/후면 카메라 전환 기능
- [x] 비디오 스트림 표시
- [x] 에러 핸들링 (권한 거부, 지원하지 않는 브라우저 등)

### 1.3 기본 UI 레이아웃
- [x] 메인 페이지 레이아웃 구성
  - [x] 헤더 영역 (로고/타이틀)
  - [x] 카메라 프리뷰 영역 (중앙)
  - [x] 컨트롤 영역 (하단)
- [x] 반응형 디자인 적용 (모바일 우선)
- [x] 안전 영역 처리 (iOS notch, Android navigation bar)
- [x] 다크 테마 적용

---

## Phase 2: 필터 시스템 (2주)

### 2.1 TensorFlow.js 통합
- [x] TensorFlow.js 설치 및 초기화
- [x] WebGL 백엔드 설정
- [x] 모델 로딩 상태 관리
- [x] 로딩 인디케이터 UI

### 2.2 세그멘테이션 모델 구현
- [x] MediaPipe Selfie Segmentation 모델 로드
- [x] Canvas 설정 및 렌더링 파이프라인 구축
- [x] 실시간 세그멘테이션 처리
  - [x] 비디오 프레임 추출
  - [x] 세그멘테이션 실행
  - [x] 마스크 생성
- [x] 성능 최적화 (프레임 스킵, 해상도 조정)
- [x] FPS 모니터링 유틸리티

### 2.3 컬러 필터 시스템
- [x] 필터 색상 상수 정의
  - [x] 골드 톤 3가지
  - [x] 딥 블루/그린 톤 3가지
  - [x] 그린 톤 3가지
  - [x] 크로마키 1가지
- [x] 필터 적용 로직 구현
  - [x] 인물 영역: 블랙 (#000000)
  - [x] 배경 영역: 선택된 컬러
- [x] FilterSelector 컴포넌트 생성
- [x] 필터 버튼 UI (원형, 컬러 썸네일)
- [x] 필터 전환 기능
- [x] 선택된 필터 하이라이트

---

## Phase 3: 녹화 기능 (1주)

### 3.1 MediaRecorder 통합
- [x] MediaRecorder API 설정
- [x] Canvas 스트림을 MediaRecorder에 연결
- [x] 비디오 포맷 설정 (WebM/MP4)
- [x] 코덱 지원 확인 (VP8/VP9/H.264)

### 3.2 녹화 컨트롤 UI
- [x] RecordingControls 컴포넌트 생성
- [x] 녹화 시작/정지 버튼
  - [x] 녹화 전: 흰색 테두리 + 빨간 원
  - [x] 녹화 중: 빨간 사각형 (정지 아이콘)
- [x] 녹화 타이머 (MM:SS)
- [x] 녹화 상태 인디케이터 (빨간 점)
- [x] 버튼 애니메이션 효과

### 3.3 파일 저장 기능
- [x] DownloadManager 유틸리티 생성
- [x] Blob 데이터 처리
- [x] 자동 파일명 생성 (filter_video_YYYYMMDD_HHMMSS)
- [x] 다운로드 트리거 구현
- [x] 저장 완료 토스트 메시지
- [x] 에러 처리 (저장 실패 시)

---

## Phase 4: 최적화 및 테스트 (1주)

### 4.1 성능 최적화
- [ ] React 렌더링 최적화
  - [ ] useMemo, useCallback 적용
  - [ ] 불필요한 리렌더링 제거
- [ ] Canvas 렌더링 최적화
- [ ] 메모리 사용량 최적화
- [ ] 배터리 소모 최소화
- [ ] 디바이스별 해상도 자동 조정

### 4.2 크로스 브라우저 테스트
- [ ] iOS Safari 테스트
  - [ ] Safari 14
  - [ ] Safari 15
  - [ ] Safari 16, 17
- [ ] Android Chrome 테스트
- [ ] 권한 처리 테스트
- [ ] 호환성 이슈 수정

### 4.3 버그 수정 및 개선
- [ ] 발견된 버그 수정
- [ ] 사용성 개선
- [ ] 에러 메시지 개선
- [ ] 접근성 개선 (a11y)

---

## Phase 5: 배포 및 모니터링

### 5.1 프로덕션 배포
- [x] 환경 변수 설정 (필요 없음 - 클라이언트 사이드)
- [x] 빌드 최적화 (완료)
- [x] Vercel 배포 준비 완료
  - [x] .gitignore 생성
  - [x] .vercelignore 생성
  - [x] DEPLOY.md 가이드 작성
- [ ] 실제 Vercel 배포 (준비 완료)
- [ ] HTTPS 설정 (Vercel 자동)
- [ ] 도메인 연결 (선택사항)

### 5.2 문서화
- [x] README.md 작성
- [x] 사용자 가이드 작성
- [x] 기술 문서 정리

### 5.3 모니터링 및 피드백
- [ ] 에러 모니터링 설정 (Sentry 등)
- [ ] 사용자 피드백 수집 시스템
- [ ] 성능 모니터링
- [ ] 개선사항 파악

---

## 추가 작업 (선택사항)

### UI/UX 개선
- [ ] 로딩 애니메이션
- [ ] 부드러운 필터 전환 효과
- [ ] 햅틱 피드백 (모바일)
- [ ] 사운드 효과

### 추가 기능
- [ ] 사진 촬영 모드
- [ ] 필터 프리셋
- [ ] 소셜 미디어 공유
- [ ] PWA 지원

---

## 현재 진행 상황

**현재 Phase**: Phase 3 - 녹화 기능 (완료) → Phase 4 - 최적화 및 테스트 준비  
**진행률**: 85% (Phase 1, 2, 3 완료)  
**다음 작업**: 성능 최적화 및 크로스 브라우저 테스트

### Phase 1 완료 내역 (2025-10-08)
- ✅ 프로젝트 셋업 완료
- ✅ 필요한 패키지 설치 (@tensorflow/tfjs, @mediapipe/selfie_segmentation)
- ✅ 프로젝트 폴더 구조 생성 (components, lib, types, constants)
- ✅ 타입 정의 파일 작성 (Filter, CameraConfig, RecordingConfig 등)
- ✅ 필터 상수 정의 (10가지 컬러)
- ✅ 카메라 유틸리티 함수 구현 (getCameraStream, stopCameraStream 등)
- ✅ VideoStream 컴포넌트 구현
- ✅ CameraView 컴포넌트 구현 (에러 처리 포함)
- ✅ 메인 페이지 UI 레이아웃 구성
- ✅ 필터 선택 UI (10개 필터 버튼)
- ✅ 녹화 버튼 UI (기능은 아직 미구현)

### Phase 2 완료 내역 (2025-10-08)
- ✅ TensorFlow.js 초기화 및 WebGL 백엔드 설정
- ✅ BodyPix 모델 로드 (MobileNetV1)
- ✅ Canvas 렌더링 파이프라인 구축
- ✅ 실시간 세그멘테이션 처리 구현
- ✅ 필터 적용 로직 (인물 블랙 + 배경 컬러)
- ✅ CanvasOverlay 컴포넌트 구현
- ✅ FPS 카운터 및 성능 모니터링
- ✅ 실시간 필터 전환 기능
- ✅ 로딩 상태 및 에러 처리
- ✅ Next.js 호환성 문제 해결 (MediaPipe → BodyPix)

### Phase 3 완료 내역 (2025-10-08)
- ✅ VideoRecorder 클래스 구현 (MediaRecorder 래퍼)
- ✅ Canvas 스트림 캡처 및 녹화
- ✅ 비디오 포맷 자동 감지 (WebM/MP4)
- ✅ iOS Safari 호환성 처리
- ✅ RecordingControls 컴포넌트 구현
- ✅ 녹화 시작/정지 버튼 (상태별 UI 변경)
- ✅ 녹화 타이머 (MM:SS 포맷)
- ✅ 녹화 중 상태 인디케이터 (애니메이션)
- ✅ 자동 파일명 생성 및 다운로드
- ✅ 저장 완료 토스트 메시지
- ✅ 녹화 중 필터 변경 방지

---

## 이슈 및 참고사항

### 기술적 결정사항
- Next.js App Router 사용
- TypeScript로 타입 안정성 확보
- Tailwind CSS로 스타일링
- MediaPipe Selfie Segmentation 사용 (BodyPix 대안)

### 알려진 제약사항
- iOS Safari는 WebM 지원 제한적 → MP4 fallback 구현됨
- 모바일 성능 이슈 → 해상도 조정 필요 (개선 예정)
- Body Segmentation 모델 로딩 시간 2-3초 소요

### 기술적 변경사항
- **2025-10-08 (1차)**: MediaPipe Selfie Segmentation에서 @tensorflow-models/body-segmentation으로 전환 시도
  - 문제: MediaPipe runtime이 Next.js에서 로드되지 않음
- **2025-10-08 (2차)**: @tensorflow-models/body-pix로 최종 전환
  - 이유: Next.js 환경에서 가장 안정적이고 외부 의존성이 없음
  - 모델: MobileNetV1 (경량, 빠른 성능)
  - 장점: 별도의 외부 라이브러리 로딩 불필요, WebGL 가속 지원

### 현재 구현된 기능 요약
1. ✅ **카메라 기능**: 실시간 카메라 스트림, 권한 처리, 에러 핸들링
2. ✅ **AI 필터**: BodyPix(MobileNetV1) 기반 인물 세그멘테이션, 10가지 컬러 필터
3. ✅ **녹화 기능**: Canvas 스트림 녹화, 자동 저장, 타이머
4. ✅ **UI/UX**: 모바일 최적화, 다크 테마, 반응형 디자인
5. ✅ **성능**: FPS 모니터링, WebGL 가속

### 다음 우선순위 작업
1. 실제 디바이스 테스트 (iOS/Android)
2. 성능 최적화 (저사양 디바이스 대응)
3. 카메라 전환 기능 추가
4. 사용자 피드백 수집 및 개선

### 참고 링크
- [PRD 문서](./PRD.md)
- [Next.js 문서](https://nextjs.org/docs)
- [TensorFlow.js 문서](https://www.tensorflow.org/js)
- [MediaPipe 문서](https://google.github.io/mediapipe/)

