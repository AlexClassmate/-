import React, { useState } from 'react';
import { CheckCircle, XCircle, Trophy } from 'lucide-react';
import { QuizQuestion } from '../types';

const QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "如果原数组长度为 N，线段树数组通常需要开多大？",
    options: ["N", "2 * N", "4 * N", "N * N"],
    correctAnswer: 2,
    explanation: "虽然理论节点数接近 2N，但由于堆式存储（完全二叉树结构）对于非完美二叉树会有空缺，为了防止越界，工程上习惯开 4N 的空间。"
  },
  {
    id: 2,
    question: "线段树进行单点修改（Update）的时间复杂度是多少？",
    options: ["O(1)", "O(log N)", "O(N)", "O(N log N)"],
    correctAnswer: 1,
    explanation: "单点修改只需要从叶子节点一路向上更新到根节点，路径长度即为树的高度，约为 log N。"
  },
  {
    id: 3,
    question: "懒惰标记（Lazy Tag）的主要作用是什么？",
    options: ["为了偷懒不计算", "将区间修改的复杂度降为 O(log N)", "节省内存空间", "让代码更难懂"],
    correctAnswer: 1,
    explanation: "懒惰标记避免了每次区间修改都递归到叶子节点。只有当后续访问需要用到子区间的信息时，才将标记下传（Push Down），从而保证区间修改的高效性。"
  },
  {
    id: 4,
    question: "线段树最不适合处理以下哪种问题？",
    options: ["区间求和", "区间最大值", "动态插入/删除数组元素", "单点修改"],
    correctAnswer: 2,
    explanation: "线段树是基于固定区间的静态结构。如果数组元素频繁插入删除（导致索引变化），线段树结构会被破坏。平衡树（如Treap, Splay）更适合动态插入删除。"
  }
];

const QuizSection: React.FC = () => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);
    
    if (idx === QUESTIONS[currentQIndex].correctAnswer) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQIndex < QUESTIONS.length - 1) {
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
        <p className="text-xl text-gray-400 mb-8">你的得分: <span className="text-primary font-bold">{score}</span> / {QUESTIONS.length}</p>
        
        {score === QUESTIONS.length ? (
          <p className="text-green-400 mb-8 font-bold">太强了！你已经是线段树大师了！</p>
        ) : (
          <p className="text-gray-400 mb-8">还不错，再接再厉！</p>
        )}
        
        <button 
          onClick={resetQuiz}
          className="bg-primary hover:bg-blue-600 text-white px-8 py-3 rounded-full font-bold transition transform hover:scale-105"
        >
          再试一次
        </button>
      </div>
    );
  }

  const question = QUESTIONS[currentQIndex];

  return (
    <div className="max-w-2xl mx-auto h-full flex flex-col justify-center">
      <div className="bg-dark-lighter p-8 rounded-2xl border border-gray-700 shadow-xl relative overflow-hidden">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 h-1 bg-gray-700 w-full">
          <div 
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${((currentQIndex + 1) / QUESTIONS.length) * 100}%` }}
          />
        </div>

        <div className="flex justify-between items-center mb-6 mt-2">
           <span className="text-gray-400 text-sm font-mono">Question {currentQIndex + 1}/{QUESTIONS.length}</span>
           <span className="text-primary text-sm font-bold">Score: {score}</span>
        </div>

        <h3 className="text-xl font-bold text-white mb-8">{question.question}</h3>

        <div className="space-y-3">
          {question.options.map((option, idx) => {
            let btnClass = "w-full text-left p-4 rounded-lg border transition-all duration-200 flex justify-between items-center ";
            
            if (!isAnswered) {
              btnClass += "border-gray-600 bg-dark hover:bg-gray-800 text-gray-300 hover:border-gray-500";
            } else {
              if (idx === question.correctAnswer) {
                btnClass += "border-green-500 bg-green-900/20 text-green-300";
              } else if (idx === selectedOption) {
                btnClass += "border-red-500 bg-red-900/20 text-red-300";
              } else {
                btnClass += "border-gray-700 bg-dark opacity-50 text-gray-500";
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={isAnswered}
                className={btnClass}
              >
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
            <button 
              onClick={nextQuestion}
              className="mt-6 w-full bg-primary hover:bg-blue-600 text-white py-3 rounded-lg font-bold transition"
            >
              {currentQIndex < QUESTIONS.length - 1 ? "下一题" : "查看结果"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizSection;
