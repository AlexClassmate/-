import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, Search, Edit3 } from 'lucide-react';
import { TreeNode, LogStep } from '../types';
import { generateTreeLayout, simulateQuery, simulateUpdate } from '../utils/treeUtils';

const DEFAULT_ARRAY = [1, 3, 5, 7, 9, 11, 13, 15];

const Visualizer: React.FC = () => {
  const [data, setData] = useState<number[]>(DEFAULT_ARRAY);
  const [treeNodes, setTreeNodes] = useState<TreeNode[]>([]);
  const [logs, setLogs] = useState<LogStep[]>([]);
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
  const [highlightType, setHighlightType] = useState<string>('');
  
  // Inputs
  const [queryL, setQueryL] = useState(0);
  const [queryR, setQueryR] = useState(7);
  const [updateIdx, setUpdateIdx] = useState(2);
  const [updateVal, setUpdateVal] = useState(99);
  
  const [isAnimating, setIsAnimating] = useState(false);
  const [resultMessage, setResultMessage] = useState<string>('');

  useEffect(() => {
    setTreeNodes(generateTreeLayout(data));
  }, [data]);

  const runAnimation = async (steps: LogStep[], finalNodes?: TreeNode[]) => {
    setIsAnimating(true);
    setResultMessage('');
    
    for (const step of steps) {
      setActiveNodeId(step.nodeId);
      setHighlightType(step.highlight);
      setLogs(prev => [step, ...prev].slice(0, 5)); // Keep last 5 logs
      
      // Delay for visual effect
      await new Promise(r => setTimeout(r, 800));
    }

    if (finalNodes) {
      setTreeNodes(finalNodes);
      // Update the base data array to match the new leaves
      const newLeaves = finalNodes
        .filter(n => n.left === n.right)
        .sort((a, b) => a.left - b.left)
        .map(n => n.value);
      setData(newLeaves);
    }

    setActiveNodeId(null);
    setHighlightType('');
    setIsAnimating(false);
  };

  const handleQuery = () => {
    if (isAnimating) return;
    const steps = simulateQuery(treeNodes, queryL, queryR);
    runAnimation(steps);
    
    // Calculate actual sum for display
    let sum = 0;
    for(let i=queryL; i<=queryR; i++) sum += data[i];
    setTimeout(() => setResultMessage(`查询结果 (Sum): ${sum}`), steps.length * 800);
  };

  const handleUpdate = () => {
    if (isAnimating) return;
    const { steps, newNodes } = simulateUpdate(treeNodes, updateIdx, updateVal);
    runAnimation(steps, newNodes);
  };

  const handleReset = () => {
    setData(DEFAULT_ARRAY);
    setLogs([]);
    setResultMessage('');
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Left: Controls & Logs */}
      <div className="w-full lg:w-1/3 space-y-4">
        <div className="bg-dark-lighter p-4 rounded-xl border border-gray-700 shadow-lg">
          <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
            <Play className="w-5 h-5" /> 控制台
          </h3>
          
          <div className="space-y-6">
            {/* Query Control */}
            <div className="space-y-2">
              <label className="text-sm text-gray-400 font-semibold flex items-center gap-2">
                <Search className="w-4 h-4" /> 区间查询 (Sum)
              </label>
              <div className="flex gap-2">
                <input 
                  type="number" min="0" max="7" 
                  value={queryL} onChange={(e) => setQueryL(Number(e.target.value))}
                  className="w-full bg-dark border border-gray-600 rounded px-3 py-2 focus:border-primary outline-none transition"
                  placeholder="L"
                />
                <span className="self-center">-</span>
                <input 
                  type="number" min="0" max="7"
                  value={queryR} onChange={(e) => setQueryR(Number(e.target.value))}
                  className="w-full bg-dark border border-gray-600 rounded px-3 py-2 focus:border-primary outline-none transition"
                  placeholder="R"
                />
                <button 
                  onClick={handleQuery}
                  disabled={isAnimating}
                  className="bg-primary hover:bg-blue-600 disabled:opacity-50 text-white px-4 py-2 rounded font-bold transition"
                >
                  查询
                </button>
              </div>
            </div>

            {/* Update Control */}
            <div className="space-y-2">
              <label className="text-sm text-gray-400 font-semibold flex items-center gap-2">
                <Edit3 className="w-4 h-4" /> 单点更新
              </label>
              <div className="flex gap-2">
                <input 
                  type="number" min="0" max="7"
                  value={updateIdx} onChange={(e) => setUpdateIdx(Number(e.target.value))}
                  className="w-full bg-dark border border-gray-600 rounded px-3 py-2 focus:border-primary outline-none transition"
                  placeholder="Index"
                />
                <input 
                  type="number"
                  value={updateVal} onChange={(e) => setUpdateVal(Number(e.target.value))}
                  className="w-full bg-dark border border-gray-600 rounded px-3 py-2 focus:border-primary outline-none transition"
                  placeholder="Value"
                />
                <button 
                  onClick={handleUpdate}
                  disabled={isAnimating}
                  className="bg-accent hover:bg-yellow-600 disabled:opacity-50 text-white px-4 py-2 rounded font-bold transition"
                >
                  更新
                </button>
              </div>
            </div>

            <button 
              onClick={handleReset}
              className="w-full border border-gray-600 hover:bg-gray-700 text-gray-300 py-2 rounded flex items-center justify-center gap-2 transition"
            >
              <RotateCcw className="w-4 h-4" /> 重置数组
            </button>
          </div>
        </div>

        {/* Logs Console */}
        <div className="bg-black p-4 rounded-xl border border-gray-800 h-64 overflow-hidden flex flex-col font-mono text-sm">
          <div className="text-gray-500 mb-2 border-b border-gray-800 pb-1">System Logs...</div>
          <div className="flex-1 overflow-y-auto space-y-2">
             <AnimatePresence>
              {logs.map((log, i) => (
                <motion.div 
                  key={`${log.nodeId}-${i}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-2 rounded border-l-2 ${
                    log.highlight === 'visiting' ? 'border-blue-500 bg-blue-900/20 text-blue-200' :
                    log.highlight === 'found' ? 'border-green-500 bg-green-900/20 text-green-200' :
                    log.highlight === 'updating' ? 'border-yellow-500 bg-yellow-900/20 text-yellow-200' :
                    'border-purple-500 bg-purple-900/20 text-purple-200'
                  }`}
                >
                  <span className="font-bold mr-2">Node {log.nodeId}:</span>
                  {log.message}
                </motion.div>
              ))}
            </AnimatePresence>
            {resultMessage && (
               <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 bg-secondary/20 border border-secondary text-secondary font-bold rounded text-center mt-2"
              >
                {resultMessage}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Right: SVG Visualizer */}
      <div className="flex-1 bg-dark-lighter rounded-xl border border-gray-700 shadow-2xl overflow-hidden relative">
        <div className="absolute top-4 left-4 text-gray-400 text-sm">
          Visualization Area (Array Size: 8)
        </div>
        <svg className="w-full h-full" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid meet">
          <defs>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          
          {/* Edges */}
          {treeNodes.map(node => {
             const leftChild = treeNodes.find(n => n.id === node.id * 2);
             const rightChild = treeNodes.find(n => n.id === node.id * 2 + 1);
             return (
               <g key={`edges-${node.id}`}>
                 {leftChild && (
                   <line 
                    x1={node.x} y1={node.y} x2={leftChild.x} y2={leftChild.y} 
                    stroke="#475569" strokeWidth="2"
                   />
                 )}
                 {rightChild && (
                   <line 
                    x1={node.x} y1={node.y} x2={rightChild.x} y2={rightChild.y} 
                    stroke="#475569" strokeWidth="2"
                   />
                 )}
               </g>
             );
          })}

          {/* Nodes */}
          {treeNodes.map(node => {
            const isActive = activeNodeId === node.id;
            let fillColor = "#1e293b"; // Default slate
            let strokeColor = "#94a3b8";
            
            if (isActive) {
               if (highlightType === 'visiting') { strokeColor = "#3b82f6"; fillColor = "#1d4ed8"; } // Blue
               if (highlightType === 'found') { strokeColor = "#10b981"; fillColor = "#059669"; } // Green
               if (highlightType === 'partial') { strokeColor = "#a855f7"; fillColor = "#7e22ce"; } // Purple
               if (highlightType === 'updating') { strokeColor = "#f59e0b"; fillColor = "#d97706"; } // Orange
            }

            return (
              <g key={node.id} className="transition-all duration-300">
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={22}
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth={isActive ? 3 : 2}
                  filter={isActive ? "url(#glow)" : ""}
                  className="transition-colors duration-300"
                />
                <text
                  x={node.x}
                  y={node.y}
                  dy=".3em"
                  textAnchor="middle"
                  fill="#fff"
                  fontSize="12"
                  fontWeight="bold"
                  className="select-none pointer-events-none"
                >
                  {node.value}
                </text>
                {/* ID Label (small) */}
                <text
                  x={node.x}
                  y={node.y - 30}
                  textAnchor="middle"
                  fill="#64748b"
                  fontSize="10"
                >
                  #{node.id}
                </text>
                {/* Range Label (small) */}
                <text
                   x={node.x}
                   y={node.y + 35}
                   textAnchor="middle"
                   fill="#94a3b8"
                   fontSize="10"
                >
                  [{node.left}, {node.right}]
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default Visualizer;
