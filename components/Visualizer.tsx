import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, Search, Edit3, Layers, BarChart2 } from 'lucide-react';
import { TreeNode, LogStep, CourseLevel } from '../types';
import { generateTreeLayout, simulateQuery, simulatePointUpdate, simulateRangeUpdate } from '../utils/treeUtils';

const DEFAULT_ARRAY = [1, 3, 5, 7, 9, 11, 13, 15];

interface Props {
  level: CourseLevel;
}

const Visualizer: React.FC<Props> = ({ level }) => {
  const [data, setData] = useState<number[]>(DEFAULT_ARRAY);
  const [treeNodes, setTreeNodes] = useState<TreeNode[]>([]);
  const [logs, setLogs] = useState<LogStep[]>([]);
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
  const [highlightType, setHighlightType] = useState<string>('');
  
  // Inputs
  const [queryL, setQueryL] = useState(0);
  const [queryR, setQueryR] = useState(7);
  const [updateIdx, setUpdateIdx] = useState(2);
  const [updateVal, setUpdateVal] = useState(20);
  const [rangeUpdateL, setRangeUpdateL] = useState(1);
  const [rangeUpdateR, setRangeUpdateR] = useState(4);
  const [rangeUpdateVal, setRangeUpdateVal] = useState(2);
  
  const [isAnimating, setIsAnimating] = useState(false);
  const [resultMessage, setResultMessage] = useState<string>('');

  const mode = level === 'expert' ? 'MAX' : 'SUM';

  // Reset when level changes
  useEffect(() => {
    handleReset();
  }, [level]);

  useEffect(() => {
    setTreeNodes(generateTreeLayout(data, mode));
  }, [data, mode]);

  const runAnimation = async (steps: LogStep[], finalNodes?: TreeNode[]) => {
    setIsAnimating(true);
    setResultMessage('');
    
    for (const step of steps) {
      setActiveNodeId(step.nodeId);
      setHighlightType(step.highlight);
      setLogs(prev => [step, ...prev].slice(0, 5));
      
      await new Promise(r => setTimeout(r, 800));
    }

    if (finalNodes) {
      setTreeNodes(finalNodes);
    }

    setActiveNodeId(null);
    setHighlightType('');
    setIsAnimating(false);
  };

  const handleQuery = () => {
    if (isAnimating) return;
    const steps = simulateQuery(treeNodes, queryL, queryR, level === 'advanced', mode);
    runAnimation(steps);
    
    // Calculate expected result for display
    let res = 0;
    if (mode === 'SUM') {
       res = 0;
       for(let i=queryL; i<=queryR; i++) res += data[i];
    } else {
       res = -Infinity;
       for(let i=queryL; i<=queryR; i++) res = Math.max(res, data[i]);
    }
    
    setTimeout(() => setResultMessage(`${mode === 'SUM' ? '求和' : '最大值'}结果: ${res}`), steps.length * 800);
  };

  const handlePointUpdate = () => {
    if (isAnimating) return;
    const { steps, newNodes } = simulatePointUpdate(treeNodes, updateIdx, updateVal, mode);
    // Sync data for point update
    const newData = [...data];
    newData[updateIdx] = updateVal;
    setData(newData);
    runAnimation(steps, newNodes);
  };

  const handleRangeUpdate = () => {
    if (isAnimating) return;
    if (level === 'expert') {
        alert("本演示的高阶模式主要展示 RMQ 的查询逻辑。区间修改请参考进阶篇。");
        return;
    }
    const { steps, newNodes } = simulateRangeUpdate(treeNodes, rangeUpdateL, rangeUpdateR, rangeUpdateVal);
    // Note: data sync for range update with lazy is complex for visualization array, we rely on treeNodes
    runAnimation(steps, newNodes);
  };

  const handleReset = () => {
    setData(DEFAULT_ARRAY);
    setTreeNodes(generateTreeLayout(DEFAULT_ARRAY, mode));
    setLogs([]);
    setResultMessage('');
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Left: Controls */}
      <div className="w-full lg:w-1/3 space-y-4">
        <div className="bg-dark-lighter p-4 rounded-xl border border-gray-700 shadow-lg">
          <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
            <Play className="w-5 h-5" /> 控制台 
            <span className="text-sm bg-gray-800 px-2 py-0.5 rounded text-gray-400">
               {level === 'basic' ? '基础: SUM' : level === 'advanced' ? '进阶: Lazy SUM' : '高阶: MAX'}
            </span>
          </h3>
          
          <div className="space-y-6">
            {/* Query Control */}
            <div className="space-y-2">
              <label className="text-sm text-gray-400 font-semibold flex items-center gap-2">
                <Search className="w-4 h-4" /> 区间查询 ({mode})
              </label>
              <div className="flex gap-2">
                <input 
                  type="number" min="0" max="7" 
                  value={queryL} onChange={(e) => setQueryL(Number(e.target.value))}
                  className="w-full bg-dark border border-gray-600 rounded px-3 py-2 focus:border-primary outline-none"
                  placeholder="L"
                />
                <span className="self-center">-</span>
                <input 
                  type="number" min="0" max="7"
                  value={queryR} onChange={(e) => setQueryR(Number(e.target.value))}
                  className="w-full bg-dark border border-gray-600 rounded px-3 py-2 focus:border-primary outline-none"
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

            {/* Basic & Expert: Point Update */}
            {(level === 'basic' || level === 'expert') && (
            <div className="space-y-2">
              <label className="text-sm text-gray-400 font-semibold flex items-center gap-2">
                <Edit3 className="w-4 h-4" /> 单点更新 (Set Value)
              </label>
              <div className="flex gap-2">
                <input 
                  type="number" min="0" max="7"
                  value={updateIdx} onChange={(e) => setUpdateIdx(Number(e.target.value))}
                  className="w-full bg-dark border border-gray-600 rounded px-3 py-2 focus:border-primary outline-none"
                  placeholder="Index"
                />
                <input 
                  type="number"
                  value={updateVal} onChange={(e) => setUpdateVal(Number(e.target.value))}
                  className="w-full bg-dark border border-gray-600 rounded px-3 py-2 focus:border-primary outline-none"
                  placeholder="Value"
                />
                <button 
                  onClick={handlePointUpdate}
                  disabled={isAnimating}
                  className={`disabled:opacity-50 text-white px-4 py-2 rounded font-bold transition ${level === 'expert' ? 'bg-purple-600 hover:bg-purple-500' : 'bg-accent hover:bg-yellow-600'}`}
                >
                  更新
                </button>
              </div>
            </div>
            )}

            {/* Advanced: Range Update */}
            {level === 'advanced' && (
            <div className="space-y-2">
              <label className="text-sm text-yellow-400 font-semibold flex items-center gap-2">
                <Layers className="w-4 h-4" /> 区间更新 (Add Value)
              </label>
              <div className="flex gap-2 mb-2">
                <input 
                  type="number" min="0" max="7" placeholder="L"
                  value={rangeUpdateL} onChange={(e) => setRangeUpdateL(Number(e.target.value))}
                  className="w-1/3 bg-dark border border-gray-600 rounded px-2 py-2 focus:border-yellow-500 outline-none"
                />
                 <span className="self-center">-</span>
                 <input 
                  type="number" min="0" max="7" placeholder="R"
                  value={rangeUpdateR} onChange={(e) => setRangeUpdateR(Number(e.target.value))}
                  className="w-1/3 bg-dark border border-gray-600 rounded px-2 py-2 focus:border-yellow-500 outline-none"
                />
              </div>
              <div className="flex gap-2">
                 <input 
                  type="number" placeholder="Add Val"
                  value={rangeUpdateVal} onChange={(e) => setRangeUpdateVal(Number(e.target.value))}
                  className="w-full bg-dark border border-gray-600 rounded px-3 py-2 focus:border-yellow-500 outline-none"
                />
                <button 
                  onClick={handleRangeUpdate}
                  disabled={isAnimating}
                  className="bg-yellow-600 hover:bg-yellow-500 disabled:opacity-50 text-white px-4 py-2 rounded font-bold transition whitespace-nowrap"
                >
                  区间+
                </button>
              </div>
            </div>
            )}

            <button 
              onClick={handleReset}
              className="w-full border border-gray-600 hover:bg-gray-700 text-gray-300 py-2 rounded flex items-center justify-center gap-2 transition"
            >
              <RotateCcw className="w-4 h-4" /> 重置演示
            </button>
          </div>
        </div>

        {/* Logs */}
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
                    log.highlight === 'pushdown' ? 'border-red-500 bg-red-900/20 text-red-200' :
                    'border-purple-500 bg-purple-900/20 text-purple-200'
                  }`}
                >
                  <span className="font-bold mr-2">#{log.nodeId}:</span>
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

      {/* Visualizer SVG */}
      <div className="flex-1 bg-dark-lighter rounded-xl border border-gray-700 shadow-2xl overflow-hidden relative">
        <svg className="w-full h-full" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid meet">
          <defs>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          
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

          {treeNodes.map(node => {
            const isActive = activeNodeId === node.id;
            let fillColor = "#1e293b";
            let strokeColor = "#94a3b8";
            
            if (isActive) {
               if (highlightType === 'visiting') { strokeColor = "#3b82f6"; fillColor = "#1d4ed8"; }
               if (highlightType === 'found') { strokeColor = "#10b981"; fillColor = "#059669"; }
               if (highlightType === 'partial') { strokeColor = "#a855f7"; fillColor = "#7e22ce"; }
               if (highlightType === 'updating') { strokeColor = "#f59e0b"; fillColor = "#d97706"; }
               if (highlightType === 'pushdown') { strokeColor = "#ef4444"; fillColor = "#b91c1c"; }
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
                
                {/* Lazy Badge (Advanced Only) */}
                {level === 'advanced' && node.lazy !== 0 && (
                  <g>
                     <circle cx={node.x + 18} cy={node.y - 18} r={10} fill="#ef4444" stroke="#fff" strokeWidth="1" />
                     <text x={node.x + 18} y={node.y - 14} textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">
                       {node.lazy}
                     </text>
                  </g>
                )}

                <text x={node.x} y={node.y - 30} textAnchor="middle" fill="#64748b" fontSize="10">
                  #{node.id}
                </text>
                <text x={node.x} y={node.y + 35} textAnchor="middle" fill="#94a3b8" fontSize="10">
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
