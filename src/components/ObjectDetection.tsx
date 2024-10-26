import React, { useRef, useState, useEffect, useCallback } from 'react';
import Webcam from 'react-webcam';
import * as cocossd from '@tensorflow-models/coco-ssd';
import { AlertCircle } from 'lucide-react';
import { loadDetectionModel, drawDetections } from '../utils/detectionUtils';
import WebcamStream from './WebcamStream';
import DetectionAlerts from './DetectionAlerts';
import DetectionList from './DetectionList';
import { Detection } from '../types/detection';

const ObjectDetection: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [model, setModel] = useState<cocossd.ObjectDetection | null>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [alerts, setAlerts] = useState<string[]>([]);
  const requestRef = useRef<number>();

  useEffect(() => {
    const initModel = async () => {
      try {
        const loadedModel = await loadDetectionModel();
        setModel(loadedModel);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load detection model. Please refresh the page.');
        setIsLoading(false);
        console.error('Model loading error:', err);
      }
    };

    initModel();

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  const detect = useCallback(async () => {
    if (!model || !webcamRef.current || !canvasRef.current) return;

    const video = webcamRef.current.video;
    if (!video || !video.readyState === 4) return;

    try {
      const predictions = await model.detect(video);
      
      const newDetections = predictions.map(pred => ({
        class: pred.class,
        score: pred.score,
        bbox: pred.bbox as [number, number, number, number]
      }));

      setDetections(newDetections);
      drawDetections(predictions, canvasRef.current, video);

      // Check for specific objects and create alerts
      predictions.forEach(pred => {
        if (pred.score > 0.7) {
          const alert = `${pred.class} detected with ${Math.round(pred.score * 100)}% confidence`;
          setAlerts(prev => [alert, ...prev].slice(0, 5));
        }
      });

      requestRef.current = requestAnimationFrame(detect);
    } catch (err) {
      console.error('Detection error:', err);
      setError('An error occurred during object detection.');
    }
  }, [model]);

  const handleVideoLoad = useCallback(() => {
    if (!error) {
      requestRef.current = requestAnimationFrame(detect);
    }
  }, [detect, error]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-red-500/10 text-red-500 p-6 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-6 h-6" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-xl">Loading detection model...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 text-white">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Real-time Object Detection
      </h1>
      
      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <WebcamStream
            webcamRef={webcamRef}
            canvasRef={canvasRef}
            onVideoLoad={handleVideoLoad}
          />
        </div>
        
        <div className="space-y-6">
          <DetectionAlerts alerts={alerts} />
          <DetectionList detections={detections} />
        </div>
      </div>
    </div>
  );
};

export default ObjectDetection;