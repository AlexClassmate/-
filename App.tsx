import React, { useState } from 'react';
import { Network, BookOpen, Code, Trophy, Activity, Terminal, Layers, Box, ChevronRight, TrendingUp, Cpu } from 'lucide-react';
import Visualizer from './components/Visualizer';
import StorySection from './components/StorySection';
import QuizSection from './components/QuizSection';
import CodeLab from './components/CodeLab';
import GuidedCoding from './components/GuidedCoding';
import ProblemPractice from './components/ProblemPractice';
import { CourseLevel } from './types';

type Tab = 'story' | 'visualizer' | 'code' | 'quiz' | 'guided' | 'practice';

const App: React.FC = () => {
  const [currentLevel, setCurrentLevel] = useState<CourseLevel>('basic');
  const [activeTab, setActiveTab] = useState<Tab>('story');

  const renderContent = () => {
    switch (activeTab) {
      case 'story': return <StorySection level={currentLevel} />;
      case 'visualizer': return <Visualizer level={currentLevel} />;
      case 'guided': return <GuidedCoding level={currentLevel} />;
      case 'code': return <CodeLab level={currentLevel} />;
      case 'quiz': return <QuizSection level={currentLevel} />;
      case 'practice': return <ProblemPractice />;
      default: return <StorySection level={currentLevel} />;
    }
  };

  const NavItem = ({ tab, label, icon: Icon }: { tab: Tab, label: string, icon: any }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium ${
        activeTab === tab 
          ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' 
          : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-dark text-gray-100 flex font-sans overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-64 bg-dark-lighter border-r border-gray-800 flex flex-col shrink-0 h-screen">
        <div className="p-6 flex items-center gap-3 border-b border-gray-800">
          <div className="bg-primary/20 p-2 rounded-lg">
            <Network className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-lg font-bold text-white tracking-tight">SegTree Master</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Basic Course */}
          <div>
            <button 
              onClick={() => { setCurrentLevel('basic'); setActiveTab('story'); }}
              className={`w-full text-left px-3 py-2 rounded mb-2 flex items-center justify-between group transition ${
                currentLevel === 'basic' ? 'bg-primary text-white' : 'hover:bg-gray-800 text-gray-400'
              }`}
            >
              <div className="flex items-center gap-2 font-bold">
                 <Box className="w-4 h-4" /> 基础线段树
              </div>
              {currentLevel === 'basic' && <ChevronRight className="w-4 h-4" />}
            </button>
            
            {currentLevel === 'basic' && (
              <div className="space-y-1 pl-2 animate-fade-in">
                <NavItem tab="story" label="教程：包工头的故事" icon={BookOpen} />
                <NavItem tab="visualizer" label="演示：点更新 & 查询" icon={Activity} />
                <NavItem tab="guided" label="实战：手写基础版" icon={Terminal} />
                <NavItem tab="code" label="代码：Standard" icon={Code} />
                <NavItem tab="quiz" label="闯关：基础测试" icon={Trophy} />
              </div>
            )}
          </div>

          {/* Advanced Course */}
          <div>
            <button 
              onClick={() => { setCurrentLevel('advanced'); setActiveTab('story'); }}
              className={`w-full text-left px-3 py-2 rounded mb-2 flex items-center justify-between group transition ${
                currentLevel === 'advanced' ? 'bg-accent text-white' : 'hover:bg-gray-800 text-gray-400'
              }`}
            >
              <div className="flex items-center gap-2 font-bold">
                 <Layers className="w-4 h-4" /> 线段树进阶
              </div>
              {currentLevel === 'advanced' && <ChevronRight className="w-4 h-4" />}
            </button>
            
            {currentLevel === 'advanced' && (
              <div className="space-y-1 pl-2 animate-fade-in">
                <NavItem tab="story" label="教程：懒惰标记" icon={BookOpen} />
                <NavItem tab="visualizer" label="演示：区间修改" icon={Activity} />
                <NavItem tab="guided" label="实战：手写 Lazy" icon={Terminal} />
                <NavItem tab="practice" label="演练：P3372 模板" icon={Cpu} />
                <NavItem tab="code" label="代码：Lazy Prop" icon={Code} />
                <NavItem tab="quiz" label="闯关：进阶测试" icon={Trophy} />
              </div>
            )}
          </div>

          {/* Expert Course */}
          <div>
            <button 
              onClick={() => { setCurrentLevel('expert'); setActiveTab('story'); }}
              className={`w-full text-left px-3 py-2 rounded mb-2 flex items-center justify-between group transition ${
                currentLevel === 'expert' ? 'bg-purple-600 text-white' : 'hover:bg-gray-800 text-gray-400'
              }`}
            >
              <div className="flex items-center gap-2 font-bold">
                 <TrendingUp className="w-4 h-4" /> 线段树高阶
              </div>
              {currentLevel === 'expert' && <ChevronRight className="w-4 h-4" />}
            </button>
            
            {currentLevel === 'expert' && (
              <div className="space-y-1 pl-2 animate-fade-in">
                <NavItem tab="story" label="教程：区间最值" icon={BookOpen} />
                <NavItem tab="visualizer" label="演示：RMQ 查询" icon={Activity} />
                <NavItem tab="guided" label="实战：手写 RMQ" icon={Terminal} />
                <NavItem tab="code" label="代码：Max Query" icon={Code} />
                <NavItem tab="quiz" label="闯关：高阶测试" icon={Trophy} />
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-gray-800 text-center">
           <p className="text-xs text-gray-500">v3.1 Interactive Learning</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 border-b border-gray-800 flex items-center px-8 bg-dark/50 backdrop-blur-md sticky top-0 z-10">
          <h2 className="text-xl font-bold flex items-center gap-2">
             <span className={`w-2 h-6 rounded-full ${
               currentLevel === 'basic' ? 'bg-primary' : 
               currentLevel === 'advanced' ? 'bg-accent' : 'bg-purple-600'
              }`}></span>
             {currentLevel === 'basic' && '基础篇：单点修改与区间查询'}
             {currentLevel === 'advanced' && '进阶篇：区间修改与懒惰标记'}
             {currentLevel === 'expert' && '高阶篇：区间最值 (RMQ)'}
          </h2>
        </header>
        <div className="flex-1 overflow-auto p-6 lg:p-8">
           {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
