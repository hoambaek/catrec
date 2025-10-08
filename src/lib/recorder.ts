import { RecordingConfig } from '@/types';
import { RECORDING_CONFIG, IOS_RECORDING_CONFIG } from '@/constants/camera';
import { isIOSSafari } from './camera';

/**
 * MediaRecorder 래퍼 클래스
 */
export class VideoRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  private stream: MediaStream | null = null;

  /**
   * Canvas에서 스트림을 가져와 녹화 준비
   */
  async initialize(canvas: HTMLCanvasElement): Promise<void> {
    try {
      // Canvas에서 MediaStream 추출
      const frameRate = 30;
      this.stream = canvas.captureStream(frameRate);

      if (!this.stream) {
        throw new Error('Failed to capture stream from canvas');
      }

      // 녹화 설정 (iOS Safari 고려)
      const config = isIOSSafari() ? IOS_RECORDING_CONFIG : RECORDING_CONFIG;

      // MediaRecorder 지원 확인
      if (!MediaRecorder.isTypeSupported(config.mimeType)) {
        console.warn(`${config.mimeType} not supported, trying alternatives`);
        
        // 대체 포맷 시도
        const alternatives = [
          'video/webm;codecs=vp8',
          'video/webm',
          'video/mp4',
        ];

        let supportedMimeType = '';
        for (const mimeType of alternatives) {
          if (MediaRecorder.isTypeSupported(mimeType)) {
            supportedMimeType = mimeType;
            break;
          }
        }

        if (!supportedMimeType) {
          throw new Error('No supported video format found');
        }

        config.mimeType = supportedMimeType;
      }

      // MediaRecorder 생성
      this.mediaRecorder = new MediaRecorder(this.stream, config);

      // 데이터 수집
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };

      console.log('VideoRecorder initialized with', config.mimeType);
    } catch (error) {
      console.error('Failed to initialize recorder:', error);
      throw error;
    }
  }

  /**
   * 녹화 시작
   */
  start(): void {
    if (!this.mediaRecorder) {
      throw new Error('Recorder not initialized');
    }

    if (this.mediaRecorder.state !== 'inactive') {
      throw new Error('Recording already in progress');
    }

    this.recordedChunks = [];
    this.mediaRecorder.start(100); // 100ms마다 데이터 수집
    console.log('Recording started');
  }

  /**
   * 녹화 중지
   */
  stop(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('Recorder not initialized'));
        return;
      }

      if (this.mediaRecorder.state === 'inactive') {
        reject(new Error('Recording not in progress'));
        return;
      }

      // 녹화 중지 시 Blob 생성
      this.mediaRecorder.onstop = () => {
        const mimeType = this.mediaRecorder?.mimeType || 'video/webm';
        const blob = new Blob(this.recordedChunks, { type: mimeType });
        console.log('Recording stopped, blob size:', blob.size);
        resolve(blob);
      };

      this.mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        reject(new Error('Recording failed'));
      };

      this.mediaRecorder.stop();
    });
  }

  /**
   * 일시정지
   */
  pause(): void {
    if (!this.mediaRecorder) {
      throw new Error('Recorder not initialized');
    }

    if (this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.pause();
      console.log('Recording paused');
    }
  }

  /**
   * 재개
   */
  resume(): void {
    if (!this.mediaRecorder) {
      throw new Error('Recorder not initialized');
    }

    if (this.mediaRecorder.state === 'paused') {
      this.mediaRecorder.resume();
      console.log('Recording resumed');
    }
  }

  /**
   * 현재 상태 가져오기
   */
  getState(): RecordingState {
    if (!this.mediaRecorder) {
      return 'inactive';
    }
    return this.mediaRecorder.state as RecordingState;
  }

  /**
   * 리소스 정리
   */
  cleanup(): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }

    this.mediaRecorder = null;
    this.recordedChunks = [];

    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
  }
}

/**
 * Blob을 파일로 다운로드
 */
export function downloadVideo(blob: Blob, filename?: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  
  // 파일명 생성 (예: filter_video_20251008_223045.webm)
  const now = new Date();
  const timestamp = now
    .toISOString()
    .replace(/[-:]/g, '')
    .replace('T', '_')
    .split('.')[0];
  
  const extension = blob.type.includes('mp4') ? 'mp4' : 'webm';
  a.download = filename || `filter_video_${timestamp}.${extension}`;

  document.body.appendChild(a);
  a.click();

  // 정리
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}

/**
 * 녹화 시간 포맷팅 (MM:SS)
 */
export function formatRecordingTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

type RecordingState = 'inactive' | 'recording' | 'paused';

