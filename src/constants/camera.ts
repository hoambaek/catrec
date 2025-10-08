import { CameraConfig, RecordingConfig } from '@/types';

// 기본 카메라 설정
export const DEFAULT_CAMERA_CONFIG: CameraConfig = {
  facingMode: 'user', // 전면 카메라
  width: 1280,
  height: 720,
  frameRate: 30,
};

// 모바일 최적화 카메라 설정
export const MOBILE_CAMERA_CONFIG: CameraConfig = {
  facingMode: 'user',
  width: 1280,
  height: 720,
  frameRate: 30,
};

// 저사양 디바이스용 설정
export const LOW_END_CAMERA_CONFIG: CameraConfig = {
  facingMode: 'user',
  width: 640,
  height: 480,
  frameRate: 24,
};

// 녹화 설정
export const RECORDING_CONFIG: RecordingConfig = {
  mimeType: 'video/webm;codecs=vp9',
  videoBitsPerSecond: 2500000, // 2.5 Mbps
};

// iOS Safari용 녹화 설정 (MP4 fallback)
export const IOS_RECORDING_CONFIG: RecordingConfig = {
  mimeType: 'video/mp4',
  videoBitsPerSecond: 2500000,
};

// 세그멘테이션 설정
export const SEGMENTATION_CONFIG = {
  modelType: 'general', // 'general' 또는 'landscape'
  minFps: 15, // 최소 FPS
  targetFps: 30, // 목표 FPS
};

// 성능 임계값
export const PERFORMANCE_THRESHOLDS = {
  lowFpsWarning: 15, // 15fps 이하면 경고
  highMemoryWarning: 500, // 500MB 이상이면 경고 (MB)
};

