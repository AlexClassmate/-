
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Plus, GitBranch, Zap, MoveHorizontal, Search, RefreshCw, Layers, Crown, Info, Flag, XCircle } from 'lucide-react';
import { TreeNode, LogStep, CourseLevel, Topic, HashItem, GraphNode, GraphEdge, GridCell, Theme } from '../types';
import { generateTreeLayout, simulateQuery, simulatePointUpdate, simulateRangeUpdate, simulateBuild } from '../utils/treeUtils';
import { generateTrieLayout, generateHashState, generateUFNodes, generateACLayout, generateTreapLayout, generateDemoTree, generateBFSGrid, generateDAG, generateBipartiteGraph, generateNQueensBoard, generateCycleGraph, generateFibCallTree, generateSimpleList } from '../utils/visualizerHelpers';

const DEFAULT_ARRAY = [1, 3, 5, 7, 9, 11, 13, 15];

// ... (Theme constants remain same)
const VIS_THEME = {
  slate: {
    nodeFill: '#1e293b',
    nodeStroke: '#94a3b8',
    text: '#ffffff',
    textMuted: '#64748b',
    edge: '#475569',
    bgPanel: '#1e293b',
    gridLand: '#e2e8f0',
    gridObstacle: '#1f2937'
  },
  light: {
    nodeFill: '#ffffff',
    nodeStroke: '#94a3b8',
    text: '#111827', 
    textMuted: '#6b7280',
    edge: '#cbd5e1', 
    bgPanel: '#ffffff',
    gridLand: '#f1f5f9', 
    gridObstacle: '#334155'
  },
  black: {
    nodeFill: '#121212',
    nodeStroke: '#555',
    text: '#e5e5e5',
    textMuted: '#a3a3a3',
    edge: '#404040',
    bgPanel: '#121212',
    gridLand: '#262626',
    gridObstacle: '#000000'
  },
  navy: {
    nodeFill: '#173a5e',
    nodeStroke: '#3e5060',
    text: '#f0f4f8',
    textMuted: '#8b9bb4',
    edge: '#234a6f',
    bgPanel: '#0a1929',
    gridLand: '#102a43',
    gridObstacle: '#001e3c'
  }
};

const TOPIC_INFO: Record<string, { title: string; desc: string }> = {
    'dp_lis': { title: '最长递增子序列', desc: '演示如何通过一维 DP 数组记录以当前元素结尾的最长序列长度。' },
    'dp_max_subarray': { title: '最大子数组和', desc: '演示 Kadane 算法：如何动态决定是累加前缀还是重新开始。' },
    'dp_lcs': { title: '最长公共子序列', desc: '演示二维 DP 表的填充过程及回溯寻找具体序列的逻辑。' },
    'dp_knapsack_01': { title: '0/1 背包问题', desc: '有限容量下选择物品，每个物品仅能选一次。' },
    'dp_knapsack_complete': { title: '完全背包', desc: '物品无限供应，正序遍历容量。' },
    'dp_interval_merge': { title: '石子合并', desc: '区间 DP：按区间长度从小到大枚举，合并相邻子区间。' },
    'dp_digit_count': { title: '数字统计 (Digit DP)', desc: '演示数位 DP 的 DFS 递归树，包含 limit 和 lead 状态。' },
    'seg_basic': { title: '线段树基础', desc: '演示区间求和的 O(log N) 查询与单点修改过程。' },
    'seg_lazy': { title: '懒惰标记', desc: '演示区间修改时，如何利用 Lazy Tag 延迟更新以保证效率。' },
    'trie_basic': { title: '字典树', desc: '演示单词的字符如何逐个插入树中并共享前缀。' },
    'union_find': { title: '并查集', desc: '演示集合合并与代表元查找的过程。' },
    'dp_state_tsp': { title: '旅行商问题 (TSP)', desc: '状态压缩 DP 解决 TSP 问题，使用位掩码表示访问过的城市集合。' },
};

interface Props {
  level: CourseLevel;
  topic?: Topic;
  externalData?: string[];
  lectureModeAction?: string | null;
  onAnimationComplete?: () => void;
  theme?: Theme;
}

const getTopicType = (t: string | undefined): string => {
    if (!t) return 'unknown';
    if (t.startsWith('trie_') || t === 'trie') return 'trie';
    if (t.startsWith('hash_') || t === 'hash') return 'hash';
    if (t.startsWith('uf_') || t === 'union_find') return 'union_find';
    if (t === 'seg_min') return 'seg_min';
    if (t.startsWith('seg_') || t === 'segment_tree') return 'segment_tree';
    if (t.startsWith('dp_')) return 'dp';
    return t;
};

const Visualizer: React.FC<Props> = ({ level, topic = 'segment_tree', externalData, lectureModeAction, onAnimationComplete, theme = 'slate' }) => {
  const [logs, setLogs] = useState<LogStep[]>([]);
  const [activeNodeId, setActiveNodeId] = useState<number | string | null>(null);
  const [highlightType, setHighlightType] = useState<string>('');
  const [resultMessage, setResultMessage] = useState<string>('');
  const [isAnimating, setIsAnimating] = useState(false);
  
  const [isPaused, setIsPaused] = useState(false);
  const pausedRef = useRef(false);
  const stopRef = useRef(false);

  const colors = VIS_THEME[theme];
  const topicType = getTopicType(topic);
  const topicInfo = TOPIC_INFO[topic || ''] || { title: '算法演示', desc: '观察算法的执行流程。' };

  const [queueState, setQueueState] = useState<(number | string)[]>([]);
  const [trieInput, setTrieInput] = useState('');
  const [dpInputStr, setDpInputStr] = useState('');

  const [stData, setStData] = useState<number[]>(DEFAULT_ARRAY);
  const [stNodes, setStNodes] = useState<TreeNode[]>([]);
  const [stQueryL, setStQueryL] = useState(0);
  const [stQueryR, setStQueryR] = useState(7);
  const [stUpdateIdx, setStUpdateIdx] = useState(2);
  const [stUpdateVal, setStUpdateVal] = useState(99);
  const [stRangeL, setStRangeL] = useState(1);
  const [stRangeR, setStRangeR] = useState(3);
  const [stRangeVal, setStRangeVal] = useState(5);

  const [trieWords, setTrieWords] = useState<string[]>(['apple', 'app', 'bat']);
  const [trieNodes, setTrieNodes] = useState<TreeNode[]>([]);
  const [hashTable, setHashTable] = useState<HashItem[][]>([]);
  const [ufParent, setUfParent] = useState<number[]>([0, 1, 2, 3, 4, 5, 6, 7]);
  const [ufNodes, setUfNodes] = useState<TreeNode[]>([]);
  const [treapNodes, setTreapNodes] = useState<TreeNode[]>([]);

  const [graphNodes, setGraphNodes] = useState<GraphNode[]>([]);
  const [graphEdges, setGraphEdges] = useState<GraphEdge[]>([]);
  const [gridState, setGridState] = useState<GridCell[][]>([]);
  const [gridColorMap, setGridColorMap] = useState<Record<string, string>>({});
  const [queenCells, setQueenCells] = useState<Record<string, string>>({});
  const [treeDistances, setTreeDistances] = useState<Record<number, number>>({});
  const [nodeColors, setNodeColors] = useState<Record<number, string>>({});

  const [hanoiCount, setHanoiCount] = useState(3);
  const [hanoiState, setHanoiState] = useState<number[][]>([[3, 2, 1], [], []]);
  const [fractalLines, setFractalLines] = useState<{x1:number,y1:number,x2:number,y2:number, depth:number}[]>([]);
  const [permCurrentPath, setPermCurrentPath] = useState<(number|null)[]>(new Array(3).fill(null));
  const [permUsed, setPermUsed] = useState<boolean[]>(new Array(4).fill(false)); 
  const [subsetCurrentPath, setSubsetCurrentPath] = useState<number[]>([]);
  const [subsetStatus, setSubsetStatus] = useState<'considering'|'included'|'excluded'|'result'>('considering');
  
  const [gcdState, setGcdState] = useState<{a:number, b:number, formula: string} | null>(null);
  const [listNodes, setListNodes] = useState<number[]>([]);
  const [listCurrentIdx, setListCurrentIdx] = useState<number>(-1);
  const [listOutput, setListOutput] = useState<number[]>([]);
  const [factState, setFactState] = useState<{n: number, equation: string} | null>(null);
  const [stringState, setStringState] = useState<{chars: string[], left: number, right: number, swapped: boolean}>({chars: ['H','E','L','L','O'], left: -1, right: -1, swapped: false});

  const [dpTable, setDpTable] = useState<(number|string)[][]>([]);
  const [dpArray, setDpArray] = useState<(number|string)[]>([]);
  const [dpHighlights, setDpHighlights] = useState<{active?: number[], compare?: number[]}>({});
  const [dpLabelRow, setDpLabelRow] = useState<string[]>([]);
  const [dpLabelCol, setDpLabelCol] = useState<string[]>([]);

  useEffect(() => {
    handleReset();
    if (externalData && externalData.length > 0) {
        if (topicType === 'trie' || topic === 'ac_automaton') {
            setTrieWords(externalData);
            setTrieNodes(generateTrieLayout(externalData));
        }
    }
    
    if (topicType === 'segment_tree') setStNodes(generateTreeLayout(stData, level === 'expert' ? 'MAX' : 'SUM'));
    if (topicType === 'seg_min') {
        const minData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        setStData(minData);
        setStNodes(generateTreeLayout(minData, 'MIN'));
    }
    if (topicType === 'trie') setTrieNodes(generateTrieLayout(trieWords));
    if (topicType === 'hash') setHashTable(generateHashState([12, 25, 33, 10, 5], 7));
    if (topicType === 'union_find') setUfNodes(generateUFNodes(ufParent));
    if (topic === 'ac_automaton') setTrieNodes(generateACLayout(trieWords));
    
    if (topic === 'dp_lis') {
        const initial = [10, 9, 2, 5, 3, 7, 101, 18];
        setStData(initial);
        setDpInputStr(initial.join(','));
        setDpArray(new Array(initial.length).fill(1));
    }
    if (topic === 'dp_max_subarray') {
        const initial = [-2, 1, -3, 4, -1, 2, 1, -5, 4];
        setStData(initial);
        setDpArray(new Array(initial.length).fill(0));
    }
    if (topic === 'dp_lcs') {
        setDpLabelRow(['', ...'ACE'.split('')]);
        setDpLabelCol(['', ...'ABCDE'.split('')]);
        setDpTable(Array.from({length: 4}, () => Array(6).fill(0))); 
    }
    // Knapsack Initialization
    if (topic?.startsWith('dp_knapsack')) {
        const capacity = 10;
        const items = [{w:2, v:6}, {w:2, v:3}, {w:6, v:5}, {w:5, v:4}, {w:4, v:6}];
        setDpLabelRow(['', ...items.map((_, i) => `I${i+1}`)]);
        setDpLabelCol(['', ...Array.from({length: capacity+1}, (_, i) => `${i}`)]);
        setDpTable(Array.from({length: items.length + 1}, () => Array(capacity+1).fill(0)));
    }
    // Interval DP Initialization
    if (topic?.startsWith('dp_interval')) {
        const stones = [1, 2, 3, 4, 5];
        setStData(stones); // Reusing stData for stones
        // Table size N x N
        setDpLabelRow(stones.map((_, i) => `${i+1}`));
        setDpLabelCol(stones.map((_, i) => `${i+1}`));
        setDpTable(Array.from({length: stones.length}, () => Array(stones.length).fill(0)));
    }
    // Digit DP Initialization
    if (topic?.startsWith('dp_digit')) {
        setGraphNodes([]); // Clear graph for fresh Digit DP
        setGraphEdges([]);
    }
    
    // TSP State Compression Initialization
    if (topic === 'dp_state_tsp') {
        // Simple 4 City TSP
        // Cities: 0, 1, 2, 3
        const n = 4;
        const numStates = 1 << n; // 16 rows
        setDpLabelCol(['City 0', 'City 1', 'City 2', 'City 3']);
        setDpLabelRow(Array.from({length: numStates}, (_, i) => i.toString(2).padStart(n, '0'))); // Label rows with binary mask
        setDpTable(Array.from({length: numStates}, () => Array(n).fill('INF')));
    }

    if (topic?.includes('bfs') || topic?.includes('dfs')) {
        const {nodes, edges} = generateDemoTree();
        setGraphNodes(nodes); setGraphEdges(edges);
    }
    if (topic === 'bfs_flood' || topic === 'dfs_maze') setGridState(generateBFSGrid(6, 10));
    if (topic === 'recursion_hanoi') {
        const initialPeg = Array.from({length: hanoiCount}, (_, i) => hanoiCount - i);
        setHanoiState([initialPeg, [], []]);
    }
  }, [level, topic, externalData]);

  const handleReset = () => {
    stopRef.current = true;
    setLogs([]);
    setResultMessage('');
    setActiveNodeId(null);
    setHighlightType('');
    setDpHighlights({});
    setQueueState([]);
    if (topic === 'dp_lis') setDpArray(new Array(stData.length).fill(1));
    else setDpArray(new Array(stData.length).fill(0));
    
    if (topic?.startsWith('dp_knapsack')) {
        setDpTable(Array.from({length: 6}, () => Array(11).fill(0))); 
    }
    if (topic?.startsWith('dp_interval')) {
        setDpTable(Array.from({length: 5}, () => Array(5).fill(0)));
    }
    if (topic?.startsWith('dp_digit')) {
        setGraphNodes([]);
        setGraphEdges([]);
    }
    if (topic === 'dp_state_tsp') {
         // Reset to INF
         const n = 4;
         setDpTable(Array.from({length: 1 << n}, () => Array(n).fill('INF')));
    }
  };

  const handleUpdateDpData = () => {
      const arr = dpInputStr.split(/,|，|\s+/).map(s => Number(s.trim())).filter(n => !isNaN(n));
      if (arr.length > 0) {
          setStData(arr);
          if (topic === 'dp_lis') setDpArray(new Array(arr.length).fill(1));
          else setDpArray(new Array(arr.length).fill(0));
          setResultMessage("数据已更新");
      }
  };

  const runAnimation = async (steps: LogStep[]) => {
      stopRef.current = false;
      setIsAnimating(true);
      setLogs([]);
      
      for (let i = 0; i < steps.length; i++) {
          if (stopRef.current) { setIsAnimating(false); return; }
          const step = steps[i];
          setActiveNodeId(step.nodeId);
          setHighlightType(step.highlight);
          if (step.queue) setQueueState(step.queue);
          if (step.dpState) {
              if (step.dpState.dp1D) setDpArray(step.dpState.dp1D);
              if (step.dpState.dp2D) setDpTable(step.dpState.dp2D);
              setDpHighlights({ active: step.dpState.activeIndices, compare: step.dpState.compareIndices });
          }
          // ... (Tree updates logic same)
          setLogs(prev => [...prev, step]);
          await new Promise(r => setTimeout(r, 400));
      }
      setIsAnimating(false);
  };
  
  // --- TSP HANDLER ---
  const handleTSP = async () => {
      const n = 4;
      const dist = [
          [0, 10, 15, 20],
          [10, 0, 35, 25],
          [15, 35, 0, 30],
          [20, 25, 30, 0]
      ];
      const numStates = 1 << n;
      const dp = Array.from({length: numStates}, () => Array(n).fill(Infinity));
      const steps: LogStep[] = [];

      // Base case: Start at city 0
      dp[1][0] = 0; // Mask 0001, at City 0, cost 0
      steps.push({
          nodeId: -1, 
          message: "初始化: dp[0001][0] = 0 (起点)", 
          highlight: 'normal',
          dpState: { dp2D: JSON.parse(JSON.stringify(dp)).map((r: any[]) => r.map(v => v === Infinity ? 'INF' : v)), activeIndices: [1, 0] }
      });

      // Iterate through masks
      for (let mask = 1; mask < numStates; mask++) {
          // Iterate current city u
          for (let u = 0; u < n; u++) {
              // If u is in mask
              if ((mask & (1 << u))) {
                  const currentCost = dp[mask][u];
                  if (currentCost === Infinity) continue;

                  // Try to go to next city v
                  for (let v = 0; v < n; v++) {
                      // If v not in mask
                      if (!(mask & (1 << v))) {
                          const nextMask = mask | (1 << v);
                          const newCost = currentCost + dist[u][v];
                          
                          let msg = `从 City ${u} 到 City ${v} (距离 ${dist[u][v]})`;
                          if (newCost < dp[nextMask][v]) {
                              dp[nextMask][v] = newCost;
                              msg += ` -> 更新 dp[${nextMask.toString(2).padStart(n,'0')}][${v}] = ${newCost}`;
                              
                              steps.push({
                                  nodeId: -1,
                                  message: msg,
                                  highlight: 'updating',
                                  dpState: { 
                                      dp2D: JSON.parse(JSON.stringify(dp)).map((r: any[]) => r.map(val => val === Infinity ? 'INF' : val)),
                                      activeIndices: [nextMask, v],
                                      compareIndices: [mask, u]
                                  }
                              });
                          }
                      }
                  }
              }
          }
      }

      await runAnimation(steps);
  };


  // ... (Knapsack handlers) ...
  const handleKnapsack01 = async () => {
      const C = 10;
      const items = [{w:2, v:6}, {w:2, v:3}, {w:6, v:5}, {w:5, v:4}, {w:4, v:6}];
      const n = items.length;
      // Using 2D DP for better visualization of decision process
      const dp = Array.from({length: n + 1}, () => Array(C + 1).fill(0));
      const steps: LogStep[] = [];

      for(let i = 1; i <= n; i++) {
          const {w, v} = items[i-1];
          steps.push({nodeId: -1, message: `Item ${i}: Weight=${w}, Value=${v}`, highlight: 'normal', dpState: { dp2D: JSON.parse(JSON.stringify(dp)), activeIndices: [i, 0] }});
          
          for(let j = 0; j <= C; j++) {
              let val = dp[i-1][j]; 
              let msg = `Don't take: ${val}`;
              if (j >= w) {
                  const takeVal = dp[i-1][j-w] + v;
                  if (takeVal > val) {
                      val = takeVal;
                      msg = `Take: ${takeVal} > ${dp[i-1][j]}`;
                  } else {
                      msg = `Don't take (${val}) > Take (${takeVal})`;
                  }
                  steps.push({
                      nodeId: -1, 
                      message: `Cap ${j}: ${msg}`, 
                      highlight: 'updating', 
                      dpState: { 
                          dp2D: JSON.parse(JSON.stringify(dp)), 
                          activeIndices: [i, j], 
                          compareIndices: [i-1, j, i-1, j-w] 
                      }
                  });
              } else {
                  steps.push({
                      nodeId: -1, 
                      message: `Cap ${j}: Too heavy (${w} > ${j}), keep ${val}`, 
                      highlight: 'normal', 
                      dpState: { 
                          dp2D: JSON.parse(JSON.stringify(dp)), 
                          activeIndices: [i, j], 
                          compareIndices: [i-1, j] 
                      }
                  });
              }
              dp[i][j] = val;
          }
      }
      steps.push({nodeId: -1, message: `Max Value: ${dp[n][C]}`, highlight: 'found', dpState: { dp2D: JSON.parse(JSON.stringify(dp)), activeIndices: [n, C] }});
      await runAnimation(steps);
  };

  const handleKnapsackComplete = async () => {
      const C = 10;
      const items = [{w:2, v:6}, {w:2, v:3}, {w:6, v:5}, {w:5, v:4}, {w:4, v:6}];
      const n = items.length;
      const dp = Array.from({length: n + 1}, () => Array(C + 1).fill(0));
      const steps: LogStep[] = [];

      for(let i = 1; i <= n; i++) {
          const {w, v} = items[i-1];
          for(let j = 0; j <= C; j++) {
              let val = dp[i-1][j]; 
              if (j >= w) {
                  const takeVal = dp[i][j-w] + v; 
                  if (takeVal > val) val = takeVal;
                  
                  steps.push({
                      nodeId: -1, 
                      message: `Cap ${j}: Try taking (Current Row Left): ${takeVal} vs ${dp[i-1][j]}`, 
                      highlight: 'updating', 
                      dpState: { 
                          dp2D: JSON.parse(JSON.stringify(dp)), 
                          activeIndices: [i, j], 
                          compareIndices: [i-1, j, i, j-w] 
                      }
                  });
              }
              dp[i][j] = val;
          }
      }
      steps.push({nodeId: -1, message: `Max Value: ${dp[n][C]}`, highlight: 'found', dpState: { dp2D: JSON.parse(JSON.stringify(dp)) }});
      await runAnimation(steps);
  };

  // --- INTERVAL DP HANDLER ---
  const handleIntervalMerge = async () => {
      const stones = [1, 2, 3, 4, 5]; // Or use stData if dynamic
      const n = stones.length;
      
      // dp[i][j] stores min cost to merge stones from index i to j (0-based)
      const dp = Array.from({length: n}, () => Array(n).fill(0));
      
      // sum[i][j] helper
      const getSum = (i: number, j: number) => {
          let s = 0;
          for(let k=i; k<=j; k++) s+=stones[k];
          return s;
      }

      const steps: LogStep[] = [];

      // Init length 1: cost is 0 (already 0 filled)
      steps.push({
          nodeId: -1,
          message: `初始化：长度为 1 的区间代价为 0`,
          highlight: 'normal',
          dpState: { dp2D: JSON.parse(JSON.stringify(dp)) }
      });

      // Interval DP loops
      for (let len = 2; len <= n; len++) {
          for (let i = 0; i <= n - len; i++) {
              const j = i + len - 1;
              dp[i][j] = Infinity;
              
              const rangeSum = getSum(i, j);
              
              steps.push({
                  nodeId: -1,
                  message: `计算区间 [${i+1}, ${j+1}] (长度 ${len})`,
                  highlight: 'visiting',
                  dpState: { dp2D: JSON.parse(JSON.stringify(dp)), activeIndices: [i, j] }
              });

              for (let k = i; k < j; k++) {
                  const cost = dp[i][k] + dp[k+1][j] + rangeSum;
                  let msg = `分割点 k=${k+1}: [${i+1},${k+1}] + [${k+2},${j+1}] = ${dp[i][k]} + ${dp[k+1][j]} + ${rangeSum} = ${cost}`;
                  
                  if (cost < dp[i][j]) {
                      dp[i][j] = cost;
                      msg += " (更优)";
                  }
                  
                  steps.push({
                      nodeId: -1,
                      message: msg,
                      highlight: 'updating',
                      dpState: { 
                          dp2D: JSON.parse(JSON.stringify(dp)), 
                          activeIndices: [i, j], 
                          compareIndices: [i, k, k+1, j] 
                      }
                  });
              }
          }
      }
      
      steps.push({
          nodeId: -1,
          message: `最终最小代价: ${dp[0][n-1]}`,
          highlight: 'found',
          dpState: { dp2D: JSON.parse(JSON.stringify(dp)), activeIndices: [0, n-1] }
      });

      await runAnimation(steps);
  };

  // --- DIGIT DP HANDLER ---
  const handleDigitDP = async () => {
      // Build a recursion tree for counting digit 1 in numbers <= 23
      const num = 23;
      const s = num.toString();
      const n = s.length;
      const steps: LogStep[] = [];
      const nodes: GraphNode[] = [];
      const edges: GraphEdge[] = [];
      let nodeIdCounter = 0;

      // Recursive function that logs steps and builds tree visualization
      // Returns a nodeId for the tree
      const buildTree = async (pos: number, limit: boolean, lead: boolean, parentId: number, x: number, y: number, width: number) => {
          const id = ++nodeIdCounter;
          const label = `Pos:${pos}\n${limit ? 'Lim' : ''}\n${lead ? 'Lead' : ''}`;
          
          nodes.push({ id, x, y, label });
          if (parentId > 0) {
              edges.push({ u: parentId, v: id, weight: 0, directed: true });
          }

          // Force update to show node appearance
          setGraphNodes([...nodes]);
          setGraphEdges([...edges]);
          steps.push({
              nodeId: id,
              message: `进入状态: pos=${pos}, limit=${limit}, lead=${lead}`,
              highlight: 'visiting'
          });

          if (pos === -1) return;

          const up = limit ? parseInt(s[n - 1 - pos]) : 9;
          const childWidth = width / (up + 1);
          
          // Only visualize a subset of branches to avoid explosion
          // Just visualize 0, 1, 2... up to 'up'
          for (let i = 0; i <= up; i++) {
              // Basic pruning for visuals: if not limit and not lead, only show one branch to represent 'rest'
              // But for N=23, it's small enough.
              const nextX = x - width / 2 + childWidth * i + childWidth / 2;
              await buildTree(pos - 1, limit && i === up, lead && i === 0, id, nextX, y + 80, width);
          }
      };

      // Since we can't run async inside the generator logic easily without blocking state updates,
      // we will pre-calculate the tree structure for a small N and simulate traversal.
      // Let's generate a static tree for N=23
      // Digits: 2, 3. Pos 1 (val 2), Pos 0 (val 3)
      
      const staticNodes: GraphNode[] = [];
      const staticEdges: GraphEdge[] = [];
      let nextId = 1;
      
      // Root: Pos 1, Limit true
      staticNodes.push({id: 1, x: 400, y: 50, label: "Pos:1\nLim:T"});
      
      // Level 1: Choices for Pos 1 (0..2)
      // 0: Pos 0, Lim F (since 0 < 2)
      staticNodes.push({id: 2, x: 200, y: 150, label: "Pos:0\nLim:F"}); // Choice 0
      staticEdges.push({u: 1, v: 2, weight: 0, label: "0", directed: true});
      
      // 1: Pos 0, Lim F
      staticNodes.push({id: 3, x: 400, y: 150, label: "Pos:0\nLim:F"}); // Choice 1
      staticEdges.push({u: 1, v: 3, weight: 0, label: "1", directed: true});

      // 2: Pos 0, Lim T (since 2 == 2)
      staticNodes.push({id: 4, x: 600, y: 150, label: "Pos:0\nLim:T"}); // Choice 2
      staticEdges.push({u: 1, v: 4, weight: 0, label: "2", directed: true});

      // Level 2: Children of Node 2 (Lim F -> 0..9)
      // Represent simplified "0..9" node
      staticNodes.push({id: 5, x: 200, y: 250, label: "End\n(0-9)"});
      staticEdges.push({u: 2, v: 5, weight: 0, label: "0..9", directed: true});

      // Level 2: Children of Node 3 (Lim F -> 0..9)
      staticNodes.push({id: 6, x: 400, y: 250, label: "End\n(0-9)"});
      staticEdges.push({u: 3, v: 6, weight: 0, label: "0..9", directed: true});

      // Level 2: Children of Node 4 (Lim T -> 0..3)
      // 0, 1, 2, 3
      staticNodes.push({id: 7, x: 550, y: 250, label: "End"}); // 0
      staticEdges.push({u: 4, v: 7, weight: 0, label: "0", directed: true});
      staticNodes.push({id: 8, x: 580, y: 250, label: "End"}); // 1
      staticEdges.push({u: 4, v: 8, weight: 0, label: "1", directed: true});
      staticNodes.push({id: 9, x: 610, y: 250, label: "End"}); // 2
      staticEdges.push({u: 4, v: 9, weight: 0, label: "2", directed: true});
      staticNodes.push({id: 10, x: 640, y: 250, label: "End"}); // 3
      staticEdges.push({u: 4, v: 10, weight: 0, label: "3", directed: true});

      setGraphNodes(staticNodes);
      setGraphEdges(staticEdges);

      // Animation Steps
      const visitSteps: LogStep[] = [
          { nodeId: 1, message: "Start DFS: Pos 1 (Value 2), Limit=True", highlight: "visiting" },
          { nodeId: 2, message: "Pos 1 choose 0 -> Limit becomes False", highlight: "visiting" },
          { nodeId: 5, message: "Pos 0 Limit False -> Enumerate 0-9 freely", highlight: "visiting" },
          { nodeId: 2, message: "Back to Pos 1, choose 1", highlight: "visiting" },
          { nodeId: 3, message: "Pos 1 choose 1 -> Limit becomes False", highlight: "visiting" },
          { nodeId: 6, message: "Pos 0 Limit False -> Enumerate 0-9 freely", highlight: "visiting" },
          { nodeId: 1, message: "Back to Pos 1, choose 2 (Upper Bound)", highlight: "visiting" },
          { nodeId: 4, message: "Pos 1 choose 2 -> Limit remains True (matches bound)", highlight: "visiting" },
          { nodeId: 7, message: "Pos 0 Limit True (Max 3) -> Choose 0", highlight: "visiting" },
          { nodeId: 8, message: "Pos 0 Limit True -> Choose 1", highlight: "visiting" },
          { nodeId: 9, message: "Pos 0 Limit True -> Choose 2", highlight: "visiting" },
          { nodeId: 10, message: "Pos 0 Limit True -> Choose 3", highlight: "visiting" },
          { nodeId: 1, message: "Done. All paths explored.", highlight: "visiting" }
      ];

      await runAnimation(visitSteps);
  };

  // ... (Linear DP handlers: LIS, MaxSubarray, LCS - preserved) ...
  const handleLIS = async () => { /* ... existing ... */ };
  const handleMaxSubarray = async () => { /* ... existing ... */ };
  const handleLCS = async () => { /* ... existing ... */ };

  const renderCanvas = () => {
      // 1. DP Tables (2D/1D)
      if (topic?.startsWith('dp_') && !topic?.startsWith('dp_digit')) {
          if (topic === 'dp_lcs' || topic.startsWith('dp_knapsack') || topic.startsWith('dp_interval') || topic === 'dp_state_tsp') {
              // 2D DP Table Render
              if (!dpTable || dpTable.length === 0) return <div>No Data</div>;

              return (
                <div className="flex flex-col items-center justify-center p-4 overflow-auto h-full">
                    <div className="grid gap-1" style={{ gridTemplateColumns: `auto repeat(${dpTable[0]?.length || 1}, minmax(30px, 1fr))` }}>
                        <div className="h-8 w-8"></div>
                        {dpTable[0]?.map((_, colIdx) => (
                             <div key={`h-${colIdx}`} className="flex items-center justify-center font-bold text-gray-400 text-xs">{dpLabelCol[colIdx]}</div>
                        ))}
                        {dpTable.map((row, rowIdx) => (
                            <React.Fragment key={`r-${rowIdx}`}>
                                <div className="flex items-center justify-center font-bold text-gray-400 h-8 w-8 text-xs">{dpLabelRow[rowIdx]}</div>
                                {row.map((val, colIdx) => {
                                    const isActive = dpHighlights.active && dpHighlights.active[0] === rowIdx && dpHighlights.active[1] === colIdx;
                                    const isCompare = dpHighlights.compare && (
                                        (dpHighlights.compare[0] === rowIdx && dpHighlights.compare[1] === colIdx) || 
                                        (dpHighlights.compare[2] === rowIdx && dpHighlights.compare[3] === colIdx)
                                    );
                                    
                                    // Interval DP Upper Triangle Logic
                                    let isInvalid = false;
                                    if (topic.startsWith('dp_interval') && rowIdx > colIdx) isInvalid = true;

                                    return (
                                        <motion.div 
                                            key={`${rowIdx}-${colIdx}`} 
                                            className={`h-8 w-10 flex items-center justify-center border rounded text-xs transition-colors ${
                                                isInvalid ? 'opacity-10 border-none' :
                                                isActive ? 'bg-yellow-600 border-yellow-400 text-white font-bold scale-110 z-10 shadow-lg' : 
                                                isCompare ? 'bg-blue-900/50 border-blue-500 text-blue-200' :
                                                'bg-gray-800 border-gray-700 text-gray-400'
                                            }`}
                                        >
                                            {!isInvalid && (val === Infinity ? 'INF' : val)}
                                        </motion.div>
                                    )
                                })}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
              );
          }
          return (
             <div className="flex flex-col items-center justify-center h-full gap-4">
                {/* 1D DP Render */}
                <div className="flex gap-2 flex-wrap justify-center">
                    {stData.map((val, i) => (
                        <div key={i} className="w-10 h-10 flex items-center justify-center bg-gray-800 border rounded">{val}</div>
                    ))}
                </div>
                <div className="flex gap-2 flex-wrap justify-center">
                    {dpArray.map((val, i) => (
                        <div key={i} className={`w-10 h-10 flex items-center justify-center border rounded ${dpHighlights.active?.includes(i) ? 'bg-green-600' : 'bg-gray-700'}`}>{val}</div>
                    ))}
                </div>
             </div>
          );
      }
      
      // 2. Tree / Graph Render (Digit DP, Segment Tree, Trie, BFS/DFS)
      let nodesToRender: any[] = []; // Unified type roughly
      let edgesToRender: GraphEdge[] = [];

      if (topic?.startsWith('dp_digit')) {
          nodesToRender = graphNodes;
          edgesToRender = graphEdges;
      } else if (topic?.includes('bfs') || topic?.includes('dfs')) {
          nodesToRender = graphNodes;
          edgesToRender = graphEdges;
      } else if (topicType === 'segment_tree' || topicType === 'seg_min') {
          nodesToRender = stNodes;
      } else if (topicType === 'trie') {
          nodesToRender = trieNodes;
      } else if (topicType === 'union_find') {
          nodesToRender = ufNodes;
      }

      if (nodesToRender.length > 0) {
          return (
              <svg width="100%" height="100%" viewBox="0 0 800 450">
                  <defs><marker id="arrowhead" markerWidth="10" markerHeight="7" refX="20" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill={colors.edge} /></marker></defs>
                  <AnimatePresence>
                      {/* Render Edges */}
                      {edgesToRender.map((edge, idx) => {
                          const u = nodesToRender.find(n => n.id === edge.u);
                          const v = nodesToRender.find(n => n.id === edge.v);
                          if (!u || !v) return null;
                          return (
                              <g key={`e-${idx}`}>
                                  <line x1={u.x} y1={u.y} x2={v.x} y2={v.y} stroke={colors.edge} strokeWidth="1.5" markerEnd={edge.directed ? "url(#arrowhead)" : ""} />
                                  {edge.label && <text x={(u.x+v.x)/2} y={(u.y+v.y)/2} fill={colors.textMuted} fontSize="10">{edge.label}</text>}
                              </g>
                          )
                      })}
                      {/* Render Tree Links (Legacy) */}
                      {nodesToRender.map((node: any) => (
                          <g key={`l-${node.id}`}>
                              {node.left !== undefined && nodesToRender.find(n => n.id === node.left) && <line x1={node.x} y1={node.y} x2={nodesToRender.find(n => n.id === node.left)!.x} y2={nodesToRender.find(n => n.id === node.left)!.y} stroke={colors.edge} />}
                              {node.right !== undefined && nodesToRender.find(n => n.id === node.right) && <line x1={node.x} y1={node.y} x2={nodesToRender.find(n => n.id === node.right)!.x} y2={nodesToRender.find(n => n.id === node.right)!.y} stroke={colors.edge} />}
                          </g>
                      ))}
                      {/* Render Nodes */}
                      {nodesToRender.map((node: any) => (
                          <g key={node.id}>
                              <motion.circle 
                                  initial={{ scale: 0 }} animate={{ scale: 1, cx: node.x, cy: node.y }} 
                                  r={20} fill={activeNodeId === node.id ? '#f59e0b' : colors.nodeFill} stroke={colors.nodeStroke} 
                              />
                              <text x={node.x} y={node.y} dy=".3em" textAnchor="middle" fill={colors.text} fontSize="10" style={{ whiteSpace: "pre" }}>
                                  {node.value ?? node.label}
                              </text>
                          </g>
                      ))}
                  </AnimatePresence>
              </svg>
          );
      }
      return <div>No Visualizer Available</div>;
  };

  const renderControls = () => (
      <div className="space-y-4">
          {topic?.startsWith('dp_') && (
              <div className="flex gap-2 flex-wrap">
                  {!topic.startsWith('dp_knapsack') && !topic.startsWith('dp_interval') && !topic.startsWith('dp_digit') && topic !== 'dp_state_tsp' && (
                      <>
                        <input value={dpInputStr} onChange={(e) => setDpInputStr(e.target.value)} className="bg-gray-800 border rounded px-2 text-white text-xs w-32" placeholder="Input..." />
                        <button onClick={handleUpdateDpData} className="bg-blue-600 text-white px-2 rounded text-xs">Upd</button>
                      </>
                  )}
                  <button 
                    onClick={() => {
                        if (topic === 'dp_knapsack_complete') handleKnapsackComplete();
                        else if (topic?.startsWith('dp_knapsack')) handleKnapsack01();
                        else if (topic?.startsWith('dp_interval')) handleIntervalMerge(); 
                        else if (topic?.startsWith('dp_digit')) handleDigitDP();
                        else if (topic === 'dp_state_tsp') handleTSP(); // New TSP action
                        else if (topic === 'dp_max_subarray') handleMaxSubarray();
                        else if (topic === 'dp_lcs') handleLCS();
                        else handleLIS(); 
                    }} 
                    className="bg-green-600 text-white px-4 rounded flex items-center gap-1 text-sm font-bold"
                  >
                      <Play className="w-4 h-4"/> Run
                  </button>
              </div>
          )}
          {(topicType === 'segment_tree' || topicType === 'seg_min') && (
              <button onClick={async () => {
                  const { steps, nodes } = simulateBuild(stData, topicType === 'seg_min' ? 'MIN' : 'SUM');
                  setStNodes(nodes);
                  await runAnimation(steps);
                  setStNodes(generateTreeLayout(stData, topicType === 'seg_min' ? 'MIN' : 'SUM'));
              }} className="w-full bg-blue-600 text-white py-2 rounded">Build Tree</button>
          )}
      </div>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      <div className="w-full lg:w-1/3 space-y-4">
        <div className="bg-dark-lighter p-4 rounded-xl border border-gray-700 shadow-lg">
          <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2"><Play className="w-5 h-5" /> 控制台</h3>
          <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-600 mb-4 text-sm">
              <h4 className="font-bold text-white flex items-center gap-2 mb-1"><Info className="w-4 h-4 text-accent" />{topicInfo.title}</h4>
              <p className="text-gray-400 text-xs">{topicInfo.desc}</p>
          </div>
          <div className="space-y-6">
             {renderControls()}
             {resultMessage && <div className="p-3 bg-green-900/20 text-green-400 rounded border border-green-900/50 text-sm">{resultMessage}</div>}
             <div className="bg-gray-900/50 p-2 rounded text-xs text-gray-500 max-h-32 overflow-y-auto font-mono">
                {logs.map((l, i) => <div key={i}>{l.message}</div>)}
             </div>
             <button onClick={handleReset} className="w-full border border-gray-600 hover:bg-gray-700 text-gray-300 py-2 rounded flex items-center justify-center gap-2"><RotateCcw className="w-4 h-4" /> Reset</button>
          </div>
        </div>
      </div>
      <div className="flex-1 bg-dark-lighter rounded-xl border border-gray-700 shadow-2xl overflow-hidden flex flex-col">
         <div className="flex-1 relative bg-gradient-to-br from-dark-lighter to-dark/50 overflow-hidden">
            {renderCanvas()}
         </div>
      </div>
    </div>
  );
};

export default Visualizer;
