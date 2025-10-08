'use client';

import { useState, useCallback } from 'react';
import CameraView from '@/components/camera/CameraView';
import CanvasOverlay from '@/components/camera/CanvasOverlay';
import RecordingControls from '@/components/camera/RecordingControls';
import { FILTERS } from '@/constants/filters';

export default function Home() {
  const [selectedFilterId, setSelectedFilterId] = useState(FILTERS[0].id);
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);
  const [canvasElement, setCanvasElement] = useState<HTMLCanvasElement | null>(null);
  const [fps, setFps] = useState<number>(0);
  const [isRecording, setIsRecording] = useState(false);

  // 선택된 필터 객체 가져오기
  const selectedFilter = FILTERS.find((f) => f.id === selectedFilterId) || FILTERS[0];

  // 비디오 준비 콜백
  const handleVideoReady = useCallback((video: HTMLVideoElement) => {
    setVideoElement(video);
  }, []);

  // Canvas 준비 콜백
  const handleCanvasReady = useCallback((canvas: HTMLCanvasElement) => {
    setCanvasElement(canvas);
  }, []);

  // FPS 업데이트 콜백
  const handleFPSUpdate = useCallback((newFps: number) => {
    setFps(newFps);
  }, []);

  // 녹화 상태 변경 콜백
  const handleRecordingStateChange = useCallback((recording: boolean) => {
    setIsRecording(recording);
  }, []);

  return (
    <div className="w-full h-full flex flex-col bg-[#1a1a1a]">
      {/* 헤더 */}
      <header className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/50 to-transparent">
        <div className="flex justify-between items-center">
          <h1 className="text-white text-xl font-bold">
            Filter Camera
          </h1>
          {/* FPS 표시 */}
          {fps > 0 && (
            <div className="text-white text-sm bg-black/50 px-3 py-1 rounded-full">
              {fps} FPS
            </div>
          )}
        </div>
      </header>

      {/* 카메라 프리뷰 영역 */}
      <div className="flex-1 relative overflow-hidden">
        {/* 원본 비디오 (숨김) */}
        <div className="absolute inset-0 opacity-0 pointer-events-none">
          <CameraView onVideoReady={handleVideoReady} />
        </div>

        {/* 필터가 적용된 Canvas */}
        {videoElement && (
          <CanvasOverlay
            video={videoElement}
            filterColor={selectedFilter.color}
            onFPSUpdate={handleFPSUpdate}
            onCanvasReady={handleCanvasReady}
            className="w-full h-full"
          />
        )}

        {/* 비디오가 준비되지 않았을 때 */}
        {!videoElement && (
          <div className="flex items-center justify-center h-full bg-gray-900">
            <CameraView onVideoReady={handleVideoReady} className="w-full h-full" />
          </div>
        )}
      </div>

      {/* 컨트롤 영역 */}
      <div className="absolute bottom-0 left-0 right-0 z-10 pb-safe">
        {/* 필터 선택 버튼 (녹화 중에는 비활성화) */}
        <div className="px-4 mb-4">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {FILTERS.map((filter) => (
              <button
                key={filter.id}
                onClick={() => !isRecording && setSelectedFilterId(filter.id)}
                disabled={isRecording}
                className={`flex-shrink-0 w-14 h-14 rounded-full transition-all ${
                  selectedFilterId === filter.id
                    ? 'ring-4 ring-white ring-offset-2 ring-offset-gray-900'
                    : 'ring-2 ring-gray-600'
                } ${isRecording ? 'opacity-50 cursor-not-allowed' : ''}`}
                style={{ backgroundColor: filter.color }}
                aria-label={filter.name}
              >
                <span className="sr-only">{filter.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 녹화 컨트롤 */}
        <RecordingControls
          canvas={canvasElement}
          onRecordingStateChange={handleRecordingStateChange}
        />
      </div>
    </div>
  );
}
