
import React, { useState, useEffect } from 'react';
import { Network, BookOpen, Code, Trophy, Activity, Terminal, Layers, Box, ChevronRight, TrendingUp, Cpu, GitMerge, Hash, GitGraph, Zap, School, Search, MoveHorizontal, GitBranch, Share2, Grid, Map, Database, Radio, Palette, Milestone, Repeat, List, ListTree, RefreshCcw, CaseSensitive, Binary, Calculator, Key, Table, ShoppingBag, Group, Calculator as CalculatorIcon } from 'lucide-react';
import Visualizer from './components/Visualizer';
import StorySection from './components/StorySection';
import QuizSection from './components/QuizSection';
import CodeLab from './components/CodeLab';
import GuidedCoding from './components/GuidedCoding';
import ProblemPractice from './components/ProblemPractice';
import LectureMode from './components/LectureMode';
import { CourseLevel, Topic, Category, Theme } from './types';

type Tab = 'story' | 'visualizer' | 'code' | 'quiz' | 'guided' | 'practice' | 'lecture';

// Navigation Structure - Redesigned
const CATEGORIES: { id: Category; label: string; icon: any; topics: { id: Topic; label: string }[] }[] = [
  {
    id: 'dp_state_module',
    label: '状压 DP (State)',
    icon: Binary,
    topics: [
      { id: 'dp_state_chess', label: '1. 棋盘放置 (玉米田)' },
      { id: 'dp_state_tsp', label: '2. 旅行商问题 (TSP)' },
      { id: 'dp_state_cover', label: '3. 集合覆盖问题' },
      { id: 'dp_state_perm', label: '4. 排列生成与计数' },
      { id: 'dp_state_resource', label: '5. 资源分配/指派' },
      { id: 'dp_state_plug', label: '6. 插头 DP (连通性)' },
      { id: 'dp_state_subset', label: '7. 子集和 (SOS DP)' },
      { id: 'dp_state_graph', label: '8. 图论状压 (最大团)' },
      { id: 'dp_state_bit', label: '9. 位运算模拟' },
      { id: 'dp_state_stage', label: '10. 多阶段状态压缩' }
    ]
  },
  {
    id: 'dp_tree_module',
    label: '树形 DP (Tree)',
    icon: GitBranch,
    topics: [
      { id: 'dp_tree_independent', label: '1. 树的最大独立集 (没有上司的舞会)' },
      { id: 'dp_tree_vertex_cover', label: '2. 树的最小点覆盖 (战略游戏)' },
      { id: 'dp_tree_dominating', label: '3. 树的最小支配集 (消防局)' },
      { id: 'dp_tree_diameter', label: '4. 树的直径 (最长路径)' },
      { id: 'dp_tree_centroid', label: '5. 树的重心 (平衡点)' },
      { id: 'dp_tree_knapsack', label: '6. 树上背包 (选课)' },
      { id: 'dp_tree_reroot', label: '7. 换根 DP (全方位扫描)' },
      { id: 'dp_tree_coloring', label: '8. 树的染色问题' },
      { id: 'dp_tree_path', label: '9. 树上路径统计 (点分治前置)' },
      { id: 'dp_tree_cycle', label: '10. 基环树 DP (骑士)' },
      { id: 'dp_tree_virtual', label: '11. 虚树 DP (关键点)' },
      { id: 'dp_tree_matching', label: '12. 树的匹配问题' },
      { id: 'dp_tree_components', label: '13. 树的连通块计数' },
      { id: 'dp_tree_game', label: '14. 树上游戏/博弈' },
      { id: 'dp_tree_sol', label: '15. 树形 DP 求方案' }
    ]
  },
  {
    id: 'dp_digit_module',
    label: '数位 DP (Digit)',
    icon: CalculatorIcon,
    topics: [
      { id: 'dp_digit_count', label: '1. 数字出现次数统计' },
      { id: 'dp_digit_constraint', label: '2. 包含/不包含特定数字' },
      { id: 'dp_digit_sum', label: '3. 数字和问题' },
      { id: 'dp_digit_div', label: '4. 整除性问题' },
      { id: 'dp_digit_base', label: '5. 二进制/多进制问题' },
      { id: 'dp_digit_prod', label: '6. 数字乘积问题' },
      { id: 'dp_digit_palindrome', label: '7. 回文数相关问题' },
      { id: 'dp_digit_kth', label: '8. 第 K 小满足条件的数' },
      { id: 'dp_digit_minmax', label: '9. 区间最值/Windy数' },
      { id: 'dp_digit_complex', label: '10. 复杂条件组合' }
    ]
  },
  {
    id: 'dp_interval_module',
    label: '区间 DP (Interval)',
    icon: Group,
    topics: [
      { id: 'dp_interval_merge', label: '1. 区间合并 (石子合并)' },
      { id: 'dp_interval_matrix', label: '2. 矩阵连乘/取数' },
      { id: 'dp_interval_palindrome', label: '3. 括号匹配/回文' },
      { id: 'dp_interval_remove', label: '4. 区间消除 (祖玛)' },
      { id: 'dp_interval_color', label: '5. 区间染色 (涂色)' },
      { id: 'dp_interval_split', label: '6. 区间分割 (切木棍)' },
      { id: 'dp_interval_count', label: '7. 区间计数 (凸多边形)' },
      { id: 'dp_interval_complex', label: '8. 复杂状态 (三维)' },
      { id: 'dp_interval_circle', label: '9. 环形问题 (断环成链)' },
      { id: 'dp_interval_opt', label: '10. 四边形不等式优化' },
      { id: 'dp_interval_sol', label: '11. 记录与输出方案' },
    ]
  },
  {
    id: 'dp_knapsack_module',
    label: '背包 DP (Knapsack)',
    icon: ShoppingBag,
    topics: [
      { id: 'dp_knapsack_01', label: '1. 0/1 背包 (基础)' },
      { id: 'dp_knapsack_complete', label: '2. 完全背包 (无限)' },
      { id: 'dp_knapsack_multi', label: '3. 多重背包 (有限)' },
      { id: 'dp_knapsack_mixed', label: '4. 混合背包' },
      { id: 'dp_knapsack_2d', label: '5. 二维费用背包' },
      { id: 'dp_knapsack_group', label: '6. 分组背包' },
      { id: 'dp_knapsack_depend', label: '7. 有依赖的背包' },
      { id: 'dp_knapsack_count', label: '8. 方案计数' },
      { id: 'dp_knapsack_record', label: '9. 记录最优方案' },
      { id: 'dp_knapsack_feasibility', label: '10. 可行性问题' },
      { id: 'dp_knapsack_val', label: '11. 求具体价值' },
      { id: 'dp_knapsack_init', label: '12. 恰好装满 vs 不超' }
    ]
  },
  {
    id: 'dp_linear_module',
    label: '线性 DP (Linear DP)',
    icon: Table,
    topics: [
      { id: 'dp_lis', label: '1. 最长递增子序列 (LIS)' },
      { id: 'dp_max_subarray', label: '2. 最大子数组和 (Kadane)' },
      { id: 'dp_robber', label: '3. 打家劫舍 (House Robber)' },
      { id: 'dp_lcs', label: '4. 最长公共子序列 (LCS)' },
      { id: 'dp_edit_dist', label: '5. 编辑距离 (Edit Distance)' },
      { id: 'dp_stairs', label: '6. 爬楼梯 (Counting)' },
      { id: 'dp_grid_path', label: '7. 路径规划 (Grid Paths)' },
      { id: 'dp_coin', label: '8. 资源分配 (Coin Change)' }
    ]
  },
  {
    id: 'seg_module',
    label: '线段树 (Segment Tree)',
    icon: Database,
    topics: [
      { id: 'seg_basic', label: '应用一：区间求和 (基础)' },
      { id: 'seg_lazy', label: '应用二：懒惰标记 (进阶)' },
      { id: 'seg_rmq', label: '应用三：区间最值 RMQ (高阶)' },
      { id: 'seg_min', label: '应用四：区间最小值 (P1816)' }
    ]
  },
  {
    id: 'trie_module',
    label: '字典树 (Trie)',
    icon: Search,
    topics: [
      { id: 'trie_basic', label: '应用一：单词查找 (基础)' },
      { id: 'trie_count', label: '应用二：前缀统计 (进阶)' },
      { id: 'trie_xor', label: '应用三：01字典树/最大异或 (高阶)' }
    ]
  },
  {
    id: 'hash_module',
    label: '哈希表 (Hash)',
    icon: Hash,
    topics: [
      { id: 'hash_basic', label: '应用一：拉链法 (基础)' },
      { id: 'hash_collision', label: '应用二：开放寻址法 (进阶)' },
      { id: 'hash_rolling', label: '应用三：字符串哈希 (高阶)' }
    ]
  },
  {
    id: 'uf_module',
    label: '并查集 (Union Find)',
    icon: Network,
    topics: [
      { id: 'uf_basic', label: '应用一：连通性判断 (基础)' },
      { id: 'uf_path', label: '应用二：路径压缩 (进阶)' },
      { id: 'uf_enemy', label: '应用三：扩展域/敌人的敌人 (高阶)' }
    ]
  },
  {
    id: 'recursion_module',
    label: '递归函数 (Recursion)',
    icon: Repeat,
    topics: [
      { id: 'recursion_factorial', label: '阶乘 (Factorial)' },
      { id: 'recursion_fib', label: '斐波那契 (Call Tree)' },
      { id: 'recursion_gcd', label: '辗转相除法 (GCD)' },
      { id: 'recursion_string_rev', label: '字符串反转 (String)' },
      { id: 'recursion_reverse_list', label: '链表逆序输出 (List)' },
      { id: 'recursion_hanoi', label: '汉诺塔 (Hanoi)' },
      { id: 'recursion_fractal', label: '分形树 (Fractal)' },
      { id: 'recursion_perm', label: '全排列 (Permutations)' },
      { id: 'recursion_subset', label: '子集生成 (Subsets)' }
    ]
  },
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
    id: 'graph',
    label: '其他图论',
    icon: GitGraph,
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
  const [currentTopic, setCurrentTopic] = useState<Topic>('seg_basic'); 
  const [activeTab, setActiveTab] = useState<Tab>('story');
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({'dp_tree_module': true, 'dp_state_module': true});
  
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

  const mapTopicToContext = (topicId: Topic): { realTopic: Topic, level: CourseLevel } => {
      // Segment Tree Mapping
      if (topicId === 'seg_basic') return { realTopic: 'segment_tree', level: 'basic' };
      if (topicId === 'seg_lazy') return { realTopic: 'segment_tree', level: 'advanced' };
      if (topicId === 'seg_rmq') return { realTopic: 'segment_tree', level: 'expert' };
      
      // Trie Mapping
      if (topicId === 'trie_basic') return { realTopic: 'trie', level: 'basic' };
      if (topicId === 'trie_count') return { realTopic: 'trie', level: 'advanced' };
      if (topicId === 'trie_xor') return { realTopic: 'trie', level: 'expert' };

      // Hash Mapping
      if (topicId === 'hash_basic') return { realTopic: 'hash', level: 'basic' };
      if (topicId === 'hash_collision') return { realTopic: 'hash', level: 'advanced' };
      if (topicId === 'hash_rolling') return { realTopic: 'hash', level: 'expert' };

      // Union Find Mapping
      if (topicId === 'uf_basic') return { realTopic: 'union_find', level: 'basic' };
      if (topicId === 'uf_path') return { realTopic: 'union_find', level: 'advanced' };
      if (topicId === 'uf_enemy') return { realTopic: 'union_find', level: 'expert' };

      return { realTopic: topicId, level: 'basic' };
  };

  const { realTopic, level } = mapTopicToContext(currentTopic);

  const isLectureOnly = (topic: Topic) => {
    const legacyBase = ['segment_tree', 'trie', 'hash', 'union_find'];
    if (topic === 'seg_min') return false; 
    return !legacyBase.includes(realTopic);
  };

  const getAvailableTabs = (topicId: Topic) => {
    if (topicId === 'seg_min') {
         return [
            { id: 'lecture', label: '讲课模式', icon: School },
            { id: 'visualizer', label: '算法演示', icon: Activity },
            { id: 'practice', label: 'P1816 真题', icon: Layers }
        ];
    }
    if (isLectureOnly(realTopic)) {
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
    if (realTopic === 'segment_tree') {
        tabs.push({ id: 'practice', label: 'P3372 真题', icon: Layers });
    }
    return tabs;
  };

  const renderContent = () => {
    if (isLectureOnly(realTopic)) {
        if (activeTab === 'lecture') return <LectureMode topic={currentTopic} level={level} theme={currentTheme} />;
        if (activeTab === 'visualizer') return <Visualizer level={level} topic={currentTopic} theme={currentTheme} />;
        return <LectureMode topic={currentTopic} level={level} theme={currentTheme} />;
    }

    switch (activeTab) {
      case 'lecture': return <LectureMode topic={currentTopic} level={level} theme={currentTheme} />;
      case 'story': return <StorySection level={level} topic={realTopic} />;
      case 'visualizer': return <Visualizer level={level} topic={realTopic} theme={currentTheme} />;
      case 'guided': return <GuidedCoding level={level} topic={realTopic} />;
      case 'code': return <CodeLab level={level} topic={realTopic} />;
      case 'quiz': return <QuizSection level={level} />;
      case 'practice': return <ProblemPractice topic={currentTopic} />;
      default: return <StorySection level={level} topic={realTopic} />;
    }
  };

  const getCurrentLabel = () => {
      for (const cat of CATEGORIES) {
          const t = cat.topics.find(t => t.id === currentTopic);
          if (t) return t.label;
      }
      return currentTopic;
  }

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
        {/* Sidebar Navigation */}
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
                                         // Auto switch to Lecture Mode for modern topics
                                         if(t.id.startsWith('dp_')) setActiveTab('lecture');
                                         else if(currentTopic !== t.id) {
                                            const context = mapTopicToContext(t.id);
                                            if (t.id === 'seg_min') setActiveTab('lecture');
                                            else if(isLectureOnly(context.realTopic)) setActiveTab('lecture');
                                            else setActiveTab('story');
                                         }
                                     }}
                                     className={`w-full text-left px-3 py-2 rounded text-xs transition flex justify-between items-center ${currentTopic === t.id ? 'bg-primary/10 text-primary border border-primary/20' : 'text-gray-400 hover:bg-gray-800'}`}
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
                                                   className={`flex items-center gap-2 px-3 py-1.5 text-[10px] w-full rounded transition-colors ${activeTab === tab.id ? 'text-white bg-gray-700 font-medium' : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/50'}`}
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
          
          {/* Footer Info */}
          <div className="p-4 border-t border-gray-800 text-[10px] text-gray-500 text-center">
              v3.0.0 - State Compression DP
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col h-full overflow-hidden bg-dark transition-colors duration-300">
          <header className="h-16 border-b border-gray-800 flex items-center px-8 bg-dark/50 backdrop-blur-md sticky top-0 z-10 shrink-0">
            <div>
                <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                   {getCurrentLabel()}
                </h2>
                {!isLectureOnly(realTopic) && realTopic !== 'seg_min' && !realTopic.startsWith('dp_') && (
                    <span className={`text-xs px-2 py-0.5 rounded ml-1 border ${level === 'basic' ? 'border-green-800 text-green-500 bg-green-900/20' : level === 'advanced' ? 'border-yellow-800 text-yellow-500 bg-yellow-900/20' : 'border-purple-800 text-purple-500 bg-purple-900/20'}`}>
                        {level === 'basic' ? 'Basic Concepts' : level === 'advanced' ? 'Advanced Techniques' : 'Expert Applications'}
                    </span>
                )}
            </div>
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
