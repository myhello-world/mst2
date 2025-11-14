import React, { useState } from 'react';
import Header from './components/Header';
import LevelCard from './components/LevelCard';
import ChallengeInterface from './components/ChallengeInterface';
import ProgressBar from './components/ProgressBar';
import { challenges } from './data/challenges';
import { useProgress } from './hooks/useProgress';
import { Challenge } from './types';
import { Trophy, RotateCcw } from 'lucide-react';

function App() {
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const { progress, completeLevel, resetProgress } = useProgress();

  const handleChallengeSelect = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
  };

  const handleChallengeComplete = () => {
    if (selectedChallenge) {
      completeLevel(selectedChallenge.id);
      const nextId = selectedChallenge.id + 1;
      const next = challenges.find(c => c.id === nextId);
      if (next) {
        setSelectedChallenge(next);
      } else {
        setSelectedChallenge(null);
      }
    }
  };

  const handleBack = () => {
    setSelectedChallenge(null);
  };

  if (selectedChallenge) {
    return (
      <ChallengeInterface
        challenge={selectedChallenge}
        onBack={handleBack}
        onComplete={handleChallengeComplete}
      />
    );
  }

  const completedCount = progress.completedLevels.size;
  const allCompleted = completedCount === challenges.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Master XSS Vulnerabilities
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Learn to identify and exploit Cross-Site Scripting vulnerabilities through hands-on challenges. 
              Each level introduces new security measures that you must bypass.
            </p>
          </div>

          <ProgressBar current={completedCount} total={challenges.length} />

          {allCompleted && (
            <div className="bg-gradient-to-r from-green-400 to-green-600 text-white p-6 rounded-xl mb-8 text-center">
              <Trophy className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Congratulations! 🎉</h3>
              <p className="text-green-100 mb-4">
                You've completed all XSS challenges! Your total score: {progress.totalScore} points
              </p>
              <div className="bg-white text-gray-800 rounded-xl p-6 max-w-md mx-auto">
                <p className="font-semibold mb-3">🎊 Great job! Celebrate your win 🎊</p>
                <p className="text-sm text-gray-600 mb-4">Follow me on Instagram for more challenges and updates:</p>
                <img
                  src="/images/instagram.png"
                  alt="Instagram QR Code"
                  className="w-56 h-56 object-contain mx-auto rounded-lg shadow-md"
                />
                <p className="text-xs text-gray-500 mt-3">Scan the QR code to follow.</p>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {challenges.map((challenge) => {
              const isLocked = challenge.id > progress.currentLevel;
              const isCompleted = progress.completedLevels.has(challenge.id);
              
              return (
                <LevelCard
                  key={challenge.id}
                  challenge={{ ...challenge, completed: isCompleted }}
                  isLocked={isLocked}
                  onClick={() => handleChallengeSelect(challenge)}
                />
              );
            })}
          </div>

          <div className="text-center">
            <button
              onClick={resetProgress}
              className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset Progress
            </button>
          </div>

          <div className="mt-12 bg-amber-50 border border-amber-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-amber-800 mb-3">⚠️ Educational Purpose Disclaimer</h3>
            <p className="text-amber-700 text-sm">
              This XSS Challenge Lab is designed purely for educational purposes to help security professionals 
              and developers understand Cross-Site Scripting vulnerabilities. The techniques demonstrated here 
              should only be used in controlled environments and with proper authorization. Misuse of these 
              techniques for malicious purposes is illegal and unethical.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;