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

// --- BASIC LEVELS ---
const BASIC_LEVELS: Level[] = [
  {
    id: 'b1_struct',
    title: '基础一：存储与定义',
    description: '搭建线段树的骨架。我们使用数组模拟完全二叉树。',
    codeTemplate: `#include <iostream>
using namespace std;

const int MAXN = 100005;
int arr[MAXN]; // 原数组
int tree[MAXN * 4]; // 线段树数组

// 左孩子: node * 2
// 右孩子: node * 2 + 1
// 思考：为什么开 4 倍空间？
// 答：为了防止非满二叉树导致的越界访问。

void push_up(int node) {
    // 汇总逻辑：当前节点 = 左孩子 + 右孩子
    tree[node] = tree[node * 2] + {{0}};
}`,
    blanks: [
      {
        id: 0,
        question: "如何获取右孩子的值？",
        options: [
          { label: "tree[node * 2 + 1]", value: "tree[node * 2 + 1]", isCorrect: true },
          { label: "tree[node + 1]", value: "tree[node + 1]", isCorrect: false },
        ],
        explanation: "在数组模拟的堆结构中，右孩子索引是当前索引乘2加1。"
      }
    ]
  },
  {
    id: 'b2_build',
    title: '基础二：建树 (Build)',
    description: '采用递归方式建立整棵树。',
    codeTemplate: `void build(int node, int start, int end) {
    // 递归出口：到达叶子节点
    if ({{0}}) {
        tree[node] = arr[start];
        return;
    }

    int mid = (start + end) / 2;
    // 递归建设左子树 [start, mid]
    build(node * 2, start, mid);
    // 递归建设右子树 [mid + 1, end]
    build(node * 2 + 1, mid + 1, end);
    
    // 汇总子节点信息
    push_up(node);
}`,
    blanks: [
      {
        id: 0,
        question: "递归的终止条件是什么？",
        options: [
          { label: "start == end", value: "start == end", isCorrect: true },
          { label: "node == 0", value: "node == 0", isCorrect: false },
        ],
        explanation: "当区间左端点等于右端点时，说明已经定位到具体的某一个元素。"
      }
    ]
  },
  {
    id: 'b3_update',
    title: '基础三：单点修改',
    description: '更新一个点的值，并维护路径上的所有和。',
    codeTemplate: `void update(int node, int start, int end, int idx, int val) {
    if (start == end) {
        tree[node] = val;
        arr[idx] = val;
        return;
    }
    int mid = (start + end) / 2;
    // 判断修改点在左边还是右边
    if ({{0}}) {
        update(node * 2, start, mid, idx, val);
    } else {
        update(node * 2 + 1, mid + 1, end, idx, val);
    }
    push_up(node);
}`,
    blanks: [
      {
        id: 0,
        question: "什么时候去左子树寻找修改点？",
        options: [
          { label: "idx <= mid", value: "idx <= mid", isCorrect: true },
          { label: "idx > mid", value: "idx > mid", isCorrect: false },
        ],
        explanation: "二分逻辑：如果目标下标 idx 小于等于中间点 mid，说明在左半区。"
      }
    ]
  },
  {
    id: 'b4_query',
    title: '基础四：区间查询',
    description: '查询区间 [L, R] 的总和。',
    codeTemplate: `int query(int node, int start, int end, int L, int R) {
    // 1. 区间完全不在查询范围内（越界）
    if (R < start || L > end) return 0;
    
    // 2. 当前区间完全被包含在查询范围内
    if ({{0}}) {
        return tree[node];
    }
    
    // 3. 部分重叠，继续分裂查询
    int mid = (start + end) / 2;
    int sum_left = query(node * 2, start, mid, L, R);
    int sum_right = query(node * 2 + 1, mid + 1, end, L, R);
    
    return sum_left + sum_right;
}`,
    blanks: [
      {
        id: 0,
        question: "完全包含的条件？",
        options: [
          { label: "L <= start && end <= R", value: "L <= start && end <= R", isCorrect: true },
          { label: "start <= L && R <= end", value: "start <= L && R <= end", isCorrect: false },
        ],
        explanation: "如果当前管理的区间 [start, end] 完全位于老板查询的 [L, R] 内部，直接上交业绩。"
      }
    ]
  }
];

// --- ADVANCED LEVELS (Lazy) ---
const ADVANCED_LEVELS: Level[] = [
  {
    id: 'a1_lazy',
    title: '进阶一：懒标记定义',
    description: '引入 lazy 数组来存储待下发的任务。',
    codeTemplate: `int tree[MAXN * 4];
int lazy[MAXN * 4]; // 懒标记数组

// 将标记下传一层
void push_down(int node, int start, int end) {
    if (lazy[node] == 0) return; // 没有标记不用管

    int mid = (start + end) / 2;
    int left = node * 2;
    int right = node * 2 + 1;

    // 1. 更新子节点的值
    // 左子节点增加量 = 标记值 * 区间长度
    tree[left] += lazy[node] * (mid - start + 1);
    tree[right] += lazy[node] * (end - mid);

    // 2. 标记累加给子节点
    lazy[left] += lazy[node];
    lazy[right] += lazy[node];

    // 3. 清除当前节点标记
    lazy[node] = {{0}};
}`,
    blanks: [
      {
        id: 0,
        question: "下发完成后，当前节点的标记应如何处理？",
        options: [
          { label: "设为 0", value: "0", isCorrect: true },
          { label: "保持不变", value: "lazy[node]", isCorrect: false },
        ],
        explanation: "任务已经分派给下属了，自己手里的备忘录（标记）就可以擦除了。"
      }
    ]
  },
  {
    id: 'a2_update',
    title: '进阶二：区间修改',
    description: '带懒标记的 Update。',
    codeTemplate: `void update_range(int node, int start, int end, int L, int R, int val) {
    // 区间被完全覆盖：直接修改并打标记
    if (L <= start && end <= R) {
        tree[node] += val * (end - start + 1);
        lazy[node] += {{0}};
        return;
    }

    // 部分重叠：先下放标记，再递归
    push_down(node, start, end);
    
    int mid = (start + end) / 2;
    if (L <= mid) update_range(node * 2, start, mid, L, R, val);
    if (R > mid) update_range(node * 2 + 1, mid + 1, end, L, R, val);
    
    // 回溯时更新自己
    tree[node] = tree[node * 2] + tree[node * 2 + 1];
}`,
    blanks: [
      {
        id: 0,
        question: "完全覆盖时，懒标记如何更新？",
        options: [
          { label: "覆盖 (lazy = val)", value: "val", isCorrect: false },
          { label: "累加 (lazy += val)", value: "val", isCorrect: true },
        ],
        explanation: "因为可能之前还有没处理的任务，所以新的修改量要累加到旧的标记上。"
      }
    ]
  },
  {
    id: 'a3_query',
    title: '进阶三：区间查询',
    description: '带 Push Down 的查询。',
    codeTemplate: `int query(int node, int start, int end, int L, int R) {
    if (R < start || L > end) return 0;
    if (L <= start && end <= R) return tree[node];

    // 核心差异：查询前必须下放标记
    // 否则子节点的数据可能是旧的
    push_down(node, start, end);

    int mid = (start + end) / 2;
    int res = 0;
    if (L <= mid) res += query(node * 2, start, mid, L, R);
    if (R > mid) res += {{0}};
    return res;
}`,
    blanks: [
      {
        id: 0,
        question: "右子树的查询逻辑？",
        options: [
          { label: "query(right, mid+1, end, L, R)", value: "query(node * 2 + 1, mid + 1, end, L, R)", isCorrect: true },
          { label: "tree[right]", value: "tree[node * 2 + 1]", isCorrect: false },
        ],
        explanation: "标准的分治查询逻辑。"
      }
    ]
  }
];

// --- EXPERT LEVELS (RMQ) ---
const EXPERT_LEVELS: Level[] = [
  {
    id: 'e1_concept',
    title: '高阶一：最值思想',
    description: '将求和 (Sum) 思维转换为求最大值 (Max) 思维。',
    codeTemplate: `#include <algorithm>
// ...
// 汇总逻辑 Push Up
void push_up(int node) {
    // 问：经理的业绩是所有下属业绩的总和吗？
    // 答：不是，RMQ中经理记录的是下属里的“最强者”。
    tree[node] = max(tree[node * 2], {{0}});
}`,
    blanks: [
      {
        id: 0,
        question: "应该取谁的最大值？",
        options: [
          { label: "tree[node * 2 + 1]", value: "tree[node * 2 + 1]", isCorrect: true },
          { label: "tree[node] + 1", value: "tree[node] + 1", isCorrect: false },
        ],
        explanation: "当前区间最大值 = max(左区间最大值, 右区间最大值)。"
      }
    ]
  },
  {
    id: 'e2_build',
    title: '高阶二：建树',
    description: 'RMQ 的建树过程。',
    codeTemplate: `void build(int node, int start, int end) {
    if (start == end) {
        tree[node] = arr[start];
        return;
    }
    int mid = (start + end) / 2;
    build(node * 2, start, mid);
    build(node * 2 + 1, mid + 1, end);
    
    // 这里的 push_up 使用的是 max 逻辑
    push_up(node); 
}
// 注意：数组初始化要小心，求最大值时通常不需要特殊初始化，
// 但如果求最小值，背景值需要设为 INF。
`,
    blanks: [
      {
        id: 0,
        question: "本题无需填空，请确认理解 Push Up 变化",
        options: [
          { label: "已理解", value: "ok", isCorrect: true }
        ],
        explanation: "RMQ 与 Sum 线段树唯一的区别就在于 Push Up 和 Query 时的合并操作。"
      }
    ]
  },
  {
    id: 'e3_query',
    title: '高阶三：区间最值查询',
    description: '查询 [L, R] 范围内的最大值。',
    codeTemplate: `int query_max(int node, int start, int end, int L, int R) {
    if (R < start || L > end) return -2e9; // 返回极小值
    if (L <= start && end <= R) return tree[node];

    int mid = (start + end) / 2;
    int max_val = -2e9;
    
    if (L <= mid) 
        max_val = max(max_val, query_max(node * 2, start, mid, L, R));
    if (R > mid) 
        max_val = {{0}};
        
    return max_val;
}`,
    blanks: [
      {
        id: 0,
        question: "如何合并右半边的结果？",
        options: [
          { label: "max(max_val, query_right)", value: "max(max_val, query_max(node * 2 + 1, mid + 1, end, L, R))", isCorrect: true },
          { label: "max_val + query_right", value: "max_val + query_right", isCorrect: false },
        ],
        explanation: "始终保持取最大值的逻辑，千万别手顺写成加法了！"
      }
    ]
  },
  {
    id: 'e4_update',
    title: '高阶四：单点修改',
    description: '修改单点值并刷新最值记录。',
    codeTemplate: `void update(int node, int start, int end, int idx, int val) {
    if (start == end) {
        tree[node] = val; // 直接修改
        return;
    }
    int mid = (start + end) / 2;
    if (idx <= mid) update(node * 2, start, mid, idx, val);
    else update(node * 2 + 1, mid + 1, end, idx, val);
    
    // 只要下属有变动，经理必须重新评选最强者
    push_up(node);
}`,
    blanks: [
      {
        id: 0,
        question: "本题无需填空，点击完成结束高阶课程",
        options: [
          { label: "完成", value: "done", isCorrect: true }
        ],
        explanation: "恭喜你！你已经掌握了线段树的核心变体。"
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

  let levels = BASIC_LEVELS;
  if (level === 'advanced') levels = ADVANCED_LEVELS;
  if (level === 'expert') levels = EXPERT_LEVELS;

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
                 {isLevelComplete && currentLevelIdx === levels.length - 1 && (
                    <div className="mt-4 w-full bg-accent/20 text-accent py-3 rounded-lg font-bold text-center border border-accent">
                       本阶段课程完成！
                    </div>
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
