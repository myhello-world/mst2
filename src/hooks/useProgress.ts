import { useState, useEffect } from 'react';
import { UserProgress } from '../types';

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('xss-lab-progress');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        completedLevels: new Set(parsed.completedLevels)
      };
    }
    return {
      currentLevel: 1,
      completedLevels: new Set(),
      totalScore: 0
    };
  });

  useEffect(() => {
    localStorage.setItem('xss-lab-progress', JSON.stringify({
      ...progress,
      completedLevels: Array.from(progress.completedLevels)
    }));
  }, [progress]);

  const completeLevel = (levelId: number) => {
    setProgress(prev => ({
      ...prev,
      completedLevels: new Set([...prev.completedLevels, levelId]),
      currentLevel: Math.max(prev.currentLevel, levelId + 1),
      totalScore: prev.totalScore + (prev.completedLevels.has(levelId) ? 0 : 100)
    }));
  };

  const resetProgress = () => {
    setProgress({
      currentLevel: 1,
      completedLevels: new Set(),
      totalScore: 0
    });
  };

  return {
    progress,
    completeLevel,
    resetProgress
  };
}