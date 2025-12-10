import React, { useState, useEffect } from 'react';
import { ChevronRight, Check, Terminal, ArrowRight } from 'lucide-react';
import { CourseLevel } from '../types';

interface Blank {
  id: number;
  question: string;
  options: { label: string; value: string; isCorrect: boolean }[];
  explanation: string;
}

interface Level {
  id: string;
  title: string;
  description: string;
  codeTemplate: string;
  blanks: Blank[];
}

const BASIC_LEVELS: Level[] = [
  {
    id: 'basics',
    title: '基础一：存储结构',
    description: '线段树基础结构。用数组存储完全二叉树。',
    codeTemplate: `int tree[MAXN * {{0}}]; 

int left_node(int node) { return node * 2; }
int right_node(int node) { return {{1}}; }
`,
    blanks: [
      {
        id: 0,
        question: "线段树数组通常开多大？",
        options: [
          { label: "2倍", value: "2", isCorrect: false },
          { label: "4倍", value: "4", isCorrect: true },
        ],
        explanation: "堆式存储需要4倍空间防止越界。"
      },
      {
        id: 1,
        question: "右孩子索引？",
        options: [
          { label: "node * 2 + 1", value: "node * 2 + 1", isCorrect: true },
          { label: "node + 1", value: "node + 1", isCorrect: false },
        ],
        explanation: "左孩子是2n，右孩子是2n+1。"
      }
    ]
  },
  {
    id: 'build',
    title: '基础二：建树',
    description: '递归建树，Push Up 汇总。',
    codeTemplate: `void build(int node, int start, int end) {
    if ({{0}}) {
        tree[node] = arr[start];
        return;
    }
    // ... recursion ...
    tree[node] = tree[left] + tree[right]; // Push Up
}`,
    blanks: [
      {
        id: 0,
        question: "递归终止条件？",
        options: [
          { label: "start == end", value: "start == end", isCorrect: true },
          { label: "node == 0", value: "node == 0", isCorrect: false },
        ],
        explanation: "左右边界重合时，说明到达叶子节点。"
      }
    ]
  }
];

const ADVANCED_LEVELS: Level[] = [
  {
    id: 'lazy_def',
    title: '进阶一：懒标记',
    description: '定义 Lazy 数组，记录未下发的任务。',
    codeTemplate: `int tree[MAXN * 4];
int lazy[MAXN * {{0}}]; // 懒标记数组

// 下发标记逻辑
void pushDown(int node, int start, int end) {
    if (lazy[node] != 0) {
        // ... 下发逻辑 ...
        lazy[node] = {{1}}; // 清空标记
    }
}`,
    blanks: [
      {
        id: 0,
        question: "懒标记数组大小？",
        options: [
          { label: "同原数组 N", value: "1", isCorrect: false },
          { label: "同线段树 4N", value: "4", isCorrect: true },
        ],
        explanation: "懒标记也是对应到线段树的每个节点的，所以也要 4N。"
      },
      {
        id: 1,
        question: "下发后如何处理当前节点的标记？",
        options: [
          { label: "保持不变", value: "lazy[node]", isCorrect: false },
          { label: "清零", value: "0", isCorrect: true },
        ],
        explanation: "任务已经下发给下属了，自己手里的便利贴当然要撕掉。"
      }
    ]
  },
  {
    id: 'range_update',
    title: '进阶二：区间修改',
    description: 'Update Range 核心逻辑。',
    codeTemplate: `void updateRange(..., int L, int R, int val) {
    if (L <= start && end <= R) {
        tree[node] += val * (end - start + 1);
        lazy[node] += {{0}};
        return;
    }
    pushDown(node, start, end);
    // ... recursion ...
}`,
    blanks: [
      {
        id: 0,
        question: "完全覆盖时，懒标记如何累加？",
        options: [
          { label: "lazy[node] += val", value: "val", isCorrect: true },
          { label: "lazy[node] = val", value: "= val", isCorrect: false },
        ],
        explanation: "是累加（+=），因为可能之前还有没下发的任务，不能直接覆盖。"
      }
    ]
  }
];

interface Props {
  level: CourseLevel;
}

const GuidedCoding: React.FC<Props> = ({ level }) => {
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({}); 
  const [activeBlank, setActiveBlank] = useState<{levelId: string, blankId: number} | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Reset when level changes
  useEffect(() => {
    setCurrentLevelIdx(0);
    setAnswers({});
    setActiveBlank(null);
    setFeedback(null);
  }, [level]);

  const levels = level === 'basic' ? BASIC_LEVELS : ADVANCED_LEVELS;
  const currentLevel = levels[currentLevelIdx];

  const handleSelectOption = (levelId: string, blankId: number, value: string, isCorrect: boolean) => {
    if (isCorrect) {
      setAnswers(prev => ({ ...prev, [`${levelId}-${blankId}`]: value }));
      setFeedback("✅ 正确！" + currentLevel.blanks.find(b => b.id === blankId)?.explanation);
      setActiveBlank(null);
    } else {
      setFeedback("❌ 不对哦，再想想。");
    }
  };

  const isLevelComplete = currentLevel.blanks.every(b => answers[`${currentLevel.id}-${b.id}`]);

  const handleNextLevel = () => {
    if (currentLevelIdx < levels.length - 1) {
      setCurrentLevelIdx(prev => prev + 1);
      setFeedback(null);
      setActiveBlank(null);
    }
  };

  const renderCode = (lvl: Level) => {
    const parts = lvl.codeTemplate.split(/(\{\{\d+\}\})/g);
    return parts.map((part, index) => {
      const match = part.match(/\{\{(\d+)\}\}/);
      if (match) {
        const blankId = parseInt(match[1]);
        const answer = answers[`${lvl.id}-${blankId}`];
        const isActive = activeBlank?.levelId === lvl.id && activeBlank?.blankId === blankId;
        if (answer) return <span key={index} className="text-green-400 font-bold border-b-2 border-green-500 mx-1 px-1">{answer}</span>;
        return (
          <button
            key={index}
            onClick={() => { setActiveBlank({ levelId: lvl.id, blankId }); setFeedback(null); }}
            className={`mx-1 px-3 py-0.5 rounded text-xs font-mono transition-all ${isActive ? 'bg-yellow-500/50 text-white border border-yellow-400 animate-pulse' : 'bg-gray-700 text-gray-300 border border-gray-500 hover:bg-gray-600'}`}
          >
            ???
          </button>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="h-full flex flex-col animate-fade-in gap-4">
      {/* Top Navigation */}
      <div className="flex justify-between items-center bg-dark-lighter p-4 rounded-xl border border-gray-700">
         <div className="flex gap-2 overflow-x-auto">
            {levels.map((lvl, idx) => {
               const isCurrent = idx === currentLevelIdx;
               const isDone = idx < currentLevelIdx;
               return (
                 <div key={lvl.id} className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${isCurrent ? 'bg-primary text-white font-bold' : isDone ? 'bg-green-900/30 text-green-400 border border-green-900' : 'bg-gray-800 text-gray-500'}`}>
                   {isDone && <Check className="w-3 h-3" />}
                   {idx + 1}. {lvl.title}
                 </div>
               )
            })}
         </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
        {/* Interaction Panel */}
        <div className="w-full lg:w-1/3 flex flex-col gap-4">
            <div className="bg-dark-lighter p-6 rounded-xl border border-gray-700 flex-1 flex flex-col">
                <h2 className="text-xl font-bold text-accent mb-2 flex items-center gap-2">
                   <Terminal className="w-5 h-5" />
                   {currentLevel.title}
                </h2>
                <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                   {currentLevel.description}
                </p>

                <div className="flex-1 overflow-y-auto">
                    {activeBlank ? (
                        <div className="animate-slide-in-right">
                           <div className="text-sm font-bold text-white mb-3 p-3 bg-gray-800 rounded border border-gray-600">
                              {currentLevel.blanks.find(b => b.id === activeBlank.blankId)?.question}
                           </div>
                           <div className="space-y-2">
                              {currentLevel.blanks.find(b => b.id === activeBlank.blankId)?.options.map((opt, i) => (
                                <button key={i} onClick={() => handleSelectOption(currentLevel.id, activeBlank.blankId, opt.value, opt.isCorrect)} className="w-full text-left p-3 rounded bg-dark border border-gray-600 hover:border-primary hover:bg-gray-800 transition text-sm text-gray-300">
                                   {opt.label}
                                </button>
                              ))}
                           </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500 text-center gap-2">
                            <ArrowRight className="w-8 h-8 opacity-50" />
                            <p>点击右侧代码 ??? 处答题</p>
                        </div>
                    )}
                </div>

                {feedback && <div className={`mt-4 p-3 rounded text-sm font-bold animate-bounce-in ${feedback.includes('✅') ? 'bg-green-900/30 text-green-400 border border-green-800' : 'bg-red-900/30 text-red-400 border border-red-800'}`}>{feedback}</div>}
                
                {isLevelComplete && currentLevelIdx < levels.length - 1 && (
                    <button onClick={handleNextLevel} className="mt-4 w-full bg-primary hover:bg-blue-600 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition">
                       进入下一关 <ChevronRight className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>

        {/* Code View */}
        <div className="flex-1 bg-[#1e1e1e] rounded-xl border border-gray-700 shadow-2xl overflow-hidden flex flex-col">
            <div className="bg-[#2d2d2d] px-4 py-2 flex items-center gap-2 border-b border-black/20">
               <span className="text-xs text-gray-400 font-mono">editor.cpp</span>
            </div>
            <div className="p-6 font-mono text-sm leading-7 text-gray-300 overflow-auto">
               <pre className="whitespace-pre-wrap">{renderCode(currentLevel)}</pre>
            </div>
        </div>
      </div>
    </div>
  );
};

export default GuidedCoding;
