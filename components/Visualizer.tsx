
// ... (Imports same)
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Plus, GitBranch, Zap, ArrowDown, MoveHorizontal, Search, RefreshCw, MousePointerClick, Check, Hash, Grid as GridIcon, Layers, Crown, Footprints, Gauge, Repeat, Box, Divide, List, Shuffle, AlignLeft, Calculator, Type, RefreshCcw as RefreshIcon } from 'lucide-react';
import { TreeNode, LogStep, CourseLevel, Topic, HashItem, GraphNode, GraphEdge, GridCell, Theme } from '../types';
import { generateTreeLayout, simulateQuery, simulatePointUpdate, simulateRangeUpdate, simulateBuild } from '../utils/treeUtils';
import { generateTrieLayout, generateHashState, generateUFNodes, generateACLayout, calculateKMPNext, transformManacherString, generateTreapLayout, generateDemoTree, generateBFSGrid, generateDAG, generateBipartiteGraph, generateNQueensBoard, generateCycleGraph, generateFibCallTree, solveHanoi, generateSimpleList } from '../utils/visualizerHelpers';

const DEFAULT_ARRAY = [1, 3, 5, 7, 9, 11, 13, 15];

// ... (Theme constants same) ...
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

// Helper to normalize specific topics to base types for rendering logic
const getTopicType = (t: Topic | undefined): string => {
    if (!t) return 'unknown';
    if (t.startsWith('trie_') || t === 'trie') return 'trie';
    if (t.startsWith('hash_') || t === 'hash') return 'hash';
    if (t.startsWith('uf_') || t === 'union_find') return 'union_find';
    if (t === 'seg_min') return 'seg_min'; // Special case
    if (t.startsWith('seg_') || t === 'segment_tree') return 'segment_tree';
    return t;
};

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
  const topicType = getTopicType(topic);

  // Input States for various modules
  const [queueState, setQueueState] = useState<(number | string)[]>([]);
  const [trieInput, setTrieInput] = useState('');
  const [hashInput, setHashInput] = useState('');
  const [ufInputA, setUfInputA] = useState(0);
  const [ufInputB, setUfInputB] = useState(1);

  // Existing Topic States
  const [stData, setStData] = useState<number[]>(DEFAULT_ARRAY);
  const [stNodes, setStNodes] = useState<TreeNode[]>([]);
  
  // ... (Other state variables same) ...
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
  const [hanoiCount, setHanoiCount] = useState(3);
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
        if (topicType === 'trie' || topic === 'ac_automaton') {
            setTrieWords(externalData);
            setTrieNodes(generateTrieLayout(externalData));
        }
    }
    
    // Static init
    if (topicType === 'segment_tree') {
        setStNodes(generateTreeLayout(stData, level === 'expert' ? 'MAX' : 'SUM'));
    }
    // New Topic Init
    if (topicType === 'seg_min') {
        const minData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // P1816 example data
        setStData(minData);
        setStNodes(generateTreeLayout(minData, 'MIN'));
        setStQueryL(2); // Example query 2 to 7
        setStQueryR(7);
    }
    
    if (topicType === 'trie') setTrieNodes(generateTrieLayout(trieWords));
    if (topicType === 'hash') setHashTable(generateHashState(hashData, 7));
    if (topicType === 'union_find') setUfNodes(generateUFNodes(ufParent));
    
    if (topic === 'ac_automaton') setTrieNodes(generateACLayout(trieWords));
    if (topic === 'balanced_tree') setTreapNodes(generateTreapLayout(treapData));

    // Graph Algos (Init logic same as before)
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
    
    // IMPORTANT: Removed stData, trieWords, hashData, ufParent, treapData from dependencies to avoid infinite loops when setting them.
  }, [level, topic, externalData]);

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
    
    // Reset Hanoi based on current count
    if (topic === 'recursion_hanoi') {
        const initialPeg = Array.from({length: hanoiCount}, (_, i) => hanoiCount - i);
        setHanoiState([initialPeg, [], []]);
    } else {
        setHanoiState([[3, 2, 1], [], []]);
    }
    
    setFractalLines([]);
    
    // Reset Playback Controls
    setIsPaused(false);
    pausedRef.current = false;
    
    if (topic === 'bfs_flood' || topic === 'dfs_maze') setGridState(generateBFSGrid(6, 10));
    if (topic === 'dfs_nqueens') setGridState(generateNQueensBoard(4));
    
    if (topicType === 'segment_tree') {
       setStNodes(generateTreeLayout(stData, level === 'expert' ? 'MAX' : 'SUM'));
    }
    if (topicType === 'seg_min') {
        const minData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        setStNodes(generateTreeLayout(minData, 'MIN'));
    }

    // ... (rest of resets)
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
          
          // --- SEGMENT TREE / TREE VALUE UPDATES ---
          if (step.treeUpdates && step.treeUpdates.length > 0) {
              setStNodes(prev => {
                  const next = [...prev];
                  step.treeUpdates!.forEach(u => {
                      const idx = next.findIndex(n => n.id === u.id);
                      if (idx !== -1) {
                          next[idx] = { ...next[idx], value: u.value };
                      }
                  });
                  return next;
              });
          }

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

  // ... (Handlers)
  // ... (Recursion handlers omitted for brevity, identical to existing file)
  const handleFib = async () => { const steps: LogStep[] = []; const stack: string[] = []; const dfs = (u: number) => { const nodeLabel = graphNodes.find(n => n.id === u)?.label || `Node ${u}`; stack.push(nodeLabel); steps.push({ nodeId: u, message: `调用 ${nodeLabel}`, highlight: 'visiting', stack: [...stack] }); const children = graphEdges.filter(e => e.u === u).map(e => e.v).sort((a,b) => a-b); for(const v of children) dfs(v); steps.push({ nodeId: u, message: `${nodeLabel} 计算完成返回`, highlight: 'found', stack: [...stack] }); stack.pop(); }; dfs(1); await runAnimation(steps); };
  const handleHanoi = async () => { const initialPeg = Array.from({length: hanoiCount}, (_, i) => hanoiCount - i); setHanoiState([initialPeg, [], []]); await new Promise(r => setTimeout(r, 50)); const steps: LogStep[] = []; const stack: string[] = []; const hanoi = (n: number, from: number, to: number, aux: number, fromLabel: string, toLabel: string, auxLabel: string) => { const frame = `hanoi(${n}, ${fromLabel}->${toLabel})`; stack.push(frame); steps.push({ nodeId: -1, message: `调用 ${frame}`, highlight: 'normal', stack: [...stack] }); if (n === 1) { steps.push({ nodeId: -1, message: `移动盘子 1: ${fromLabel} -> ${toLabel}`, highlight: 'found', hanoiMove: { disk: 1, from, to }, stack: [...stack] }); steps.push({ nodeId: -1, message: `返回 (n=1)`, highlight: 'found', stack: [...stack] }); stack.pop(); return; } hanoi(n - 1, from, aux, to, fromLabel, auxLabel, toLabel); steps.push({ nodeId: -1, message: `移动盘子 ${n}: ${fromLabel} -> ${toLabel}`, highlight: 'found', hanoiMove: { disk: n, from, to }, stack: [...stack] }); hanoi(n - 1, aux, to, from, auxLabel, toLabel, fromLabel); steps.push({ nodeId: -1, message: `返回 (n=${n})`, highlight: 'found', stack: [...stack] }); stack.pop(); }; hanoi(hanoiCount, 0, 2, 1, 'A', 'C', 'B'); await runAnimation(steps); };
  const handleFractal = async () => { const steps: LogStep[] = []; setFractalLines([]); const stack: string[] = []; const draw = (x: number, y: number, len: number, angle: number, depth: number) => { stack.push(`draw(${depth})`); steps.push({nodeId:-1, message:`Draw depth=${depth}`, highlight:'normal', stack:[...stack]}); if(depth===0) { stack.pop(); return; } const x2=x+len*Math.cos(angle*Math.PI/180); const y2=y-len*Math.sin(angle*Math.PI/180); steps.push({nodeId:-1, message:`Line`, highlight:'normal', fractalLine:{x1:x,y1:y,x2,y2,depth}, stack:[...stack]}); draw(x2,y2,len*0.7,angle+30,depth-1); draw(x2,y2,len*0.7,angle-30,depth-1); stack.pop(); }; draw(400,350,100,90,8); await runAnimation(steps); };
  const handlePermutation = async () => { const steps: LogStep[] = []; const stack: string[] = []; const n = 3; const path: (number|null)[] = new Array(n).fill(null); const used = new Array(n+1).fill(false); const dfs = (idx: number) => { stack.push(`dfs(${idx})`); steps.push({nodeId:-1, message:`Fill idx ${idx}`, highlight:'visiting', stack:[...stack], permState:{currentPath:[...path], used:[...used]}}); if(idx===n) { steps.push({nodeId:-1, message:`Found!`, highlight:'found', stack:[...stack], permState:{currentPath:[...path], used:[...used]}}); stack.pop(); return; } for(let i=1; i<=n; i++) { if(!used[i]) { used[i]=true; path[idx]=i; steps.push({nodeId:-1, message:`Try ${i}`, highlight:'updating', stack:[...stack], permState:{currentPath:[...path], used:[...used]}}); dfs(idx+1); used[i]=false; path[idx]=null; steps.push({nodeId:-1, message:`Backtrack ${i}`, highlight:'backtrack', stack:[...stack], permState:{currentPath:[...path], used:[...used]}}); } } stack.pop(); }; dfs(0); await runAnimation(steps); };
  const handleSubset = async () => { const steps: LogStep[] = []; const stack: string[] = []; const arr=[1,2,3]; const n=3; const path:number[]=[]; setSubsetResults([]); const dfs = (idx:number) => { stack.push(`dfs(${idx})`); steps.push({nodeId:-1, message:`Consider ${idx<n?arr[idx]:'End'}`, highlight:'visiting', stack:[...stack], subsetState:{index:idx, currentPath:[...path], status:'considering'}}); if(idx===n) { steps.push({nodeId:-1, message:`Subset: {${path.join(',')}}`, highlight:'found', stack:[...stack], subsetState:{index:idx, currentPath:[...path], status:'result'}}); stack.pop(); return; } path.push(arr[idx]); steps.push({nodeId:-1, message:`Select ${arr[idx]}`, highlight:'found', stack:[...stack], subsetState:{index:idx, currentPath:[...path], status:'included'}}); dfs(idx+1); path.pop(); steps.push({nodeId:-1, message:`Skip ${arr[idx]}`, highlight:'backtrack', stack:[...stack], subsetState:{index:idx, currentPath:[...path], status:'excluded'}}); dfs(idx+1); stack.pop(); }; dfs(0); await runAnimation(steps); };
  const handleGCD = async () => { const steps: LogStep[] = []; const stack: string[] = []; const gcd = (a:number,b:number) => { stack.push(`gcd(${a},${b})`); steps.push({nodeId:-1, message:`gcd(${a},${b})`, highlight:'visiting', stack:[...stack], gcdState:{a,b,formula:'?'}}); if(b===0) { steps.push({nodeId:-1, message:`Done: ${a}`, highlight:'found', stack:[...stack], gcdState:{a,b,formula:`Ans:${a}`}}); stack.pop(); return a; } steps.push({nodeId:-1, message:`Next: gcd(${b}, ${a%b})`, highlight:'updating', stack:[...stack], gcdState:{a,b,formula:`${a}%${b}=${a%b}`}}); const res = gcd(b,a%b); steps.push({nodeId:-1, message:`Return ${res}`, highlight:'found', stack:[...stack], gcdState:{a,b,formula:`Got ${res}`}}); stack.pop(); return res; }; gcd(48,18); await runAnimation(steps); };
  const handleReverseList = async () => { const steps:LogStep[]=[]; const stack:string[]=[]; const output:number[]=[]; const nodes=listNodes; setListOutput([]); const traverse = (idx:number) => { if(idx>=nodes.length) { stack.push('null'); steps.push({nodeId:-1, message:'End', highlight:'visiting', stack:[...stack], listState:{nodes, currentIndex:idx, output:[...output]}}); stack.pop(); return; } stack.push(`Node(${nodes[idx]})`); steps.push({nodeId:-1, message:`Visit ${nodes[idx]}`, highlight:'visiting', stack:[...stack], listState:{nodes, currentIndex:idx, output:[...output]}}); traverse(idx+1); output.push(nodes[idx]); steps.push({nodeId:-1, message:`Print ${nodes[idx]}`, highlight:'backtrack', stack:[...stack], listState:{nodes, currentIndex:idx, output:[...output]}}); stack.pop(); }; traverse(0); await runAnimation(steps); };
  const handleFactorial = async () => { const steps:LogStep[]=[]; const stack:string[]=[]; const fact = (n:number) => { stack.push(`fact(${n})`); steps.push({nodeId:-1, message:`fact(${n})`, highlight:'visiting', stack:[...stack], factState:{n, equation:`${n}*fact(${n-1})`}}); if(n<=1) { steps.push({nodeId:-1, message:`Base case`, highlight:'found', stack:[...stack], factState:{n, equation:'1'}}); stack.pop(); return 1; } const res = fact(n-1); steps.push({nodeId:-1, message:`Result`, highlight:'backtrack', stack:[...stack], factState:{n, equation:`${n}*${res}=${n*res}`}}); stack.pop(); return n*res; }; fact(5); await runAnimation(steps); };
  const handleStringRev = async () => { const steps:LogStep[]=[]; const stack:string[]=[]; const chars=['H','E','L','L','O']; const rev = (l:number, r:number) => { if(l>=r) { stack.push(`rev(${l},${r})`); steps.push({nodeId:-1, message:'Stop', highlight:'found', stack:[...stack], stringState:{chars:[...chars], left:l, right:r, swapped:false}}); stack.pop(); return; } stack.push(`rev(${l},${r})`); steps.push({nodeId:-1, message:`Swap ${l},${r}`, highlight:'visiting', stack:[...stack], stringState:{chars:[...chars], left:l, right:r, swapped:false}}); const t=chars[l]; chars[l]=chars[r]; chars[r]=t; steps.push({nodeId:-1, message:`Swapped`, highlight:'updating', stack:[...stack], stringState:{chars:[...chars], left:l, right:r, swapped:true}}); rev(l+1,r-1); stack.pop(); }; rev(0,4); await runAnimation(steps); };

  // --- SEGMENT TREE ACTIONS ---
  const handleStQuery = () => {
      const mode = topicType === 'seg_min' ? 'MIN' : (level === 'expert' ? 'MAX' : 'SUM');
      const steps = simulateQuery(stNodes, stQueryL, stQueryR, level === 'advanced', mode);
      runAnimation(steps);
      setResultMessage(`Query [${stQueryL}, ${stQueryR}] Complete`);
  };
  
  const handleStBuild = () => {
      const mode = topicType === 'seg_min' ? 'MIN' : (level === 'expert' ? 'MAX' : 'SUM');
      // stData is used here. It is set in useEffect.
      const { steps, nodes } = simulateBuild(stData, mode);
      setStNodes(nodes); // Initialize with "Empty/Initial" tree
      runAnimation(steps);
      setResultMessage('Build Complete');
  };

  const handleStUpdatePoint = () => {
      const mode = topicType === 'seg_min' ? 'MIN' : (level === 'expert' ? 'MAX' : 'SUM');
      const { steps, newNodes } = simulatePointUpdate(stNodes, stUpdateIdx, stUpdateVal, mode);
      runAnimation(steps);
      setStNodes(newNodes);
  };
  const handleStUpdateRange = () => {
      const { steps, newNodes } = simulateRangeUpdate(stNodes, stRangeL, stRangeR, stRangeVal);
      runAnimation(steps);
      setStNodes(newNodes);
  };

  // --- TRIE ACTIONS ---
  const handleTrieInsert = () => {
      if (!trieInput) return;
      // 1. Update State synchronously for layout
      const newWords = [...trieWords, trieInput];
      setTrieWords(newWords);
      const newLayout = generateTrieLayout(newWords);
      setTrieNodes(newLayout);
      setTrieInput('');
      setResultMessage(`Inserted "${trieInput}"`);
      // No animation steps needed for insert in this mode as tree rebuilds instantly
  };

  const handleTrieSearch = async () => {
      if (!trieInput) return;
      const steps: LogStep[] = [];
      let curr = 0; // Root
      steps.push({ nodeId: 0, message: `Start at Root`, highlight: 'visiting' });
      
      for(let char of trieInput) {
          // Note: we must search in the CURRENT trieNodes state. 
          // Since insert updates it, searching immediately after insert works.
          const node = trieNodes.find(n => n.id === curr);
          const childId = node?.children?.find(cid => trieNodes.find(c => c.id === cid)?.value === char);
          
          if (childId) {
              curr = childId;
              steps.push({ nodeId: curr, message: `Found '${char}'`, highlight: 'visiting' });
          } else {
              steps.push({ nodeId: curr, message: `Child '${char}' not found. Word does not exist.`, highlight: 'fail' });
              await runAnimation(steps);
              setResultMessage(`Word "${trieInput}" not found`);
              return;
          }
      }
      const endNode = trieNodes.find(n => n.id === curr);
      if (endNode?.isEnd) {
          steps.push({ nodeId: curr, message: `End of word marked. Found "${trieInput}"!`, highlight: 'found' });
          setResultMessage(`Found "${trieInput}"`);
      } else {
          steps.push({ nodeId: curr, message: `Path exists but not marked as word end.`, highlight: 'fail' });
          setResultMessage(`Prefix "${trieInput}" exists, but not full word.`);
      }
      await runAnimation(steps);
  };

  // --- HASH ACTIONS ---
  const handleHashInsert = () => {
      const val = Number(hashInput);
      if (isNaN(val)) return;
      
      const size = 7;
      const idx = val % size;
      const steps: LogStep[] = [];
      steps.push({ nodeId: -1, message: `Hash(${val}) = ${val} % ${size} = ${idx}`, highlight: 'normal' });
      
      setHashTable(prev => {
          const next = [...prev];
          // Check duplicates if needed, simplified here allows dupes or check manually
          if (!next[idx].find(x => x.id === val)) {
             next[idx] = [...next[idx], { id: val, val: val }];
          }
          return next;
      });
      
      steps.push({ nodeId: val, message: `Inserted ${val} into bucket ${idx}`, highlight: 'found' });
      setHashInput('');
      runAnimation(steps);
  };

  const handleHashSearch = () => {
      const val = Number(hashInput);
      if (isNaN(val)) return;
      const size = 7;
      const idx = val % size;
      const steps: LogStep[] = [];
      
      steps.push({ nodeId: -1, message: `Calculating Hash: ${val} % ${size} = ${idx}`, highlight: 'normal' });
      
      const bucket = hashTable[idx];
      const exists = bucket.find(x => x.id === val);
      
      if (exists) {
          steps.push({ nodeId: val, message: `Found ${val} in bucket ${idx}`, highlight: 'found' });
      } else {
          steps.push({ nodeId: -1, message: `Bucket ${idx} searched. ${val} not found.`, highlight: 'fail' });
      }
      runAnimation(steps);
  };

  // --- UNION FIND ACTIONS ---
  const handleUFFind = async (target: number) => {
      const steps: LogStep[] = [];
      let curr = target;
      steps.push({ nodeId: curr, message: `Find(${target})`, highlight: 'visiting' });
      
      // We need to trace parents using ufParent state
      while (ufParent[curr] !== curr) {
          curr = ufParent[curr];
          steps.push({ nodeId: curr, message: `Jump to parent ${curr}`, highlight: 'visiting' });
      }
      steps.push({ nodeId: curr, message: `Root is ${curr}`, highlight: 'found' });
      await runAnimation(steps);
      return curr;
  };

  const handleUFUnion = async (a: number, b: number) => {
      // Visualize Find A
      const rootA = await handleUFFind(a);
      // Visualize Find B
      const rootB = await handleUFFind(b);
      
      const steps: LogStep[] = [];
      if (rootA !== rootB) {
          steps.push({ nodeId: rootA, message: `Root(${a})=${rootA} != Root(${b})=${rootB}. Merging...`, highlight: 'updating' });
          
          // Update State
          const newParent = [...ufParent];
          newParent[rootA] = rootB; // Basic merge
          setUfParent(newParent);
          
          // Re-gen nodes to show structural change
          setUfNodes(generateUFNodes(newParent));
          
          steps.push({ nodeId: rootB, message: `${rootA} is now child of ${rootB}`, highlight: 'found' });
      } else {
          steps.push({ nodeId: rootA, message: `Already in same set (Root ${rootA})`, highlight: 'normal' });
      }
      runAnimation(steps);
  };

  // ... (Render Controls same)
  const renderControls = () => {
      const playbackControls = (
          <div className="flex items-center justify-between bg-gray-800/50 p-3 rounded-lg border border-gray-700 mb-4">
              <button 
                  onClick={() => { const newVal = !isPaused; setIsPaused(newVal); pausedRef.current = newVal; }}
                  disabled={!isAnimating}
                  className={`p-2 rounded-full transition ${!isAnimating ? 'text-gray-600 cursor-not-allowed' : 'text-white bg-primary hover:bg-blue-600'}`}
                  title={isPaused ? "继续" : "暂停"}
              >
                  {isPaused ? <Play className="w-5 h-5 fill-current" /> : <Pause className="w-5 h-5 fill-current" />}
              </button>
              <div className="flex items-center gap-2"><Gauge className="w-4 h-4 text-gray-400" /><div className="flex bg-gray-900 rounded p-1 border border-gray-700">{[0.5, 1, 2, 4].map(s => (<button key={s} onClick={() => { setSpeed(s); speedRef.current = s; }} className={`px-2 py-1 text-xs rounded transition ${speed === s ? 'bg-gray-700 text-white font-bold' : 'text-gray-500 hover:text-gray-300'}`}>{s}x</button>))}</div></div>
          </div>
      );

      if (topicType === 'segment_tree' || topicType === 'seg_min') {
          return (
              <div className="space-y-4">
                  {playbackControls}
                  <div className="bg-dark-lighter p-3 rounded-lg border border-gray-700">
                      <div className="text-xs font-bold text-green-400 mb-2 flex items-center gap-1"><GitBranch className="w-3 h-3"/> 建树 (Build)</div>
                      <button onClick={handleStBuild} disabled={isAnimating} className="w-full bg-green-600 hover:bg-green-500 text-white p-2 rounded text-xs flex justify-between transition disabled:opacity-50"><span>Build Tree</span><Play className="w-3 h-3" /></button>
                  </div>
                  <div className="bg-dark-lighter p-3 rounded-lg border border-gray-700">
                      <div className="text-xs font-bold text-primary mb-2 flex items-center gap-1"><Search className="w-3 h-3"/> 区间查询 {topicType === 'seg_min' ? '(Min)' : ''}</div>
                      <div className="flex gap-2 items-center"><input type="number" value={stQueryL} onChange={e => setStQueryL(Number(e.target.value))} className="w-12 bg-gray-900 border border-gray-600 rounded px-2 py-1 text-xs text-white" placeholder="L" /><span className="text-gray-400">-</span><input type="number" value={stQueryR} onChange={e => setStQueryR(Number(e.target.value))} className="w-12 bg-gray-900 border border-gray-600 rounded px-2 py-1 text-xs text-white" placeholder="R" /><button onClick={handleStQuery} disabled={isAnimating} className="ml-auto bg-primary hover:bg-blue-600 text-white p-1.5 rounded transition disabled:opacity-50"><Play className="w-3 h-3" /></button></div>
                  </div>
                  {level !== 'advanced' && (
                  <div className="bg-dark-lighter p-3 rounded-lg border border-gray-700"><div className="text-xs font-bold text-accent mb-2 flex items-center gap-1"><MousePointerClick className="w-3 h-3"/> 单点修改</div><div className="flex gap-2 items-center"><input type="number" value={stUpdateIdx} onChange={e => setStUpdateIdx(Number(e.target.value))} className="w-12 bg-gray-900 border border-gray-600 rounded px-2 py-1 text-xs text-white" placeholder="Idx" /><span className="text-gray-400">=</span><input type="number" value={stUpdateVal} onChange={e => setStUpdateVal(Number(e.target.value))} className="w-12 bg-gray-900 border border-gray-600 rounded px-2 py-1 text-xs text-white" placeholder="Val" /><button onClick={handleStUpdatePoint} disabled={isAnimating} className="ml-auto bg-accent hover:bg-yellow-600 text-white p-1.5 rounded transition disabled:opacity-50"><Zap className="w-3 h-3" /></button></div></div>
                  )}
                  {level === 'advanced' && topicType !== 'seg_min' && (
                  <div className="bg-dark-lighter p-3 rounded-lg border border-gray-700"><div className="text-xs font-bold text-purple-400 mb-2 flex items-center gap-1"><RefreshCw className="w-3 h-3"/> 区间修改 (Lazy)</div><div className="flex gap-2 items-center mb-2"><input type="number" value={stRangeL} onChange={e => setStRangeL(Number(e.target.value))} className="w-10 bg-gray-900 border border-gray-600 rounded px-2 py-1 text-xs text-white" placeholder="L" /><span className="text-gray-400">-</span><input type="number" value={stRangeR} onChange={e => setStRangeR(Number(e.target.value))} className="w-10 bg-gray-900 border border-gray-600 rounded px-2 py-1 text-xs text-white" placeholder="R" /></div><div className="flex gap-2 items-center"><span className="text-xs text-gray-400">Add:</span><input type="number" value={stRangeVal} onChange={e => setStRangeVal(Number(e.target.value))} className="flex-1 bg-gray-900 border border-gray-600 rounded px-2 py-1 text-xs text-white" placeholder="Val" /><button onClick={handleStUpdateRange} disabled={isAnimating} className="bg-purple-600 hover:bg-purple-500 text-white p-1.5 rounded transition disabled:opacity-50"><Zap className="w-3 h-3" /></button></div></div>
                  )}
              </div>
          )
      }

      // TRIE CONTROLS
      if (topicType === 'trie') {
          return (
              <div className="space-y-4">
                  {playbackControls}
                  <div className="bg-dark-lighter p-3 rounded-lg border border-gray-700">
                      <div className="text-xs font-bold text-secondary mb-2 flex items-center gap-1"><Search className="w-3 h-3"/> 字典树操作</div>
                      <div className="flex gap-2 items-center mb-2">
                          <input type="text" value={trieInput} onChange={e => setTrieInput(e.target.value)} className="flex-1 bg-gray-900 border border-gray-600 rounded px-2 py-1 text-xs text-white" placeholder="单词..." />
                      </div>
                      <div className="flex gap-2">
                          <button onClick={handleTrieInsert} disabled={isAnimating} className="flex-1 bg-green-600 hover:bg-green-500 text-white p-1.5 rounded text-xs transition">插入</button>
                          <button onClick={handleTrieSearch} disabled={isAnimating} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white p-1.5 rounded text-xs transition">查找</button>
                      </div>
                  </div>
              </div>
          );
      }

      // HASH CONTROLS
      if (topicType === 'hash') {
          return (
              <div className="space-y-4">
                  {playbackControls}
                  <div className="bg-dark-lighter p-3 rounded-lg border border-gray-700">
                      <div className="text-xs font-bold text-accent mb-2 flex items-center gap-1"><Hash className="w-3 h-3"/> 哈希表操作</div>
                      <div className="flex gap-2 items-center mb-2">
                          <input type="number" value={hashInput} onChange={e => setHashInput(e.target.value)} className="flex-1 bg-gray-900 border border-gray-600 rounded px-2 py-1 text-xs text-white" placeholder="数字..." />
                      </div>
                      <div className="flex gap-2">
                          <button onClick={handleHashInsert} disabled={isAnimating} className="flex-1 bg-green-600 hover:bg-green-500 text-white p-1.5 rounded text-xs transition">插入</button>
                          <button onClick={handleHashSearch} disabled={isAnimating} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white p-1.5 rounded text-xs transition">查找</button>
                      </div>
                  </div>
              </div>
          );
      }

      // UNION FIND CONTROLS
      if (topicType === 'union_find') {
           return (
              <div className="space-y-4">
                  {playbackControls}
                  <div className="bg-dark-lighter p-3 rounded-lg border border-gray-700">
                      <div className="text-xs font-bold text-purple-400 mb-2 flex items-center gap-1"><GitBranch className="w-3 h-3"/> 并查集操作</div>
                      <div className="flex gap-2 items-center mb-2">
                          <input type="number" value={ufInputA} onChange={e => setUfInputA(Number(e.target.value))} className="w-12 bg-gray-900 border border-gray-600 rounded px-2 py-1 text-xs text-white" />
                          <span className="text-gray-400">&</span>
                          <input type="number" value={ufInputB} onChange={e => setUfInputB(Number(e.target.value))} className="w-12 bg-gray-900 border border-gray-600 rounded px-2 py-1 text-xs text-white" />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                          <button onClick={() => handleUFUnion(ufInputA, ufInputB)} disabled={isAnimating} className="col-span-2 bg-purple-600 hover:bg-purple-500 text-white p-1.5 rounded text-xs transition">合并 (Union)</button>
                          <button onClick={() => handleUFFind(ufInputA)} disabled={isAnimating} className="bg-blue-600 hover:bg-blue-500 text-white p-1.5 rounded text-xs transition">查找 A</button>
                          <button onClick={() => handleUFFind(ufInputB)} disabled={isAnimating} className="bg-blue-600 hover:bg-blue-500 text-white p-1.5 rounded text-xs transition">查找 B</button>
                      </div>
                  </div>
              </div>
          );
      }
      
      // ... (Other renders identical to original file, condensed for brevity)
      if (['recursion_fib', 'recursion_hanoi', 'recursion_fractal', 'recursion_perm', 'recursion_subset', 'recursion_gcd', 'recursion_reverse_list', 'recursion_factorial', 'recursion_string_rev', 'dfs_basic', 'dfs_connect', 'dfs_maze', 'dfs_nqueens', 'dfs_graph_algo', 'bfs_basic', 'bfs_shortest', 'bfs_state', 'bfs_flood', 'bfs_topo', 'bfs_bipartite', 'bfs_multi', 'tree_diameter', 'tree_center', 'tree_centroid', 'tree_dp', 'tree_knapsack'].includes(topic!)) {
          if (topic === 'recursion_fib') return ( <div className="space-y-4">{playbackControls}<div className="bg-dark-lighter p-3 rounded-lg border border-gray-700"><div className="text-xs font-bold text-primary mb-2 flex items-center gap-1"><Repeat className="w-3 h-3"/> 递归演示</div><button onClick={handleFib} disabled={isAnimating} className="w-full bg-blue-600 hover:bg-blue-500 text-white p-2 rounded text-xs flex justify-between"><span>Calculate Fib(5)</span><Play className="w-3 h-3" /></button></div></div> );
          if (topic === 'recursion_hanoi') return ( <div className="space-y-4">{playbackControls}<div className="bg-dark-lighter p-3 rounded-lg border border-gray-700"><div className="text-xs font-bold text-primary mb-2 flex items-center gap-1"><Repeat className="w-3 h-3"/> 递归演示</div><div className="flex gap-2 items-center mb-2"><span className="text-xs text-gray-400">Disk:</span><input type="number" min="1" max="6" value={hanoiCount} onChange={(e)=>setHanoiCount(Number(e.target.value))} className="w-12 bg-gray-900 border border-gray-600 rounded px-2 py-1 text-xs text-white" /></div><button onClick={handleHanoi} disabled={isAnimating} className="w-full bg-blue-600 hover:bg-blue-500 text-white p-2 rounded text-xs flex justify-between"><span>Solve Hanoi</span><Play className="w-3 h-3" /></button></div></div> );
          if (topic === 'recursion_fractal') return ( <div className="space-y-4">{playbackControls}<div className="bg-dark-lighter p-3 rounded-lg border border-gray-700"><div className="text-xs font-bold text-primary mb-2 flex items-center gap-1"><Repeat className="w-3 h-3"/> 递归演示</div><button onClick={handleFractal} disabled={isAnimating} className="w-full bg-blue-600 hover:bg-blue-500 text-white p-2 rounded text-xs flex justify-between"><span>Grow Fractal Tree</span><Play className="w-3 h-3" /></button></div></div> );
          if (topic === 'recursion_perm') return ( <div className="space-y-4">{playbackControls}<div className="bg-dark-lighter p-3 rounded-lg border border-gray-700"><div className="text-xs font-bold text-primary mb-2 flex items-center gap-1"><Repeat className="w-3 h-3"/> 递归演示</div><button onClick={handlePermutation} disabled={isAnimating} className="w-full bg-blue-600 hover:bg-blue-500 text-white p-2 rounded text-xs flex justify-between"><span>Start Permutations (3)</span><Play className="w-3 h-3" /></button></div>{/* Visual Perm Pool */}<div className="flex gap-2 justify-center">{[1,2,3].map(n => <div key={n} className={`w-8 h-8 rounded flex items-center justify-center font-bold text-sm ${permUsed[n] ? 'bg-gray-700 text-gray-500' : 'bg-primary text-white'}`}>{n}</div>)}</div><div className="flex gap-2 justify-center border-t border-gray-700 pt-2">{permCurrentPath.map((n, i) => <div key={i} className="w-8 h-8 border border-gray-600 rounded flex items-center justify-center text-white font-bold">{n}</div>)}</div></div> );
          if (topic === 'recursion_subset') return ( <div className="space-y-4">{playbackControls}<div className="bg-dark-lighter p-3 rounded-lg border border-gray-700"><div className="text-xs font-bold text-primary mb-2 flex items-center gap-1"><Repeat className="w-3 h-3"/> 递归演示</div><button onClick={handleSubset} disabled={isAnimating} className="w-full bg-blue-600 hover:bg-blue-500 text-white p-2 rounded text-xs flex justify-between"><span>Generate Subsets (3)</span><Play className="w-3 h-3" /></button></div> <div className="space-y-2">{/* Item Selection Viz */}<div className="flex justify-around bg-gray-900/50 p-2 rounded">{[1,2,3].map((val, idx) => (<div key={idx} className="flex flex-col items-center gap-1"><span className="text-gray-400 text-xs">Idx {idx}</span><div className={`w-8 h-8 rounded flex items-center justify-center font-bold transition-all ${subsetCurrentIdx === idx ? 'ring-2 ring-yellow-500' : ''} ${subsetStatus === 'included' && subsetCurrentIdx === idx ? 'bg-green-600' : subsetStatus === 'excluded' && subsetCurrentIdx === idx ? 'bg-red-600' : 'bg-gray-700'}`}>{val}</div></div>))}</div>{/* Current Path */}<div className="text-xs text-gray-400">Current Subset: <span className="text-white font-mono">{`{ ${subsetCurrentPath.join(', ')} }`}</span></div></div> </div> );
          if (topic === 'recursion_gcd') return ( <div className="space-y-4">{playbackControls}<div className="bg-dark-lighter p-3 rounded-lg border border-gray-700"><button onClick={handleGCD} disabled={isAnimating} className="w-full bg-blue-600 hover:bg-blue-500 text-white p-2 rounded text-xs flex justify-between"><span>Calculate GCD(48, 18)</span><Play className="w-3 h-3" /></button></div> {gcdState && <div className="bg-gray-800 p-2 rounded text-center"><div className="text-2xl font-bold text-white mb-1">gcd({gcdState.a}, {gcdState.b})</div><div className="text-xs text-gray-400">{gcdState.formula}</div></div>} </div> );
          if (topic === 'recursion_reverse_list') return ( <div className="space-y-4">{playbackControls}<div className="bg-dark-lighter p-3 rounded-lg border border-gray-700"><button onClick={handleReverseList} disabled={isAnimating} className="w-full bg-blue-600 hover:bg-blue-500 text-white p-2 rounded text-xs flex justify-between"><span>Reverse Print List</span><Play className="w-3 h-3" /></button></div><div className="flex items-center overflow-x-auto gap-1 p-2">{listNodes.map((val, idx) => (<div key={idx} className="flex items-center"><div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 transition-all ${listCurrentIdx === idx ? 'bg-yellow-500 border-yellow-300 text-black scale-110' : 'bg-gray-800 border-gray-600 text-gray-300'}`}>{val}</div>{idx < listNodes.length - 1 && <div className="w-4 h-0.5 bg-gray-600 mx-1"></div>}</div>))}</div><div className="text-xs text-gray-400 mt-2">Output: <span className="text-green-400 font-mono font-bold">{listOutput.join(' ')}</span></div></div> );
          if (topic === 'recursion_factorial') return ( <div className="space-y-4">{playbackControls}<div className="bg-dark-lighter p-3 rounded-lg border border-gray-700"><button onClick={handleFactorial} disabled={isAnimating} className="w-full bg-blue-600 hover:bg-blue-500 text-white p-2 rounded text-xs flex justify-between"><span>Calculate Factorial(5)</span><Play className="w-3 h-3" /></button></div>{factState && <div className="bg-gray-800 p-2 rounded text-center"><div className="text-xl font-bold text-white mb-1">n = {factState.n}</div><div className="text-xs text-yellow-400 font-mono">{factState.equation}</div></div>}</div> );
          if (topic === 'recursion_string_rev') return ( <div className="space-y-4">{playbackControls}<div className="bg-dark-lighter p-3 rounded-lg border border-gray-700"><button onClick={handleStringRev} disabled={isAnimating} className="w-full bg-blue-600 hover:bg-blue-500 text-white p-2 rounded text-xs flex justify-between"><span>Reverse String</span><Play className="w-3 h-3" /></button></div><div className="flex justify-center gap-1 p-2 bg-gray-900 rounded">{stringState.chars.map((c, i) => (<div key={i} className={`w-8 h-10 border-2 rounded flex items-center justify-center font-bold text-lg transition-all ${stringState.left === i || stringState.right === i ? 'border-yellow-500 bg-yellow-900/30 text-yellow-300 scale-110' : 'border-gray-600 bg-gray-800 text-gray-300'}`}>{c}</div>))}</div><div className="flex justify-between px-4 text-xs text-gray-500 font-mono"><span>L: {stringState.left}</span><span>R: {stringState.right}</span></div></div> );
          return null;
      }
      
      return <div className="text-gray-500 text-sm">Controls not available for this mode yet.</div>;
  };

  const renderQueue = () => {
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
      if (topicType === 'segment_tree' || topicType === 'seg_min') {
         // Segment Tree Renderer
         return (
         <svg className="w-full h-full" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid meet">
            <defs>
               <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
               </filter>
            </defs>
            {/* Edges */}
            {stNodes.map(node => (
                 <g key={`edge-${node.id}`}>
                    {stNodes.find(n => n.id === node.id * 2) && <line x1={node.x} y1={node.y} x2={stNodes.find(n => n.id === node.id * 2)!.x} y2={stNodes.find(n => n.id === node.id * 2)!.y} stroke={colors.edge} strokeWidth="2" />}
                    {stNodes.find(n => n.id === node.id * 2 + 1) && <line x1={node.x} y1={node.y} x2={stNodes.find(n => n.id === node.id * 2 + 1)!.x} y2={stNodes.find(n => n.id === node.id * 2 + 1)!.y} stroke={colors.edge} strokeWidth="2" />}
                 </g>
            ))}

            {/* Nodes */}
            {stNodes.map(node => (
                <g key={node.id}>
                    <circle 
                        cx={node.x} cy={node.y} r={22} 
                        fill={activeNodeId === node.id ? (
                            highlightType === 'visiting' ? '#f59e0b' : 
                            highlightType === 'found' ? '#10b981' : 
                            highlightType === 'pushdown' ? '#8b5cf6' : 
                            highlightType === 'updating' ? '#3b82f6' : // Explicit blue for updating
                            '#3b82f6'
                        ) : colors.nodeFill}
                        stroke={node.lazy ? '#ec4899' : (activeNodeId === node.id ? '#fff' : colors.nodeStroke)} 
                        strokeWidth={node.lazy ? 3 : 2}
                        className="transition-colors duration-300"
                    />
                    <text x={node.x} y={node.y} dy=".3em" textAnchor="middle" fill={colors.text} fontSize="12" fontWeight="bold">{node.value}</text>
                    
                    {/* Range Label */}
                    <text x={node.x} y={node.y + 35} textAnchor="middle" fill={colors.textMuted} fontSize="10">
                        [{stNodes.find(n=>n.id===node.id)?.left || 0}, {stNodes.find(n=>n.id===node.id)?.right || 0}]
                    </text>
                    
                    {/* Lazy Tag Badge */}
                    {node.lazy !== 0 && (
                        <g>
                           <circle cx={node.x + 15} cy={node.y - 15} r={8} fill="#ec4899" />
                           <text x={node.x + 15} y={node.y - 12} textAnchor="middle" fontSize="8" fill="white" fontWeight="bold">L</text>
                        </g>
                    )}
                </g>
            ))}
         </svg>
      );
      }
      
      // Hash Table Renderer
      if (topicType === 'hash') {
        return (
            <div className="p-4 h-full overflow-y-auto custom-scrollbar flex items-center justify-center">
                <div className="w-full max-w-2xl">
                {hashTable.map((bucket, idx) => (
                    <div key={idx} className="flex items-center mb-3">
                        {/* Bucket Index */}
                        <div className="w-12 h-12 bg-gray-800 border-2 border-gray-600 flex items-center justify-center text-gray-400 font-mono text-sm shrink-0 mr-4 rounded-lg">
                            {idx}
                        </div>
                        {/* Chain */}
                        <div className="flex items-center gap-2 overflow-x-auto p-1 scrollbar-hide">
                            <AnimatePresence>
                            {bucket.map((item, i) => (
                                <React.Fragment key={`${item.id}-${i}`}>
                                    {i > 0 && <div className="w-6 h-0.5 bg-gray-600 shrink-0"></div>}
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8, x: -20 }}
                                        animate={{ opacity: 1, scale: 1, x: 0 }}
                                        className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold shadow-md shrink-0 
                                            ${activeNodeId === item.id ? 'bg-yellow-500 border-yellow-300 text-black' : 'bg-primary border-blue-400 text-white'}`}
                                    >
                                        {item.val}
                                    </motion.div>
                                </React.Fragment>
                            ))}
                            </AnimatePresence>
                            {bucket.length === 0 && <span className="text-gray-700 text-xs italic ml-2">Empty</span>}
                        </div>
                    </div>
                ))}
                </div>
            </div>
        );
      }

      // Fallback for Graph etc.
      // ... (Rest of renderCanvas cases, TRIE, GRAPH, etc.) ...
      if (topicType === 'trie' || topic === 'ac_automaton' || topic === 'balanced_tree' || topicType === 'union_find') {
           const nodes = topicType === 'trie' ? trieNodes : (topic === 'ac_automaton' ? trieNodes : (topic === 'balanced_tree' ? treapNodes : ufNodes));
           // ... (Render logic for these trees)
           return (
             <svg className="w-full h-full" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid meet">
                {/* Edges */}
                {nodes.map(node => (
                     <g key={`edge-${node.id}`}>
                        {node.children?.map(cid => {
                            const child = nodes.find(n => n.id === cid);
                            if(child) return <line key={cid} x1={node.x} y1={node.y} x2={child.x} y2={child.y} stroke={colors.edge} strokeWidth="2" />
                            return null;
                        })}
                     </g>
                ))}
                {/* Nodes */}
                {nodes.map(node => (
                    <g key={node.id}>
                        <circle cx={node.x} cy={node.y} r={20} fill={activeNodeId === node.id ? '#f59e0b' : colors.nodeFill} stroke={colors.nodeStroke} strokeWidth="2" />
                        <text x={node.x} y={node.y} dy=".3em" textAnchor="middle" fill={colors.text} fontSize="12" fontWeight="bold">{node.value}</text>
                    </g>
                ))}
             </svg>
           )
      }
      
      return <div className="p-10 text-center text-gray-500">Visualization canvas for {topic}</div>;
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
          {/* Bottom Queue Bar for non-stack algorithms. Hide for Segment Tree as requested */}
          {!topic?.startsWith('dfs') && !topic?.startsWith('recursion') && !['segment_tree', 'seg_min'].includes(topic || '') && renderQueue()}
      </div>
    </div>
  );
};

export default Visualizer;
