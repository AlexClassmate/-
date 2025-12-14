

export type CourseLevel = 'basic' | 'advanced' | 'expert';

export type Category = 
  | 'seg_module' | 'trie_module' | 'hash_module' | 'uf_module' 
  | 'dp_linear_module' | 'dp_knapsack_module' | 'dp_interval_module' | 'dp_digit_module' | 'dp_tree_module'
  | 'dp_state_module' // Added State Compression DP
  | 'data_structure' | 'string' | 'graph' | 'tree' | 'algorithm' | 'bfs_module' | 'dfs_module' | 'recursion_module';

export type Theme = 'slate' | 'light' | 'black' | 'navy';

export type Topic = 
  // Data Structure Specific Applications
  | 'seg_basic' | 'seg_lazy' | 'seg_rmq' | 'seg_min'
  | 'trie_basic' | 'trie_count' | 'trie_xor'
  | 'hash_basic' | 'hash_collision' | 'hash_rolling'
  | 'uf_basic' | 'uf_path' | 'uf_enemy'
  
  // Linear DP Applications
  | 'dp_lis' | 'dp_max_subarray' | 'dp_robber' | 'dp_lcs' | 'dp_edit_dist' | 'dp_stairs' | 'dp_grid_path' | 'dp_coin'

  // Knapsack DP Applications
  | 'dp_knapsack_01' | 'dp_knapsack_complete' | 'dp_knapsack_multi' | 'dp_knapsack_mixed' 
  | 'dp_knapsack_2d' | 'dp_knapsack_group' | 'dp_knapsack_depend' | 'dp_knapsack_count'
  | 'dp_knapsack_record' | 'dp_knapsack_feasibility' | 'dp_knapsack_val' | 'dp_knapsack_init'

  // Interval DP Applications
  | 'dp_interval_merge' | 'dp_interval_matrix' | 'dp_interval_palindrome' | 'dp_interval_remove'
  | 'dp_interval_color' | 'dp_interval_split' | 'dp_interval_count' | 'dp_interval_complex'
  | 'dp_interval_circle' | 'dp_interval_opt' | 'dp_interval_sol'

  // Digit DP Applications
  | 'dp_digit_count' | 'dp_digit_constraint' | 'dp_digit_sum' | 'dp_digit_div' 
  | 'dp_digit_base' | 'dp_digit_prod' | 'dp_digit_palindrome' | 'dp_digit_kth'
  | 'dp_digit_minmax' | 'dp_digit_complex'

  // Tree DP Applications
  | 'dp_tree_independent' | 'dp_tree_vertex_cover' | 'dp_tree_dominating' 
  | 'dp_tree_diameter' | 'dp_tree_centroid' | 'dp_tree_knapsack' 
  | 'dp_tree_reroot' | 'dp_tree_coloring' | 'dp_tree_path' 
  | 'dp_tree_cycle' | 'dp_tree_virtual' | 'dp_tree_matching'
  | 'dp_tree_components' | 'dp_tree_game' | 'dp_tree_sol'

  // State Compression DP (New)
  | 'dp_state_chess' | 'dp_state_tsp' | 'dp_state_cover' | 'dp_state_perm' 
  | 'dp_state_resource' | 'dp_state_plug' | 'dp_state_subset' 
  | 'dp_state_graph' | 'dp_state_bit' | 'dp_state_stage'

  // Legacy Data Structure
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
  // Recursion Module
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
  label?: string; // For edge labels (e.g. chosen digit)
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

  // Custom payload for DP
  dpState?: {
      dp1D?: (number|string)[];
      dp2D?: (number|string)[][];
      activeIndices?: number[]; // [i] for 1D, [i, j] for 2D
      compareIndices?: number[]; // indices being compared against
  };

  // Update specific tree node values during animation
  treeUpdates?: { id: number, value: number | string }[];
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
  quizData?: QuizQuestion[]; // CHANGED: Now supports multiple questions
  codeProblem?: {
    template: string;
    blanks: { id: number; question: string; options: { label: string; value: string; isCorrect: boolean }[]; }[];
  };
}
