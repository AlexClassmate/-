
export type CourseLevel = 'basic' | 'advanced' | 'expert';

export type Category = 'data_structure' | 'string' | 'graph' | 'tree' | 'algorithm' | 'bfs_module' | 'dfs_module' | 'recursion_module';

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
  | 'bfs_basic' | 'bfs_shortest' | 'bfs_state' | 'bfs_flood' | 'bfs_topo' | 'bfs_bipartite' | 'bfs_multi'
  // DFS Module
  | 'dfs_basic' | 'dfs_connect' | 'dfs_perm' | 'dfs_maze' | 'dfs_nqueens' | 'dfs_bag' | 'dfs_graph_algo' | 'dfs_pruning'
  // Recursion Module (UPDATED)
  | 'recursion_fib' | 'recursion_hanoi' | 'recursion_fractal' | 'recursion_perm' | 'recursion_subset'
  | 'recursion_gcd' | 'recursion_reverse_list' | 'recursion_factorial' | 'recursion_string_rev';

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
  type: 'land' | 'water' | 'obstacle' | 'path' | 'start' | 'end'; // Added path/start/end
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
  highlight: 'visiting' | 'found' | 'updating' | 'partial' | 'pushdown' | 'normal' | 'fail' | 'match' | 'mismatch' | 'mirror' | 'backtrack'; // Added backtrack
  queue?: (number | string)[]; // Snapshot of the queue state
  stack?: (number | string)[]; // Snapshot of the stack state (for DFS)
  
  // Custom payloads for recursion
  hanoiMove?: { disk: number, from: number, to: number };
  fractalLine?: { x1: number, y1: number, x2: number, y2: number, depth: number };
  
  // Custom payloads for Permutations/Subsets
  permState?: { currentPath: (number|null)[], used: boolean[] };
  subsetState?: { index: number, currentPath: number[], status: 'considering' | 'included' | 'excluded' | 'result' };
  
  // Custom payloads for new recursion topics
  gcdState?: { a: number, b: number, formula: string };
  listState?: { nodes: number[], currentIndex: number, output: number[] }; // Nodes are values
  factState?: { n: number, equation: string };
  stringState?: { chars: string[], left: number, right: number, swapped: boolean };
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // index
  explanation: string;
}

// Lecture Mode Types
export type StepType = 'theory' | 'experiment' | 'conclusion' | 'code' | 'quiz' | 'full_code';

export interface LectureStep {
  id: number;
  type: StepType;
  title: string;
  content: string; // Markdown supported
  codeSnippet?: string; // For full_code type
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
