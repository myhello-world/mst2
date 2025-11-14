import React from 'react';
import { Lock, CheckCircle, AlertTriangle } from 'lucide-react';
import { Challenge } from '../types';

interface LevelCardProps {
  challenge: Challenge;
  isLocked: boolean;
  onClick: () => void;
}

export default function LevelCard({ challenge, isLocked, onClick }: LevelCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'hard': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getDifficultyBg = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100';
      case 'medium': return 'bg-yellow-100';
      case 'hard': return 'bg-red-100';
      default: return 'bg-gray-100';
    }
  };

  return (
    <div
      onClick={isLocked ? undefined : onClick}
      className={`relative p-6 rounded-xl border-2 transition-all duration-200 ${
        isLocked
          ? 'border-gray-300 bg-gray-50 cursor-not-allowed opacity-60'
          : challenge.completed
          ? 'border-green-400 bg-green-50 cursor-pointer hover:shadow-lg hover:scale-105'
          : 'border-gray-300 bg-white cursor-pointer hover:shadow-lg hover:scale-105 hover:border-red-400'
      }`}
    >
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-90 rounded-xl">
          <Lock className="h-8 w-8 text-gray-400" />
        </div>
      )}
      
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-xl font-bold text-gray-800">Level {challenge.id}</h3>
        <div className="flex items-center space-x-2">
          {challenge.completed && (
            <CheckCircle className="h-6 w-6 text-green-500" />
          )}
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getDifficultyBg(challenge.difficulty)} ${getDifficultyColor(challenge.difficulty)}`}>
            {challenge.difficulty.toUpperCase()}
          </span>
        </div>
      </div>
      
      <h4 className="font-semibold text-gray-700 mb-2">{challenge.title}</h4>
      <p className="text-gray-600 text-sm leading-relaxed">{challenge.description}</p>
      
      <div className="mt-4 flex items-center text-amber-600">
        <AlertTriangle className="h-4 w-4 mr-1" />
        <span className="text-xs font-medium">Educational purposes only</span>
      </div>
    </div>
  );
}