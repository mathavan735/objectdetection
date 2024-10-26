import React from 'react';
import { Bell } from 'lucide-react';

interface DetectionAlertsProps {
  alerts: string[];
}

const DetectionAlerts: React.FC<DetectionAlertsProps> = ({ alerts }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-xl mb-6">
      <div className="flex items-center gap-3 mb-4">
        <Bell className="w-6 h-6 text-yellow-400" />
        <h2 className="text-2xl font-bold">Recent Alerts</h2>
      </div>
      <div className="space-y-2">
        {alerts.length > 0 ? (
          alerts.map((alert, index) => (
            <div
              key={index}
              className="bg-gray-700/50 p-3 rounded-lg text-sm"
            >
              {alert}
            </div>
          ))
        ) : (
          <p className="text-gray-400 italic">No alerts yet</p>
        )}
      </div>
    </div>
  );
};

export default DetectionAlerts;