
import React from 'react';

interface StatDisplayProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  className?: string;
}

const StatDisplay: React.FC<StatDisplayProps> = ({ icon, label, value, className }) => {
  return (
    <div className={`flex items-center p-3 bg-gray-800/50 rounded-lg ${className}`}>
      <div className="mr-3 text-blue-400">{icon}</div>
      <div>
        <div className="text-sm text-gray-400">{label}</div>
        <div className="text-lg font-bold font-mono">{value}</div>
      </div>
    </div>
  );
};

export default StatDisplay;
