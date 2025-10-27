import React from 'react';
import type { Hobby } from '../types';

interface HobbiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectHobby: (hobby: Hobby | null) => void;
  hobbies: Hobby[];
  currentHobby: Hobby | null;
}

const HobbiesModal: React.FC<HobbiesModalProps> = ({ isOpen, onClose, onSelectHobby, hobbies, currentHobby }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full border border-gray-700">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-blue-400 mb-4">Manage Hobby</h2>
          <p className="text-gray-400 mb-6">Choose a hobby to pursue in your free time. Hobbies consume a small amount of energy and money each week but offer a chance to permanently increase your Luck.</p>
          <div className="space-y-4">
            {hobbies.map(hobby => {
              const isSelected = currentHobby?.id === hobby.id;
              return (
                <div key={hobby.id} className={`p-4 rounded-lg flex justify-between items-center transition-colors ${isSelected ? 'bg-blue-800 border border-blue-500' : 'bg-gray-700'}`}>
                  <div>
                    <h3 className="text-lg font-bold text-white">{hobby.name}</h3>
                    <p className="text-sm">{hobby.description}</p>
                    <p className="text-sm font-mono mt-1">
                      <span className="text-red-400">-${hobby.costPerWeek} Money/wk</span>, <span className="text-yellow-400">-${hobby.energyPerWeek} Energy/wk</span>
                      , <span className="text-green-400">{hobby.luckGainChance * 100}% chance for +1 Luck</span>
                    </p>
                  </div>
                  <button
                    onClick={() => onSelectHobby(hobby)}
                    disabled={isSelected}
                    className="px-4 py-2 font-bold rounded transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isSelected ? 'Selected' : 'Select'}
                  </button>
                </div>
              );
            })}
             <div className={`p-4 rounded-lg flex justify-between items-center transition-colors ${!currentHobby ? 'bg-blue-800 border border-blue-500' : 'bg-gray-700'}`}>
                <div>
                    <h3 className="text-lg font-bold text-white">No Hobby</h3>
                    <p className="text-sm">Focus entirely on your career. No extra costs or benefits.</p>
                </div>
                 <button
                    onClick={() => onSelectHobby(null)}
                    disabled={!currentHobby}
                    className="px-4 py-2 font-bold rounded transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {!currentHobby ? 'Selected' : 'Select'}
                  </button>
             </div>
          </div>
          <button onClick={onClose} className="mt-6 w-full px-4 py-2 bg-gray-600 text-white font-bold rounded hover:bg-gray-700">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default HobbiesModal;
