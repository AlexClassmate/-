import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Trophy } from 'lucide-react';
import { QuizQuestion, CourseLevel } from '../types';

const BASIC_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "如果原数组长度为 N，线段树数组通常需要开多大？",
    options: ["N", "2 * N", "4 * N", "N * N"],
    correctAnswer: 2,
    explanation: "工程上为了防止非满二叉树导致的越界，习惯开 4N。"
  },
  {
    id: 2,
    question: "单点修改 (Point Update) 的时间复杂度？",
    options: ["O(1)", "O(log N)", "O(N)", "O(N log N)"],
    correctAnswer: 1,
    explanation: "从叶子到根节点的路径长度为 log N。"
  },
  {
    id: 3,
    question: "线段树的叶子节点代表什么？",
    options: ["原数组的一个具体元素", "一个长度为2的区间", "懒标记", "根节点"],
    correctAnswer: 0,
    explanation: "叶子节点的 Left == Right，对应原数组中的下标。"
  }
];

const ADVANCED_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "懒惰标记 (Lazy Tag) 的核心作用？",
    options: ["偷懒不计算", "将区间修改复杂度降为 O(log N)", "节省内存", "增加代码行数"],
    correctAnswer: 1,
    explanation: "避免每次区间修改都遍历到底，只有在需要时才下发。"
  },
  {
    id: 2,
    question: "Push Down 操作应该在什么时候执行？",
    options: ["建树时", "查询或修改访问到有标记的节点且需要进入子区间时", "程序结束时", "随机执行"],
    correctAnswer: 1,
    explanation: "当我们需要深入子节点获取精确信息，或者要修改子节点时，必须先把当前节点的任务下发下去。"
  },
  {
    id: 3,
    question: "关于懒惰标记的累加，下列说法正确的是？",
    options: ["新标记直接覆盖旧标记", "新标记需要累加到旧标记上", "只能存在一个标记", "标记永远为1"],
    correctAnswer: 1,
    explanation: "如果一个节点本身就有未下发的任务（旧标记），新来的任务（新标记）需要与其合并（累加）。"
  }
];

const EXPERT_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "求区间最大值 (RMQ) 时，Push Up 的逻辑是什么？",
    options: ["tree[node] = tree[left] + tree[right]", "tree[node] = max(tree[left], tree[right])", "tree[node] = tree[left] * tree[right]", "tree[node] = min(tree[left], tree[right])"],
    correctAnswer: 1,
    explanation: "父节点的最大值等于两个子节点最大值中的较大者。"
  },
  {
    id: 2,
    question: "查询 RMQ 区间 [L, R] 时，如果当前节点范围完全在 [L, R] 内，应该返回？",
    options: ["tree[node] (当前节点最大值)", "0", "infinity", "-infinity"],
    correctAnswer: 0,
    explanation: "直接返回该节点维护的最大值，供上层比较。"
  },
  {
    id: 3,
    question: "求最大值时，查询函数越界（不在查询范围内）应返回什么？",
    options: ["0", "正无穷 (INF)", "负无穷 (-INF)", "1"],
    correctAnswer: 2,
    explanation: "返回负无穷，确保在做 max(result, current) 操作时不会干扰结果。"
  }
];

interface Props {
  level: CourseLevel;
}

const QuizSection: React.FC<Props> = ({ level }) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  let questions = BASIC_QUESTIONS;
  if (level === 'advanced') questions = ADVANCED_QUESTIONS;
  if (level === 'expert') questions = EXPERT_QUESTIONS;

  useEffect(() => {
    setCurrentQIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setFinished(false);
  }, [level]);

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);
    
    if (idx === questions[currentQIndex].correctAnswer) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(curr => curr + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setFinished(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setFinished(false);
  };

  if (finished) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center animate-fade-in">
        <Trophy className="w-24 h-24 text-yellow-500 mb-6" />
        <h2 className="text-3xl font-bold text-white mb-2">挑战完成!</h2>
        <p className="text-xl text-gray-400 mb-8">得分: <span className="text-primary font-bold">{score}</span> / {questions.length}</p>
        <button onClick={resetQuiz} className="bg-primary hover:bg-blue-600 text-white px-8 py-3 rounded-full font-bold transition">再试一次</button>
      </div>
    );
  }

  const question = questions[currentQIndex];

  return (
    <div className="max-w-2xl mx-auto h-full flex flex-col justify-center">
      <div className="bg-dark-lighter p-8 rounded-2xl border border-gray-700 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 h-1 bg-gray-700 w-full">
          <div className="h-full bg-primary transition-all duration-500" style={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }} />
        </div>

        <div className="flex justify-between items-center mb-6 mt-2">
           <span className="text-gray-400 text-sm font-mono">Q {currentQIndex + 1}/{questions.length}</span>
           <span className="text-primary text-sm font-bold">Score: {score}</span>
        </div>

        <h3 className="text-xl font-bold text-white mb-8">{question.question}</h3>

        <div className="space-y-3">
          {question.options.map((option, idx) => {
            let btnClass = "w-full text-left p-4 rounded-lg border transition-all duration-200 flex justify-between items-center ";
            if (!isAnswered) btnClass += "border-gray-600 bg-dark hover:bg-gray-800 text-gray-300 hover:border-gray-500";
            else if (idx === question.correctAnswer) btnClass += "border-green-500 bg-green-900/20 text-green-300";
            else if (idx === selectedOption) btnClass += "border-red-500 bg-red-900/20 text-red-300";
            else btnClass += "border-gray-700 bg-dark opacity-50 text-gray-500";

            return (
              <button key={idx} onClick={() => handleSelect(idx)} disabled={isAnswered} className={btnClass}>
                <span>{option}</span>
                {isAnswered && idx === question.correctAnswer && <CheckCircle className="w-5 h-5 text-green-500" />}
                {isAnswered && idx === selectedOption && idx !== question.correctAnswer && <XCircle className="w-5 h-5 text-red-500" />}
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className="mt-6 animate-fade-in">
            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 text-sm text-gray-300">
              <span className="font-bold text-primary">解析：</span> {question.explanation}
            </div>
            <button onClick={nextQuestion} className="mt-6 w-full bg-primary hover:bg-blue-600 text-white py-3 rounded-lg font-bold transition">
              {currentQIndex < questions.length - 1 ? "下一题" : "查看结果"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizSection;
