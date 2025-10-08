'use client';

import { useState, useEffect, useCallback } from 'react';
import { CameraState, CameraError as CameraErrorType } from '@/types';
import { getCameraStream, stopCameraStream, isCameraSupported } from '@/lib/camera';
import VideoStream from './VideoStream';

interface CameraViewProps {
  onVideoReady?: (video: HTMLVideoElement) => void;
  className?: string;
}

/**
 * 카메라 뷰 컴포넌트
 * 카메라 스트림 관리 및 표시
 */
export default function CameraView({ onVideoReady, className = '' }: CameraViewProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraState, setCameraState] = useState<CameraState>('initializing');
  const [error, setError] = useState<CameraErrorType | null>(null);

  // 카메라 초기화
  const initializeCamera = useCallback(async () => {
    console.log('Initializing camera...');
    console.log('Window location:', window.location.href);
    console.log('Is secure context:', window.isSecureContext);
    
    // 브라우저 지원 확인
    if (!isCameraSupported()) {
      setCameraState('error');
      
      // HTTPS 체크
      const isLocalhost = window.location.hostname === 'localhost' || 
                          window.location.hostname === '127.0.0.1';
      const isSecure = window.isSecureContext;
      
      let errorMessage = '이 브라우저는 카메라를 지원하지 않습니다.';
      
      if (!isSecure && !isLocalhost) {
        errorMessage = '카메라는 HTTPS 또는 localhost에서만 사용할 수 있습니다. localhost:3000으로 접속해주세요.';
      }
      
      setError({
        type: 'not-supported',
        message: errorMessage,
      });
      return;
    }

    setCameraState('initializing');

    try {
      const cameraStream = await getCameraStream();
      setStream(cameraStream);
      setCameraState('ready');
      setError(null);
    } catch (err) {
      const cameraError = err as CameraErrorType;
      setCameraState(cameraError.type === 'permission-denied' ? 'no-permission' : 'error');
      setError(cameraError);
    }
  }, []);

  // 컴포넌트 마운트 시 카메라 초기화
  useEffect(() => {
    initializeCamera();

    // 클린업: 컴포넌트 언마운트 시 카메라 스트림 중지
    return () => {
      if (stream) {
        stopCameraStream(stream);
      }
    };
  }, []);

  // 에러 메시지 렌더링
  const renderError = () => {
    const isLocalhost = window.location.hostname === 'localhost' || 
                        window.location.hostname === '127.0.0.1';
    const isSecure = window.isSecureContext;
    
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-900 text-white p-6">
        <div className="text-center max-w-md">
          <svg
            className="w-16 h-16 mx-auto mb-4 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h3 className="text-xl font-bold mb-2">카메라 오류</h3>
          <p className="text-gray-300 mb-4">{error?.message}</p>
          
          {!isSecure && !isLocalhost && (
            <div className="bg-yellow-900/30 border border-yellow-600 rounded-lg p-3 mb-4 text-sm">
              <p className="text-yellow-300 font-semibold mb-1">💡 해결 방법:</p>
              <p className="text-yellow-200">
                현재 주소: <code className="bg-black/30 px-1 rounded">{window.location.hostname}</code>
                <br />
                localhost:3000 으로 접속해주세요
              </p>
            </div>
          )}
          
          <button
            onClick={initializeCamera}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  };

  // 로딩 상태 렌더링
  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center h-full bg-gray-900 text-white">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
      <p className="text-gray-300">카메라를 초기화하는 중...</p>
    </div>
  );

  return (
    <div className={`relative w-full h-full ${className}`}>
      {cameraState === 'initializing' && renderLoading()}
      {(cameraState === 'error' || cameraState === 'no-permission') && renderError()}
      {cameraState === 'ready' && stream && (
        <VideoStream
          stream={stream}
          onVideoReady={onVideoReady}
          className="w-full h-full"
        />
      )}
    </div>
  );
}

