
import React, { useState, useEffect } from 'react';
import { Network, BookOpen, Code, Trophy, Activity, Terminal, Layers, Box, ChevronRight, TrendingUp, Cpu, GitMerge, Hash, GitGraph, Zap, School, Search, MoveHorizontal, GitBranch, Share2, Grid, Map, Database, Radio, Palette, Milestone } from 'lucide-react';
import Visualizer from './components/Visualizer';
import StorySection from './components/StorySection';
import QuizSection from './components/QuizSection';
import CodeLab from './components/CodeLab';
import GuidedCoding from './components/GuidedCoding';
import ProblemPractice from './components/ProblemPractice';
import LectureMode from './components/LectureMode';
import { CourseLevel, Topic, Category, Theme } from './types';

type Tab = 'story' | 'visualizer' | 'code' | 'quiz' | 'guided' | 'practice' | 'lecture';

// Navigation Structure
const CATEGORIES: { id: Category; label: string; icon: any; topics: { id: Topic; label: string }[] }[] = [
  {
    id: 'dfs_module',
    label: '深度优先搜索 (DFS)',
    icon: GitMerge,
    topics: [
      { id: 'dfs_basic', label: 'DFS 基础：不撞南墙不回头' },
      { id: 'dfs_connect', label: '应用一：连通性检测' },
      { id: 'dfs_perm', label: '应用二：排列组合 (回溯)' },
      { id: 'dfs_maze', label: '应用三：迷宫与路径' },
      { id: 'dfs_nqueens', label: '应用四：N 皇后问题' },
      { id: 'dfs_bag', label: '应用五：子集和与背包' },
      { id: 'dfs_graph_algo', label: '应用六：图论 (环与拓扑)' },
      { id: 'dfs_pruning', label: '应用七：剪枝技巧' }
    ]
  },
  {
    id: 'bfs_module',
    label: '广度优先搜索 (BFS)',
    icon: Radio,
    topics: [
      { id: 'bfs_basic', label: 'BFS 基础与层序遍历' },
      { id: 'bfs_shortest', label: '无权图最短路径' },
      { id: 'bfs_state', label: '状态空间搜索' },
      { id: 'bfs_flood', label: '洪水填充 (Flood Fill)' },
      { id: 'bfs_topo', label: '拓扑排序' },
      { id: 'bfs_bipartite', label: '二分图判定' },
      { id: 'bfs_multi', label: '多源 BFS' }
    ]
  },
  {
    id: 'data_structure',
    label: '数据结构',
    icon: Database,
    topics: [
      { id: 'segment_tree', label: '线段树' },
      { id: 'trie', label: '字典树' },
      { id: 'hash', label: '哈希表' },
      { id: 'union_find', label: '并查集' },
      { id: 'balanced_tree', label: '平衡树 (Treap)' }
    ]
  },
  {
    id: 'graph',
    label: '图论算法',
    icon: Network,
    topics: [
      { id: 'mst', label: '最小生成树' },
      { id: 'shortest_path', label: '最短路' },
      { id: 'tarjan', label: 'Tarjan (强连通)' },
      { id: 'diff_constraints', label: '差分约束' }
    ]
  },
  {
    id: 'tree',
    label: '树上问题',
    icon: GitBranch,
    topics: [
      { id: 'tree_diameter', label: '树的直径' },
      { id: 'tree_centroid', label: '树的重心' },
      { id: 'tree_center', label: '树的中心' },
      { id: 'tree_dp', label: '树形 DP' },
      { id: 'tree_knapsack', label: '树上背包' }
    ]
  },
  {
    id: 'string',
    label: '字符串',
    icon: Code,
    topics: [
      { id: 'kmp', label: 'KMP 算法' },
      { id: 'ac_automaton', label: 'AC 自动机' },
      { id: 'manacher', label: 'Manacher' }
    ]
  },
  {
    id: 'algorithm',
    label: '基础算法',
    icon: Cpu,
    topics: [
      { id: 'sweep_line', label: '扫描线' }
    ]
  }
];

const THEME_OPTIONS: { id: Theme; label: string; color: string }[] = [
    { id: 'slate', label: '极夜黑 (默认)', color: '#0f172a' },
    { id: 'light', label: '亮色模式', color: '#f8fafc' },
    { id: 'black', label: '纯黑 (OLED)', color: '#000000' },
    { id: 'navy',  label: '深蓝', color: '#0a1929' },
];

const App: React.FC = () => {
  const [currentTopic, setCurrentTopic] = useState<Topic>('segment_tree');
  const [currentLevel, setCurrentLevel] = useState<CourseLevel>('basic');
  const [activeTab, setActiveTab] = useState<Tab>('story');
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({'dfs_module': true, 'bfs_module': false});
  
  // Theme State
  const [currentTheme, setCurrentTheme] = useState<Theme>('slate');
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  // Apply Theme Effect
  useEffect(() => {
    document.body.dataset.theme = currentTheme;
  }, [currentTheme]);

  const toggleCategory = (cat: string) => {
    setOpenCategories(prev => ({...prev, [cat]: !prev[cat]}));
  };

  // Determine if the current topic supports specific tabs
  const isLectureOnly = (topic: Topic) => {
    // Legacy topics support full suite. New ones default to Lecture Mode.
    const legacy = ['segment_tree', 'trie', 'hash', 'union_find'];
    return !legacy.includes(topic);
  };

  const getAvailableTabs = (topicId: Topic) => {
    if (isLectureOnly(topicId)) {
        return [
            { id: 'lecture', label: '讲课模式', icon: School },
            { id: 'visualizer', label: '算法演示', icon: Activity }
        ] as { id: Tab, label: string, icon: any }[];
    }
    const tabs: { id: Tab, label: string, icon: any }[] = [
        { id: 'story', label: '情景学习', icon: BookOpen },
        { id: 'lecture', label: '讲课模式', icon: School },
        { id: 'visualizer', label: '可视化', icon: Activity },
        { id: 'guided', label: '引导编程', icon: Terminal },
        { id: 'code', label: '代码模板', icon: Code },
        { id: 'quiz', label: '测验', icon: Trophy },
    ];
    if (topicId === 'segment_tree') {
        tabs.push({ id: 'practice', label: 'P3372 真题', icon: Layers });
    }
    return tabs;
  };

  const renderContent = () => {
    // If it's a "Lecture Only" topic (like trees), we restrict tabs but MUST allow 'visualizer' 
    // to pass through to the switch statement instead of forcing LectureMode.
    if (isLectureOnly(currentTopic)) {
        if (activeTab === 'lecture') return <LectureMode topic={currentTopic} theme={currentTheme} />;
        if (activeTab === 'visualizer') return <Visualizer level={currentLevel} topic={currentTopic} theme={currentTheme} />;
        // Default fallthrough
        return <LectureMode topic={currentTopic} theme={currentTheme} />;
    }

    switch (activeTab) {
      case 'lecture': return <LectureMode topic={currentTopic} theme={currentTheme} />;
      case 'story': return <StorySection level={currentLevel} topic={currentTopic} />;
      case 'visualizer': return <Visualizer level={currentLevel} topic={currentTopic} theme={currentTheme} />;
      case 'guided': return <GuidedCoding level={currentLevel} topic={currentTopic} />;
      case 'code': return <CodeLab level={currentLevel} topic={currentTopic} />;
      case 'quiz': return <QuizSection level={currentLevel} />;
      case 'practice': return <ProblemPractice />;
      default: return <StorySection level={currentLevel} topic={currentTopic} />;
    }
  };

  return (
    <div className="min-h-screen bg-dark text-gray-100 flex flex-col font-sans overflow-hidden transition-colors duration-300">
      
      {/* Top Bar */}
      <nav className="h-16 bg-dark-lighter border-b border-gray-800 flex items-center px-6 shrink-0 z-20 shadow-md">
         <div className="flex items-center gap-3 mr-12">
            <div className="bg-primary/20 p-2 rounded-lg">
              <Network className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight hidden md:block">Algo Master</h1>
         </div>
         <div className="text-sm text-gray-400 ml-auto flex items-center gap-4">
             {/* Theme Switcher */}
             <div className="relative">
                 <button 
                    onClick={() => setShowThemeMenu(!showThemeMenu)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded hover:bg-gray-700/50 transition border border-transparent hover:border-gray-700"
                    title="切换主题"
                 >
                     <Palette className="w-4 h-4" />
                     <span className="hidden sm:inline text-xs">{THEME_OPTIONS.find(t=>t.id===currentTheme)?.label}</span>
                 </button>
                 
                 {showThemeMenu && (
                     <div className="absolute top-full right-0 mt-2 w-48 bg-dark-lighter border border-gray-700 rounded-lg shadow-xl overflow-hidden z-50">
                         {THEME_OPTIONS.map(opt => (
                             <button
                                key={opt.id}
                                onClick={() => { setCurrentTheme(opt.id); setShowThemeMenu(false); }}
                                className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 hover:bg-gray-700/50 transition ${currentTheme === opt.id ? 'text-primary font-bold bg-primary/10' : 'text-gray-300'}`}
                             >
                                 <div className="w-4 h-4 rounded-full border border-gray-500" style={{backgroundColor: opt.color}}></div>
                                 {opt.label}
                             </button>
                         ))}
                     </div>
                 )}
             </div>
             {showThemeMenu && <div className="fixed inset-0 z-40" onClick={() => setShowThemeMenu(false)}></div>}
         </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation (Merged) */}
        <aside className="w-72 bg-dark-lighter border-r border-gray-800 flex flex-col shrink-0 h-full overflow-hidden">
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
             {CATEGORIES.map(cat => (
                 <div key={cat.id} className="space-y-1">
                    <button 
                      onClick={() => toggleCategory(cat.id)}
                      className="w-full flex items-center justify-between px-2 py-2 text-gray-400 hover:text-white font-bold text-xs uppercase tracking-wider"
                    >
                       <div className="flex items-center gap-2">
                          <cat.icon className="w-4 h-4" /> {cat.label}
                       </div>
                       <ChevronRight className={`w-3 h-3 transition-transform ${openCategories[cat.id] ? 'rotate-90' : ''}`} />
                    </button>
                    
                    {openCategories[cat.id] && (
                        <div className="space-y-1 pl-2 border-l border-gray-700 ml-3">
                           {cat.topics.map(t => (
                               <div key={t.id}>
                                   <button 
                                     onClick={() => { 
                                         setCurrentTopic(t.id); 
                                         if(currentTopic !== t.id) {
                                            // Default action when switching topic
                                            if(isLectureOnly(t.id)) setActiveTab('lecture');
                                            else setActiveTab('story');
                                         }
                                     }}
                                     className={`w-full text-left px-3 py-2 rounded text-sm transition flex justify-between items-center ${currentTopic === t.id ? 'bg-primary/10 text-primary border border-primary/20' : 'text-gray-400 hover:bg-gray-800'}`}
                                   >
                                      {t.label}
                                   </button>
                                   
                                   {/* Nested Tabs for Active Topic */}
                                   {currentTopic === t.id && (
                                       <div className="ml-3 mt-1 mb-2 space-y-0.5 pl-2 border-l border-gray-700/50">
                                           {getAvailableTabs(t.id).map(tab => (
                                               <button
                                                   key={tab.id}
                                                   onClick={() => setActiveTab(tab.id)}
                                                   className={`flex items-center gap-2 px-3 py-1.5 text-xs w-full rounded transition-colors ${activeTab === tab.id ? 'text-white bg-gray-700 font-medium' : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/50'}`}
                                               >
                                                   <tab.icon className={`w-3 h-3 ${activeTab === tab.id ? 'text-primary' : ''}`} />
                                                   {tab.label}
                                               </button>
                                           ))}
                                       </div>
                                   )}
                               </div>
                           ))}
                        </div>
                    )}
                 </div>
             ))}
          </div>

          {/* Difficulty Selector (Moved to Footer) */}
          {!isLectureOnly(currentTopic) && (
            <div className="p-4 border-t border-gray-800 bg-black/10 shrink-0">
                <div className="text-xs font-bold text-gray-500 mb-2 px-1 uppercase tracking-wider flex items-center gap-2">
                    <TrendingUp className="w-3 h-3" /> 难度选择 (Difficulty)
                </div>
                <div className="grid grid-cols-3 gap-1 bg-gray-900/50 p-1 rounded-lg">
                    {(['basic', 'advanced', 'expert'] as CourseLevel[]).map(l => (
                        <button 
                            key={l} 
                            onClick={() => setCurrentLevel(l)} 
                            className={`px-1 py-1.5 rounded text-[10px] capitalize font-medium transition-all text-center ${currentLevel===l ? 'bg-primary text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            {l}
                        </button>
                    ))}
                </div>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col h-full overflow-hidden bg-dark transition-colors duration-300">
          <header className="h-16 border-b border-gray-800 flex items-center px-8 bg-dark/50 backdrop-blur-md sticky top-0 z-10 shrink-0">
            <h2 className="text-xl font-bold flex items-center gap-2 text-white">
               {currentTopic.replace(/_/g, ' ').toUpperCase()}
            </h2>
          </header>
          <div className="flex-1 overflow-auto p-6 lg:p-8">
             {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
