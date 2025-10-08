// 필터 타입 정의
export interface Filter {
  id: string;
  name: string;
  color: string;
  category: 'gold' | 'blue-green' | 'green' | 'chroma';
}

// 카메라 설정 타입
export interface CameraConfig {
  facingMode: 'user' | 'environment';
  width: number;
  height: number;
  frameRate: number;
}

// 녹화 설정 타입
export interface RecordingConfig {
  mimeType: string;
  videoBitsPerSecond?: number;
}

// 세그멘테이션 결과 타입
export interface SegmentationResult {
  mask: ImageData;
  width: number;
  height: number;
}

// 녹화 상태 타입
export type RecordingState = 'idle' | 'recording' | 'paused' | 'stopped';

// 카메라 상태 타입
export type CameraState = 'initializing' | 'ready' | 'error' | 'no-permission';

// 에러 타입
export interface CameraError {
  type: 'permission-denied' | 'not-supported' | 'device-error' | 'unknown';
  message: string;
}

// 성능 메트릭 타입
export interface PerformanceMetrics {
  fps: number;
  segmentationTime: number;
  renderTime: number;
}

