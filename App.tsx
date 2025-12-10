import React, { useState } from 'react';
import { Network, BookOpen, Code, Trophy, Activity, Terminal } from 'lucide-react';
import Visualizer from './components/Visualizer';
import StorySection from './components/StorySection';
import QuizSection from './components/QuizSection';
import CodeLab from './components/CodeLab';
import GuidedCoding from './components/GuidedCoding';

type Tab = 'story' | 'visualizer' | 'code' | 'quiz' | 'guided';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('story');

  const renderContent = () => {
    switch (activeTab) {
      case 'story': return <StorySection />;
      case 'visualizer': return <Visualizer />;
      case 'guided': return <GuidedCoding />;
      case 'code': return <CodeLab />;
      case 'quiz': return <QuizSection />;
      default: return <StorySection />;
    }
  };

  return (
    <div className="min-h-screen bg-dark text-gray-100 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-dark-lighter border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/20 p-2 rounded-lg">
              <Network className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent hidden sm:block">
              SegTree Master
            </h1>
          </div>
          
          <nav className="flex gap-1 bg-gray-900 p-1 rounded-lg overflow-x-auto">
            <button 
              onClick={() => setActiveTab('story')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-md transition-all text-sm font-medium whitespace-nowrap ${
                activeTab === 'story' ? 'bg-gray-700 text-white shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" /> <span className="hidden sm:inline">教程</span>
            </button>
            <button 
              onClick={() => setActiveTab('visualizer')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-md transition-all text-sm font-medium whitespace-nowrap ${
                activeTab === 'visualizer' ? 'bg-primary text-white shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Activity className="w-4 h-4" /> <span className="hidden sm:inline">演示</span>
            </button>
            <button 
              onClick={() => setActiveTab('guided')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-md transition-all text-sm font-medium whitespace-nowrap ${
                activeTab === 'guided' ? 'bg-emerald-600 text-white shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Terminal className="w-4 h-4" /> <span className="hidden sm:inline">实战</span>
            </button>
            <button 
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-md transition-all text-sm font-medium whitespace-nowrap ${
                activeTab === 'code' ? 'bg-gray-700 text-white shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Code className="w-4 h-4" /> <span className="hidden sm:inline">代码</span>
            </button>
             <button 
              onClick={() => setActiveTab('quiz')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-md transition-all text-sm font-medium whitespace-nowrap ${
                activeTab === 'quiz' ? 'bg-accent text-white shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Trophy className="w-4 h-4" /> <span className="hidden sm:inline">闯关</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8 overflow-hidden h-[calc(100vh-64px)]">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
