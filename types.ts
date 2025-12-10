export type CourseLevel = 'basic' | 'advanced' | 'expert';

export interface TreeNode {
  id: number;
  value: number;
  lazy: number; // Add lazy tag storage
  left: number; // range start index (inclusive)
  right: number; // range end index (inclusive)
  x: number;
  y: number;
  depth: number;
}

export type OperationType = 'IDLE' | 'BUILD' | 'UPDATE' | 'QUERY';

export interface LogStep {
  nodeId: number;
  message: string;
  highlight: 'visiting' | 'found' | 'updating' | 'partial' | 'pushdown';
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // index
  explanation: string;
}
