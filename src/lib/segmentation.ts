import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import * as bodyPix from '@tensorflow-models/body-pix';

let segmentationModel: bodyPix.BodyPix | null = null;
let isInitialized = false;

/**
 * TensorFlow.js 초기화
 */
export async function initializeTensorFlow(): Promise<void> {
  try {
    // WebGL 백엔드 설정
    await tf.setBackend('webgl');
    await tf.ready();
    console.log('TensorFlow.js initialized with WebGL backend');
  } catch (error) {
    console.error('TensorFlow.js initialization failed:', error);
    throw error;
  }
}

/**
 * BodyPix 모델 로드
 */
export async function loadSegmentationModel(): Promise<bodyPix.BodyPix> {
  if (segmentationModel && isInitialized) {
    return segmentationModel;
  }

  try {
    // TensorFlow.js 초기화
    await initializeTensorFlow();

    // BodyPix 모델 로드
    console.log('Loading BodyPix model...');
    
    // 모바일 디바이스 감지
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    segmentationModel = await bodyPix.load({
      architecture: 'MobileNetV1',
      outputStride: 16, // 성능과 품질 균형 (8은 너무 느림)
      multiplier: 0.75, // 적절한 품질 유지
      quantBytes: 2,
    });
    
    isInitialized = true;
    console.log('BodyPix model loaded successfully');
    
    return segmentationModel;
  } catch (error) {
    console.error('Failed to load segmentation model:', error);
    throw error;
  }
}

/**
 * 비디오 프레임에 세그멘테이션 적용
 */
export async function segmentFrame(
  video: HTMLVideoElement
): Promise<ImageData | null> {
  if (!segmentationModel || !isInitialized) {
    console.warn('Segmentation model not initialized');
    return null;
  }

  try {
    // 세그멘테이션 실행 (성능과 품질 균형)
    const segmentation = await segmentationModel.segmentPerson(video, {
      flipHorizontal: false,
      internalResolution: 'medium', // 성능과 품질 균형
      segmentationThreshold: 0.5, // 더 부드러운 감지
    });

    if (!segmentation) {
      return null;
    }

    // 마스크 데이터를 ImageData로 변환
    // BodyPix는 width x height 크기의 배열을 반환
    const { width, height, data } = segmentation;
    
    // ImageData 생성 (RGBA 형식)
    const imageData = new ImageData(width, height);
    
    // BodyPix 데이터를 ImageData로 변환
    // data 배열: 1 = 사람, 0 = 배경
    for (let i = 0; i < data.length; i++) {
      const pixelIndex = i * 4;
      const personValue = data[i] === 1 ? 255 : 0; // 1이면 사람(255), 0이면 배경(0)
      
      imageData.data[pixelIndex] = personValue;     // R
      imageData.data[pixelIndex + 1] = personValue; // G
      imageData.data[pixelIndex + 2] = personValue; // B
      imageData.data[pixelIndex + 3] = 255;         // A (불투명)
    }
    
    return imageData;
  } catch (error) {
    console.error('Segmentation failed:', error);
    return null;
  }
}

/**
 * 모델 리소스 정리
 */
export function cleanupSegmentationModel(): void {
  if (segmentationModel) {
    segmentationModel.dispose();
    segmentationModel = null;
    isInitialized = false;
  }
}

/**
 * 세그멘테이션 마스크를 Canvas에 적용하여 필터링
 */
export function applySegmentationFilter(
  canvas: HTMLCanvasElement,
  video: HTMLVideoElement,
  maskData: ImageData,
  backgroundColor: string
): void {
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return;

  // Canvas 크기를 비디오 크기와 맞춤
  if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
  }

  // 비디오 프레임을 Canvas에 그리기
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // 현재 프레임의 이미지 데이터 가져오기
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;
  const mask = maskData.data;

  // 배경 색상을 RGB로 변환
  const bgColor = hexToRgb(backgroundColor);

  // 각 픽셀에 필터 적용
  for (let i = 0; i < mask.length; i += 4) {
    const maskValue = mask[i]; // 0-255, 255 = 사람, 0 = 배경

    if (maskValue > 128) {
      // 사람 영역: 블랙으로 설정
      pixels[i] = 0;     // R
      pixels[i + 1] = 0; // G
      pixels[i + 2] = 0; // B
      // pixels[i + 3]은 alpha, 그대로 유지
    } else {
      // 배경 영역: 선택된 색상으로 설정
      pixels[i] = bgColor.r;     // R
      pixels[i + 1] = bgColor.g; // G
      pixels[i + 2] = bgColor.b; // B
      // pixels[i + 3]은 alpha, 그대로 유지
    }
  }

  // 수정된 이미지 데이터를 Canvas에 다시 그리기
  ctx.putImageData(imageData, 0, 0);
}

/**
 * HEX 색상을 RGB로 변환
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  // # 제거
  const sanitized = hex.replace('#', '');

  // RGB 값 추출
  const r = parseInt(sanitized.substring(0, 2), 16);
  const g = parseInt(sanitized.substring(2, 4), 16);
  const b = parseInt(sanitized.substring(4, 6), 16);

  return { r, g, b };
}

/**
 * 성능 측정을 위한 FPS 계산
 */
export class FPSCounter {
  private frames: number[] = [];
  private lastTime: number = performance.now();

  update(): number {
    const now = performance.now();
    const delta = now - this.lastTime;
    this.lastTime = now;

    this.frames.push(1000 / delta);
    if (this.frames.length > 60) {
      this.frames.shift();
    }

    return this.getAverageFPS();
  }

  getAverageFPS(): number {
    if (this.frames.length === 0) return 0;
    const sum = this.frames.reduce((a, b) => a + b, 0);
    return Math.round(sum / this.frames.length);
  }

  reset(): void {
    this.frames = [];
    this.lastTime = performance.now();
  }
}

