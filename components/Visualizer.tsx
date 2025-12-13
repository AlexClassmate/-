import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Plus, GitBranch, Zap, ArrowDown, MoveHorizontal, Search, RefreshCw, MousePointerClick, Check, Hash, Grid as GridIcon, Layers, Crown, Footprints, Gauge, Repeat, Box, Divide, List, Shuffle, AlignLeft, Calculator, Type, RefreshCcw as RefreshIcon } from 'lucide-react';
import { TreeNode, LogStep, CourseLevel, Topic, HashItem, GraphNode, GraphEdge, GridCell, Theme } from '../types';
import { generateTreeLayout, simulateQuery, simulatePointUpdate, simulateRangeUpdate } from '../utils/treeUtils';
import { generateTrieLayout, generateHashState, generateUFNodes, generateACLayout, calculateKMPNext, transformManacherString, generateTreapLayout, generateDemoTree, generateBFSGrid, generateDAG, generateBipartiteGraph, generateNQueensBoard, generateCycleGraph, generateFibCallTree, solveHanoi, generateSimpleList } from '../utils/visualizerHelpers';

const DEFAULT_ARRAY = [1, 3, 5, 7, 9, 11, 13, 15];

// Visualizer Theme Configuration
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
    text: '#111827', // Gray 900
    textMuted: '#6b7280',
    edge: '#cbd5e1', // Gray 300
    bgPanel: '#ffffff',
    gridLand: '#f1f5f9', // Slate 100
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

interface Props {
  level: CourseLevel;
  topic?: Topic;
  externalData?: string[];
  lectureModeAction?: string | null;
  onAnimationComplete?: () => void;
  theme?: Theme;
}

const Visualizer: React.FC<Props> = ({ level, topic = 'segment_tree', externalData, lectureModeAction, onAnimationComplete, theme = 'slate' }) => {
  const [logs, setLogs] = useState<LogStep[]>([]);
  const [activeNodeId, setActiveNodeId] = useState<number | string | null>(null);
  const [highlightType, setHighlightType] = useState<string>('');
  const [resultMessage, setResultMessage] = useState<string>('');
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Animation Control State
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(1);
  const pausedRef = useRef(false);
  const speedRef = useRef(1);
  const stopRef = useRef(false);

  const colors = VIS_THEME[theme];

  // NEW: Queue/Stack State for Visualization
  const [queueState, setQueueState] = useState<(number | string)[]>([]);

  // Existing Topic States
  const [stData, setStData] = useState<number[]>(DEFAULT_ARRAY);
  const [stNodes, setStNodes] = useState<TreeNode[]>([]);
  
  // Segment Tree Inputs
  const [stQueryL, setStQueryL] = useState(0);
  const [stQueryR, setStQueryR] = useState(7);
  const [stUpdateIdx, setStUpdateIdx] = useState(2);
  const [stUpdateVal, setStUpdateVal] = useState(99);
  const [stRangeL, setStRangeL] = useState(1);
  const [stRangeR, setStRangeR] = useState(3);
  const [stRangeVal, setStRangeVal] = useState(5);

  const [trieWords, setTrieWords] = useState<string[]>(['apple', 'app', 'bat']);
  const [trieNodes, setTrieNodes] = useState<TreeNode[]>([]);
  
  const [hashData, setHashData] = useState<number[]>([12, 25, 33, 10, 5]);
  const [hashTable, setHashTable] = useState<HashItem[][]>([]);
  const [ufParent, setUfParent] = useState<number[]>([0, 1, 2, 3, 4, 5, 6, 7]);
  const [ufNodes, setUfNodes] = useState<TreeNode[]>([]);
  const [treapData, setTreapData] = useState<{val: number, pri: number}[]>([]);
  const [treapNodes, setTreapNodes] = useState<TreeNode[]>([]);

  // Graph State
  const [graphNodes, setGraphNodes] = useState<GraphNode[]>([]);
  const [graphEdges, setGraphEdges] = useState<GraphEdge[]>([]);
  
  // Grid State (BFS / DFS Maze / N-Queens)
  const [gridState, setGridState] = useState<GridCell[][]>([]);
  const [gridColorMap, setGridColorMap] = useState<Record<string, string>>({}); // "r-c" -> color
  // Special State for N-Queens
  const [queenCells, setQueenCells] = useState<Record<string, string>>({}); // "r-c" -> "Q" or "X"

  // Tree Algo State
  const [treeDistances, setTreeDistances] = useState<Record<number, number>>({});
  const [treeFarthestNode, setTreeFarthestNode] = useState<number | null>(null);
  const [treeDpValues, setTreeDpValues] = useState<Record<number, {no:number, yes:number}>>({});
  const [treeComponents, setTreeComponents] = useState<Record<number, number>>({});
  const [treeCentroidInput, setTreeCentroidInput] = useState(1);
  const [nodeColors, setNodeColors] = useState<Record<number, string>>({}); // For Bipartite/Topo

  // RECURSION STATE
  const [hanoiState, setHanoiState] = useState<number[][]>([[3, 2, 1], [], []]); // 3 pegs
  const [fractalLines, setFractalLines] = useState<{x1:number,y1:number,x2:number,y2:number, depth:number}[]>([]);
  const [permCurrentPath, setPermCurrentPath] = useState<(number|null)[]>(new Array(3).fill(null));
  const [permUsed, setPermUsed] = useState<boolean[]>(new Array(4).fill(false)); 
  const [subsetCurrentPath, setSubsetCurrentPath] = useState<number[]>([]);
  const [subsetCurrentIdx, setSubsetCurrentIdx] = useState<number>(-1);
  const [subsetStatus, setSubsetStatus] = useState<'considering'|'included'|'excluded'|'result'>('considering');
  const [subsetResults, setSubsetResults] = useState<number[][]>([]);
  
  // New Recursion States
  const [gcdState, setGcdState] = useState<{a:number, b:number, formula: string} | null>(null);
  const [listNodes, setListNodes] = useState<number[]>([]);
  const [listCurrentIdx, setListCurrentIdx] = useState<number>(-1);
  const [listOutput, setListOutput] = useState<number[]>([]);
  const [factState, setFactState] = useState<{n: number, equation: string} | null>(null);
  const [stringState, setStringState] = useState<{chars: string[], left: number, right: number, swapped: boolean}>({chars: ['H','E','L','L','O'], left: -1, right: -1, swapped: false});

  // --- INIT ---
  useEffect(() => {
    handleReset();
    if (externalData && externalData.length > 0) {
        if (topic === 'trie' || topic === 'ac_automaton') {
            setTrieWords(externalData);
            setTrieNodes(generateTrieLayout(externalData));
        }
    }
    
    // Static init
    if (topic === 'segment_tree') setStNodes(generateTreeLayout(stData, level === 'expert' ? 'MAX' : 'SUM'));
    if (topic === 'trie') setTrieNodes(generateTrieLayout(trieWords));
    if (topic === 'hash') setHashTable(generateHashState(hashData, 7));
    if (topic === 'union_find') setUfNodes(generateUFNodes(ufParent));
    if (topic === 'ac_automaton') setTrieNodes(generateACLayout(trieWords));
    if (topic === 'balanced_tree') setTreapNodes(generateTreapLayout(treapData));

    // Graph Algos
    if (['tree_diameter', 'tree_centroid', 'tree_center', 'tree_dp', 'tree_knapsack', 'bfs_basic', 'bfs_shortest', 'bfs_state', 'bfs_multi', 'dfs_basic', 'dfs_connect'].includes(topic!)) {
        const {nodes, edges} = generateDemoTree();
        setGraphNodes(nodes);
        setGraphEdges(edges);
        // Highlight start nodes for multi-source
        if (topic === 'bfs_multi') {
            setNodeColors({1: '#ef4444', 6: '#ef4444'});
        }
    } else if (topic === 'bfs_topo') {
        const {nodes, edges} = generateDAG();
        setGraphNodes(nodes);
        setGraphEdges(edges);
    } else if (topic === 'bfs_bipartite') {
        const {nodes, edges} = generateBipartiteGraph(true);
        setGraphNodes(nodes);
        setGraphEdges(edges);
    } else if (topic === 'bfs_flood' || topic === 'dfs_maze') {
        setGridState(generateBFSGrid(6, 10));
    } else if (topic === 'dfs_nqueens') {
        setGridState(generateNQueensBoard(4)); // Default 4x4
    } else if (topic === 'dfs_graph_algo') {
        const {nodes, edges} = generateCycleGraph();
        setGraphNodes(nodes);
        setGraphEdges(edges);
    } else if (['mst', 'shortest_path', 'tarjan', 'diff_constraints'].includes(topic!)) {
         setGraphNodes([
            {id: 1, x: 200, y: 100, label: 'A'},
            {id: 2, x: 400, y: 50, label: 'B'},
            {id: 3, x: 600, y: 100, label: 'C'},
            {id: 4, x: 200, y: 300, label: 'D'},
            {id: 5, x: 400, y: 350, label: 'E'},
            {id: 6, x: 600, y: 300, label: 'F'},
        ]);
        setGraphEdges([
            {u: 1, v: 2, weight: 4},
            {u: 1, v: 4, weight: 2},
            {u: 2, v: 3, weight: 6},
            {u: 2, v: 5, weight: 5},
            {u: 3, v: 6, weight: 1},
            {u: 4, v: 5, weight: 3},
            {u: 5, v: 6, weight: 7},
        ]);
    } else if (topic === 'recursion_fib') {
        const {nodes, edges} = generateFibCallTree(5);
        setGraphNodes(nodes);
        setGraphEdges(edges);
    } else if (topic === 'recursion_reverse_list') {
        setListNodes(generateSimpleList(5)); // 1->2->3->4->5
    }
    
  }, [level, topic, externalData, stData, trieWords, hashData, ufParent, treapData]);

  const handleReset = () => {
    stopRef.current = true; // Signal stop to any running animation
    setLogs([]);
    setResultMessage('');
    setActiveNodeId(null);
    setHighlightType('');
    setTreeDistances({});
    setTreeFarthestNode(null);
    setTreeDpValues({});
    setTreeComponents({});
    setNodeColors({});
    setGridColorMap({});
    setQueenCells({});
    setQueueState([]); // Reset queue/stack
    setHanoiState([[3, 2, 1], [], []]);
    setFractalLines([]);
    
    // Reset Playback Controls
    setIsPaused(false);
    pausedRef.current = false;
    
    if (topic === 'bfs_flood' || topic === 'dfs_maze') setGridState(generateBFSGrid(6, 10));
    if (topic === 'dfs_nqueens') setGridState(generateNQueensBoard(4));
    if (topic === 'segment_tree') {
       setStNodes(generateTreeLayout(stData, level === 'expert' ? 'MAX' : 'SUM'));
    }
    if (topic === 'bfs_multi') {
        setNodeColors({1: '#ef4444', 6: '#ef4444'});
    }
    if (topic === 'recursion_fib') {
         const {nodes, edges} = generateFibCallTree(5);
         setGraphNodes(nodes);
         setGraphEdges(edges);
    }
    if (topic === 'recursion_reverse_list') {
        setListNodes(generateSimpleList(5));
        setListCurrentIdx(-1);
        setListOutput([]);
    }
    if (topic === 'recursion_string_rev') {
        setStringState({chars: ['H','E','L','L','O'], left: -1, right: -1, swapped: false});
    }
    if (topic === 'recursion_gcd') {
        setGcdState(null);
    }
    if (topic === 'recursion_factorial') {
        setFactState(null);
    }
    
    // Reset new recursion states
    setPermCurrentPath([null, null, null]);
    setPermUsed([false, false, false, false]);
    setSubsetCurrentPath([]);
    setSubsetCurrentIdx(-1);
    setSubsetStatus('considering');
    setSubsetResults([]);
  };

  const runAnimation = async (steps: LogStep[]) => {
      stopRef.current = false; // Allow running
      setIsAnimating(true);
      setLogs([]);
      
      for (let i = 0; i < steps.length; i++) {
          // 1. Check Stop Signal
          if (stopRef.current) {
              setIsAnimating(false);
              return;
          }

          // 2. Check Pause Signal
          while (pausedRef.current) {
              if (stopRef.current) {
                  setIsAnimating(false);
                  return;
              }
              await new Promise(r => setTimeout(r, 100)); // Poll every 100ms
          }

          const step = steps[i];
          setActiveNodeId(step.nodeId);
          setHighlightType(step.highlight);
          
          if (step.queue) setQueueState(step.queue);
          if (step.stack) setQueueState(step.stack); // Handle stack updates
          
          // Custom handlers for specific visual updates
          if (topic === 'bfs_flood' && typeof step.nodeId === 'string') {
               setGridColorMap(prev => ({...prev, [step.nodeId as string]: step.highlight === 'visiting' ? '#f59e0b' : '#3b82f6'}));
          }
          if (topic === 'dfs_maze' && typeof step.nodeId === 'string') {
               // Red for current visit/dead end, Blue for confirmed path
               const color = step.highlight === 'visiting' ? '#ef4444' : (step.highlight === 'backtrack' ? '#6b7280' : '#3b82f6');
               setGridColorMap(prev => ({...prev, [step.nodeId as string]: color}));
          }
          if (topic === 'dfs_nqueens' && typeof step.nodeId === 'string') {
              if (step.message.includes('放置')) setQueenCells(prev => ({...prev, [step.nodeId as string]: 'Q'}));
              if (step.message.includes('回溯') || step.message.includes('移除')) {
                  setQueenCells(prev => {
                      const next = {...prev};
                      delete next[step.nodeId as string];
                      return next;
                  });
              }
              if (step.highlight === 'fail') {
                  setQueenCells(prev => ({...prev, [step.nodeId as string]: 'X'}));
              }
          }
          if (topic === 'dfs_graph_algo') {
              // Cycle detection colors
              const color = step.highlight === 'visiting' ? '#facc15' : (step.highlight === 'found' ? '#10b981' : (step.highlight === 'fail' ? '#ef4444' : '#3b82f6'));
              setNodeColors(prev => ({...prev, [Number(step.nodeId)]: color}));
          }

          if (topic === 'bfs_topo' && step.highlight === 'found') {
               setNodeColors(prev => ({...prev, [Number(step.nodeId)]: '#10b981'}));
          }
          if (topic === 'bfs_bipartite') {
              const color = step.message.includes('黑色') ? '#1f2937' : '#f3f4f6';
              setNodeColors(prev => ({...prev, [Number(step.nodeId)]: color}));
          }

          // RECURSION HANDLERS
          if (topic === 'recursion_hanoi' && step.hanoiMove) {
              const { from, to } = step.hanoiMove;
              setHanoiState(prev => {
                  const newState = prev.map(arr => [...arr]); // Deep copy
                  const disk = newState[from].pop();
                  if (disk) newState[to].push(disk);
                  return newState;
              });
          }
          if (topic === 'recursion_fractal' && step.fractalLine) {
              setFractalLines(prev => [...prev, step.fractalLine!]);
          }
          
          if (topic === 'recursion_perm' && step.permState) {
              setPermCurrentPath(step.permState.currentPath);
              setPermUsed(step.permState.used);
          }
          
          if (topic === 'recursion_subset' && step.subsetState) {
              setSubsetCurrentIdx(step.subsetState.index);
              setSubsetCurrentPath(step.subsetState.currentPath);
              setSubsetStatus(step.subsetState.status);
              
              if (step.subsetState.status === 'result') {
                  setSubsetResults(prev => [...prev, step.subsetState!.currentPath]);
              }
          }
          
          if (topic === 'recursion_gcd' && step.gcdState) {
              setGcdState(step.gcdState);
          }
          
          if (topic === 'recursion_reverse_list' && step.listState) {
              setListCurrentIdx(step.listState.currentIndex);
              setListOutput(step.listState.output);
          }
          
          if (topic === 'recursion_factorial' && step.factState) {
              setFactState(step.factState);
          }
          
          if (topic === 'recursion_string_rev' && step.stringState) {
              setStringState(step.stringState);
          }

          setLogs(prev => [...prev, step]);
          
          // 3. Dynamic Delay based on Speed
          // Base delay 600ms. Speed 1 -> 600ms, Speed 2 -> 300ms, Speed 0.5 -> 1200ms
          const delay = 600 / speedRef.current;
          await new Promise(r => setTimeout(r, delay));
      }
      setIsAnimating(false);
      if(onAnimationComplete) onAnimationComplete();
  };

  // --- RECURSION ALGO HANDLERS ---
  const handleFib = async () => {
      const steps: LogStep[] = [];
      const stack: string[] = []; // Track stack for visualization
      
      // A simple DFS on the generated graph nodes to mimic execution
      const dfs = (u: number) => {
          const nodeLabel = graphNodes.find(n => n.id === u)?.label || `Node ${u}`;
          stack.push(nodeLabel);
          
          steps.push({ 
              nodeId: u, 
              message: `调用 ${nodeLabel}`, 
              highlight: 'visiting',
              stack: [...stack] // Snapshot stack
          });
          
          const children = graphEdges.filter(e => e.u === u).map(e => e.v).sort((a,b) => a-b);
          
          for(const v of children) {
              dfs(v);
          }
          
          steps.push({ 
              nodeId: u, 
              message: `${nodeLabel} 计算完成返回`, 
              highlight: 'found',
              stack: [...stack] 
          });
          
          stack.pop();
      };

      dfs(1); // Root
      await runAnimation(steps);
  };

  const handleHanoi = async () => {
      const steps: LogStep[] = [];
      const stack: string[] = [];
      // Note: We don't need to manually reset Hanoi state here because handleReset called before this or at mount
      
      const hanoi = (n: number, from: number, to: number, aux: number, fromLabel: string, toLabel: string, auxLabel: string) => {
          const frame = `hanoi(${n}, ${fromLabel}->${toLabel})`;
          stack.push(frame);
          
          steps.push({
              nodeId: -1,
              message: `调用 ${frame}`,
              highlight: 'normal',
              stack: [...stack]
          });

          if (n === 1) {
              steps.push({
                  nodeId: -1,
                  message: `移动盘子 1: ${fromLabel} -> ${toLabel}`,
                  highlight: 'found',
                  hanoiMove: { disk: 1, from, to },
                  stack: [...stack]
              });
              
              // Simulate return
              steps.push({ nodeId: -1, message: `返回 (n=1)`, highlight: 'found', stack: [...stack] });
              stack.pop();
              return;
          }
          
          hanoi(n - 1, from, aux, to, fromLabel, auxLabel, toLabel);
          
          steps.push({
              nodeId: -1,
              message: `移动盘子 ${n}: ${fromLabel} -> ${toLabel}`,
              highlight: 'found',
              hanoiMove: { disk: n, from, to },
              stack: [...stack]
          });
          
          hanoi(n - 1, aux, to, from, auxLabel, toLabel, fromLabel);
          
          steps.push({ nodeId: -1, message: `返回 (n=${n})`, highlight: 'found', stack: [...stack] });
          stack.pop();
      };

      hanoi(3, 0, 2, 1, 'A', 'C', 'B');
      await runAnimation(steps);
  };

  const handleFractal = async () => {
      const steps: LogStep[] = [];
      setFractalLines([]);
      const stack: string[] = [];
      
      const draw = (x: number, y: number, len: number, angle: number, depth: number) => {
          const frame = `draw(d=${depth})`;
          stack.push(frame);
          
          steps.push({
              nodeId: -1,
              message: `绘制分支 depth=${depth}`,
              highlight: 'normal',
              stack: [...stack]
          });
          
          if (depth === 0) {
              stack.pop();
              return;
          }
          
          const x2 = x + len * Math.cos(angle * Math.PI / 180);
          const y2 = y - len * Math.sin(angle * Math.PI / 180);
          
          steps.push({
              nodeId: -1,
              message: `延伸线条`,
              highlight: 'normal',
              fractalLine: { x1: x, y1: y, x2: x2, y2: y2, depth },
              stack: [...stack]
          });
          
          draw(x2, y2, len * 0.7, angle + 30, depth - 1);
          draw(x2, y2, len * 0.7, angle - 30, depth - 1);
          
          stack.pop();
      };

      draw(400, 350, 100, 90, 8); // Start from bottom center
      await runAnimation(steps);
  };

  const handlePermutation = async () => {
      const steps: LogStep[] = [];
      const stack: string[] = [];
      const n = 3;
      const path: (number|null)[] = new Array(n).fill(null);
      const used: boolean[] = new Array(n + 1).fill(false);

      const dfs = (index: number) => {
          stack.push(`dfs(idx=${index})`);
          steps.push({
              nodeId: -1,
              message: `进入递归: 正在填第 ${index+1} 个空位`,
              highlight: 'visiting',
              stack: [...stack],
              permState: { currentPath: [...path], used: [...used] }
          });

          if (index === n) {
              steps.push({
                  nodeId: -1,
                  message: `填满了！找到一个解: [${path.join(', ')}]`,
                  highlight: 'found',
                  stack: [...stack],
                  permState: { currentPath: [...path], used: [...used] }
              });
              stack.pop();
              return;
          }

          for (let i = 1; i <= n; i++) {
              if (!used[i]) {
                  // Choose
                  used[i] = true;
                  path[index] = i;
                  steps.push({
                      nodeId: -1,
                      message: `尝试填入数字 ${i}`,
                      highlight: 'updating',
                      stack: [...stack],
                      permState: { currentPath: [...path], used: [...used] }
                  });

                  // Recurse
                  dfs(index + 1);

                  // Backtrack
                  used[i] = false;
                  path[index] = null;
                  steps.push({
                      nodeId: -1,
                      message: `回溯: 拿出数字 ${i}，尝试下一个可能`,
                      highlight: 'backtrack',
                      stack: [...stack],
                      permState: { currentPath: [...path], used: [...used] }
                  });
              }
          }
          stack.pop();
      };

      dfs(0);
      await runAnimation(steps);
  };

  const handleSubset = async () => {
      const steps: LogStep[] = [];
      const stack: string[] = [];
      const arr = [1, 2, 3];
      const n = arr.length;
      const path: number[] = [];
      
      setSubsetResults([]); // Clear results

      const dfs = (index: number) => {
          stack.push(`dfs(idx=${index})`);
          steps.push({
              nodeId: -1,
              message: `进入递归: 考虑第 ${index+1} 个数字 (${index < n ? arr[index] : '结束'})`,
              highlight: 'visiting',
              stack: [...stack],
              subsetState: { index: index, currentPath: [...path], status: 'considering' }
          });

          if (index === n) {
              steps.push({
                  nodeId: -1,
                  message: `所有数字考虑完毕，得到子集: {${path.join(', ')}}`,
                  highlight: 'found',
                  stack: [...stack],
                  subsetState: { index: index, currentPath: [...path], status: 'result' }
              });
              stack.pop();
              return;
          }

          // Option 1: Include arr[index]
          path.push(arr[index]);
          steps.push({
              nodeId: -1,
              message: `决策 1: 选中数字 ${arr[index]}`,
              highlight: 'found',
              stack: [...stack],
              subsetState: { index: index, currentPath: [...path], status: 'included' }
          });
          dfs(index + 1);
          path.pop(); // Backtrack

          // Option 2: Exclude arr[index]
          steps.push({
              nodeId: -1,
              message: `决策 2: 不选数字 ${arr[index]} (回溯后)`,
              highlight: 'backtrack',
              stack: [...stack],
              subsetState: { index: index, currentPath: [...path], status: 'excluded' }
          });
          dfs(index + 1);

          stack.pop();
      };

      dfs(0);
      await runAnimation(steps);
  };
  
  const handleGCD = async () => {
      const steps: LogStep[] = [];
      const stack: string[] = [];
      
      const gcd = (a: number, b: number) => {
          stack.push(`gcd(${a}, ${b})`);
          steps.push({
              nodeId: -1,
              message: `调用 gcd(${a}, ${b})`,
              highlight: 'visiting',
              stack: [...stack],
              gcdState: { a, b, formula: `?` }
          });
          
          if (b === 0) {
              steps.push({
                  nodeId: -1,
                  message: `b 为 0，找到最大公约数: ${a}`,
                  highlight: 'found',
                  stack: [...stack],
                  gcdState: { a, b, formula: `Answer: ${a}` }
              });
              stack.pop();
              return a;
          }
          
          steps.push({
              nodeId: -1,
              message: `下一步: gcd(${b}, ${a} % ${b}) = gcd(${b}, ${a % b})`,
              highlight: 'updating',
              stack: [...stack],
              gcdState: { a, b, formula: `${a} % ${b} = ${a % b}` }
          });
          
          const res = gcd(b, a % b);
          
          // Return
          steps.push({
              nodeId: -1,
              message: `返回结果: ${res}`,
              highlight: 'found',
              stack: [...stack],
              gcdState: { a, b, formula: `Got ${res}` }
          });
          stack.pop();
          return res;
      };
      
      gcd(48, 18);
      await runAnimation(steps);
  };
  
  const handleReverseList = async () => {
      const steps: LogStep[] = [];
      const stack: string[] = [];
      const output: number[] = [];
      const nodes = listNodes;
      
      setListOutput([]); // Clear
      
      const traverse = (idx: number) => {
          if (idx >= nodes.length) {
              stack.push('null');
              steps.push({
                  nodeId: -1,
                  message: `到达链表末尾 (NULL)，准备回溯`,
                  highlight: 'visiting',
                  stack: [...stack],
                  listState: { nodes, currentIndex: idx, output: [...output] }
              });
              stack.pop();
              return;
          }
          
          stack.push(`Node(${nodes[idx]})`);
          steps.push({
              nodeId: -1,
              message: `访问节点 ${nodes[idx]}，进入下一层`,
              highlight: 'visiting',
              stack: [...stack],
              listState: { nodes, currentIndex: idx, output: [...output] }
          });
          
          traverse(idx + 1);
          
          output.push(nodes[idx]);
          steps.push({
              nodeId: -1,
              message: `回到节点 ${nodes[idx]}，执行打印`,
              highlight: 'backtrack',
              stack: [...stack],
              listState: { nodes, currentIndex: idx, output: [...output] }
          });
          
          stack.pop();
      };
      
      traverse(0);
      await runAnimation(steps);
  };
  
  const handleFactorial = async () => {
      const steps: LogStep[] = [];
      const stack: string[] = [];
      
      const fact = (n: number) => {
          stack.push(`fact(${n})`);
          steps.push({
              nodeId: -1,
              message: `计算 fact(${n})`,
              highlight: 'visiting',
              stack: [...stack],
              factState: { n, equation: `${n} * fact(${n-1})` }
          });
          
          if (n <= 1) {
              steps.push({
                  nodeId: -1,
                  message: `基本情况 n=${n}, 返回 1`,
                  highlight: 'found',
                  stack: [...stack],
                  factState: { n, equation: `1` }
              });
              stack.pop();
              return 1;
          }
          
          const res = fact(n - 1);
          
          steps.push({
              nodeId: -1,
              message: `fact(${n}) = ${n} * ${res} = ${n * res}`,
              highlight: 'backtrack',
              stack: [...stack],
              factState: { n, equation: `${n} * ${res} = ${n * res}` }
          });
          
          stack.pop();
          return n * res;
      };
      
      fact(5);
      await runAnimation(steps);
  };
  
  const handleStringRev = async () => {
      const steps: LogStep[] = [];
      const stack: string[] = [];
      // Use local copy for simulation
      const chars = ['H','E','L','L','O'];
      
      const rev = (l: number, r: number) => {
          if (l >= r) {
              stack.push(`rev(${l},${r})`);
              steps.push({
                  nodeId: -1,
                  message: `指针相遇或交叉 (L=${l}, R=${r})，停止`,
                  highlight: 'found',
                  stack: [...stack],
                  stringState: { chars: [...chars], left: l, right: r, swapped: false }
              });
              stack.pop();
              return;
          }
          
          stack.push(`rev(${l},${r})`);
          steps.push({
              nodeId: -1,
              message: `交换 s[${l}]='${chars[l]}' 和 s[${r}]='${chars[r]}'`,
              highlight: 'visiting',
              stack: [...stack],
              stringState: { chars: [...chars], left: l, right: r, swapped: false }
          });
          
          // Swap
          const temp = chars[l];
          chars[l] = chars[r];
          chars[r] = temp;
          
          steps.push({
              nodeId: -1,
              message: `交换完成: ${chars.join('')}`,
              highlight: 'updating',
              stack: [...stack],
              stringState: { chars: [...chars], left: l, right: r, swapped: true }
          });
          
          rev(l + 1, r - 1);
          
          stack.pop();
      };
      
      rev(0, 4);
      await runAnimation(steps);
  };

  // --- DFS HANDLERS ---
  const handleDFSBasic = async () => {
      const steps: LogStep[] = [];
      const visited = new Set<number>();
      const stack: number[] = []; // Visual stack representation

      const dfs = (u: number) => {
          visited.add(u);
          stack.push(u);
          steps.push({nodeId: u, message: `访问节点 ${u}`, highlight: 'visiting', queue: [...stack]});

          const neighbors = graphEdges.filter(e => e.u === u || e.v === u).map(e => e.u === u ? e.v : e.u);
          for(const v of neighbors) {
              if(!visited.has(v)) {
                  steps.push({nodeId: v, message: `发现邻居 ${v}，深入递归`, highlight: 'found', queue: [...stack]});
                  dfs(v);
                  // Backtrack visual
                  steps.push({nodeId: u, message: `从 ${v} 回溯到 ${u}`, highlight: 'backtrack', queue: [...stack]});
              }
          }
          stack.pop();
          steps.push({nodeId: u, message: `节点 ${u} 处理完毕，退栈`, highlight: 'normal', queue: [...stack]});
      };

      await runAnimation(steps);
      dfs(1);
      await runAnimation(steps); // Execute gathered steps
  };

  const handleDFSConnectivity = async () => {
      const steps: LogStep[] = [];
      const visited = new Set<number>();
      let components = 0;
      
      const dfs = (u: number) => {
          visited.add(u);
          setNodeColors(prev => ({...prev, [u]: '#10b981'})); 
          steps.push({nodeId: u, message: `访问节点 ${u} (属于连通块 ${components})`, highlight: 'found'});
          
          const neighbors = graphEdges.filter(e => e.u === u || e.v === u).map(e => e.u === u ? e.v : e.u);
          for(const v of neighbors) {
              if(!visited.has(v)) dfs(v);
          }
      };

      for(const node of graphNodes) {
          if(!visited.has(node.id)) {
              components++;
              steps.push({nodeId: node.id, message: `发现新的未访问节点 ${node.id}，连通块计数 +1`, highlight: 'visiting'});
              dfs(node.id);
          }
      }
      setResultMessage(`总连通块数量: ${components}`);
      await runAnimation(steps);
  };

  const handleMazeDFS = async () => {
      const steps: LogStep[] = [];
      const rows = gridState.length;
      const cols = gridState[0].length;
      const visited = new Set<string>();
      const dirs = [[0,1], [1,0], [0,-1], [-1,0]];
      let found = false;

      // Add simple stack visualization simulation
      const stack: string[] = [];

      const dfs = (r: number, c: number) => {
          if(found) return;
          visited.add(`${r}-${c}`);
          stack.push(`(${r},${c})`);
          steps.push({nodeId: `${r}-${c}`, message: `探索格子 (${r},${c})`, highlight: 'visiting', queue: [...stack]});
          
          if(r === rows-1 && c === cols-1) {
              found = true;
              steps.push({nodeId: `${r}-${c}`, message: `到达终点!`, highlight: 'found', queue: [...stack]});
              stack.pop();
              return;
          }

          for(const [dr, dc] of dirs) {
              const nr = r + dr, nc = c + dc;
              if (nr >=0 && nr < rows && nc >= 0 && nc < cols && 
                  gridState[nr][nc].type !== 'obstacle' && !visited.has(`${nr}-${nc}`)) {
                      if(!found) {
                          dfs(nr, nc);
                          if(!found) steps.push({nodeId: `${r}-${c}`, message: `从 (${nr},${nc}) 回溯到 (${r},${c})`, highlight: 'backtrack', queue: [...stack]});
                      }
              }
          }
          stack.pop();
      };

      dfs(0, 0);
      await runAnimation(steps);
  };

  const handleNQueens = async () => {
      const n = 4; // Use 4 for demo
      const steps: LogStep[] = [];
      const board: number[] = new Array(n).fill(-1); // col index for each row
      
      const isSafe = (row: number, col: number) => {
          for(let r=0; r<row; r++) {
              const c = board[r];
              if(c === col || Math.abs(row - r) === Math.abs(col - c)) return false;
          }
          return true;
      };

      const solve = (row: number) => {
          if(row === n) return true;

          for(let col=0; col<n; col++) {
              steps.push({nodeId: `${row}-${col}`, message: `尝试在 (${row},${col}) 放置皇后`, highlight: 'visiting'});
              if(isSafe(row, col)) {
                  board[row] = col;
                  steps.push({nodeId: `${row}-${col}`, message: `放置成功`, highlight: 'found'});
                  if(solve(row + 1)) return true;
                  board[row] = -1; // Backtrack
                  steps.push({nodeId: `${row}-${col}`, message: `后续无解，回溯：移除 (${row},${col})`, highlight: 'backtrack'});
              } else {
                  steps.push({nodeId: `${row}-${col}`, message: `位置冲突 (攻击范围)`, highlight: 'fail'});
              }
          }
          return false;
      };

      solve(0);
      await runAnimation(steps);
  };

  const handleCycleDetect = async () => {
      const steps: LogStep[] = [];
      const visited = new Set<number>();
      const pathSet = new Set<number>(); // Current recursion stack
      let hasCycle = false;
      const stack: number[] = [];

      const dfs = (u: number) => {
          visited.add(u);
          pathSet.add(u);
          stack.push(u);
          steps.push({nodeId: u, message: `访问 ${u} (标记灰色/递归中)`, highlight: 'visiting', queue: [...stack]});

          const neighbors = graphEdges.filter(e => e.u === u && e.directed).map(e => e.v);
          for(const v of neighbors) {
              if (pathSet.has(v)) {
                  hasCycle = true;
                  steps.push({nodeId: v, message: `遇到祖先节点 ${v}，发现环！`, highlight: 'fail', queue: [...stack]});
                  stack.pop();
                  pathSet.delete(u);
                  return;
              }
              if (!visited.has(v)) {
                  if(hasCycle) return;
                  dfs(v);
              }
          }
          
          stack.pop();
          pathSet.delete(u);
          steps.push({nodeId: u, message: `节点 ${u} 递归结束 (标记黑色)`, highlight: 'found', queue: [...stack]});
      };

      // Start from 1
      dfs(1);
      await runAnimation(steps);
      setResultMessage(hasCycle ? "检测到环!" : "无环");
  };

  // --- BFS HANDLERS (Keep existing) ---
  const handleBFSBasic = async () => {
      let startNodes = [1];
      if (topic === 'bfs_multi') startNodes = [1, 6];

      const steps: LogStep[] = [];
      const queue = [...startNodes];
      const visited = new Set(startNodes);
      
      steps.push({nodeId: -1, message: `初始化队列: [${startNodes.join(', ')}]`, highlight: 'normal', queue: [...queue]});

      while(queue.length) {
          const u = queue.shift()!;
          steps.push({nodeId: u, message: `从队列弹出节点 ${u}`, highlight: 'found', queue: [...queue]});
          
          const neighbors = graphEdges.filter(e => e.u === u || e.v === u).map(e => e.u === u ? e.v : e.u);
          for(const v of neighbors) {
              if(!visited.has(v)) {
                  visited.add(v);
                  queue.push(v);
                  steps.push({nodeId: v, message: `发现邻居 ${v}, 入队`, highlight: 'visiting', queue: [...queue]});
              }
          }
      }
      await runAnimation(steps);
  };

  const handleBFSFloodFill = async () => {
      const steps: LogStep[] = [];
      const visited = new Set<string>();
      const rows = gridState.length;
      const cols = gridState[0].length;
      const dirs = [[0,1], [0,-1], [1,0], [-1,0]];
      
      let islandCount = 0;
      let queueDisplay: string[] = [];

      for(let r=0; r<rows; r++) {
          for(let c=0; c<cols; c++) {
              if (gridState[r][c].type === 'land' && !visited.has(`${r}-${c}`)) {
                  islandCount++;
                  const q = [[r,c]];
                  queueDisplay = [`(${r},${c})`];
                  visited.add(`${r}-${c}`);
                  steps.push({nodeId: `${r}-${c}`, message: `发现第 ${islandCount} 座岛屿，位于 (${r},${c})`, highlight: 'visiting', queue: [...queueDisplay]});
                  
                  while(q.length) {
                      const [currR, currC] = q.shift()!;
                      queueDisplay.shift();
                      steps.push({nodeId: `${currR}-${currC}`, message: `处理坐标 (${currR},${currC})`, highlight: 'found', queue: [...queueDisplay]});
                      
                      for(const [dr, dc] of dirs) {
                          const nr = currR + dr, nc = c + dc;
                          if (nr >=0 && nr < rows && nc >= 0 && nc < cols && 
                              gridState[nr][nc].type === 'land' && !visited.has(`${nr}-${nc}`)) {
                                  visited.add(`${nr}-${nc}`);
                                  q.push([nr, nc]);
                                  queueDisplay.push(`(${nr},${nc})`);
                                  steps.push({nodeId: `${nr}-${nc}`, message: `扩展到 (${nr},${nc})，入队`, highlight: 'found', queue: [...queueDisplay]});
                          }
                      }
                  }
              }
          }
      }
      await runAnimation(steps);
      setResultMessage(`总计岛屿数: ${islandCount}`);
  };

  const handleTopoSort = async () => {
      const steps: LogStep[] = [];
      const inDegree: Record<number, number> = {};
      graphNodes.forEach(n => inDegree[n.id] = n.inDegree || 0);
      
      const q: number[] = [];
      Object.keys(inDegree).forEach(k => {
          if (inDegree[Number(k)] === 0) {
              q.push(Number(k));
          }
      });
      steps.push({nodeId: -1, message: `初始入度为 0 的节点: [${q.join(', ')}]`, highlight: 'visiting', queue: [...q]});

      const result = [];
      while(q.length) {
          const u = q.shift()!;
          result.push(u);
          steps.push({nodeId: u, message: `弹出节点 ${u} (加入结果集)`, highlight: 'found', queue: [...q]});

          // Find outgoing edges
          const neighbors = graphEdges.filter(e => e.u === u && e.directed).map(e => e.v);
          for(const v of neighbors) {
              inDegree[v]--;
              if(inDegree[v] === 0) {
                  q.push(v);
                  steps.push({nodeId: v, message: `节点 ${v} 入度减为 0，入队`, highlight: 'visiting', queue: [...q]});
              } else {
                  steps.push({nodeId: v, message: `节点 ${v} 入度减 1，剩余 ${inDegree[v]}`, highlight: 'updating', queue: [...q]});
              }
          }
      }
      await runAnimation(steps);
  };

  const handleBipartite = async () => {
      const steps: LogStep[] = [];
      const colors: Record<number, number> = {}; // 0 or 1
      let isBipartite = true;
      
      // BFS Color
      const startNode = 1;
      const q = [startNode];
      colors[startNode] = 0;
      steps.push({nodeId: startNode, message: `开始: 将节点 ${startNode} 染成黑色`, highlight: 'visiting', queue: [...q]});

      while(q.length) {
          const u = q.shift()!;
          const currColor = colors[u];
          const nextColor = 1 - currColor;
          const colorName = nextColor === 0 ? '黑色' : '白色';
          steps.push({nodeId: u, message: `弹出节点 ${u}，准备染其邻居为 ${colorName}`, highlight: 'normal', queue: [...q]});

          const neighbors = graphEdges.filter(e => e.u === u || e.v === u).map(e => e.u === u ? e.v : e.u);
          for(const v of neighbors) {
              if (colors[v] === undefined) {
                  colors[v] = nextColor;
                  q.push(v);
                  steps.push({nodeId: v, message: `邻居 ${v} 染成 ${colorName}，入队`, highlight: 'found', queue: [...q]});
              } else if (colors[v] === currColor) {
                  isBipartite = false;
                  steps.push({nodeId: v, message: `冲突！邻居 ${v} 颜色相同！`, highlight: 'fail', queue: [...q]});
              }
          }
      }
      await runAnimation(steps);
      setResultMessage(isBipartite ? "是二分图" : "不是二分图");
  };

  // ... (Keep existing Tree Algo handlers: handleTreeBFS, handleTreeCentroid, etc.)
  const handleTreeBFS = async (startNode: number) => {
      // Reuse basic BFS but tracking dist
      setTreeDistances({});
      setTreeFarthestNode(null);
      const steps: LogStep[] = [];
      const dist: Record<number, number> = {};
      const q = [startNode];
      dist[startNode] = 0;
      let maxDist = 0;
      let farthest = startNode;
      steps.push({nodeId: startNode, message: `从节点 ${startNode} 开始 BFS, 距离=0`, highlight: 'visiting', queue: [...q]});
      while(q.length > 0) {
          const u = q.shift()!;
          steps.push({nodeId: u, message: `访问节点 ${u}`, highlight: 'normal', queue: [...q]});
          
          if(dist[u] > maxDist) { maxDist = dist[u]; farthest = u; }
          const neighbors = graphEdges.filter(e => e.u === u || e.v === u);
          for(const e of neighbors) {
              const v = e.u === u ? e.v : e.u;
              if (dist[v] === undefined) {
                  dist[v] = dist[u] + 1;
                  steps.push({nodeId: v, message: `发现 ${v}, 距离更新为 ${dist[v]}, 入队`, highlight: 'found', queue: [...q, v]}); // Simulate push visually
                  q.push(v);
              }
          }
      }
      steps.push({nodeId: farthest, message: `最远节点是 ${farthest} (距离 ${maxDist})`, highlight: 'match', queue: []});
      await runAnimation(steps);
      setTreeDistances(dist);
      setTreeFarthestNode(farthest);
  };
  // (Assuming handleTreeCentroid, handleTreeDP are kept as is)
  const handleTreeCentroid = async (removeNode: number) => {
      setTreeComponents({});
      const steps: LogStep[] = [];
      const sizes: Record<number, number> = {};
      const getComponentSize = (start: number, visited: Set<number>) => {
          let size = 0; const q = [start]; visited.add(start);
          while(q.length) {
              const u = q.pop()!; size++;
              const neighbors = graphEdges.filter(e => e.u === u || e.v === u);
              for(const e of neighbors) {
                  const v = e.u === u ? e.v : e.u;
                  if (v !== removeNode && !visited.has(v)) { visited.add(v); q.push(v); }
              }
          }
          return size;
      };
      const visited = new Set<number>();
      let maxComp = 0;
      const neighbors = graphEdges.filter(e => e.u === removeNode || e.v === removeNode).map(e => e.u === removeNode ? e.v : e.u);
      steps.push({nodeId: removeNode, message: `尝试移除节点 ${removeNode}`, highlight: 'fail'});
      for(const v of neighbors) {
          if(!visited.has(v)) {
             const compSize = getComponentSize(v, visited);
             sizes[v] = compSize;
             maxComp = Math.max(maxComp, compSize);
             steps.push({nodeId: v, message: `以 ${v} 为根的连通块大小为 ${compSize}`, highlight: 'visiting'});
          }
      }
      await runAnimation(steps);
      setTreeComponents(sizes);
  };
  const handleTreeDP = async () => {
      setTreeDpValues({});
      const steps: LogStep[] = [];
      const dp: Record<number, {no:number, yes:number}> = {};
      const happy: Record<number, number> = {1:10, 2:20, 3:30, 4:40, 5:50, 6:60, 7:70, 8:80};
      const dfs = (u: number, p: number) => {
          dp[u] = {no: 0, yes: happy[u]};
          const neighbors = graphEdges.filter(e => e.u === u || e.v === u).map(e => e.u === u ? e.v : e.u);
          for(const v of neighbors) {
              if (v !== p) {
                  dfs(v, u);
                  dp[u].no += Math.max(dp[v].no, dp[v].yes);
                  dp[u].yes += dp[v].no;
              }
          }
          steps.push({nodeId: u, message: `DP[${u}]: Yes=${dp[u].yes}, No=${dp[u].no}`, highlight: 'updating'});
      };
      dfs(1, 0);
      await runAnimation(steps);
      setTreeDpValues(dp);
  };
  
  // --- SEGMENT TREE ACTIONS (Keep existing) ---
  const handleStQuery = () => {
      const steps = simulateQuery(stNodes, stQueryL, stQueryR, level === 'advanced', level === 'expert' ? 'MAX' : 'SUM');
      runAnimation(steps);
      setResultMessage(`Query [${stQueryL}, ${stQueryR}] Complete`);
  };
  const handleStUpdatePoint = () => {
      const { steps, newNodes } = simulatePointUpdate(stNodes, stUpdateIdx, stUpdateVal, level === 'expert' ? 'MAX' : 'SUM');
      runAnimation(steps);
      setStNodes(newNodes);
  };
  const handleStUpdateRange = () => {
      const { steps, newNodes } = simulateRangeUpdate(stNodes, stRangeL, stRangeR, stRangeVal);
      runAnimation(steps);
      setStNodes(newNodes);
  };

  // --- RENDERERS ---
  const renderControls = () => {
      // Common Playback Controls
      const playbackControls = (
          <div className="flex items-center justify-between bg-gray-800/50 p-3 rounded-lg border border-gray-700 mb-4">
              <button 
                  onClick={() => {
                      const newVal = !isPaused;
                      setIsPaused(newVal);
                      pausedRef.current = newVal;
                  }}
                  disabled={!isAnimating}
                  className={`p-2 rounded-full transition ${!isAnimating ? 'text-gray-600 cursor-not-allowed' : 'text-white bg-primary hover:bg-blue-600'}`}
                  title={isPaused ? "继续" : "暂停"}
              >
                  {isPaused ? <Play className="w-5 h-5 fill-current" /> : <Pause className="w-5 h-5 fill-current" />}
              </button>

              <div className="flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-gray-400" />
                  <div className="flex bg-gray-900 rounded p-1 border border-gray-700">
                      {[0.5, 1, 2, 4].map(s => (
                          <button
                              key={s}
                              onClick={() => {
                                  setSpeed(s);
                                  speedRef.current = s;
                              }}
                              className={`px-2 py-1 text-xs rounded transition ${speed === s ? 'bg-gray-700 text-white font-bold' : 'text-gray-500 hover:text-gray-300'}`}
                          >
                              {s}x
                          </button>
                      ))}
                  </div>
              </div>
          </div>
      );

      // RECURSION CONTROLS
      if (topic === 'recursion_fib') {
           return (
              <div className="space-y-4">
                  {playbackControls}
                  <div className="bg-dark-lighter p-3 rounded-lg border border-gray-700">
                      <div className="text-xs font-bold text-primary mb-2 flex items-center gap-1"><Repeat className="w-3 h-3"/> 递归演示</div>
                      <button onClick={handleFib} disabled={isAnimating} className="w-full bg-blue-600 hover:bg-blue-500 text-white p-2 rounded text-xs flex justify-between">
                             <span>Calculate Fib(5)</span>
                             <Play className="w-3 h-3" />
                      </button>
                  </div>
              </div>
          );
      }
      if (topic === 'recursion_hanoi') {
           return (
              <div className="space-y-4">
                  {playbackControls}
                  <div className="bg-dark-lighter p-3 rounded-lg border border-gray-700">
                      <div className="text-xs font-bold text-primary mb-2 flex items-center gap-1"><Box className="w-3 h-3"/> 汉诺塔演示</div>
                      <button onClick={handleHanoi} disabled={isAnimating} className="w-full bg-purple-600 hover:bg-purple-500 text-white p-2 rounded text-xs flex justify-between">
                             <span>Solve Hanoi(3)</span>
                             <Play className="w-3 h-3" />
                      </button>
                  </div>
              </div>
          );
      }
      if (topic === 'recursion_fractal') {
           return (
              <div className="space-y-4">
                  {playbackControls}
                  <div className="bg-dark-lighter p-3 rounded-lg border border-gray-700">
                      <div className="text-xs font-bold text-primary mb-2 flex items-center gap-1"><Divide className="w-3 h-3"/> 分形树演示</div>
                      <button onClick={handleFractal} disabled={isAnimating} className="w-full bg-green-600 hover:bg-green-500 text-white p-2 rounded text-xs flex justify-between">
                             <span>Grow Fractal Tree</span>
                             <Play className="w-3 h-3" />
                      </button>
                  </div>
              </div>
          );
      }
      if (topic === 'recursion_perm') {
           return (
              <div className="space-y-4">
                  {playbackControls}
                  <div className="bg-dark-lighter p-3 rounded-lg border border-gray-700">
                      <div className="text-xs font-bold text-primary mb-2 flex items-center gap-1"><Shuffle className="w-3 h-3"/> 全排列演示</div>
                      <button onClick={handlePermutation} disabled={isAnimating} className="w-full bg-orange-600 hover:bg-orange-500 text-white p-2 rounded text-xs flex justify-between">
                             <span>Start Permutations (3)</span>
                             <Play className="w-3 h-3" />
                      </button>
                  </div>
              </div>
          );
      }
      if (topic === 'recursion_subset') {
           return (
              <div className="space-y-4">
                  {playbackControls}
                  <div className="bg-dark-lighter p-3 rounded-lg border border-gray-700">
                      <div className="text-xs font-bold text-primary mb-2 flex items-center gap-1"><List className="w-3 h-3"/> 子集生成演示</div>
                      <button onClick={handleSubset} disabled={isAnimating} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white p-2 rounded text-xs flex justify-between">
                             <span>Generate Subsets (3)</span>
                             <Play className="w-3 h-3" />
                      </button>
                  </div>
              </div>
          );
      }
      if (topic === 'recursion_gcd') {
           return (
              <div className="space-y-4">
                  {playbackControls}
                  <div className="bg-dark-lighter p-3 rounded-lg border border-gray-700">
                      <div className="text-xs font-bold text-primary mb-2 flex items-center gap-1"><RefreshIcon className="w-3 h-3"/> 辗转相除演示</div>
                      <button onClick={handleGCD} disabled={isAnimating} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded text-xs flex justify-between">
                             <span>GCD(48, 18)</span>
                             <Play className="w-3 h-3" />
                      </button>
                  </div>
              </div>
          );
      }
      if (topic === 'recursion_reverse_list') {
           return (
              <div className="space-y-4">
                  {playbackControls}
                  <div className="bg-dark-lighter p-3 rounded-lg border border-gray-700">
                      <div className="text-xs font-bold text-primary mb-2 flex items-center gap-1"><AlignLeft className="w-3 h-3"/> 链表逆序演示</div>
                      <button onClick={handleReverseList} disabled={isAnimating} className="w-full bg-pink-600 hover:bg-pink-500 text-white p-2 rounded text-xs flex justify-between">
                             <span>Reverse Print List</span>
                             <Play className="w-3 h-3" />
                      </button>
                  </div>
              </div>
          );
      }
      if (topic === 'recursion_factorial') {
           return (
              <div className="space-y-4">
                  {playbackControls}
                  <div className="bg-dark-lighter p-3 rounded-lg border border-gray-700">
                      <div className="text-xs font-bold text-primary mb-2 flex items-center gap-1"><Calculator className="w-3 h-3"/> 阶乘演示</div>
                      <button onClick={handleFactorial} disabled={isAnimating} className="w-full bg-red-600 hover:bg-red-500 text-white p-2 rounded text-xs flex justify-between">
                             <span>Calculate Factorial(5)</span>
                             <Play className="w-3 h-3" />
                      </button>
                  </div>
              </div>
          );
      }
      if (topic === 'recursion_string_rev') {
           return (
              <div className="space-y-4">
                  {playbackControls}
                  <div className="bg-dark-lighter p-3 rounded-lg border border-gray-700">
                      <div className="text-xs font-bold text-primary mb-2 flex items-center gap-1"><Type className="w-3 h-3"/> 字符串反转演示</div>
                      <button onClick={handleStringRev} disabled={isAnimating} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded text-xs flex justify-between">
                             <span>Reverse String</span>
                             <Play className="w-3 h-3" />
                      </button>
                  </div>
              </div>
          );
      }

      // DFS CONTROLS
      if (topic === 'dfs_basic' || topic === 'dfs_connect') {
          return (
              <div className="space-y-4">
                  {playbackControls}
                  <div className="bg-dark-lighter p-3 rounded-lg border border-gray-700">
                      <div className="text-xs font-bold text-primary mb-2 flex items-center gap-1"><Zap className="w-3 h-3"/> DFS 操作</div>
                      <button onClick={topic === 'dfs_basic' ? handleDFSBasic : handleDFSConnectivity} disabled={isAnimating} className="w-full bg-blue-600 hover:bg-blue-500 text-white p-2 rounded text-xs flex justify-between">
                             <span>{topic === 'dfs_basic' ? 'Start DFS Recursion' : 'Count Components'}</span>
                             <Play className="w-3 h-3" />
                      </button>
                  </div>
              </div>
          );
      }
      if (topic === 'dfs_maze') {
           return (
              <div className="space-y-4">
                  {playbackControls}
                  <div className="bg-dark-lighter p-3 rounded-lg border border-gray-700">
                      <div className="text-xs font-bold text-primary mb-2 flex items-center gap-1"><Footprints className="w-3 h-3"/> 迷宫操作</div>
                      <button onClick={handleMazeDFS} disabled={isAnimating} className="w-full bg-blue-600 hover:bg-blue-500 text-white p-2 rounded text-xs flex justify-between">
                             <span>Start Maze DFS</span>
                             <Play className="w-3 h-3" />
                      </button>
                  </div>
              </div>
          );
      }
      if (topic === 'dfs_nqueens') {
           return (
              <div className="space-y-4">
                  {playbackControls}
                  <div className="bg-dark-lighter p-3 rounded-lg border border-gray-700">
                      <div className="text-xs font-bold text-primary mb-2 flex items-center gap-1"><Crown className="w-3 h-3"/> N-Queens</div>
                      <button onClick={handleNQueens} disabled={isAnimating} className="w-full bg-purple-600 hover:bg-purple-500 text-white p-2 rounded text-xs flex justify-between">
                             <span>Start 4-Queens</span>
                             <Play className="w-3 h-3" />
                      </button>
                  </div>
              </div>
          );
      }
      if (topic === 'dfs_graph_algo') {
           return (
              <div className="space-y-4">
                  {playbackControls}
                  <div className="bg-dark-lighter p-3 rounded-lg border border-gray-700">
                      <div className="text-xs font-bold text-primary mb-2 flex items-center gap-1"><RefreshCw className="w-3 h-3"/> 环检测</div>
                      <button onClick={handleCycleDetect} disabled={isAnimating} className="w-full bg-red-600 hover:bg-red-500 text-white p-2 rounded text-xs flex justify-between">
                             <span>Detect Cycle</span>
                             <Play className="w-3 h-3" />
                      </button>
                  </div>
              </div>
          );
      }

      // BFS CONTROLS
      if (topic === 'bfs_basic' || topic === 'bfs_shortest' || topic === 'bfs_state' || topic === 'bfs_multi') {
           return (
              <div className="space-y-4">
                  {playbackControls}
                  <div className="bg-dark-lighter p-3 rounded-lg border border-gray-700">
                      <div className="text-xs font-bold text-primary mb-2 flex items-center gap-1"><Zap className="w-3 h-3"/> BFS 控制</div>
                      <button onClick={handleBFSBasic} disabled={isAnimating} className="w-full bg-blue-600 hover:bg-blue-500 text-white p-2 rounded text-xs flex justify-between">
                             <span>开始 BFS {topic === 'bfs_multi' ? '(起点 1 & 6)' : ''}</span>
                             <Play className="w-3 h-3" />
                      </button>
                  </div>
              </div>
           );
      }
      if (topic === 'bfs_flood') {
           return (
              <div className="space-y-4">
                  {playbackControls}
                  <div className="bg-dark-lighter p-3 rounded-lg border border-gray-700">
                      <div className="text-xs font-bold text-primary mb-2 flex items-center gap-1"><GridIcon className="w-3 h-3"/> Flood Fill</div>
                      <button onClick={handleBFSFloodFill} disabled={isAnimating} className="w-full bg-blue-600 hover:bg-blue-500 text-white p-2 rounded text-xs flex justify-between">
                             <span>开始 洪水填充</span>
                             <Play className="w-3 h-3" />
                      </button>
                  </div>
              </div>
           );
      }
      if (topic === 'bfs_topo') {
           return (
              <div className="space-y-4">
                  {playbackControls}
                  <div className="bg-dark-lighter p-3 rounded-lg border border-gray-700">
                      <div className="text-xs font-bold text-primary mb-2 flex items-center gap-1"><Layers className="w-3 h-3"/> 拓扑排序</div>
                      <button onClick={handleTopoSort} disabled={isAnimating} className="w-full bg-blue-600 hover:bg-blue-500 text-white p-2 rounded text-xs flex justify-between">
                             <span>运行 Kahn 算法</span>
                             <Play className="w-3 h-3" />
                      </button>
                  </div>
              </div>
           );
      }
      if (topic === 'bfs_bipartite') {
           return (
              <div className="space-y-4">
                  {playbackControls}
                  <div className="bg-dark-lighter p-3 rounded-lg border border-gray-700">
                      <div className="text-xs font-bold text-primary mb-2 flex items-center gap-1"><GitBranch className="w-3 h-3"/> 二分图判定</div>
                      <button onClick={handleBipartite} disabled={isAnimating} className="w-full bg-blue-600 hover:bg-blue-500 text-white p-2 rounded text-xs flex justify-between">
                             <span>开始染色判定</span>
                             <Play className="w-3 h-3" />
                      </button>
                  </div>
              </div>
           );
      }

      // Existing Controls
      if (topic === 'segment_tree') {
          return (
              <div className="space-y-4">
                  {playbackControls}
                  {/* Query */}
                  <div className="bg-dark-lighter p-3 rounded-lg border border-gray-700">
                      <div className="text-xs font-bold text-primary mb-2 flex items-center gap-1"><Search className="w-3 h-3"/> 区间查询</div>
                      <div className="flex gap-2 items-center">
                          <input type="number" value={stQueryL} onChange={e => setStQueryL(Number(e.target.value))} className="w-12 bg-gray-900 border border-gray-600 rounded px-2 py-1 text-xs text-white" placeholder="L" />
                          <span className="text-gray-400">-</span>
                          <input type="number" value={stQueryR} onChange={e => setStQueryR(Number(e.target.value))} className="w-12 bg-gray-900 border border-gray-600 rounded px-2 py-1 text-xs text-white" placeholder="R" />
                          <button onClick={handleStQuery} disabled={isAnimating} className="ml-auto bg-primary hover:bg-blue-600 text-white p-1.5 rounded transition disabled:opacity-50">
                             <Play className="w-3 h-3" />
                          </button>
                      </div>
                  </div>

                  {/* Point Update */}
                  {level !== 'advanced' && (
                  <div className="bg-dark-lighter p-3 rounded-lg border border-gray-700">
                      <div className="text-xs font-bold text-accent mb-2 flex items-center gap-1"><MousePointerClick className="w-3 h-3"/> 单点修改</div>
                      <div className="flex gap-2 items-center">
                          <input type="number" value={stUpdateIdx} onChange={e => setStUpdateIdx(Number(e.target.value))} className="w-12 bg-gray-900 border border-gray-600 rounded px-2 py-1 text-xs text-white" placeholder="Idx" />
                          <span className="text-gray-400">=</span>
                          <input type="number" value={stUpdateVal} onChange={e => setStUpdateVal(Number(e.target.value))} className="w-12 bg-gray-900 border border-gray-600 rounded px-2 py-1 text-xs text-white" placeholder="Val" />
                          <button onClick={handleStUpdatePoint} disabled={isAnimating} className="ml-auto bg-accent hover:bg-yellow-600 text-white p-1.5 rounded transition disabled:opacity-50">
                             <Zap className="w-3 h-3" />
                          </button>
                      </div>
                  </div>
                  )}

                  {/* Range Update (Advanced only) */}
                  {level === 'advanced' && (
                  <div className="bg-dark-lighter p-3 rounded-lg border border-gray-700">
                      <div className="text-xs font-bold text-purple-400 mb-2 flex items-center gap-1"><RefreshCw className="w-3 h-3"/> 区间修改 (Lazy)</div>
                      <div className="flex gap-2 items-center mb-2">
                          <input type="number" value={stRangeL} onChange={e => setStRangeL(Number(e.target.value))} className="w-10 bg-gray-900 border border-gray-600 rounded px-2 py-1 text-xs text-white" placeholder="L" />
                          <span className="text-gray-400">-</span>
                          <input type="number" value={stRangeR} onChange={e => setStRangeR(Number(e.target.value))} className="w-10 bg-gray-900 border border-gray-600 rounded px-2 py-1 text-xs text-white" placeholder="R" />
                      </div>
                      <div className="flex gap-2 items-center">
                          <span className="text-xs text-gray-400">Add:</span>
                          <input type="number" value={stRangeVal} onChange={e => setStRangeVal(Number(e.target.value))} className="flex-1 bg-gray-900 border border-gray-600 rounded px-2 py-1 text-xs text-white" placeholder="Val" />
                          <button onClick={handleStUpdateRange} disabled={isAnimating} className="bg-purple-600 hover:bg-purple-500 text-white p-1.5 rounded transition disabled:opacity-50">
                             <Zap className="w-3 h-3" />
                          </button>
                      </div>
                  </div>
                  )}
              </div>
          )
      }

      // TREE ALGO CONTROLS (Keep)
      if (['tree_diameter', 'tree_center'].includes(topic!)) {
           return (
              <div className="space-y-4">
                  {playbackControls}
                  <div className="bg-dark-lighter p-3 rounded-lg border border-gray-700">
                      <div className="text-xs font-bold text-primary mb-2 flex items-center gap-1"><MoveHorizontal className="w-3 h-3"/> 树的直径 BFS</div>
                      <div className="space-y-2">
                          <button onClick={() => handleTreeBFS(1)} disabled={isAnimating} className="w-full bg-blue-600 hover:bg-blue-500 text-white p-2 rounded text-xs flex justify-between">
                             <span>1. 从 Node 1 开始 BFS</span>
                             <Play className="w-3 h-3" />
                          </button>
                          {treeFarthestNode && (
                              <button onClick={() => handleTreeBFS(treeFarthestNode)} disabled={isAnimating} className="w-full bg-accent hover:bg-yellow-600 text-white p-2 rounded text-xs flex justify-between">
                                 <span>2. 从 Node {treeFarthestNode} 开始 BFS</span>
                                 <Play className="w-3 h-3" />
                              </button>
                          )}
                      </div>
                  </div>
              </div>
           );
      }
      if (topic === 'tree_centroid') {
           return (
              <div className="space-y-4">
                  {playbackControls}
                  <div className="bg-dark-lighter p-3 rounded-lg border border-gray-700">
                      <div className="text-xs font-bold text-primary mb-2 flex items-center gap-1"><GitBranch className="w-3 h-3"/> 验证重心</div>
                      <div className="flex gap-2 items-center mb-2">
                          <span className="text-xs text-gray-400">移除节点:</span>
                          <input type="number" value={treeCentroidInput} onChange={e => setTreeCentroidInput(Number(e.target.value))} className="w-12 bg-gray-900 border border-gray-600 rounded px-2 py-1 text-xs text-white" />
                      </div>
                      <button onClick={() => handleTreeCentroid(treeCentroidInput)} disabled={isAnimating} className="w-full bg-purple-600 hover:bg-purple-500 text-white p-2 rounded text-xs flex justify-between">
                             <span>计算最大连通块</span>
                             <Play className="w-3 h-3" />
                      </button>
                  </div>
              </div>
           );
      }
       if (['tree_dp', 'tree_knapsack'].includes(topic!)) {
           return (
              <div className="space-y-4">
                  {playbackControls}
                  <div className="bg-dark-lighter p-3 rounded-lg border border-gray-700">
                      <div className="text-xs font-bold text-primary mb-2 flex items-center gap-1"><Hash className="w-3 h-3"/> 树形 DP</div>
                      <button onClick={handleTreeDP} disabled={isAnimating} className="w-full bg-green-600 hover:bg-green-500 text-white p-2 rounded text-xs flex justify-between">
                             <span>执行状态转移</span>
                             <Play className="w-3 h-3" />
                      </button>
                  </div>
              </div>
           );
      }

      if (['mst', 'shortest_path', 'tarjan', 'diff_constraints', 'dfs_perm', 'dfs_bag', 'dfs_pruning'].includes(topic!)) {
          return <div className="text-gray-400 text-sm italic p-2 border border-dashed border-gray-700 rounded">Interactive demos available in Lecture Steps.</div>
      }
      
      return <div className="text-gray-500 text-sm">Controls not available for this mode yet.</div>;
  };

  // NEW: Render Queue in a dedicated bottom bar
  const renderQueue = () => {
    // If empty and not animating, maybe hide? Or keep for consistency. Keeping it is better context.
    return (
        <div className="h-20 bg-gray-900/80 border-t border-gray-700 p-2 shrink-0 flex flex-col justify-center backdrop-blur-sm">
            <div className="flex justify-between items-center mb-1 px-2">
                <div className="text-xs text-gray-400 font-mono uppercase tracking-wider flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-green-500"></div>
                   队列 (Queue) [Front → Rear]
                </div>
                <span className="text-xs text-gray-500">{queueState.length} items</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 px-2 custom-scrollbar items-center h-full">
                <AnimatePresence mode="popLayout">
                {queueState.map((item, i) => (
                    <motion.div 
                        key={`${item}-${i}`} 
                        layout
                        initial={{ opacity: 0, scale: 0.8, x: 20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: -20 }}
                        className="bg-gray-800 border border-gray-600 text-white px-3 py-1.5 rounded text-xs font-mono font-bold shrink-0 shadow-sm whitespace-nowrap"
                    >
                        {item}
                    </motion.div>
                ))}
                </AnimatePresence>
                {queueState.length === 0 && <span className="text-gray-600 text-xs italic ml-1">Empty</span>}
            </div>
        </div>
    );
  };

  const renderCanvas = () => {
      // 1. MANACHER & KMP Placeholders (assumed managed by lecture steps mainly)
      if (topic === 'manacher') return <div className="p-4 text-center text-gray-500">Manacher Visuals Active in Lecture</div>;
      if (topic === 'kmp') return <div className="p-4 text-center text-gray-500">KMP Visuals Active in Lecture</div>;

      // REMOVED: Horizontal Queue Visual Overlay

      // 2. GRID RENDERER (Flood Fill / Maze / N-Queens)
      if (topic === 'bfs_flood' || topic === 'dfs_maze' || topic === 'dfs_nqueens') {
          return (
             <div className="relative w-full h-full">
                 <svg className="w-full h-full" viewBox="0 0 800 400">
                     {gridState.map((row, r) => (row.map((cell, c) => (
                         <g key={`${r}-${c}`}>
                             <rect 
                                x={200 + c * 50}
                                y={50 + r * 50}
                                width={45}
                                height={45}
                                fill={
                                    topic === 'dfs_nqueens' 
                                        ? ((r+c)%2===0 ? '#334155' : '#475569') // Chessboard pattern
                                        : (cell.type === 'obstacle' ? colors.gridObstacle : (gridColorMap[`${r}-${c}`] || colors.gridLand))
                                }
                                stroke={colors.edge}
                                rx={4}
                             />
                             {/* N-Queens Specifics */}
                             {topic === 'dfs_nqueens' && queenCells[`${r}-${c}`] === 'Q' && (
                                 <text x={200 + c * 50 + 22} y={50 + r * 50 + 30} fontSize="30" textAnchor="middle" fill="#fbbf24">♛</text>
                             )}
                             {topic === 'dfs_nqueens' && queenCells[`${r}-${c}`] === 'X' && (
                                 <text x={200 + c * 50 + 22} y={50 + r * 50 + 32} fontSize="30" textAnchor="middle" fill="#ef4444">✕</text>
                             )}
                         </g>
                     ))))}
                 </svg>
             </div>
          )
      }

      // 3. GRAPH RENDERER
      if (['mst', 'shortest_path', 'tarjan', 'diff_constraints', 'bfs_basic', 'bfs_shortest', 'bfs_state', 'bfs_topo', 'bfs_bipartite', 'bfs_multi', 'dfs_basic', 'dfs_connect', 'dfs_graph_algo', 'recursion_fib'].includes(topic!)) {
          return (
              <div className="relative w-full h-full">
                  <svg className="w-full h-full" viewBox="0 0 800 400">
                      <defs>
                          <marker id="arrow" markerWidth="10" markerHeight="10" refX="25" refY="3.5" orient="auto">
                              <polygon points="0 0, 10 3.5, 0 7" fill={colors.edge} />
                          </marker>
                      </defs>
                      {graphEdges.map((e, i) => {
                          const u = graphNodes.find(n => n.id === e.u);
                          const v = graphNodes.find(n => n.id === e.v);
                          if (!u || !v) return null; // Safety check
                          return (
                              <g key={i}>
                                  <line x1={u.x} y1={u.y} x2={v.x} y2={v.y} stroke={colors.edge} strokeWidth="2" markerEnd={e.directed ? "url(#arrow)" : ""} />
                                  {e.weight > 0 && <text x={(u.x+v.x)/2} y={(u.y+v.y)/2 - 5} fill={colors.textMuted} fontSize="12" textAnchor="middle">{e.weight}</text>}
                              </g>
                          )
                      })}
                      {graphNodes.map(n => (
                          <g key={n.id}>
                              <circle 
                                 cx={n.x} cy={n.y} r={topic === 'recursion_fib' ? 18 : 22} 
                                 fill={activeNodeId === n.id ? (highlightType === 'visiting' ? '#f59e0b' : highlightType === 'found' ? '#10b981' : highlightType === 'fail' ? '#ef4444' : '#3b82f6') : (nodeColors[n.id] || colors.nodeFill)} 
                                 stroke={activeNodeId === n.id ? '#fff' : colors.nodeStroke} 
                                 strokeWidth="2" 
                              />
                              <text x={n.x} y={n.y} dy=".3em" textAnchor="middle" fill={nodeColors[n.id] && nodeColors[n.id] !== colors.nodeFill ? (theme === 'light' && nodeColors[n.id] === '#f3f4f6' ? 'black' : 'white') : colors.text} fontWeight="bold" fontSize="12">
                                  {n.label || n.id}
                                  {topic === 'bfs_topo' && n.inDegree !== undefined && `(${n.inDegree})`}
                              </text>
                              
                              {/* Distance Label for Diameter/BFS */}
                              {treeDistances[n.id] !== undefined && (
                                 <text x={n.x+15} y={n.y-25} fontSize="12" fill="#facc15" fontWeight="bold">d:{treeDistances[n.id]}</text>
                              )}
                              {/* DP Values */}
                              {treeDpValues[n.id] && (
                                  <g>
                                      <text x={n.x + 25} y={n.y - 5} fontSize="10" fill="#4ade80">Y:{treeDpValues[n.id].yes}</text>
                                      <text x={n.x + 25} y={n.y + 10} fontSize="10" fill="#f87171">N:{treeDpValues[n.id].no}</text>
                                  </g>
                              )}
                              {/* Centroid Component Sizes */}
                              {treeComponents[n.id] && (
                                  <text x={n.x+20} y={n.y+20} fontSize="12" fill="#38bdf8" fontWeight="bold">sz:{treeComponents[n.id]}</text>
                              )}
                          </g>
                      ))}
                  </svg>
              </div>
          );
      }
      
      // 4. HANOI RENDERER
      if (topic === 'recursion_hanoi') {
          return (
              <div className="relative w-full h-full flex items-end justify-center pb-10 gap-20">
                  {/* Pegs */}
                  {[0, 1, 2].map(pegIdx => (
                      <div key={pegIdx} className="relative flex flex-col-reverse items-center w-32 h-64">
                           {/* Stick */}
                           <div className="absolute bottom-0 w-2 h-48 bg-gray-500 rounded-t-lg z-0"></div>
                           {/* Base */}
                           <div className="absolute bottom-[-10px] w-32 h-2 bg-gray-600 rounded"></div>
                           {/* Label */}
                           <div className="absolute -bottom-8 font-bold text-gray-400">{String.fromCharCode(65+pegIdx)}</div>
                           
                           {/* Disks */}
                           <AnimatePresence>
                               {hanoiState[pegIdx].map((diskSize, i) => (
                                   <motion.div
                                      layoutId={`disk-${diskSize}`}
                                      key={diskSize}
                                      initial={{ opacity: 0, y: -50 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, scale: 0 }}
                                      className="z-10 h-6 rounded border border-white/20 mb-1"
                                      style={{ 
                                          width: `${diskSize * 25 + 20}%`,
                                          backgroundColor: diskSize === 1 ? '#ef4444' : diskSize === 2 ? '#3b82f6' : '#f59e0b'
                                      }}
                                   />
                               ))}
                           </AnimatePresence>
                      </div>
                  ))}
              </div>
          )
      }

      // 5. FRACTAL RENDERER
      if (topic === 'recursion_fractal') {
          return (
              <div className="relative w-full h-full">
                  <svg className="w-full h-full" viewBox="0 0 800 400">
                      {fractalLines.map((line, i) => (
                          <motion.line
                             key={i}
                             initial={{ pathLength: 0, opacity: 0 }}
                             animate={{ pathLength: 1, opacity: 1 }}
                             x1={line.x1} y1={line.y1}
                             x2={line.x2} y2={line.y2}
                             stroke={line.depth < 3 ? '#22c55e' : '#a855f7'}
                             strokeWidth={Math.max(1, line.depth)}
                             strokeLinecap="round"
                          />
                      ))}
                  </svg>
              </div>
          )
      }
      
      // 6. PERMUTATION RENDERER
      if (topic === 'recursion_perm') {
          return (
              <div className="relative w-full h-full flex flex-col items-center justify-center">
                  <div className="mb-12 text-gray-400 text-sm font-mono tracking-wider">TARGET: 3 Slots</div>
                  
                  {/* Slots */}
                  <div className="flex gap-4 mb-16">
                      {permCurrentPath.map((val, i) => (
                          <motion.div 
                             key={i}
                             className={`w-20 h-24 rounded-lg border-2 flex items-center justify-center text-4xl font-bold transition-colors ${val !== null ? 'border-orange-500 bg-orange-900/30 text-white' : 'border-gray-700 bg-gray-800/50 text-gray-600'}`}
                          >
                              {val !== null ? val : "?"}
                          </motion.div>
                      ))}
                  </div>
                  
                  {/* Number Pool */}
                  <div className="flex gap-4 p-4 bg-gray-900 rounded-xl border border-gray-700">
                      <div className="text-xs text-gray-500 font-mono self-center mr-2">POOL:</div>
                      {[1, 2, 3].map(num => (
                          <div 
                             key={num}
                             className={`w-12 h-12 rounded-full flex items-center justify-center font-bold border transition-all ${permUsed[num] ? 'bg-gray-800 text-gray-600 border-gray-700 scale-90 opacity-50' : 'bg-blue-600 text-white border-blue-400 shadow-lg scale-100'}`}
                          >
                              {num}
                          </div>
                      ))}
                  </div>
              </div>
          )
      }
      
      // 7. SUBSET RENDERER
      if (topic === 'recursion_subset') {
          const arr = [1, 2, 3];
          return (
              <div className="relative w-full h-full flex flex-row p-8 gap-8">
                  {/* Left: Current Decision Process */}
                  <div className="flex-1 flex flex-col items-center justify-center border-r border-gray-700 pr-8">
                      <div className="text-gray-400 text-sm font-mono tracking-wider mb-8">CURRENT SUBSET</div>
                      
                      {/* Current subset build */}
                      <div className="flex flex-wrap gap-2 mb-12 min-h-[60px] p-4 bg-gray-900/50 rounded-lg w-full justify-center">
                          <AnimatePresence>
                              {subsetCurrentPath.length === 0 && <span className="text-gray-600 italic">Empty Set</span>}
                              {subsetCurrentPath.map((val) => (
                                  <motion.div
                                      key={val}
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      exit={{ scale: 0 }}
                                      className="w-10 h-10 rounded bg-cyan-600 text-white flex items-center justify-center font-bold shadow"
                                  >
                                      {val}
                                  </motion.div>
                              ))}
                          </AnimatePresence>
                      </div>
                      
                      {/* Decision visual */}
                      <div className="flex gap-2">
                          {arr.map((val, i) => (
                              <div key={i} className={`relative p-4 rounded-lg border-2 transition-all flex flex-col items-center ${i === subsetCurrentIdx ? 'border-yellow-500 bg-yellow-900/20 scale-110 z-10' : 'border-gray-700 bg-gray-800 opacity-50'}`}>
                                  <span className="text-2xl font-bold text-white mb-2">{val}</span>
                                  {i === subsetCurrentIdx && (
                                      <motion.div 
                                        initial={{ opacity: 0, y: 10 }} 
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`text-xs font-bold px-2 py-1 rounded ${subsetStatus === 'included' ? 'bg-green-600' : subsetStatus === 'excluded' ? 'bg-red-600' : 'bg-yellow-600'}`}
                                      >
                                          {subsetStatus === 'included' ? 'SELECTED' : subsetStatus === 'excluded' ? 'SKIPPED' : '?'}
                                      </motion.div>
                                  )}
                              </div>
                          ))}
                      </div>
                  </div>
                  
                  {/* Right: Results List */}
                  <div className="w-48 flex flex-col overflow-hidden">
                      <div className="text-gray-400 text-sm font-mono tracking-wider mb-4">RESULTS ({subsetResults.length})</div>
                      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-2">
                          {subsetResults.map((res, i) => (
                              <motion.div 
                                  key={i}
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  className="p-2 bg-gray-800 border border-gray-700 rounded text-xs text-gray-300 font-mono"
                              >
                                  {res.length === 0 ? "{ }" : `{ ${res.join(', ')} }`}
                              </motion.div>
                          ))}
                      </div>
                  </div>
              </div>
          )
      }
      
      // 8. GCD RENDERER
      if (topic === 'recursion_gcd') {
          return (
              <div className="relative w-full h-full flex flex-col items-center justify-center">
                  <div className="mb-12">
                      <motion.div
                         key={gcdState?.formula}
                         initial={{ opacity: 0, scale: 0.8 }}
                         animate={{ opacity: 1, scale: 1 }}
                         className="text-4xl font-bold text-white bg-gray-800/80 px-8 py-6 rounded-2xl border border-gray-600 shadow-2xl backdrop-blur-sm"
                      >
                          {gcdState?.formula || "GCD(?, ?)"}
                      </motion.div>
                  </div>
                  <div className="flex gap-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                          <span className="text-gray-400 text-sm font-mono">A</span>
                          <div className="w-24 h-24 rounded-full bg-indigo-600 text-white flex items-center justify-center text-3xl font-bold shadow-lg border-4 border-indigo-400">
                              {gcdState?.a ?? "?"}
                          </div>
                      </div>
                      <div className="flex items-center text-gray-500 font-mono text-xl">
                          %
                      </div>
                      <div className="flex flex-col items-center gap-2">
                          <span className="text-gray-400 text-sm font-mono">B</span>
                          <div className="w-24 h-24 rounded-full bg-purple-600 text-white flex items-center justify-center text-3xl font-bold shadow-lg border-4 border-purple-400">
                              {gcdState?.b ?? "?"}
                          </div>
                      </div>
                  </div>
              </div>
          );
      }
      
      // 9. REVERSE LIST RENDERER
      if (topic === 'recursion_reverse_list') {
          return (
              <div className="relative w-full h-full flex flex-col p-8">
                  {/* List View */}
                  <div className="flex items-center justify-center gap-2 mb-16 mt-8">
                      {listNodes.map((val, i) => (
                          <React.Fragment key={i}>
                              <div className={`relative w-16 h-16 rounded-lg flex items-center justify-center border-2 transition-all shadow-lg ${i === listCurrentIdx ? 'bg-pink-600 border-white scale-110 z-10' : 'bg-gray-800 border-gray-600 text-gray-400'}`}>
                                  <span className="text-xl font-bold text-white">{val}</span>
                                  {i === listCurrentIdx && (
                                      <motion.div 
                                        layoutId="list-cursor"
                                        className="absolute -top-3 -right-3 w-6 h-6 bg-yellow-400 rounded-full border-2 border-black z-20 shadow-sm"
                                      />
                                  )}
                              </div>
                              {i < listNodes.length && (
                                  <div className="w-8 h-0.5 bg-gray-600"></div>
                              )}
                          </React.Fragment>
                      ))}
                      <div className={`px-3 py-1 rounded text-xs font-mono ${listCurrentIdx === listNodes.length ? 'bg-red-500/20 text-red-400 border border-red-500' : 'bg-gray-800 text-gray-500 border border-gray-700'}`}>
                          NULL
                      </div>
                  </div>
                  
                  {/* Output View */}
                  <div className="flex-1 flex flex-col items-center">
                      <div className="text-xs text-gray-400 font-mono tracking-wider mb-4 border-b border-gray-700 pb-1 w-full text-center">OUTPUT STREAM</div>
                      <div className="flex gap-3 overflow-hidden h-16 items-center">
                          <AnimatePresence>
                              {listOutput.map((val, i) => (
                                  <motion.div
                                      key={`${val}-${i}`}
                                      initial={{ opacity: 0, y: 20 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold font-mono shadow-md border border-green-400"
                                  >
                                      {val}
                                  </motion.div>
                              ))}
                          </AnimatePresence>
                          {listOutput.length === 0 && <span className="text-gray-600 text-sm italic">Waiting for recursion return...</span>}
                      </div>
                  </div>
              </div>
          );
      }
      
      // 10. FACTORIAL RENDERER
      if (topic === 'recursion_factorial') {
          return (
              <div className="relative w-full h-full flex flex-col items-center justify-center">
                  <motion.div 
                      key={factState?.equation}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-3xl md:text-5xl font-bold text-white mb-8 text-center leading-tight drop-shadow-lg"
                  >
                      {factState?.equation || "Calculating..."}
                  </motion.div>
                  <div className="text-gray-400 font-mono text-sm">
                      Current N: <span className="text-red-400 text-lg font-bold ml-2">{factState?.n ?? '?'}</span>
                  </div>
              </div>
          );
      }
      
      // 11. STRING REVERSE RENDERER
      if (topic === 'recursion_string_rev') {
          return (
              <div className="relative w-full h-full flex flex-col items-center justify-center">
                  <div className="flex gap-4">
                      {stringState.chars.map((char, i) => (
                          <div key={i} className="flex flex-col items-center gap-2">
                              {/* Indices markers */}
                              <div className="h-6 w-full flex justify-center relative">
                                  {i === stringState.left && <motion.div layoutId="ptr-l" className="text-green-400 font-bold text-xs">L</motion.div>}
                                  {i === stringState.right && <motion.div layoutId="ptr-r" className="text-red-400 font-bold text-xs">R</motion.div>}
                              </div>
                              
                              {/* Char Box */}
                              <motion.div 
                                  layout
                                  className={`w-16 h-20 rounded-lg flex items-center justify-center text-4xl font-bold border-2 shadow-xl ${
                                      (i === stringState.left || i === stringState.right) 
                                      ? (stringState.swapped ? 'bg-green-600 border-green-400 text-white' : 'bg-yellow-600 border-yellow-400 text-white')
                                      : 'bg-gray-800 border-gray-600 text-gray-300'
                                  }`}
                              >
                                  {char}
                              </motion.div>
                              
                              <div className="text-gray-600 text-xs font-mono">{i}</div>
                          </div>
                      ))}
                  </div>
              </div>
          );
      }

      // 12. TREE ALGO RENDERER
      if (['tree_diameter', 'tree_centroid', 'tree_center', 'tree_dp', 'tree_knapsack'].includes(topic!)) {
           // Reuse Graph Renderer above effectively, but keeping this block structure for safety if needed specific tree visuals
            return (
              <div className="relative w-full h-full">
                  <svg className="w-full h-full" viewBox="0 0 800 400">
                       {graphEdges.map((e, i) => {
                          const u = graphNodes.find(n => n.id === e.u);
                          const v = graphNodes.find(n => n.id === e.v);
                          if (!u || !v) return null; // Safety check
                          return <line key={i} x1={u.x} y1={u.y} x2={v.x} y2={v.y} stroke={colors.edge} strokeWidth="2" />
                      })}
                      {graphNodes.map(n => (
                          <g key={n.id}>
                              <circle 
                                cx={n.x} cy={n.y} r={22} 
                                fill={activeNodeId === n.id ? (highlightType === 'visiting' ? '#f59e0b' : highlightType === 'fail' ? '#ef4444' : '#10b981') : colors.nodeFill} 
                                stroke={activeNodeId === n.id ? '#fff' : '#10b981'} 
                                strokeWidth="2" 
                              />
                              <text x={n.x} y={n.y} dy=".3em" textAnchor="middle" fill={colors.text} fontWeight="bold">{n.id}</text>
                              
                              {/* Distance Label for Diameter */}
                              {treeDistances[n.id] !== undefined && (
                                 <text x={n.x+15} y={n.y-25} fontSize="12" fill="#facc15" fontWeight="bold">d:{treeDistances[n.id]}</text>
                              )}

                              {/* DP Values */}
                              {treeDpValues[n.id] && (
                                  <g>
                                      <text x={n.x + 25} y={n.y - 5} fontSize="10" fill="#4ade80">Y:{treeDpValues[n.id].yes}</text>
                                      <text x={n.x + 25} y={n.y + 10} fontSize="10" fill="#f87171">N:{treeDpValues[n.id].no}</text>
                                  </g>
                              )}

                              {/* Centroid Component Sizes */}
                              {treeComponents[n.id] && (
                                  <text x={n.x+20} y={n.y+20} fontSize="12" fill="#38bdf8" fontWeight="bold">sz:{treeComponents[n.id]}</text>
                              )}
                          </g>
                      ))}
                  </svg>
              </div>
           )
      }

      // 13. GENERIC TREE (Seg, Trie, Treap, UF)
      return (
         <svg className="w-full h-full" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid meet">
            {/* ... Existing generic tree render ... */}
            <defs>
               <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
               </filter>
            </defs>
            {/* Edges */}
            {topic === 'segment_tree' && stNodes.map(node => (
                 <g key={`edge-${node.id}`}>
                    {stNodes.find(n => n.id === node.id * 2) && <line x1={node.x} y1={node.y} x2={stNodes.find(n => n.id === node.id * 2)!.x} y2={stNodes.find(n => n.id === node.id * 2)!.y} stroke={colors.edge} strokeWidth="2" />}
                    {stNodes.find(n => n.id === node.id * 2 + 1) && <line x1={node.x} y1={node.y} x2={stNodes.find(n => n.id === node.id * 2 + 1)!.x} y2={stNodes.find(n => n.id === node.id * 2 + 1)!.y} stroke={colors.edge} strokeWidth="2" />}
                 </g>
            ))}
             {topic === 'trie' && trieNodes.map(node => (
                 <g key={`edge-${node.id}`}>
                    {node.children?.map(cid => {
                        const child = trieNodes.find(n => n.id === cid);
                        if(child) return <line key={cid} x1={node.x} y1={node.y} x2={child.x} y2={child.y} stroke={colors.edge} strokeWidth="2" />
                        return null;
                    })}
                 </g>
            ))}

            {/* Nodes */}
            {(topic === 'segment_tree' ? stNodes : (topic === 'trie' ? trieNodes : (topic === 'balanced_tree' ? treapNodes : []))).map(node => (
                <g key={node.id}>
                    <circle 
                        cx={node.x} cy={node.y} r={topic === 'segment_tree' ? 22 : 20} 
                        fill={activeNodeId === node.id ? (highlightType === 'visiting' ? '#f59e0b' : highlightType === 'found' ? '#10b981' : highlightType === 'pushdown' ? '#8b5cf6' : '#3b82f6') : colors.nodeFill}
                        stroke={node.lazy ? '#ec4899' : (activeNodeId === node.id ? '#fff' : colors.nodeStroke)} 
                        strokeWidth={node.lazy ? 3 : 2}
                        className="transition-colors duration-300"
                    />
                    <text x={node.x} y={node.y} dy=".3em" textAnchor="middle" fill={colors.text} fontSize="12" fontWeight="bold">{node.value}</text>
                    
                    {/* Segment Tree Range Label */}
                    {topic === 'segment_tree' && (
                        <text x={node.x} y={node.y + 35} textAnchor="middle" fill={colors.textMuted} fontSize="10">
                            [{stNodes.find(n=>n.id===node.id)?.left || 0}, {stNodes.find(n=>n.id===node.id)?.right || 0}]
                        </text>
                    )}
                    
                    {/* Lazy Tag Badge */}
                    {topic === 'segment_tree' && node.lazy !== 0 && (
                        <g>
                           <circle cx={node.x + 15} cy={node.y - 15} r={8} fill="#ec4899" />
                           <text x={node.x + 15} y={node.y - 12} textAnchor="middle" fontSize="8" fill="white" fontWeight="bold">L</text>
                        </g>
                    )}
                </g>
            ))}
         </svg>
      );
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      <div className="w-full lg:w-1/3 space-y-4">
        <div className="bg-dark-lighter p-4 rounded-xl border border-gray-700 shadow-lg">
          <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
            <Play className="w-5 h-5" /> 控制台 
          </h3>
          <div className="space-y-6">
             {renderControls()}
             {resultMessage && <div className="p-3 bg-gray-900 rounded border border-gray-700 text-sm text-green-400">{resultMessage}</div>}
             <div className="bg-gray-900/50 p-2 rounded text-xs text-gray-500 max-h-32 overflow-y-auto font-mono">
                {logs.map((l, i) => <div key={i}>{l.message}</div>)}
             </div>
             <button onClick={handleReset} className="w-full border border-gray-600 hover:bg-gray-700 text-gray-300 py-2 rounded flex items-center justify-center gap-2 transition">
               <RotateCcw className="w-4 h-4" /> 重置 (Reset)
             </button>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-dark-lighter rounded-xl border border-gray-700 shadow-2xl overflow-hidden flex flex-col">
         <div className="flex-1 flex flex-row overflow-hidden relative min-h-0">
            <div className="flex-1 relative overflow-hidden bg-gradient-to-br from-dark-lighter to-dark/50">
                {renderCanvas()}
            </div>
            
            {/* Vertical Stack Sidebar for DFS & Recursion */}
            {(topic?.startsWith('dfs') || topic?.startsWith('recursion')) && (
                <div className="w-40 border-l border-gray-700 bg-black/20 flex flex-col shrink-0">
                    <div className="p-3 bg-gray-800/50 border-b border-gray-700 font-bold text-xs text-gray-400 text-center uppercase tracking-wider flex items-center justify-center gap-2">
                        <Layers className="w-4 h-4" /> 递归栈
                    </div>
                    <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar relative flex flex-col">
                        <AnimatePresence mode="popLayout" initial={false}>
                            {/* Reverse to show Top at Top */}
                            {[...queueState].reverse().map((item, i) => (
                                <motion.div
                                    key={`${item}-${queueState.length - 1 - i}`}
                                    layout
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20, scale: 0.9 }}
                                    className="bg-purple-600/20 border border-purple-500 text-purple-200 p-2.5 rounded-md text-center text-sm font-mono shadow-sm flex items-center justify-center relative group shrink-0"
                                >
                                    <span className="z-10">{item}</span>
                                    {i === 0 && (
                                        <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full"></div>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            )}
         </div>
          {/* Bottom Queue Bar for non-stack algorithms */}
          {!topic?.startsWith('dfs') && !topic?.startsWith('recursion') && renderQueue()}
      </div>
    </div>
  );
};

export default Visualizer;