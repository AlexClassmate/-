import React, { useState } from 'react';
import { ChevronRight, Check, X, Terminal, ArrowRight, RefreshCw } from 'lucide-react';

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

const LEVELS: Level[] = [
  {
    id: 'basics',
    title: '第一关：地基与框架',
    description: '建楼先打地基。线段树是个完全二叉树（虽然后面可能会缺胳膊少腿，但我们按最完美的算）。我们需要一个数组存原始数据，一个数组存树节点。',
    codeTemplate: `#include <iostream>
using namespace std;

const int MAXN = 100005;
int arr[MAXN]; // 工人队列（原始数组）

// 思考：线段树数组 tree[] 需要开多大？
// 提示：二叉树如果不满，数组下标可能会跳跃。
int tree[MAXN * {{0}}]; 

// 辅助函数：快速找亲戚
int left_node(int node) { 
    return node * 2; 
}

int right_node(int node) { 
    // 右孩子通常紧跟在左孩子后面
    return {{1}}; 
}
`,
    blanks: [
      {
        id: 0,
        question: "线段树数组 `tree` 通常需要开多大空间？",
        options: [
          { label: "2倍 (2 * MAXN)", value: "2", isCorrect: false },
          { label: "4倍 (4 * MAXN)", value: "4", isCorrect: true },
        ],
        explanation: "虽然理想满二叉树接近2倍，但在最坏情况（如单链状或最后一层刚开始），堆式存储的下标会达到接近4N的位置。为了不越界，包工头习惯开4倍！"
      },
      {
        id: 1,
        question: "右孩子节点的索引是多少？(当前节点为 node)",
        options: [
          { label: "node * 2 + 1", value: "node * 2 + 1", isCorrect: true },
          { label: "node + 1", value: "node + 1", isCorrect: false },
        ],
        explanation: "完全二叉树的性质：左孩子是 2*node，右孩子自然就是 2*node + 1 啦。"
      }
    ]
  },
  {
    id: 'build',
    title: '第二关：建树 (Build)',
    description: '万丈高楼平地起。Build 过程就是一个递归点名的过程。如果是叶子节点（具体工人），直接记录；如果是管理节点，就汇总手下的业绩。',
    codeTemplate: `// node: 当前节点编号
// start, end: 当前管理的区间范围
void build(int node, int start, int end) {
    // 1. 递归出口：到了叶子节点
    if ({{0}}) {
        tree[node] = arr[start];
        return;
    }

    int mid = (start + end) / 2;
    int left = left_node(node);
    int right = right_node(node);

    // 2. 递归建设下级
    build(left, start, mid);
    build(right, mid + 1, end);

    // 3. Push Up: 汇总业绩
    // 当前节点的值 = 左孩子的值 + 右孩子的值
    tree[node] = {{1}};
}
`,
    blanks: [
      {
        id: 0,
        question: "递归的终止条件（到达叶子节点）是什么？",
        options: [
          { label: "start == end", value: "start == end", isCorrect: true },
          { label: "start > end", value: "start > end", isCorrect: false },
          { label: "node == 0", value: "node == 0", isCorrect: false },
        ],
        explanation: "当区间左端点等于右端点时（例如 [5, 5]），说明我们已经定位到了原数组中的某一个具体元素，这就是叶子节点。"
      },
      {
        id: 1,
        question: "如何汇总（Push Up）左右孩子的区间和？",
        options: [
          { label: "tree[left] + tree[right]", value: "tree[left] + tree[right]", isCorrect: true },
          { label: "max(tree[left], tree[right])", value: "max(tree[left], tree[right])", isCorrect: false },
        ],
        explanation: "因为我们求的是区间和（Sum），所以领导的业绩 = 左下属业绩 + 右下属业绩。如果是求最大值，这里就改成 max()。"
      }
    ]
  },
  {
    id: 'update',
    title: '第三关：单点修改 (Update)',
    description: '比如第 5 号工人吃了菠菜，力气变大了。我们需要找到他，更新他，然后还要通知他的所有上级领导修改业绩记录。',
    codeTemplate: `// idx: 要修改的原数组下标
// val: 修改后的值
void update(int node, int start, int end, int idx, int val) {
    // 1. 找到了目标叶子节点
    if (start == end) {
        tree[node] = val;
        arr[idx] = val;
        return;
    }

    int mid = (start + end) / 2;
    int left = left_node(node);
    int right = right_node(node);

    // 2. 判断去左边找还是去右边找
    if ({{0}}) {
        update(left, start, mid, idx, val);
    } else {
        update(right, mid + 1, end, idx, val);
    }

    // 3. 别忘了更新本级领导的数据
    tree[node] = tree[left] + tree[right];
}
`,
    blanks: [
      {
        id: 0,
        question: "什么情况下应该去左子树（start ~ mid）寻找？",
        options: [
          { label: "idx <= mid", value: "idx <= mid", isCorrect: true },
          { label: "idx > mid", value: "idx > mid", isCorrect: false },
        ],
        explanation: "二分法的基本素养：如果目标下标 idx 比中间点 mid 小（或相等），那肯定在左半区，否则去右半区。"
      }
    ]
  },
  {
    id: 'query',
    title: '第四关：区间查询 (Query)',
    description: '老板要查账了！查询区间 [L, R] 的总和。这需要我们将查询区间拆分成线段树上已有的节点区间。',
    codeTemplate: `// L, R: 目标查询区间
int query(int node, int start, int end, int L, int R) {
    // Case 1: 当前节点区间完全在查询范围之外
    // 例如查询 [1,3]，当前节点是 [5,8]
    if ({{0}}) {
        return 0; // 没关系，返回0
    }

    // Case 2: 当前节点区间完全被包含在查询范围内
    // 例如查询 [1,10]，当前节点是 [2,5]，那直接把 [2,5] 的总和交上去
    if ({{1}}) {
        return tree[node];
    }

    // Case 3: 有部分重叠，需要分裂查询
    int mid = (start + end) / 2;
    int left = left_node(node);
    int right = right_node(node);

    int sum_left = query(left, start, mid, L, R);
    int sum_right = query(right, mid + 1, end, L, R);

    return sum_left + sum_right;
}
`,
    blanks: [
      {
        id: 0,
        question: "如何判断当前区间 [start, end] 完全在查询区间 [L, R] 之外？",
        options: [
          { label: "R < start || L > end", value: "R < start || L > end", isCorrect: true },
          { label: "start < L || end > R", value: "start < L || end > R", isCorrect: false },
        ],
        explanation: "两种情况：区间在查询目标的左边 (end < L) 或者在右边 (start > R)。在C++里通常写成 R < start || L > end。"
      },
      {
        id: 1,
        question: "如何判断当前区间 [start, end] 完全被包含在 [L, R] 内部？",
        options: [
          { label: "L <= start && end <= R", value: "L <= start && end <= R", isCorrect: true },
          { label: "start <= L && R <= end", value: "start <= L && R <= end", isCorrect: false },
        ],
        explanation: "如果当前区间的左边界 >= L 且 右边界 <= R，说明我是你的一部分，直接把我的值拿走吧！"
      }
    ]
  }
];

const GuidedCoding: React.FC = () => {
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({}); // Key: levelId-blankId
  const [activeBlank, setActiveBlank] = useState<{levelId: string, blankId: number} | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const currentLevel = LEVELS[currentLevelIdx];

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
    if (currentLevelIdx < LEVELS.length - 1) {
      setCurrentLevelIdx(prev => prev + 1);
      setFeedback(null);
      setActiveBlank(null);
    }
  };

  const renderCode = (level: Level) => {
    const parts = level.codeTemplate.split(/(\{\{\d+\}\})/g);
    
    return parts.map((part, index) => {
      const match = part.match(/\{\{(\d+)\}\}/);
      if (match) {
        const blankId = parseInt(match[1]);
        const answer = answers[`${level.id}-${blankId}`];
        const isActive = activeBlank?.levelId === level.id && activeBlank?.blankId === blankId;

        if (answer) {
          return (
            <span key={index} className="text-green-400 font-bold border-b-2 border-green-500 mx-1 px-1">
              {answer}
            </span>
          );
        }
        return (
          <button
            key={index}
            onClick={() => {
                setActiveBlank({ levelId: level.id, blankId });
                setFeedback(null);
            }}
            className={`mx-1 px-3 py-0.5 rounded text-xs font-mono transition-all ${
              isActive 
                ? 'bg-yellow-500/50 text-white border border-yellow-400 animate-pulse' 
                : 'bg-gray-700 text-gray-300 border border-gray-500 hover:bg-gray-600'
            }`}
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
            {LEVELS.map((lvl, idx) => {
               const isCurrent = idx === currentLevelIdx;
               const isDone = idx < currentLevelIdx;
               return (
                 <div 
                  key={lvl.id} 
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
                    isCurrent ? 'bg-primary text-white font-bold' : 
                    isDone ? 'bg-green-900/30 text-green-400 border border-green-900' : 'bg-gray-800 text-gray-500'
                  }`}
                 >
                   {isDone && <Check className="w-3 h-3" />}
                   {idx + 1}. {lvl.id.toUpperCase()}
                 </div>
               )
            })}
         </div>
         <div className="text-gray-400 text-sm hidden md:block">
            手把手教你写代码
         </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
        {/* Left: Interaction Panel */}
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
                              题目: {currentLevel.blanks.find(b => b.id === activeBlank.blankId)?.question}
                           </div>
                           <div className="space-y-2">
                              {currentLevel.blanks.find(b => b.id === activeBlank.blankId)?.options.map((opt, i) => (
                                <button
                                  key={i}
                                  onClick={() => handleSelectOption(currentLevel.id, activeBlank.blankId, opt.value, opt.isCorrect)}
                                  className="w-full text-left p-3 rounded bg-dark border border-gray-600 hover:border-primary hover:bg-gray-800 transition text-sm text-gray-300"
                                >
                                   {opt.label}
                                </button>
                              ))}
                           </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500 text-center gap-2">
                           {isLevelComplete ? (
                               <div className="text-green-500 font-bold flex flex-col items-center">
                                  <Check className="w-12 h-12 mb-2" />
                                  本关卡已完成！
                               </div>
                           ) : (
                               <>
                                <ArrowRight className="w-8 h-8 opacity-50" />
                                <p>点击右侧代码中的 <span className="inline-block bg-gray-700 px-1 rounded text-xs border border-gray-500">???</span> 处开始答题</p>
                               </>
                           )}
                        </div>
                    )}
                </div>

                {/* Feedback Area */}
                {feedback && (
                  <div className={`mt-4 p-3 rounded text-sm font-bold animate-bounce-in ${
                    feedback.includes('✅') ? 'bg-green-900/30 text-green-400 border border-green-800' : 'bg-red-900/30 text-red-400 border border-red-800'
                  }`}>
                    {feedback}
                  </div>
                )}
                
                {/* Next Level Button */}
                {isLevelComplete && currentLevelIdx < LEVELS.length - 1 && (
                    <button 
                      onClick={handleNextLevel}
                      className="mt-4 w-full bg-primary hover:bg-blue-600 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition"
                    >
                       进入下一关 <ChevronRight className="w-4 h-4" />
                    </button>
                )}
                 {isLevelComplete && currentLevelIdx === LEVELS.length - 1 && (
                    <div className="mt-4 w-full bg-accent/20 text-accent py-3 rounded-lg font-bold text-center border border-accent">
                       恭喜！你已经学会了所有代码！
                    </div>
                )}
            </div>
        </div>

        {/* Right: Code View */}
        <div className="flex-1 bg-[#1e1e1e] rounded-xl border border-gray-700 shadow-2xl overflow-hidden flex flex-col">
            <div className="bg-[#2d2d2d] px-4 py-2 flex items-center gap-2 border-b border-black/20">
               <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500"/>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"/>
                  <div className="w-3 h-3 rounded-full bg-green-500"/>
               </div>
               <span className="text-xs text-gray-400 font-mono ml-2">editor.cpp</span>
            </div>
            <div className="p-6 font-mono text-sm leading-7 text-gray-300 overflow-auto">
               <pre className="whitespace-pre-wrap">
                  {renderCode(currentLevel)}
               </pre>
            </div>
        </div>
      </div>
    </div>
  );
};

export default GuidedCoding;
