import { CameraConfig, CameraError } from '@/types';
import { DEFAULT_CAMERA_CONFIG } from '@/constants/camera';

/**
 * 카메라 스트림을 가져옵니다
 */
export async function getCameraStream(
  config: Partial<CameraConfig> = {}
): Promise<MediaStream> {
  const finalConfig = { ...DEFAULT_CAMERA_CONFIG, ...config };

  try {
    const constraints: MediaStreamConstraints = {
      video: {
        facingMode: finalConfig.facingMode,
        width: { ideal: finalConfig.width },
        height: { ideal: finalConfig.height },
        frameRate: { ideal: finalConfig.frameRate },
      },
      audio: false, // 오디오는 필요 없음
    };

    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    return stream;
  } catch (error) {
    throw mapCameraError(error);
  }
}

/**
 * 카메라 스트림을 중지합니다
 */
export function stopCameraStream(stream: MediaStream | null): void {
  if (!stream) return;

  stream.getTracks().forEach((track) => {
    track.stop();
  });
}

/**
 * 카메라 전환 (전면 <-> 후면)
 */
export async function switchCamera(
  currentStream: MediaStream,
  currentFacingMode: 'user' | 'environment'
): Promise<MediaStream> {
  // 현재 스트림 중지
  stopCameraStream(currentStream);

  // 반대 카메라로 전환
  const newFacingMode = currentFacingMode === 'user' ? 'environment' : 'user';

  return getCameraStream({ facingMode: newFacingMode });
}

/**
 * 브라우저가 카메라를 지원하는지 확인
 */
export function isCameraSupported(): boolean {
  // MediaDevices API 지원 확인
  if (!navigator.mediaDevices) {
    console.error('navigator.mediaDevices is not available');
    return false;
  }
  
  if (!navigator.mediaDevices.getUserMedia) {
    console.error('getUserMedia is not available');
    return false;
  }
  
  // HTTPS 확인 (localhost는 예외)
  const isSecureContext = window.isSecureContext;
  const isLocalhost = window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1';
  
  if (!isSecureContext && !isLocalhost) {
    console.warn('Camera requires HTTPS or localhost');
  }
  
  return true;
}

/**
 * 에러를 CameraError 타입으로 변환
 */
function mapCameraError(error: unknown): CameraError {
  if (error instanceof DOMException) {
    switch (error.name) {
      case 'NotAllowedError':
      case 'PermissionDeniedError':
        return {
          type: 'permission-denied',
          message: '카메라 권한이 거부되었습니다. 브라우저 설정에서 카메라 접근을 허용해주세요.',
        };
      case 'NotFoundError':
      case 'DevicesNotFoundError':
        return {
          type: 'device-error',
          message: '카메라를 찾을 수 없습니다. 카메라가 연결되어 있는지 확인해주세요.',
        };
      case 'NotReadableError':
      case 'TrackStartError':
        return {
          type: 'device-error',
          message: '카메라를 사용할 수 없습니다. 다른 앱에서 카메라를 사용 중일 수 있습니다.',
        };
      case 'NotSupportedError':
        return {
          type: 'not-supported',
          message: '이 브라우저는 카메라를 지원하지 않습니다.',
        };
    }
  }

  return {
    type: 'unknown',
    message: '카메라 접근 중 알 수 없는 오류가 발생했습니다.',
  };
}

/**
 * iOS Safari 여부 확인
 */
export function isIOSSafari(): boolean {
  const ua = navigator.userAgent;
  const iOS = /iPad|iPhone|iPod/.test(ua);
  const webkit = /WebKit/.test(ua);
  return iOS && webkit && !/CriOS|FxiOS|OPiOS|mercury/.test(ua);
}

/**
 * 디바이스가 모바일인지 확인
 */
export function isMobileDevice(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

