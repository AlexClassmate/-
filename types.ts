

export type CourseLevel = 'basic' | 'advanced' | 'expert';

export type Category = 'data_structure' | 'string' | 'graph' | 'tree' | 'algorithm' | 'bfs_module';

export type Theme = 'slate' | 'light' | 'black' | 'navy';

export type Topic = 
  // Data Structure
  | 'segment_tree' | 'trie' | 'hash' | 'union_find' | 'balanced_tree'
  // String
  | 'ac_automaton' | 'kmp' | 'manacher'
  // Graph
  | 'mst' | 'shortest_path' | 'tarjan' | 'diff_constraints'
  // Tree
  | 'tree_diameter' | 'tree_centroid' | 'tree_center' | 'tree_dp' | 'tree_knapsack'
  // Algorithm
  | 'sweep_line'
  // BFS Module
  | 'bfs_basic' | 'bfs_shortest' | 'bfs_state' | 'bfs_flood' | 'bfs_topo' | 'bfs_bipartite' | 'bfs_multi';

// Generic tree node (Segment Tree / Trie / UF Tree / AC Automaton / Treap)
export interface TreeNode {
  id: number;
  value: number | string; // Changed to support characters for Trie
  lazy?: number;
  left?: number; // ID of left child
  right?: number; // ID of right child
  x: number;
  y: number;
  depth: number;
  children?: number[]; // For Trie or UF
  parentId?: number;   // For UF
  isEnd?: boolean;     // For Trie end of word
  count?: number;      // For Trie prefix count
  failId?: number;     // For AC Automaton Fail Pointer
  priority?: number;   // For Treap
}

// Generic Graph Node/Edge for MST, Shortest Path, etc.
export interface GraphNode {
  id: number;
  x: number;
  y: number;
  label?: string;
  group?: number; // For Bipartite (0 or 1)
  inDegree?: number; // For Topo Sort
}

export interface GraphEdge {
  u: number;
  v: number;
  weight: number;
  active?: boolean; // For visualization highlighting
  directed?: boolean;
}

// Grid Cell for Flood Fill
export interface GridCell {
  row: number;
  col: number;
  type: 'land' | 'water' | 'obstacle';
  visited?: boolean;
  distance?: number;
  group?: number;
}

// Hash Table Item
export interface HashItem {
  id: number; // key
  val: string | number;
  next?: HashItem; // For chaining visual
}

export type OperationType = 'IDLE' | 'BUILD' | 'UPDATE' | 'QUERY';

export interface LogStep {
  nodeId: number | string; // Support string IDs for hash keys
  message: string;
  highlight: 'visiting' | 'found' | 'updating' | 'partial' | 'pushdown' | 'normal' | 'fail' | 'match' | 'mismatch' | 'mirror'; // Added mirror for Manacher
  queue?: (number | string)[]; // NEW: Snapshot of the queue state
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // index
  explanation: string;
}

// Lecture Mode Types
export type StepType = 'theory' | 'experiment' | 'conclusion' | 'code' | 'quiz';

export interface LectureStep {
  id: number;
  type: StepType;
  title: string;
  content: string; // Markdown supported
  experimentConfig?: {
    initialData?: string[]; // For Treap: "val,pri" strings or just vals
    allowedActions?: string[]; 
    hint?: string;
  };
  quizData?: QuizQuestion;
  codeProblem?: {
    template: string;
    blanks: { id: number; question: string; options: { label: string; value: string; isCorrect: boolean }[]; }[];
  };
}
