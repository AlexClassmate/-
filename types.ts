export interface TreeNode {
  id: number;
  value: number;
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
  highlight: 'visiting' | 'found' | 'updating' | 'partial';
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // index
  explanation: string;
}
