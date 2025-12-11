

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, Plus, GitBranch, Zap, ArrowDown, MoveHorizontal, Search, RefreshCw, MousePointerClick, Check, Hash, Grid as GridIcon, Layers } from 'lucide-react';
import { TreeNode, LogStep, CourseLevel, Topic, HashItem, GraphNode, GraphEdge, GridCell, Theme } from '../types';
import { generateTreeLayout, simulateQuery, simulatePointUpdate, simulateRangeUpdate } from '../utils/treeUtils';
import { generateTrieLayout, generateHashState, generateUFNodes, generateACLayout, calculateKMPNext, transformManacherString, generateTreapLayout, generateDemoTree, generateBFSGrid, generateDAG, generateBipartiteGraph } from '../utils/visualizerHelpers';

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
  
  const colors = VIS_THEME[theme];

  // NEW: Queue State for Visualization
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
  
  // BFS Grid State
  const [gridState, setGridState] = useState<GridCell[][]>([]);
  const [gridColorMap, setGridColorMap] = useState<Record<string, string>>({}); // "r-c" -> color

  // Tree Algo State
  const [treeDistances, setTreeDistances] = useState<Record<number, number>>({});
  const [treeFarthestNode, setTreeFarthestNode] = useState<number | null>(null);
  const [treeDpValues, setTreeDpValues] = useState<Record<number, {no:number, yes:number}>>({});
  const [treeComponents, setTreeComponents] = useState<Record<number, number>>({});
  const [treeCentroidInput, setTreeCentroidInput] = useState(1);
  const [nodeColors, setNodeColors] = useState<Record<number, string>>({}); // For Bipartite/Topo

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
    if (['tree_diameter', 'tree_centroid', 'tree_center', 'tree_dp', 'tree_knapsack', 'bfs_basic', 'bfs_shortest', 'bfs_state', 'bfs_multi'].includes(topic!)) {
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
    } else if (topic === 'bfs_flood') {
        setGridState(generateBFSGrid(6, 10));
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
    }
    
  }, [level, topic, externalData, stData, trieWords, hashData, ufParent, treapData]);

  const handleReset = () => {
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
    setQueueState([]); // Reset queue
    if (topic === 'bfs_flood') setGridState(generateBFSGrid(6, 10));
    if (topic === 'segment_tree') {
       setStNodes(generateTreeLayout(stData, level === 'expert' ? 'MAX' : 'SUM'));
    }
    if (topic === 'bfs_multi') {
        setNodeColors({1: '#ef4444', 6: '#ef4444'});
    }
  };

  const runAnimation = async (steps: LogStep[]) => {
      setIsAnimating(true);
      setLogs([]);
      for (let i = 0; i < steps.length; i++) {
          const step = steps[i];
          setActiveNodeId(step.nodeId);
          setHighlightType(step.highlight);
          
          if (step.queue) {
              setQueueState(step.queue);
          }
          
          // Custom handlers for specific BFS visual updates
          if (topic === 'bfs_flood' && typeof step.nodeId === 'string') {
               setGridColorMap(prev => ({...prev, [step.nodeId as string]: step.highlight === 'visiting' ? '#f59e0b' : '#3b82f6'}));
          }
          if (topic === 'bfs_topo' && step.highlight === 'found') {
               setNodeColors(prev => ({...prev, [Number(step.nodeId)]: '#10b981'}));
          }
           if (topic === 'bfs_bipartite') {
              // message usually contains "Color x Black"
              const color = step.message.includes('黑色') ? '#1f2937' : '#f3f4f6';
              setNodeColors(prev => ({...prev, [Number(step.nodeId)]: color}));
          }

          setLogs(prev => [...prev, step]);
          await new Promise(r => setTimeout(r, 600));
      }
      setIsAnimating(false);
      if(onAnimationComplete) onAnimationComplete();
  };

  // --- BFS HANDLERS ---
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
                          const nr = currR + dr, nc = currC + dc;
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
      if (topic === 'bfs_basic' || topic === 'bfs_shortest' || topic === 'bfs_state' || topic === 'bfs_multi') {
           return (
              <div className="space-y-4">
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

      if (['mst', 'shortest_path', 'tarjan', 'diff_constraints'].includes(topic!)) {
          return <div className="text-gray-400 text-sm italic p-2 border border-dashed border-gray-700 rounded">Experiments available in Lecture Mode steps.</div>
      }
      
      return <div className="text-gray-500 text-sm">Controls not available for this mode yet.</div>;
  };

  const renderCanvas = () => {
      // 1. MANACHER & KMP Placeholders (assumed managed by lecture steps mainly)
      if (topic === 'manacher') return <div className="p-4 text-center text-gray-500">Manacher Visuals Active in Lecture</div>;
      if (topic === 'kmp') return <div className="p-4 text-center text-gray-500">KMP Visuals Active in Lecture</div>;

      const queueVisual = (
        <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-md rounded-lg p-3 border border-gray-600 shadow-xl overflow-hidden z-20">
            <div className="flex justify-between items-center mb-2">
                <div className="text-xs text-gray-400 font-mono uppercase tracking-wider flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-green-500"></div>
                   队列 (Queue) [Front → Rear]
                </div>
                <span className="text-xs text-gray-500">{queueState.length} items</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar min-h-[30px] items-center">
                <AnimatePresence mode="popLayout">
                {queueState.map((item, i) => (
                    <motion.div 
                        key={`${item}-${i}`} // Use index to ensure uniqueness for duplicate values if any
                        layout
                        initial={{ opacity: 0, scale: 0.8, x: 20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: -20 }}
                        className="bg-gray-800 border border-gray-600 text-white px-3 py-1.5 rounded text-xs font-mono font-bold shrink-0 shadow-sm"
                    >
                        {item}
                    </motion.div>
                ))}
                </AnimatePresence>
                {queueState.length === 0 && <span className="text-gray-600 text-xs italic ml-1">Empty</span>}
            </div>
        </div>
      );

      // 2. GRID RENDERER (Flood Fill)
      if (topic === 'bfs_flood') {
          return (
             <div className="relative w-full h-full">
                 <svg className="w-full h-full" viewBox="0 0 800 400">
                     {gridState.map((row, r) => row.map((cell, c) => (
                         <rect 
                            key={`${r}-${c}`}
                            x={100 + c * 40}
                            y={50 + r * 40}
                            width={35}
                            height={35}
                            fill={cell.type === 'obstacle' ? colors.gridObstacle : (gridColorMap[`${r}-${c}`] || colors.gridLand)}
                            stroke={colors.edge}
                            rx={4}
                         />
                     )))}
                 </svg>
                 {queueVisual}
             </div>
          )
      }

      // 3. GRAPH RENDERER
      if (['mst', 'shortest_path', 'tarjan', 'diff_constraints', 'bfs_basic', 'bfs_shortest', 'bfs_state', 'bfs_topo', 'bfs_bipartite', 'bfs_multi'].includes(topic!)) {
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
                                 cx={n.x} cy={n.y} r={22} 
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
                  {/* Show Queue only for BFS Modules */}
                  {topic?.startsWith('bfs') && queueVisual}
              </div>
          );
      }

      // 4. TREE ALGO RENDERER
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
                  {topic === 'tree_diameter' && queueVisual}
              </div>
           )
      }

      // 5. GENERIC TREE (Seg, Trie, Treap, UF)
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

      <div className="flex-1 bg-dark-lighter rounded-xl border border-gray-700 shadow-2xl overflow-hidden relative">
         {renderCanvas()}
      </div>
    </div>
  );
};

export default Visualizer;
