import React from 'react';
import { BookOpen, Users, Package, StickyNote, Zap } from 'lucide-react';
import { CourseLevel } from '../types';

interface Props {
  level: CourseLevel;
}

const StorySection: React.FC<Props> = ({ level }) => {
  if (level === 'advanced') {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        <div className="bg-dark-lighter p-6 rounded-xl border border-gray-700 shadow-lg">
          <h2 className="text-2xl font-bold text-accent mb-4 flex items-center gap-2">
             <StickyNote /> 进阶篇：懒惰的经理 (Lazy Propagation)
          </h2>
          <div className="space-y-4 text-gray-300 leading-relaxed">
            <p>
              在基础篇中，单点修改很容易。但如果大老板让你把 <span className="text-primary font-bold">[1, 10000]</span> 号工人的工资都涨 10 块钱，怎么办？
            </p>
            <p>
              如果你一个个去改（遍历叶子节点），这和暴力法没区别，复杂度又回到了 O(N)。这就像你要通知一万个人，累死你。
            </p>
            <div className="bg-yellow-900/20 border-l-4 border-yellow-500 p-4 my-4">
              <h4 className="font-bold text-yellow-200 mb-1">懒惰标记 (Lazy Tag) 的智慧</h4>
              <p className="text-sm">
                聪明的经理（区间节点）不会立刻下发任务。他会做两件事：
                <ol className="list-decimal pl-5 mt-2 space-y-1">
                  <li><strong>立刻修改自己的账本</strong>：当前区间总和 += (人数 * 10)。</li>
                  <li><strong>贴个便利贴 (Tag)</strong>：在办公室门口贴条："欠下属每人 10 块钱，下次有人来查细账再通知下去"。</li>
                </ol>
              </p>
            </div>
            <p>
              这就是<strong>区间修改 O(log N)</strong> 的秘密。只有当必须访问子节点（比如查区间 [1, 5]）时，经理才会被迫把便利贴撕下来，把任务下发给两个下属（Push Down）。
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-dark-lighter p-6 rounded-xl border border-gray-700">
             <h3 className="text-lg font-bold text-purple-400 mb-3 flex items-center gap-2">
               <Zap /> 核心操作：Push Down
             </h3>
             <p className="text-sm text-gray-400">
               下放标记的过程。当访问到一个有 Tag 的节点时，必须先把 Tag 给左、右孩子加上，并更新孩子的值，然后把自己的 Tag 清零。
               这保证了任何时候访问到的数据都是最新的。
             </p>
          </div>
          <div className="bg-dark-lighter p-6 rounded-xl border border-gray-700">
             <h3 className="text-lg font-bold text-secondary mb-3 flex items-center gap-2">
               <Package /> 区间最值 (RMQ)
             </h3>
             <p className="text-sm text-gray-400">
               除了求和，线段树也可以维护最大值/最小值。原理一样：Push Up 时取 <code>max(left, right)</code>，但注意懒标记的处理逻辑会有所不同（比如区间赋值 vs 区间增加）。
             </p>
          </div>
        </div>
      </div>
    );
  }

  // Basic Level Content
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="bg-dark-lighter p-6 rounded-xl border border-gray-700 shadow-lg">
        <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
           <Users /> 基础篇：假如你是个包工头...
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
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-dark-lighter p-6 rounded-xl border border-gray-700">
           <h3 className="text-lg font-bold text-secondary mb-3 flex items-center gap-2">
             <Package /> 核心性质
           </h3>
           <ul className="space-y-2 text-sm text-gray-400">
             <li>• <strong>二叉树结构</strong>：每个节点代表一个区间。</li>
             <li>• <strong>空间开销</strong>：通常开 <code className="bg-gray-800 px-1 rounded">4*N</code> 的数组空间就够了。</li>
             <li>• <strong>复杂度</strong>：建树 O(N)，查询和修改都是 O(log N)。</li>
           </ul>
        </div>
      </div>
    </div>
  );
};

export default StorySection;
