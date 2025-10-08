'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import {
  loadSegmentationModel,
  segmentFrame,
  applySegmentationFilter,
  cleanupSegmentationModel,
  FPSCounter,
} from '@/lib/segmentation';

interface CanvasOverlayProps {
  video: HTMLVideoElement | null;
  filterColor: string;
  onFPSUpdate?: (fps: number) => void;
  onCanvasReady?: (canvas: HTMLCanvasElement) => void;
  className?: string;
}

/**
 * Canvas 오버레이 컴포넌트
 * 실시간 세그멘테이션 및 필터 적용
 */
export default function CanvasOverlay({
  video,
  filterColor,
  onFPSUpdate,
  onCanvasReady,
  className = '',
}: CanvasOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const fpsCounterRef = useRef<FPSCounter>(new FPSCounter());
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [modelError, setModelError] = useState<string | null>(null);

  // 렌더링 루프
  const renderLoop = useCallback(async () => {
    if (!video || !canvasRef.current) {
      animationFrameRef.current = requestAnimationFrame(renderLoop);
      return;
    }

    try {
      // 비디오가 재생 중인지 확인
      if (video.readyState !== video.HAVE_ENOUGH_DATA) {
        animationFrameRef.current = requestAnimationFrame(renderLoop);
        return;
      }

      // 세그멘테이션 수행
      const maskData = await segmentFrame(video);

      if (maskData && canvasRef.current) {
        // 필터 적용
        applySegmentationFilter(
          canvasRef.current,
          video,
          maskData,
          filterColor
        );

        // FPS 업데이트
        const fps = fpsCounterRef.current.update();
        if (onFPSUpdate && fps > 0) {
          onFPSUpdate(fps);
        }
      } else {
        console.warn('No mask data received from segmentation');
      }
    } catch (error) {
      console.error('Render loop error:', error);
    }

    // 다음 프레임 요청
    animationFrameRef.current = requestAnimationFrame(renderLoop);
  }, [video, filterColor, onFPSUpdate]);

  // 모델 로드 및 렌더링 시작
  useEffect(() => {
    let isMounted = true;

    const initializeAndStart = async () => {
      try {
        console.log('[CanvasOverlay] Starting initialization...');
        setIsModelLoading(true);
        setModelError(null);

        // 모델 로드
        console.log('[CanvasOverlay] Loading segmentation model...');
        await loadSegmentationModel();
        console.log('[CanvasOverlay] Model loaded successfully');

        if (isMounted) {
          setIsModelLoading(false);
          // Canvas가 준비되었음을 알림
          if (onCanvasReady && canvasRef.current) {
            console.log('[CanvasOverlay] Canvas ready, notifying parent');
            onCanvasReady(canvasRef.current);
          }
          // 렌더링 루프 시작
          console.log('[CanvasOverlay] Starting render loop');
          animationFrameRef.current = requestAnimationFrame(renderLoop);
        }
      } catch (error) {
        console.error('[CanvasOverlay] Failed to initialize segmentation:', error);
        if (isMounted) {
          setModelError(`필터 로드 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
          setIsModelLoading(false);
        }
      }
    };

    initializeAndStart();

    // 클린업
    return () => {
      isMounted = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [renderLoop]);

  // 컴포넌트 언마운트 시 모델 정리
  useEffect(() => {
    return () => {
      cleanupSegmentationModel();
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover transform scale-x-[-1]"
        style={{
          display: isModelLoading || modelError ? 'none' : 'block',
        }}
      />

      {/* 로딩 인디케이터 */}
      {isModelLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4 mx-auto"></div>
            <p className="text-white">AI 모델 로딩 중...</p>
          </div>
        </div>
      )}

      {/* 에러 메시지 */}
      {modelError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80">
          <div className="text-center p-4">
            <p className="text-red-500">{modelError}</p>
          </div>
        </div>
      )}
    </div>
  );
}

