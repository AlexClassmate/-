
import React from 'react';
import { Users, StickyNote, TrendingUp, BarChart2, Search, Database, Network, Cpu, Hash, GitMerge, Zap } from 'lucide-react';
import { CourseLevel, Topic } from '../types';

interface Props {
  level: CourseLevel;
  topic: Topic;
}

const StorySection: React.FC<Props> = ({ level, topic }) => {
  
  // --- SEGMENT TREE CONTENT (Original) ---
  if (topic === 'segment_tree') {
    if (level === 'expert') {
      return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          <div className="bg-dark-lighter p-6 rounded-xl border border-gray-700 shadow-lg">
            <h2 className="text-2xl font-bold text-purple-400 mb-4 flex items-center gap-2">
               <TrendingUp /> 高阶篇：谁是单挑王 (RMQ)
            </h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>包工头最近很烦。老板不再关心“一共搬了多少砖”（求和），而是开始问：“在第 [L, R] 号工人里，谁搬得<strong>最多</strong>？”这就是传说中的 <strong>RMQ</strong> 问题。</p>
              <div className="bg-purple-900/20 border-l-4 border-purple-500 p-4 my-4">
                <h4 className="font-bold text-purple-200 mb-1">思维转变：从加法到PK</h4>
                <p className="text-sm">以前我们是把左右下属的业绩加起来 (Sum)。现在不同了，经理要组织“比武招亲”。<br/><strong>Push Up 逻辑</strong>：<code>tree[node] = max(tree[left], tree[right])</code>。</p>
              </div>
            </div>
          </div>
        </div>
      );
    }
    if (level === 'advanced') {
      return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          <div className="bg-dark-lighter p-6 rounded-xl border border-gray-700 shadow-lg">
            <h2 className="text-2xl font-bold text-accent mb-4 flex items-center gap-2">
               <StickyNote /> 进阶篇：懒惰的经理 (Lazy Propagation)
            </h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>在基础篇中，单点修改很容易。但如果大老板让你把 <span className="text-primary font-bold">[1, 10000]</span> 号工人的工资都涨 10 块钱，怎么办？暴力法会累死你。</p>
              <div className="bg-yellow-900/20 border-l-4 border-yellow-500 p-4 my-4">
                <h4 className="font-bold text-yellow-200 mb-1">懒惰标记 (Lazy Tag) 的智慧</h4>
                <p className="text-sm">聪明的经理（区间节点）不会立刻下发任务。他会做两件事：1. 立刻修改自己的账本；2. 在门口贴个便利贴(Tag)：“欠下属每人10块，下次有人查再给”。</p>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        <div className="bg-dark-lighter p-6 rounded-xl border border-gray-700 shadow-lg">
          <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
             <Users /> 基础篇：假如你是个包工头...
          </h2>
          <div className="space-y-4 text-gray-300 leading-relaxed">
            <p>想象一下，你手里有一个长度为 N 的大数组，这就像是一排工人。你需要经常做两件事：<strong>点名查账（区间查询）</strong>和<strong>即使反馈（单点修改）</strong>。</p>
            <div className="bg-blue-900/20 border-l-4 border-primary p-4 my-4">
              <h4 className="font-bold text-blue-200 mb-1">线段树登场</h4>
              <p className="text-sm">线段树就是建立了<strong>层级管理制度</strong>。你（Root）管两个大经理，大经理管中层，最后管工人。查询修改复杂度仅为 O(log N)。</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- TRIE CONTENT ---
  if (topic === 'trie') {
    if (level === 'basic') {
      return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          <div className="bg-dark-lighter p-6 rounded-xl border border-gray-700 shadow-lg">
            <h2 className="text-2xl font-bold text-secondary mb-4 flex items-center gap-2">
               <Search /> 基础篇：查字典的艺术
            </h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>如果我要你在一本乱序的单词本里找 "apple"，你得从头翻到尾。但如果是字典呢？你会先找 'a' 开头的区域，再找 'p'，再找 'p'...</p>
              <div className="bg-green-900/20 border-l-4 border-green-500 p-4 my-4">
                <h4 className="font-bold text-green-200 mb-1">字典树 (Trie) 的结构</h4>
                <p className="text-sm">
                   字典树就是把单词拆开，建成一棵树。根节点什么都不存，第一层节点代表单词的第一个字母，第二层代表第二个...
                   <br/>
                   如果有单词 "cat" 和 "car"，它们会共享前缀 "c" -&gt; "a"，然后在第三层分叉成 't' 和 'r'。省空间又快！
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }
    if (level === 'advanced') {
      return (
         <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          <div className="bg-dark-lighter p-6 rounded-xl border border-gray-700 shadow-lg">
            <h2 className="text-2xl font-bold text-accent mb-4 flex items-center gap-2">
               <BarChart2 /> 进阶篇：前缀统计与标记
            </h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>光能查单词是否存在太初级了。搜索引擎输入 "app" 时，为什么能瞬间告诉你以 "app" 开头的词有几百万个？</p>
              <div className="bg-yellow-900/20 border-l-4 border-yellow-500 p-4 my-4">
                <h4 className="font-bold text-yellow-200 mb-1">节点上的计数器</h4>
                <p className="text-sm">
                   我们在 Trie 的每个节点上加一个计数器 `count`。
                   <br/>
                   每当插入一个单词路过某个节点时，计数器 +1。
                   <br/>
                   这样，查前缀 "app" 时，只要走到第二个 'p' 这个节点，看它的 `count` 是多少，就知道有多少个单词经过了这里（即以此为前缀）。
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }
    if (level === 'expert') {
       return (
         <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          <div className="bg-dark-lighter p-6 rounded-xl border border-gray-700 shadow-lg">
            <h2 className="text-2xl font-bold text-purple-400 mb-4 flex items-center gap-2">
               <Cpu /> 高阶篇：01 字典树 (XOR 最值)
            </h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>Trie 不仅能存单词，还能存二进制数！把整数看成 32 位的 01 字符串。</p>
              <div className="bg-purple-900/20 border-l-4 border-purple-500 p-4 my-4">
                <h4 className="font-bold text-purple-200 mb-1">最大异或对问题</h4>
                <p className="text-sm">
                   给你一堆数，找两个数异或值最大。
                   <br/>
                   <strong>贪心策略</strong>：如果当前位是 1，我们希望找个这一位是 0 的数（异或得1）；如果是 0，就找 1。
                   <br/>
                   在高位尽量满足“不同”，就能让结果最大。在 01 Trie 上跑这个贪心，复杂度直接从 O(N^2) 降到 O(N log C)。
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  // --- HASH TABLE CONTENT ---
  if (topic === 'hash') {
    if (level === 'basic') {
       return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          <div className="bg-dark-lighter p-6 rounded-xl border border-gray-700 shadow-lg">
            <h2 className="text-2xl font-bold text-accent mb-4 flex items-center gap-2">
               <Hash /> 基础篇：神奇的储物柜
            </h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>你要去图书馆还书，如果书是乱放的，管理员得找死。但如果规定：“编号为 X 的书，必须放在第 (X % 100) 号柜子里”。</p>
              <div className="bg-orange-900/20 border-l-4 border-orange-500 p-4 my-4">
                <h4 className="font-bold text-orange-200 mb-1">直接寻址与映射</h4>
                <p className="text-sm">
                   这就是哈希表的核心：通过一个函数（哈希函数），把复杂的输入（如 "apple" 或 123456）直接映射到一个数组下标。
                   <br/>
                   理想情况下，查找时间是 O(1)，也就是“瞬间找到”。
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }
    if (level === 'advanced') {
       return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          <div className="bg-dark-lighter p-6 rounded-xl border border-gray-700 shadow-lg">
            <h2 className="text-2xl font-bold text-blue-400 mb-4 flex items-center gap-2">
               <GitMerge /> 进阶篇：撞车了怎么办？(冲突解决)
            </h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>接着上面的例子，第 1 号书放在 1 号柜，第 101 号书算出来也是 1 号柜。这就叫<strong>哈希冲突 (Collision)</strong>。</p>
              <div className="bg-blue-900/20 border-l-4 border-blue-500 p-4 my-4">
                <h4 className="font-bold text-blue-200 mb-1">拉链法 (Chaining)</h4>
                <p className="text-sm">
                   柜子里不直接放书，而是放一个“吊牌”或者链表。
                   <br/>
                   1 号书来了，挂在 1 号柜；101 号书来了，挂在 1 号书下面。
                   <br/>
                   虽然找的时候要顺着链表摸一下，但只要链表不长，速度依然飞快。
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }
    if (level === 'expert') {
       return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          <div className="bg-dark-lighter p-6 rounded-xl border border-gray-700 shadow-lg">
            <h2 className="text-2xl font-bold text-purple-400 mb-4 flex items-center gap-2">
               <Database /> 高阶篇：字符串哈希 (Rolling Hash)
            </h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>如何快速判断两个长文章片段是否相同？逐字比较太慢 (O(L))。能不能把字符串变成一个整数指纹？</p>
              <div className="bg-purple-900/20 border-l-4 border-purple-500 p-4 my-4">
                <h4 className="font-bold text-purple-200 mb-1">滚动哈希</h4>
                <p className="text-sm">
                   把字符串看成一个 P 进制的数。
                   <br/>
                   Hash("abc") = ('a'*P^2 + 'b'*P^1 + 'c'*P^0) % M。
                   <br/>
                   它的神奇之处在于，当你从 "abc" 变成 "bcd" 时，不需要重新算，只需要去掉 'a' 的影响，左移一位，加上 'd'。这让子串匹配（Rabin-Karp）快得飞起。
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  // --- UNION FIND CONTENT ---
  if (topic === 'union_find') {
     if (level === 'basic') {
       return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          <div className="bg-dark-lighter p-6 rounded-xl border border-gray-700 shadow-lg">
            <h2 className="text-2xl font-bold text-purple-400 mb-4 flex items-center gap-2">
               <Network /> 基础篇：找老大
            </h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>并查集（DSU）专门解决“朋友圈”问题。A 和 B 是朋友，B 和 C 是朋友，那 A 和 C 也是一伙的。</p>
              <div className="bg-purple-900/20 border-l-4 border-purple-500 p-4 my-4">
                <h4 className="font-bold text-purple-200 mb-1">认大哥逻辑</h4>
                <p className="text-sm">
                   一开始每个人都是自己的老大。
                   <br/>
                   A 认识了 B，A 打不过 B，于是 A 认 B 做大哥（parent[A] = B）。
                   <br/>
                   判断两个人是不是一伙的，只要看他们的大哥（递归找根节点）是不是同一个人就行了！
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }
    if (level === 'advanced') {
       return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          <div className="bg-dark-lighter p-6 rounded-xl border border-gray-700 shadow-lg">
            <h2 className="text-2xl font-bold text-accent mb-4 flex items-center gap-2">
               <Zap /> 进阶篇：路径压缩 (Path Compression)
            </h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>如果层级太多：A-&gt;B-&gt;C-&gt;D-&gt;...-&gt;Z，每次 A 找大哥 Z 都要跑断腿。这叫“长链”问题。</p>
              <div className="bg-yellow-900/20 border-l-4 border-yellow-500 p-4 my-4">
                <h4 className="font-bold text-yellow-200 mb-1">越级汇报</h4>
                <p className="text-sm">
                   既然 A 知道最终大哥是 Z，下次找的时候，不如直接把 A 的父节点改成 Z！(parent[A] = Z)。
                   <br/>
                   这就是路径压缩。一次查找后，路径上所有人都直接挂在老大名下，树瞬间变扁平，下次查找就是 O(1)。
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }
    if (level === 'expert') {
       return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          <div className="bg-dark-lighter p-6 rounded-xl border border-gray-700 shadow-lg">
            <h2 className="text-2xl font-bold text-red-400 mb-4 flex items-center gap-2">
               <TrendingUp /> 高阶篇：敌人的敌人是朋友 (种类并查集)
            </h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>普通的并查集只知道“在一起”。但如果关系更复杂：A 和 B 是敌人，B 和 C 是敌人，那 A 和 C 可能是朋友。</p>
              <div className="bg-red-900/20 border-l-4 border-red-500 p-4 my-4">
                <h4 className="font-bold text-red-200 mb-1">扩展域并查集</h4>
                <p className="text-sm">
                   我们把每个人拆成两个点：A(本体) 和 A'(敌人域)。
                   <br/>
                   如果 A 和 B 是敌人，就把 A 和 B' 连起来，B 和 A' 连起来。
                   <br/>
                   这样，如果 A 和 C 是朋友，它们会在同一个集合；如果是敌人，会在互补集合。这能解决经典的“食物链”问题。
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="flex items-center justify-center h-full text-gray-500 italic p-8 border border-dashed border-gray-700 rounded-xl">
        <p>Please select a specific Data Structure topic (Segment Tree, Trie, Hash, Union Find) to view its story.</p>
    </div>
  );
};

export default StorySection;
