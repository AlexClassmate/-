import React from 'react';
import { BookOpen, Users, Package } from 'lucide-react';

const StorySection: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="bg-dark-lighter p-6 rounded-xl border border-gray-700 shadow-lg">
        <h2 className="text-2xl font-bold text-accent mb-4 flex items-center gap-2">
           <Users /> 假如你是个包工头...
        </h2>
        <div className="space-y-4 text-gray-300 leading-relaxed">
          <p>
            想象一下，你手里有一个长度为 <span className="text-primary font-mono font-bold">N</span> 的大数组，这就像是一排站得整整齐齐的工人。
            你需要经常做两件事：
          </p>
          <ol className="list-decimal pl-6 space-y-2">
            <li><strong>点名查账（区间查询）</strong>：老板突然问你：“从第 2 个工人到第 100 个工人，他们一共搬了多少块砖？”</li>
            <li><strong>即使反馈（单点修改）</strong>：第 5 号工人突然吃了大力菠菜，搬砖数从 10 变成了 50，你需要马上更新记录。</li>
          </ol>
          <p>
            如果用普通数组（暴力法），查账要一个个加（O(N)），慢得像蜗牛。如果你是个暴躁的老板，查询几百万次，你早就崩溃了。
          </p>
          <div className="bg-blue-900/20 border-l-4 border-primary p-4 my-4">
            <h4 className="font-bold text-blue-200 mb-1">这就是线段树登场的时候！</h4>
            <p className="text-sm">
              线段树就是建立了<strong>层级管理制度</strong>。
              你（Root）管两个大经理，大经理管中层干部，中层干部管小组长... 最后小组长管具体的工人（叶子节点）。
            </p>
          </div>
          <p>
            当你要查 [1, 100] 的总和时，你不需要问 100 个工人。你只需要问几个管理 [1, 50], [51, 100] 的经理，把他们汇报的数字加起来就行了。
            这一下就把复杂度从 <span className="text-red-400">O(N)</span> 降到了 <span className="text-green-400">O(log N)</span>。
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-dark-lighter p-6 rounded-xl border border-gray-700">
           <h3 className="text-lg font-bold text-secondary mb-3 flex items-center gap-2">
             <Package /> 核心性质
           </h3>
           <ul className="space-y-2 text-sm text-gray-400">
             <li>• <strong>二叉树结构</strong>：每个节点代表一个区间。</li>
             <li>• <strong>空间开销</strong>：通常开 <code className="bg-gray-800 px-1 rounded">4*N</code> 的数组空间就够了，不用怕爆栈。</li>
             <li>• <strong>叶子节点</strong>：代表原数组中的单个元素。</li>
             <li>• <strong>非叶子节点</strong>：存储左右孩子的值的聚合（如 Sum, Max, Min）。</li>
           </ul>
        </div>
        <div className="bg-dark-lighter p-6 rounded-xl border border-gray-700">
           <h3 className="text-lg font-bold text-purple-400 mb-3 flex items-center gap-2">
             <BookOpen /> 懒惰标记 (Lazy Tag)
           </h3>
           <p className="text-sm text-gray-400 mb-2">
             这是线段树最“像人”的地方。如果要修改一个大区间，聪明的管理者不会马上下去通知每个人。
           </p>
           <p className="text-sm text-gray-400">
             他会在自己的备忘录上贴个条子（Tag）：<strong>"这一片区域都要+10，但我先不干，等有人真要查具体的细节时，我再把任务下发给手下。"</strong>
             这就是 O(log N) 区间修改的精髓。
           </p>
        </div>
      </div>
    </div>
  );
};

export default StorySection;
