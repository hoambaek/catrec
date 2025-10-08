'use client';

import { useEffect, useRef, forwardRef } from 'react';

interface VideoStreamProps {
  stream: MediaStream | null;
  className?: string;
  onVideoReady?: (video: HTMLVideoElement) => void;
}

/**
 * 카메라 비디오 스트림을 표시하는 컴포넌트
 */
const VideoStream = forwardRef<HTMLVideoElement, VideoStreamProps>(
  ({ stream, className = '', onVideoReady }, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
      const video = videoRef.current;
      if (!video || !stream) return;

      // 비디오 엘리먼트에 스트림 연결
      video.srcObject = stream;

      // 비디오 메타데이터 로드 시
      const handleLoadedMetadata = () => {
        video.play().catch((error) => {
          console.error('비디오 재생 오류:', error);
        });

        if (onVideoReady) {
          onVideoReady(video);
        }
      };

      video.addEventListener('loadedmetadata', handleLoadedMetadata);

      return () => {
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        if (video.srcObject) {
          video.srcObject = null;
        }
      };
    }, [stream, onVideoReady]);

    // ref 병합
    useEffect(() => {
      if (typeof ref === 'function') {
        ref(videoRef.current);
      } else if (ref) {
        ref.current = videoRef.current;
      }
    }, [ref]);

    return (
      <video
        ref={videoRef}
        className={`transform scale-x-[-1] ${className}`}
        playsInline
        muted
        autoPlay
        style={{
          objectFit: 'cover',
        }}
      />
    );
  }
);

VideoStream.displayName = 'VideoStream';

export default VideoStream;

