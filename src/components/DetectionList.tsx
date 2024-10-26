import React from 'react';
import { List } from 'lucide-react';
import { Detection } from '../types/detection';

interface DetectionListProps {
  detections: Detection[];
}

const DetectionList: React.FC<DetectionListProps> = ({ detections }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-xl">
      <div className="flex items-center gap-3 mb-4">
        <List className="w-6 h-6 text-green-400" />
        <h2 className="text-2xl font-bold">Current Detections</h2>
      </div>
      <div className="space-y-2">
        {detections.length > 0 ? (
          detections.map((detection, index) => (
            <div
              key={index}
              className="bg-gray-700/50 p-3 rounded-lg flex justify-between items-center"
            >
              <span className="capitalize">{detection.class}</span>
              <span className="text-sm bg-gray-600 px-2 py-1 rounded">
                {Math.round(detection.score * 100)}%
              </span>
            </div>
          ))
        ) : (
          <p className="text-gray-400 italic">No objects detected</p>
        )}
      </div>
    </div>
  );
};

export default DetectionList;