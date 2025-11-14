export interface Challenge {
  id: number;
  title: string;
  description: string;
  hint: string;
  completed: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface UserProgress {
  currentLevel: number;
  completedLevels: Set<number>;
  totalScore: number;
}