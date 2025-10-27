import React from 'react';
import type { Perk } from '../types';

interface PerkSelectionScreenProps {
  onSelectPerk: (perk: Perk) => void;
}

const perksData = [
  {
    id: 'happy',
    name: 'Šťastlivec (Happy Camper)',
    description: 'Your positive outlook is unshakable. Your Happiness will never drop below 90.',
    icon: '😊',
  },
  {
    id: 'rich',
    name: 'Boháč (High Roller)',
    description: 'You have a knack for finding good deals. Earn a dynamic weekly salary bonus of up to 100%.',
    icon: '💰',
  },
  {
    id: 'fortunate',
    name: 'Štístko (Fortunate)',
    description: 'You were born under a lucky star. Start with a high Luck stat, but your passive XP gain is reduced by 20%.',
    icon: '🍀',
  },
  {
    id: 'influencer',
    name: 'Cutiepie (Influencer)',
    description: 'You have a natural charisma. Your Personal Brand grows 50% faster from events.',
    icon: '⭐',
  },
  {
    id: 'testing',
    name: 'Testovací režim',
    description: 'Pro účely testování. Každý týden získáváte 4x více peněz a zkušeností a šance na událost je 4x vyšší, což urychluje postup.',
    icon: '🧪',
  },
];

const PerkSelectionScreen: React.FC<PerkSelectionScreenProps> = ({ onSelectPerk }) => {
  return (
    <div className="fixed inset-0 bg-gray-900 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg shadow-2xl max-w-4xl w-full border border-gray-700 p-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-center text-blue-400 mb-2">Choose Your Path</h1>
        <p className="text-center text-gray-400 mb-8">Select a starting perk that will define your career.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {perksData.map(perk => (
            <button
              key={perk.id}
              onClick={() => onSelectPerk(perk.id as Perk)}
              className="bg-gray-700/50 rounded-lg p-6 text-center transition-all duration-300 hover:bg-blue-600 hover:scale-105 border border-gray-600 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <div className="text-5xl mb-4">{perk.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">{perk.name}</h3>
              <p className="text-sm text-gray-300">{perk.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PerkSelectionScreen;