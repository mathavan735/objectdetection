import React from 'react';
import Webcam from 'react-webcam';

interface WebcamStreamProps {
  webcamRef: React.RefObject<Webcam>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  onVideoLoad: () => void;
}

const WebcamStream: React.FC<WebcamStreamProps> = ({ webcamRef, canvasRef, onVideoLoad }) => {
  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "environment"
  };

  return (
    <div className="relative">
      <Webcam
        ref={webcamRef}
        muted={true}
        className="rounded-lg"
        videoConstraints={videoConstraints}
        onLoadedData={onVideoLoad}
      />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 rounded-lg"
      />
    </div>
  );
};

export default WebcamStream;