import React, { useRef, useEffect, useState } from 'react';
import { Camera, X, RefreshCcw } from 'lucide-react';

interface CameraCaptureProps {
  onCapture: (imageDataUrl: string) => void;
  onCancel: () => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera access error:", err);
        setError("Unable to access camera. Please allow permissions or use upload.");
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      onCapture(dataUrl);
    }
  };

  if (error) {
    return (
      <div className="bg-rose-50 p-6 rounded-2xl flex flex-col items-center justify-center text-rose-600 border border-rose-200 h-64">
        <p className="mb-4 font-bold">{error}</p>
        <button 
          onClick={onCancel}
          className="px-4 py-2 bg-white rounded-lg shadow-sm text-sm font-bold hover:bg-rose-100"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <div className="relative bg-black rounded-2xl overflow-hidden aspect-video shadow-lg group">
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        muted
        className="w-full h-full object-cover" 
      />
      
      {/* Overlay Controls */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex flex-col justify-end pb-6 items-center">
        <button 
          onClick={handleCapture}
          className="w-16 h-16 rounded-full border-4 border-white bg-teal-500/80 hover:bg-teal-500 hover:scale-105 transition-all shadow-lg flex items-center justify-center"
          aria-label="Take Photo"
        >
          <Camera size={28} className="text-white" />
        </button>
      </div>

      <button 
        onClick={onCancel}
        className="absolute top-4 right-4 bg-black/40 text-white p-2 rounded-full backdrop-blur-md hover:bg-black/60 transition-colors"
      >
        <X size={20} />
      </button>
    </div>
  );
};