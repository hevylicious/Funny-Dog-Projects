import React from 'react';

interface LoadGamePromptProps {
  onContinue: () => void;
  onNewGame: () => void;
}

const LoadGamePrompt: React.FC<LoadGamePromptProps> = ({ onContinue, onNewGame }) => {
  return (
    <div className="fixed inset-0 bg-gray-900 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg shadow-2xl max-w-md w-full border border-gray-700 p-8 text-center animate-fade-in">
        <h1 className="text-3xl font-bold text-blue-400 mb-4">Welcome Back!</h1>
        <p className="text-gray-300 mb-8">An existing game was found. Would you like to continue where you left off?</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={onContinue}
            className="flex-1 w-full px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors"
          >
            Continue Game
          </button>
          <button
            onClick={onNewGame}
            className="flex-1 w-full px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors"
          >
            Start New Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoadGamePrompt;
