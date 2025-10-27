import React from 'react';
import type { Education, GameState } from '../types';

interface EducationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEnroll: (education: Education) => void;
  educationOptions: Education[];
  playerMoney: number;
  playerSkills: GameState['skills'];
}

const EducationModal: React.FC<EducationModalProps> = ({ isOpen, onClose, onEnroll, educationOptions, playerMoney, playerSkills }) => {
  if (!isOpen) return null;

  const checkRequirements = (requirements: Education['requirements']) => {
    if (!requirements) return true;
    return Object.entries(requirements).every(([skillKey, requiredLevel]) => {
      return playerSkills[skillKey as keyof GameState['skills']].level >= requiredLevel;
    });
  };

  const getRequirementText = (requirements: Education['requirements']) => {
    if (!requirements) return null;
    return 'Req: ' + Object.entries(requirements)
      .map(([skillKey, requiredLevel]) => {
        const skillName = playerSkills[skillKey as keyof GameState['skills']].name;
        const currentLevel = playerSkills[skillKey as keyof GameState['skills']].level;
        const hasReq = currentLevel >= requiredLevel;
        return `<span class="${hasReq ? 'text-green-400' : 'text-red-400'}">${skillName} Lvl ${requiredLevel}</span>`;
      })
      .join(', ');
  };

  const getTypeStyles = (type: Education['type']) => {
    switch (type) {
      case 'course': return 'border-blue-500';
      case 'training': return 'border-yellow-500';
      case 'certification': return 'border-purple-500';
      default: return 'border-gray-600';
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg shadow-2xl max-w-3xl w-full border border-gray-700">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-blue-400 mb-4">Education & Training</h2>
          <p className="text-gray-400 mb-6">Invest in yourself. Enrolling will advance time and consume money, but you'll gain valuable skills and credentials. You won't earn a salary while studying.</p>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {educationOptions.map(edu => {
              const canAfford = playerMoney >= edu.cost;
              const meetsReqs = checkRequirements(edu.requirements);
              const isEnrollable = canAfford && meetsReqs;
              const reqText = getRequirementText(edu.requirements);

              return (
                <div key={edu.id} className={`p-4 rounded-lg border-l-4 ${getTypeStyles(edu.type)} ${isEnrollable ? 'bg-gray-700' : 'bg-gray-700/50 text-gray-500'}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className={`text-lg font-bold ${isEnrollable ? 'text-white' : ''}`}>{edu.name} <span className="text-sm font-light capitalize text-gray-400">({edu.type})</span></h3>
                      <p className="text-sm mt-1">{edu.description}</p>
                      <div className="text-sm font-mono mt-2 space-x-4">
                        <span className="text-green-400">+{edu.rewards.xp} XP ({playerSkills[edu.skill].name})</span>
                        {edu.rewards.personalBrand && <span className="text-yellow-400">+{edu.rewards.personalBrand} Brand</span>}
                        {edu.rewards.awardTrait && <span className="text-purple-400">Awards Trait!</span>}
                      </div>
                       {reqText && <p className="text-xs mt-2" dangerouslySetInnerHTML={{ __html: reqText }} />}
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                        <p className={`font-mono font-bold ${canAfford ? 'text-green-300' : 'text-red-400'}`}>${edu.cost}</p>
                        <p className="text-sm text-gray-400">{edu.durationWeeks} week{edu.durationWeeks > 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onEnroll(edu)}
                    disabled={!isEnrollable}
                    className="w-full mt-3 px-4 py-2 font-bold rounded transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Enroll
                  </button>
                </div>
              );
            })}
          </div>
          <button onClick={onClose} className="mt-6 w-full px-4 py-2 bg-gray-600 text-white font-bold rounded hover:bg-gray-700">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EducationModal;
