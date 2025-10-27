import React from 'react';
import type { Activity } from '../types';

interface ActivitiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectActivity: (activity: Activity) => void;
  activities: Activity[];
  playerMoney: number;
}

const ActivitiesModal: React.FC<ActivitiesModalProps> = ({ isOpen, onClose, onSelectActivity, activities, playerMoney }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full border border-gray-700">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-blue-400 mb-4">Personal Activities</h2>
          <p className="text-gray-400 mb-6">Take a week off to recharge. This will advance time by one week, but you won't earn a salary.</p>
          <div className="space-y-4">
            {activities.map(activity => {
              const canAfford = playerMoney >= activity.cost;
              return (
                <div key={activity.id} className={`p-4 rounded-lg flex justify-between items-center ${canAfford ? 'bg-gray-700' : 'bg-gray-700/50 text-gray-500'}`}>
                  <div>
                    <h3 className={`text-lg font-bold ${canAfford ? 'text-white' : ''}`}>{activity.name}</h3>
                    <p className="text-sm">{activity.description}</p>
                    <p className="text-sm font-mono mt-1">
                      <span className="text-green-400">+{activity.effects.energy} Energy</span>, <span className="text-yellow-400">+{activity.effects.happiness} Happiness</span>
                    </p>
                  </div>
                  <button
                    onClick={() => onSelectActivity(activity)}
                    disabled={!canAfford}
                    className="px-4 py-2 font-bold rounded transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed bg-teal-600 hover:bg-teal-700 text-white"
                  >
                    Do it (${activity.cost})
                  </button>
                </div>
              );
            })}
          </div>
          <button onClick={onClose} className="mt-6 w-full px-4 py-2 bg-gray-600 text-white font-bold rounded hover:bg-gray-700">
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivitiesModal;