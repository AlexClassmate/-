
import React, { useState } from 'react';
import { ArrowRight, CheckCircle, ChevronRight, ChevronLeft, Terminal, BookOpen, Brain, Zap, ClipboardList, Lightbulb } from 'lucide-react';
import { Topic, LectureStep, Theme } from '../types';
import { 
    AC_AUTOMATON_LECTURE, KMP_LECTURE, MANACHER_LECTURE, BALANCED_TREE_LECTURE,
    MST_LECTURE, SHORTEST_PATH_LECTURE, TARJAN_LECTURE, DIFF_CONSTRAINTS_LECTURE,
    SWEEP_LINE_LECTURE, TREE_DIAMETER_LECTURE, TREE_CENTROID_LECTURE, TREE_CENTER_LECTURE, TREE_DP_LECTURE, TREE_KNAPSACK_LECTURE,
    SEGMENT_TREE_LECTURE, TRIE_LECTURE, HASH_LECTURE, UNION_FIND_LECTURE,
    BFS_BASIC_LECTURE, BFS_SHORTEST_PATH_LECTURE, BFS_STATE_SPACE_LECTURE, BFS_FLOOD_FILL_LECTURE, BFS_TOPO_SORT_LECTURE, BFS_BIPARTITE_LECTURE, BFS_MULTI_SOURCE_LECTURE
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
                 <div className="flex flex-col h-full animate-fade-in">
                     <p className="mb-4 text-gray-300">{currentStep.content}</p>
                     <div className="flex-1 bg-[#1e1e1e] p-6 rounded-xl border border-gray-700 font-mono text-sm overflow-auto shadow-inner whitespace-pre-wrap">
                         {parts.map((part, i) => {
                             const match = part.match(/\{\{(\d+)\}\}/);
                             if (match) {
                                 const id = parseInt(match[1]);
                                 const blank = problem.blanks.find(b => b.id === id)!;
                                 const userAnswer = codeAnswers[id];
                                 
                                 if (userAnswer) {
                                     return <span key={i} className="text-green-400 font-bold border-b border-green-500 mx-1">{userAnswer}</span>
                                 }
                                 
                                 return (
                                     <div key={i} className="inline-block relative group mx-1 align-middle">
                                         <button className="bg-gray-700 hover:bg-gray-600 text-yellow-300 px-2 rounded border border-gray-500">???</button>
                                         <div className="absolute top-full left-0 mt-2 w-48 bg-gray-800 border border-gray-600 rounded shadow-xl z-20 hidden group-hover:block p-1 whitespace-normal">
                                             <div className="text-xs text-gray-400 mb-1 px-2 py-1 border-b border-gray-700">{blank.question}</div>
                                             {blank.options.map(opt => (
                                                 <button 
                                                    key={opt.value}
                                                    onClick={() => {
                                                        if(opt.isCorrect) setCodeAnswers(prev => ({...prev, [id]: opt.value}));
                                                    }}
                                                    className="w-full text-left px-2 py-1.5 text-xs hover:bg-primary/20 hover:text-primary rounded"
                                                 >
                                                     {opt.label}
                                                 </button>
                                             ))}
                                         </div>
                                     </div>
                                 )
                             }
                             return <span key={i} className="text-gray-300">{part}</span>
                         })}
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
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
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
