
import React, { useState, useEffect } from 'react';
import { CheckCircle, ChevronRight, ChevronLeft, Terminal, Brain, Copy, XCircle } from 'lucide-react';
import { Topic, LectureStep, Theme, CourseLevel } from '../types';
import { LECTURE_DATA_MAP } from '../utils/lectureData';
import Visualizer from './Visualizer';

interface Props {
  topic: Topic;
  level?: CourseLevel;
  theme?: Theme;
}

const LectureMode: React.FC<Props> = ({ topic, level = 'basic', theme = 'slate' }) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [quizState, setQuizState] = useState<Record<number, {selected: number | null, feedback: string, correct: boolean}>>({});
  const [codeAnswers, setCodeAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    setCurrentStepIdx(0);
    setQuizState({});
    setCodeAnswers({});
  }, [topic]);

  const steps: LectureStep[] = LECTURE_DATA_MAP[topic] || [
    {
      id: 0,
      type: 'theory',
      title: 'Module Loading...',
      content: 'If you see this, the module content is missing or loading. Please contact support.'
    }
  ];

  const currentStep = steps[currentStepIdx] || steps[0];
  const isLastStep = currentStepIdx === steps.length - 1;

  const handleNext = () => {
    if (currentStepIdx < steps.length - 1) {
      setCurrentStepIdx(prev => prev + 1);
      setQuizState({});
      setCodeAnswers({});
    }
  };

  const handlePrev = () => {
    if (currentStepIdx > 0) setCurrentStepIdx(prev => prev - 1);
  };

  const renderProgressBar = () => (
    <div className="flex gap-1 mb-6">
       {steps.map((step, idx) => (
         <div 
            key={step.id} 
            className={`h-2 rounded-full flex-1 transition-all ${idx <= currentStepIdx ? 'bg-primary' : 'bg-gray-700'}`}
         />
       ))}
    </div>
  );

  const formatMath = (latex: string) => {
    return latex
        .replace(/\\sum/g, '∑')
        .replace(/\\prod/g, '∏')
        .replace(/\\le/g, '≤')
        .replace(/\\ge/g, '≥')
        .replace(/\\neq/g, '≠')
        .replace(/\\times/g, '×')
        .replace(/\\div/g, '÷')
        .replace(/\\infty/g, '∞')
        .replace(/\\max/g, 'max')
        .replace(/\\min/g, 'min')
        .replace(/\\log/g, 'log')
        .replace(/_/g, '_')
        .replace(/\^/g, '^');
  };

  const parseInline = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|`[^`]+`|\$[^\$]+\$)/g);
    return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i} className="text-white font-bold">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('`') && part.endsWith('`')) {
            return <code key={i} className="bg-primary/10 text-primary-light border border-primary/20 px-1.5 py-0.5 rounded font-mono text-sm mx-1">{part.slice(1, -1)}</code>;
        }
        if (part.startsWith('$') && part.endsWith('$')) {
            return <span key={i} className="font-serif italic text-yellow-200 px-1 bg-yellow-900/10 rounded">{formatMath(part.slice(1, -1))}</span>;
        }
        return part;
    });
  };

  const renderMarkdown = (content: string) => {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeLines: string[] = [];

    lines.forEach((line, idx) => {
        if (line.trim().startsWith('```')) {
            if (inCodeBlock) {
                elements.push(
                    <div key={`code-${idx}`} className="relative group my-4">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg blur opacity-50"></div>
                        <pre className="relative bg-[#1e1e1e] p-4 rounded-lg overflow-x-auto border border-gray-700 text-sm font-mono leading-relaxed">
                            <code className="text-gray-300">{codeLines.join('\n')}</code>
                        </pre>
                    </div>
                );
                codeLines = [];
                inCodeBlock = false;
            } else {
                inCodeBlock = true;
            }
            return;
        }
        if (inCodeBlock) {
            codeLines.push(line);
            return;
        }
        if (line.startsWith('### ')) {
            elements.push(
                <h3 key={idx} className="text-lg font-bold text-primary mt-4 mb-2 flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-primary rounded-full"></div>
                    {parseInline(line.slice(4))}
                </h3>
            );
            return;
        }
        if (line.startsWith('## ')) {
             elements.push(<h2 key={idx} className="text-xl font-bold text-white mt-5 mb-3">{parseInline(line.slice(3))}</h2>);
             return;
        }
        if (line.trim().startsWith('- ')) {
            elements.push(
                <div key={idx} className="flex gap-2 mb-1 ml-4 text-gray-300">
                    <span className="text-primary">•</span>
                    <span>{parseInline(line.trim().slice(2))}</span>
                </div>
            );
            return;
        }
        if (line.startsWith('> ')) {
            elements.push(
                <div key={idx} className="border-l-4 border-yellow-500 bg-yellow-900/10 p-4 my-4 text-gray-300 italic rounded-r border-y border-r border-yellow-900/20">
                    {parseInline(line.slice(2))}
                </div>
            );
            return;
        }
        if (line.trim()) {
            elements.push(<p key={idx} className="mb-4 leading-relaxed text-gray-300">{parseInline(line)}</p>);
        } else {
             elements.push(<div key={idx} className="h-2"></div>);
        }
    });
    return elements;
  };

  const renderContent = () => {
     switch(currentStep.type) {
         case 'theory':
         case 'conclusion':
            return (
                <div className="animate-fade-in">
                   {renderMarkdown(currentStep.content)}
                </div>
            );
         case 'experiment':
            return (
                <div className="flex flex-col h-full animate-fade-in">
                    <div className="mb-4 text-gray-300">
                        {renderMarkdown(currentStep.content)}
                    </div>
                    <div className="flex-1 border border-gray-700 rounded-xl overflow-hidden min-h-[400px] shadow-2xl relative">
                        <Visualizer 
                            level={level} 
                            topic={topic} 
                            theme={theme} 
                            externalData={currentStep.experimentConfig?.initialData} 
                        />
                    </div>
                </div>
            );
         case 'code':
             const problem = currentStep.codeProblem!;
             const parts = problem.template.split(/(\{\{\d+\}\})/g);
             return (
                 <div className="flex flex-col h-full animate-fade-in gap-6">
                     <div className="text-gray-300 shrink-0">
                        {renderMarkdown(currentStep.content)}
                     </div>
                     <div className="flex-1 bg-[#1e1e1e] p-6 rounded-xl border border-gray-700 font-mono text-sm overflow-auto shadow-inner whitespace-pre-wrap leading-relaxed">
                         {parts.map((part, i) => {
                             const match = part.match(/\{\{(\d+)\}\}/);
                             if (match) {
                                 const id = parseInt(match[1]);
                                 const blank = problem.blanks.find(b => b.id === id)!;
                                 const userAnswer = codeAnswers[id];
                                 if (userAnswer) {
                                     const isCorrect = blank.options.find(o => o.value === userAnswer)?.isCorrect;
                                     return (
                                         <span key={i} className={`font-bold border-b-2 mx-1 px-1 rounded transition-colors ${isCorrect ? 'text-green-400 border-green-500 bg-green-900/20' : 'text-red-400 border-red-500 bg-red-900/20'}`}>
                                             {userAnswer}
                                         </span>
                                     );
                                 }
                                 return (
                                     <span key={i} className="bg-yellow-500/20 text-yellow-300 border-b-2 border-yellow-500 mx-1 px-2 rounded animate-pulse">
                                         ??{id + 1}??
                                     </span>
                                 );
                             }
                             return <span key={i} className="text-gray-300">{part}</span>
                         })}
                     </div>
                     <div className="bg-dark-lighter p-4 rounded-xl border border-gray-700 space-y-6 shrink-0">
                         <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                             <Terminal className="w-4 h-4" /> 填空挑战
                         </h4>
                         <div className="grid gap-6 md:grid-cols-2">
                             {problem.blanks.map((blank) => {
                                 const userAnswer = codeAnswers[blank.id];
                                 return (
                                     <div key={blank.id} className="space-y-3">
                                         <div className="text-sm text-white font-medium flex items-center gap-2">
                                             <span className="bg-yellow-500/20 text-yellow-300 text-xs px-1.5 py-0.5 rounded border border-yellow-500/50 font-mono">
                                                 ??{blank.id + 1}??
                                             </span>
                                             {blank.question}
                                         </div>
                                         <div className="grid grid-cols-1 gap-2">
                                             {blank.options.map(opt => {
                                                 const isSelected = userAnswer === opt.value;
                                                 let btnClass = "text-left px-3 py-2 rounded text-xs border transition-all ";
                                                 if (isSelected) {
                                                     if (opt.isCorrect) btnClass += "bg-green-600 border-green-500 text-white font-bold shadow-sm";
                                                     else btnClass += "bg-red-600 border-red-500 text-white font-bold shadow-sm";
                                                 } else {
                                                     btnClass += "bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500";
                                                 }
                                                 return (
                                                     <button 
                                                        key={opt.value}
                                                        onClick={() => {
                                                            setCodeAnswers(prev => ({...prev, [blank.id]: opt.value}));
                                                        }}
                                                        className={btnClass}
                                                     >
                                                         <div className="flex justify-between items-center">
                                                             <span>{opt.label}</span>
                                                             {isSelected && (opt.isCorrect ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />)}
                                                         </div>
                                                     </button>
                                                 );
                                             })}
                                         </div>
                                     </div>
                                 );
                             })}
                         </div>
                     </div>
                 </div>
             );
         case 'quiz':
             const questions = currentStep.quizData || [];
             return (
                 <div className="flex flex-col items-center justify-start h-full animate-fade-in overflow-y-auto">
                     <div className="w-full max-w-3xl space-y-8 pb-8">
                         <div className="flex items-center gap-2 text-yellow-500 mb-2">
                             <Brain className="w-6 h-6" />
                             <span className="font-bold text-lg">Quiz Time ({questions.length} questions)</span>
                         </div>
                         {questions.map((q, idx) => {
                             const state = quizState[idx];
                             return (
                                 <div key={idx} className="bg-dark-lighter p-6 rounded-2xl border border-gray-700 shadow-lg">
                                     <h3 className="text-lg font-bold text-white mb-4 flex gap-2">
                                         <span className="text-gray-500">Q{idx+1}.</span> {q.question}
                                     </h3>
                                     <div className="space-y-2">
                                         {q.options.map((opt, optIdx) => (
                                             <button 
                                                key={optIdx}
                                                onClick={() => {
                                                    const isCorrect = optIdx === q.correctAnswer;
                                                    setQuizState(prev => ({
                                                        ...prev, 
                                                        [idx]: {
                                                            selected: optIdx, 
                                                            correct: isCorrect,
                                                            feedback: isCorrect ? '✅ 正确！ ' + q.explanation : '❌ 错误。请再试一次。'
                                                        }
                                                    }));
                                                }}
                                                className={`w-full text-left p-3 rounded-lg border transition-all ${
                                                    state?.selected === optIdx 
                                                    ? (optIdx === q.correctAnswer ? 'bg-green-900/20 border-green-500 text-green-300' : 'bg-red-900/20 border-red-500 text-red-300')
                                                    : 'bg-dark border-gray-600 hover:bg-gray-800 text-gray-300'
                                                }`}
                                             >
                                                 {opt}
                                             </button>
                                         ))}
                                     </div>
                                     {state?.feedback && (
                                         <div className={`mt-4 p-3 rounded-lg text-sm font-bold animate-fade-in ${state.correct ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                                             {state.feedback}
                                         </div>
                                     )}
                                 </div>
                             )
                         })}
                     </div>
                 </div>
             );
         case 'full_code':
             return (
                 <div className="flex flex-col h-full animate-fade-in">
                     <div className="mb-6 text-gray-300">
                         {renderMarkdown(currentStep.content)}
                     </div>
                     <div className="flex-1 bg-[#1e1e1e] rounded-xl border border-gray-700 overflow-hidden flex flex-col shadow-lg">
                         <div className="bg-[#2d2d2d] px-4 py-2 flex justify-between items-center border-b border-black/20">
                             <div className="flex items-center gap-2">
                                 <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                                 <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                                 <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                                 <span className="ml-2 text-xs text-gray-400 font-mono">solution.cpp</span>
                             </div>
                             <button 
                                 onClick={() => {
                                     navigator.clipboard.writeText(currentStep.codeSnippet || '');
                                     alert('代码已复制!');
                                 }}
                                 className="text-gray-400 hover:text-white transition p-1"
                                 title="复制代码"
                             >
                                 <Copy className="w-4 h-4" />
                             </button>
                         </div>
                         <pre className="flex-1 overflow-auto p-6 font-mono text-sm text-gray-300 custom-scrollbar leading-relaxed">
                             <code dangerouslySetInnerHTML={{
                                 __html: (currentStep.codeSnippet || '')
                                     .replace(/</g, '&lt;')
                                     .replace(/>/g, '&gt;')
                                     .replace(/\/\/.*/g, '<span class="text-gray-500 italic">$&</span>')
                                     .replace(/\b(int|void|using|namespace|return|if|else|const|for|while|long long|bool|char|double|float)\b/g, '<span class="text-purple-400 font-bold">$1</span>')
                                     .replace(/\b(cout|cin|printf|scanf|vector|string|swap|min|max|cos|sin)\b/g, '<span class="text-yellow-200">$1</span>')
                             }} />
                         </pre>
                     </div>
                 </div>
             );
         default: return null;
     }
  };

  return (
    <div className="h-full flex flex-col max-w-6xl mx-auto">
      <div className="flex-1 bg-dark-lighter rounded-2xl border border-gray-700 shadow-2xl overflow-hidden flex flex-col relative">
          <div className="bg-gray-800/50 p-6 border-b border-gray-700 flex justify-between items-center backdrop-blur-sm">
             <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    {currentStep.title}
                </h2>
                <span className="text-xs text-gray-400 font-mono mt-1 block">Step {currentStepIdx + 1} of {steps.length}</span>
             </div>
             <div className="flex gap-2">
                 <button 
                    onClick={handlePrev} 
                    disabled={currentStepIdx === 0}
                    className="p-2 rounded-full hover:bg-gray-700 text-gray-400 disabled:opacity-30 transition"
                 >
                     <ChevronLeft className="w-6 h-6" />
                 </button>
                 <button 
                    onClick={handleNext} 
                    disabled={isLastStep}
                    className="p-2 rounded-full bg-primary hover:bg-blue-600 text-white disabled:opacity-50 disabled:bg-gray-700 transition shadow-lg"
                 >
                     {isLastStep ? <CheckCircle className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
                 </button>
             </div>
          </div>
          <div className="p-6 md:p-8 flex-1 overflow-y-auto custom-scrollbar bg-dark/50">
             {renderProgressBar()}
             {renderContent()}
          </div>
      </div>
    </div>
  );
};

export default LectureMode;
