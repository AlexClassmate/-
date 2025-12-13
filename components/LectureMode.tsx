import React, { useState, useEffect } from 'react';
import { CheckCircle, ChevronRight, ChevronLeft, Terminal, BookOpen, Brain, Lightbulb, Copy, XCircle } from 'lucide-react';
import { Topic, LectureStep, Theme } from '../types';
import { 
    AC_AUTOMATON_LECTURE, KMP_LECTURE, MANACHER_LECTURE, BALANCED_TREE_LECTURE,
    MST_LECTURE, SHORTEST_PATH_LECTURE, TARJAN_LECTURE, DIFF_CONSTRAINTS_LECTURE,
    SWEEP_LINE_LECTURE, TREE_DIAMETER_LECTURE, TREE_CENTROID_LECTURE, TREE_CENTER_LECTURE, TREE_DP_LECTURE, TREE_KNAPSACK_LECTURE,
    SEGMENT_TREE_LECTURE, TRIE_LECTURE, HASH_LECTURE, UNION_FIND_LECTURE,
    BFS_BASIC_LECTURE, BFS_SHORTEST_PATH_LECTURE, BFS_STATE_SPACE_LECTURE, BFS_FLOOD_FILL_LECTURE, BFS_TOPO_SORT_LECTURE, BFS_BIPARTITE_LECTURE, BFS_MULTI_SOURCE_LECTURE,
    DFS_BASIC_LECTURE, DFS_CONNECT_LECTURE, DFS_PERM_LECTURE, DFS_MAZE_LECTURE, DFS_NQUEENS_LECTURE, DFS_BAG_LECTURE, DFS_GRAPH_ALGO_LECTURE, DFS_PRUNING_LECTURE,
    RECURSION_FIB_LECTURE, RECURSION_HANOI_LECTURE, RECURSION_FRACTAL_LECTURE, RECURSION_PERM_LECTURE, RECURSION_SUBSET_LECTURE,
    RECURSION_FACTORIAL_LECTURE, RECURSION_GCD_LECTURE, RECURSION_STRING_REV_LECTURE, RECURSION_REVERSE_LIST_LECTURE
} from '../utils/lectureData';
import Visualizer from './Visualizer';

interface Props {
  topic: Topic;
  theme?: Theme;
}

const LectureMode: React.FC<Props> = ({ topic, theme = 'slate' }) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [quizSelected, setQuizSelected] = useState<number | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string>('');
  const [codeAnswers, setCodeAnswers] = useState<Record<string, string>>({});

  // RESET STATE WHEN TOPIC CHANGES
  useEffect(() => {
    setCurrentStepIdx(0);
    setQuizSelected(null);
    setQuizFeedback('');
    setCodeAnswers({});
  }, [topic]);

  let steps: LectureStep[] = [];
  
  // MAPPING
  switch(topic) {
      case 'segment_tree': steps = SEGMENT_TREE_LECTURE; break;
      case 'trie': steps = TRIE_LECTURE; break;
      case 'hash': steps = HASH_LECTURE; break;
      case 'union_find': steps = UNION_FIND_LECTURE; break;
      case 'ac_automaton': steps = AC_AUTOMATON_LECTURE; break;
      case 'kmp': steps = KMP_LECTURE; break;
      case 'manacher': steps = MANACHER_LECTURE; break;
      case 'balanced_tree': steps = BALANCED_TREE_LECTURE; break;
      case 'mst': steps = MST_LECTURE; break;
      case 'shortest_path': steps = SHORTEST_PATH_LECTURE; break;
      case 'tarjan': steps = TARJAN_LECTURE; break;
      case 'diff_constraints': steps = DIFF_CONSTRAINTS_LECTURE; break;
      case 'sweep_line': steps = SWEEP_LINE_LECTURE; break;
      case 'tree_diameter': steps = TREE_DIAMETER_LECTURE; break;
      case 'tree_centroid': steps = TREE_CENTROID_LECTURE; break;
      case 'tree_center': steps = TREE_CENTER_LECTURE; break;
      case 'tree_dp': steps = TREE_DP_LECTURE; break;
      case 'tree_knapsack': steps = TREE_KNAPSACK_LECTURE; break;
      
      // BFS Module
      case 'bfs_basic': steps = BFS_BASIC_LECTURE; break;
      case 'bfs_shortest': steps = BFS_SHORTEST_PATH_LECTURE; break;
      case 'bfs_state': steps = BFS_STATE_SPACE_LECTURE; break;
      case 'bfs_flood': steps = BFS_FLOOD_FILL_LECTURE; break;
      case 'bfs_topo': steps = BFS_TOPO_SORT_LECTURE; break;
      case 'bfs_bipartite': steps = BFS_BIPARTITE_LECTURE; break;
      case 'bfs_multi': steps = BFS_MULTI_SOURCE_LECTURE; break;

      // DFS Module
      case 'dfs_basic': steps = DFS_BASIC_LECTURE; break;
      case 'dfs_connect': steps = DFS_CONNECT_LECTURE; break;
      case 'dfs_perm': steps = DFS_PERM_LECTURE; break;
      case 'dfs_maze': steps = DFS_MAZE_LECTURE; break;
      case 'dfs_nqueens': steps = DFS_NQUEENS_LECTURE; break;
      case 'dfs_bag': steps = DFS_BAG_LECTURE; break;
      case 'dfs_graph_algo': steps = DFS_GRAPH_ALGO_LECTURE; break;
      case 'dfs_pruning': steps = DFS_PRUNING_LECTURE; break;

      // Recursion Module
      case 'recursion_fib': steps = RECURSION_FIB_LECTURE; break;
      case 'recursion_hanoi': steps = RECURSION_HANOI_LECTURE; break;
      case 'recursion_fractal': steps = RECURSION_FRACTAL_LECTURE; break;
      case 'recursion_perm': steps = RECURSION_PERM_LECTURE; break;
      case 'recursion_subset': steps = RECURSION_SUBSET_LECTURE; break;
      case 'recursion_factorial': steps = RECURSION_FACTORIAL_LECTURE; break;
      case 'recursion_gcd': steps = RECURSION_GCD_LECTURE; break;
      case 'recursion_string_rev': steps = RECURSION_STRING_REV_LECTURE; break;
      case 'recursion_reverse_list': steps = RECURSION_REVERSE_LIST_LECTURE; break;

      default: steps = [];
  }

  const currentStep = steps[currentStepIdx] || {
    id: 0,
    type: 'theory',
    title: 'Loading...',
    content: 'Module content not found.'
  };
  
  const isLastStep = currentStepIdx === steps.length - 1;

  const handleNext = () => {
    if (currentStepIdx < steps.length - 1) {
      setCurrentStepIdx(prev => prev + 1);
      setQuizSelected(null);
      setQuizFeedback('');
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

  const renderContent = () => {
     switch(currentStep.type) {
         case 'theory':
            return (
                <div className="prose prose-invert max-w-none text-gray-300 animate-fade-in">
                   {currentStep.content.split('\n').map((line, i) => {
                       if (line.trim().startsWith('#')) return <h3 key={i} className="text-xl font-bold text-white mt-4 mb-2 flex items-center gap-2"><BookOpen className="w-5 h-5 text-primary"/> {line.replace(/#/g, '')}</h3>
                       if (line.trim().startsWith('>')) return <div key={i} className="border-l-4 border-yellow-500 bg-yellow-900/10 p-4 my-4 text-gray-200 italic">{line.replace(/>/g, '')}</div>
                       return <p key={i} className="mb-2 leading-relaxed">{line}</p>
                   })}
                </div>
            );
         case 'conclusion':
            return (
                <div className="prose prose-invert max-w-none text-gray-300 animate-fade-in">
                   {currentStep.content.split('\n').map((line, i) => {
                       if (line.trim().startsWith('#')) return <h3 key={i} className="text-xl font-bold text-white mt-4 mb-2 flex items-center gap-2"><Lightbulb className="w-5 h-5 text-accent"/> {line.replace(/#/g, '')}</h3>
                       return <p key={i} className="mb-2 leading-relaxed">{line}</p>
                   })}
                </div>
            );
         case 'experiment':
            return (
                <div className="flex flex-col h-full animate-fade-in">
                    <div className="mb-4 text-gray-300 space-y-2">
                       {currentStep.content.split('\n').map((line, i) => {
                           if (line.trim().startsWith('*')) return <li key={i} className="ml-4 list-disc text-gray-400">{line.replace(/\*/g, '')}</li>
                           if (line.trim().startsWith('>')) return <div key={i} className="text-sm text-accent mt-2 p-2 bg-accent/10 border border-accent/20 rounded">{line.replace(/>/g, '')}</div>
                           return <p key={i} className="mb-1">{line}</p>
                       })}
                    </div>
                    <div className="flex-1 border border-gray-700 rounded-xl overflow-hidden min-h-[400px] shadow-2xl relative">
                        {/* Force level based on content for lazy propagation demo */}
                        <Visualizer level={'basic'} topic={topic} theme={theme} />
                    </div>
                </div>
            );
         case 'code':
             const problem = currentStep.codeProblem!;
             const parts = problem.template.split(/(\{\{\d+\}\})/g);
             
             return (
                 <div className="flex flex-col h-full animate-fade-in gap-6">
                     <p className="text-gray-300 shrink-0">{currentStep.content}</p>
                     
                     {/* Code Display Area */}
                     <div className="flex-1 bg-[#1e1e1e] p-6 rounded-xl border border-gray-700 font-mono text-sm overflow-auto shadow-inner whitespace-pre-wrap leading-relaxed">
                         {parts.map((part, i) => {
                             const match = part.match(/\{\{(\d+)\}\}/);
                             if (match) {
                                 const id = parseInt(match[1]);
                                 const blank = problem.blanks.find(b => b.id === id)!;
                                 const userAnswer = codeAnswers[id];
                                 const isCorrect = userAnswer && blank.options.find(o => o.value === userAnswer)?.isCorrect;
                                 
                                 if (userAnswer) {
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

                     {/* Questions Area - Static Layout */}
                     <div className="bg-dark-lighter p-4 rounded-xl border border-gray-700 space-y-6 shrink-0">
                         <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                             <Terminal className="w-4 h-4" /> 填空挑战 (Fill in the Blanks)
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
         case 'full_code':
             return (
                 <div className="flex flex-col h-full animate-fade-in">
                     <div className="prose prose-invert max-w-none text-gray-300 mb-6">
                         {currentStep.content.split('\n').map((line, i) => {
                             if (line.trim().startsWith('#')) return <h3 key={i} className="text-xl font-bold text-white mt-4 mb-2 flex items-center gap-2"><Terminal className="w-5 h-5 text-primary"/> {line.replace(/#/g, '')}</h3>
                             if (line.trim().startsWith('**Input**')) return <div key={i} className="font-mono text-sm text-blue-300 mt-2 pl-4 border-l-2 border-blue-500 bg-blue-900/10 p-1">{line.replace(/\*\*/g, '')}</div>
                             if (line.trim().startsWith('**Output**')) return <div key={i} className="font-mono text-sm text-green-300 mb-2 pl-4 border-l-2 border-green-500 bg-green-900/10 p-1">{line.replace(/\*\*/g, '')}</div>
                             return <p key={i} className="mb-1 leading-relaxed">{line}</p>
                         })}
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
         case 'quiz':
             return (
                 <div className="flex flex-col items-center justify-center h-full animate-fade-in">
                     <div className="bg-dark-lighter p-8 rounded-2xl border border-gray-700 shadow-xl max-w-2xl w-full">
                         <div className="flex items-center gap-2 mb-6 text-yellow-500">
                             <Brain className="w-6 h-6" />
                             <span className="font-bold text-lg">Quiz Time</span>
                         </div>
                         <h3 className="text-xl font-bold text-white mb-6">{currentStep.quizData?.question}</h3>
                         <div className="space-y-3">
                             {currentStep.quizData?.options.map((opt, i) => (
                                 <button 
                                    key={i}
                                    onClick={() => {
                                        setQuizSelected(i);
                                        if (i === currentStep.quizData?.correctAnswer) {
                                            setQuizFeedback('✅ 正确！ ' + currentStep.quizData?.explanation);
                                        } else {
                                            setQuizFeedback('❌ 错误。请再试一次。');
                                        }
                                    }}
                                    className={`w-full text-left p-4 rounded-lg border transition-all ${
                                        quizSelected === i 
                                        ? (i === currentStep.quizData?.correctAnswer ? 'bg-green-900/20 border-green-500 text-green-300' : 'bg-red-900/20 border-red-500 text-red-300')
                                        : 'bg-dark border-gray-600 hover:bg-gray-800 text-gray-300'
                                    }`}
                                 >
                                     {opt}
                                 </button>
                             ))}
                         </div>
                         {quizFeedback && (
                             <div className={`mt-6 p-4 rounded-lg text-sm font-bold animate-fade-in ${quizFeedback.includes('✅') ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                                 {quizFeedback}
                             </div>
                         )}
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
