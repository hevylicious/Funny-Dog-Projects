import React from 'react';
import type { GameEvent, GameEventChoice, Perk } from '../types';

interface EventModalProps {
  event: GameEvent;
  onChoice: (choice: GameEventChoice) => void;
  playerLuck: number;
  startingPerk: Perk;
}

const CloverIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-300" viewBox="0 0 20 20" fill="currentColor"><path d="M10 3.5a1.5 1.5 0 011.06.44l.953.953a.5.5 0 00.707-.707L11.76 3.24a2.5 2.5 0 00-3.52 0L7.28 4.197a.5.5 0 00.707.707l.953-.953A1.5 1.5 0 0110 3.5zm-3.5 6a1.5 1.5 0 01.44-1.06l.953-.953a.5.5 0 00-.707-.707l-.953.953a2.5 2.5 0 000 3.52l.953.953a.5.5 0 00.707-.707l-.953-.953A1.5 1.5 0 016.5 9.5zm7 0a1.5 1.5 0 01-1.06 1.06l-.953.953a.5.5 0 00.707.707l.953-.953a2.5 2.5 0 000-3.52l-.953-.953a.5.5 0 00-.707-.707l.953.953c.293.293.44.684.44 1.06zm-3.5 3.5a1.5 1.5 0 01-1.06.44l-.953-.953a.5.5 0 00-.707.707l.953.953a2.5 2.5 0 003.52 0l.953-.953a.5.5 0 00-.707-.707l-.953.953a1.5 1.5 0 01-1.06-.44z" /></svg>;

const EventModal: React.FC<EventModalProps> = ({ event, onChoice, playerLuck, startingPerk }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full border border-gray-700 animate-fade-in">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-blue-400 mb-2">{event.title}</h2>
          <p className="text-gray-300 mb-6 whitespace-pre-wrap">{event.description}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {event.choices
              .filter(choice => !choice.luckThreshold || playerLuck >= choice.luckThreshold || startingPerk === 'testing')
              .map((choice, index) => {
                const isLuckyChoice = !!choice.luckThreshold;
                return (
                  <button
                    key={index}
                    onClick={() => onChoice(choice)}
                    className={`w-full text-left p-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-75 flex items-center
                      ${isLuckyChoice 
                        ? 'bg-yellow-800/50 hover:bg-yellow-700 border border-yellow-600 focus:ring-yellow-500' 
                        : 'bg-gray-700 hover:bg-blue-600 focus:ring-blue-500'}`
                    }
                  >
                    {isLuckyChoice && <CloverIcon />}
                    <p className="font-semibold">{choice.text}</p>
                  </button>
                )
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventModal;