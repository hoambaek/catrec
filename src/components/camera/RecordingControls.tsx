'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { VideoRecorder, downloadVideo, formatRecordingTime } from '@/lib/recorder';

interface RecordingControlsProps {
  canvas: HTMLCanvasElement | null;
  onRecordingStateChange?: (isRecording: boolean) => void;
}

/**
 * 녹화 컨트롤 컴포넌트
 */
export default function RecordingControls({
  canvas,
  onRecordingStateChange,
}: RecordingControlsProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showSavedMessage, setShowSavedMessage] = useState(false);
  
  const recorderRef = useRef<VideoRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 녹화 시작/중지
  const toggleRecording = useCallback(async () => {
    if (!canvas) {
      alert('카메라가 준비되지 않았습니다.');
      return;
    }

    try {
      if (!isRecording) {
        // 녹화 시작
        if (!recorderRef.current) {
          recorderRef.current = new VideoRecorder();
          await recorderRef.current.initialize(canvas);
        }

        recorderRef.current.start();
        setIsRecording(true);
        setRecordingTime(0);

        // 타이머 시작
        timerRef.current = setInterval(() => {
          setRecordingTime((prev) => prev + 1);
        }, 1000);

        if (onRecordingStateChange) {
          onRecordingStateChange(true);
        }
      } else {
        // 녹화 중지
        if (!recorderRef.current) return;

        const blob = await recorderRef.current.stop();
        setIsRecording(false);

        // 타이머 중지
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }

        // 파일 다운로드
        downloadVideo(blob);

        // 저장 완료 메시지 표시
        setShowSavedMessage(true);
        setTimeout(() => {
          setShowSavedMessage(false);
        }, 3000);

        if (onRecordingStateChange) {
          onRecordingStateChange(false);
        }
      }
    } catch (error) {
      console.error('Recording error:', error);
      alert('녹화 중 오류가 발생했습니다.');
      
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [canvas, isRecording, onRecordingStateChange]);

  // 클린업
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (recorderRef.current) {
        recorderRef.current.cleanup();
      }
    };
  }, []);

  return (
    <div className="relative">
      {/* 녹화 버튼 */}
      <div className="flex justify-center items-center pb-8">
        <button
          onClick={toggleRecording}
          className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
            isRecording
              ? 'bg-red-500/30 backdrop-blur-sm animate-pulse'
              : 'bg-white/20 backdrop-blur-sm active:scale-95'
          }`}
          aria-label={isRecording ? '녹화 중지' : '녹화 시작'}
        >
          {isRecording ? (
            <div className="w-8 h-8 bg-red-500 rounded-sm" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-red-500 transition-all" />
          )}
        </button>
      </div>

      {/* 녹화 타이머 */}
      {isRecording && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-16 bg-red-500 text-white px-4 py-2 rounded-full flex items-center gap-2 animate-fade-in">
          <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
          <span className="font-mono font-bold">
            {formatRecordingTime(recordingTime)}
          </span>
        </div>
      )}

      {/* 저장 완료 토스트 */}
      {showSavedMessage && (
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in">
          ✓ 비디오가 저장되었습니다
        </div>
      )}
    </div>
  );
}

