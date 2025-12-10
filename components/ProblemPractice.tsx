
import React, { useState } from 'react';
import { BookOpen, Lightbulb, AlertTriangle, FileCode, Copy, Check } from 'lucide-react';

const ProblemPractice: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'problem' | 'solution'>('problem');
  const [copied, setCopied] = useState(false);

  const solutionCode = `#include <iostream>
using namespace std;

// 必须使用 long long，因为题目中说和不超过 2*10^18
// int (通常 2*10^9) 会溢出
typedef long long ll;

const int MAXN = 100005;
ll arr[MAXN];
ll tree[MAXN * 4]; // 线段树数组开 4 倍
ll lazy[MAXN * 4]; // 懒标记数组
int n, m;

// 向上更新 (Push Up)
void push_up(int node) {
    tree[node] = tree[node * 2] + tree[node * 2 + 1];
}

// 向下传递懒标记 (Push Down)
// 这是区间修改的核心：只有当需要访问子节点时，才把任务下发
void push_down(int node, int start, int end) {
    // 如果当前节点没有标记，直接返回
    if (lazy[node] == 0) return;

    int mid = (start + end) / 2;
    int left = node * 2;
    int right = node * 2 + 1;

    // 1. 更新左子节点
    // 左子节点的值 += 标记值 * 左区间长度
    tree[left] += lazy[node] * (mid - start + 1);
    // 标记累加（注意是 +=）
    lazy[left] += lazy[node];

    // 2. 更新右子节点
    tree[right] += lazy[node] * (end - mid);
    lazy[right] += lazy[node];

    // 3. 清除当前节点的标记
    lazy[node] = 0;
}

// 建树
void build(int node, int start, int end) {
    if (start == end) {
        tree[node] = arr[start];
        return;
    }
    int mid = (start + end) / 2;
    build(node * 2, start, mid);
    build(node * 2 + 1, mid + 1, end);
    push_up(node);
}

// 区间修改：[L, R] 加上 k
void update(int node, int start, int end, int L, int R, ll k) {
    // 1. 如果当前区间完全在查询范围内
    if (L <= start && end <= R) {
        // 直接更新当前节点的值
        tree[node] += k * (end - start + 1);
        // 打上懒标记
        lazy[node] += k;
        return;
    }

    // 2. 如果不完全包含，先下放标记，再处理子节点
    push_down(node, start, end);

    int mid = (start + end) / 2;
    if (L <= mid) update(node * 2, start, mid, L, R, k);
    if (R > mid) update(node * 2 + 1, mid + 1, end, L, R, k);

    // 3. 子节点更新完后，更新当前节点
    push_up(node);
}

// 区间查询：求 [L, R] 的和
ll query(int node, int start, int end, int L, int R) {
    if (L <= start && end <= R) {
        return tree[node];
    }

    // 查询前也必须下放标记，否则子节点的数据可能是旧的
    push_down(node, start, end);

    int mid = (start + end) / 2;
    ll sum = 0;
    if (L <= mid) sum += query(node * 2, start, mid, L, R);
    if (R > mid) sum += query(node * 2 + 1, mid + 1, end, L, R);
    
    return sum;
}

int main() {
    // 加速输入输出，防止超时
    ios::sync_with_stdio(0); 
    cin.tie(0);

    cin >> n >> m;
    for(int i = 1; i <= n; i++) {
        cin >> arr[i];
    }

    build(1, 1, n);

    for(int i = 0; i < m; i++) {
        int op;
        cin >> op;
        if (op == 1) {
            int x, y;
            ll k;
            cin >> x >> y >> k;
            update(1, 1, n, x, y, k);
        } else {
            int x, y;
            cin >> x >> y;
            cout << query(1, 1, n, x, y) << "\\n";
        }
    }
    return 0;
}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(solutionCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex h-full gap-6 animate-fade-in flex-col max-w-5xl mx-auto">
       {/* Top Navigation */}
       <div className="flex bg-dark-lighter rounded-xl p-1 shrink-0 border border-gray-700 w-full sm:w-fit mx-auto sm:mx-0">
          <button 
            onClick={() => setActiveTab('problem')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition ${activeTab === 'problem' ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
          >
            <BookOpen className="w-4 h-4" />
            题目描述
          </button>
          <button 
              onClick={() => setActiveTab('solution')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition ${activeTab === 'solution' ? 'bg-accent text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
          >
            <Lightbulb className="w-4 h-4" />
            题解与代码
          </button>
       </div>

       {/* Content Area */}
       <div className="flex-1 bg-dark-lighter rounded-2xl border border-gray-700 shadow-2xl overflow-hidden flex flex-col relative">
          
          {/* TAB 1: PROBLEM DESCRIPTION (MARKDOWN STYLE) */}
          {activeTab === 'problem' && (
            <div className="flex-1 overflow-auto p-8 lg:px-12 text-gray-300 leading-7">
                <div className="flex items-center gap-3 mb-8 border-b border-gray-700 pb-6">
                  <div className="bg-primary/20 px-3 py-1 rounded text-primary font-mono font-bold text-lg">P3372</div>
                  <h1 className="text-3xl font-bold text-white">【模板】线段树 1</h1>
                </div>
                
                <div className="space-y-8">
                  {/* Description */}
                  <section>
                    <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-primary pl-4 flex items-center">
                      题目描述
                    </h2>
                    <div className="prose prose-invert max-w-none">
                      <p className="mb-4">如题，已知一个数列 <code className="bg-black/30 px-1.5 py-0.5 rounded font-mono text-primary text-sm">{"{a_i}"}</code>，你需要进行下面两种操作：</p>
                      <ol className="list-decimal pl-6 space-y-2 bg-black/20 p-4 rounded-lg border border-gray-800">
                        <li>将某区间 <span className="font-mono text-yellow-500">[x, y]</span> 每一个数加上 <span className="font-mono text-yellow-500">k</span>。</li>
                        <li>求出某区间 <span className="font-mono text-yellow-500">[x, y]</span> 每一个数的和。</li>
                      </ol>
                    </div>
                  </section>

                  {/* Input Format */}
                  <section>
                    <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-primary pl-4">输入格式</h2>
                    <div className="text-gray-300 space-y-2">
                      <p>第一行包含两个整数 <span className="font-mono text-gray-400">n, m</span>，分别表示该数列数字的个数和操作的总个数。</p>
                      <p>第二行包含 <span className="font-mono text-gray-400">n</span> 个用空格分隔的整数 <span className="font-mono text-gray-400">a_i</span>，其中第 <span className="font-mono text-gray-400">i</span> 个数字表示数列第 <span className="font-mono text-gray-400">i</span> 项的初始值。</p>
                      <p>接下来 <span className="font-mono text-gray-400">m</span> 行每行包含 3 或 4 个整数，表示一个操作，具体如下：</p>
                      <ul className="list-disc pl-6 mt-2 space-y-2 font-mono text-sm bg-black/40 p-4 rounded border border-gray-700">
                        <li><span className="text-accent font-bold">1 x y k</span> ：将区间 [x, y] 内每个数加上 k。</li>
                        <li><span className="text-accent font-bold">2 x y</span> ：输出区间 [x, y] 内每个数的和。</li>
                      </ul>
                    </div>
                  </section>

                  {/* Output Format */}
                  <section>
                    <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-primary pl-4">输出格式</h2>
                    <p>输出包含若干行整数，即为所有操作 2 的结果。</p>
                  </section>
                  
                  {/* Examples */}
                   <section>
                    <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-primary pl-4">输入输出样例</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-black/40 rounded-lg overflow-hidden border border-gray-700">
                         <div className="bg-gray-800/50 px-4 py-2 text-xs text-gray-400 border-b border-gray-700 font-mono">输入 #1</div>
                         <pre className="p-4 font-mono text-sm text-gray-300 overflow-x-auto">
{`5 5
1 5 4 2 3
2 2 4
1 2 3 2
2 3 4
1 1 5 1
2 1 4`}
                         </pre>
                      </div>
                       <div className="bg-black/40 rounded-lg overflow-hidden border border-gray-700">
                         <div className="bg-gray-800/50 px-4 py-2 text-xs text-gray-400 border-b border-gray-700 font-mono">输出 #1</div>
                         <pre className="p-4 font-mono text-sm text-gray-300 overflow-x-auto">
{`11
8
20`}
                         </pre>
                      </div>
                    </div>
                  </section>

                  {/* Hint */}
                  <section>
                    <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-primary pl-4">说明/提示</h2>
                    <div className="bg-blue-900/10 border border-blue-900/30 rounded-lg p-5">
                      <ul className="list-disc pl-5 space-y-2 text-sm text-gray-300">
                        <li>对于 30% 的数据：<span className="font-mono">n ≤ 10, m ≤ 10</span>。</li>
                        <li>对于 70% 的数据：<span className="font-mono">n ≤ 10^3, m ≤ 10^4</span>。</li>
                        <li>对于 100% 的数据：<span className="font-mono">1 ≤ n, m ≤ 10^5</span>。</li>
                        <li className="text-yellow-400 font-bold">重要：a_i, k 为正数，且任意时刻数列的和不超过 2 × 10^18。</li>
                      </ul>
                    </div>
                  </section>
                </div>
            </div>
          )}

          {/* TAB 2: SOLUTION & CODE */}
          {activeTab === 'solution' && (
            <div className="flex-1 overflow-auto bg-[#0d1117]">
               <div className="p-8 lg:px-12 max-w-4xl mx-auto space-y-10">
                  
                  {/* Approach */}
                  <section className="space-y-4">
                     <h2 className="text-2xl font-bold text-accent flex items-center gap-2">
                       <Lightbulb className="w-6 h-6" />
                       解题思路：懒惰标记 (Lazy Tag)
                     </h2>
                     <div className="text-gray-300 leading-relaxed space-y-4">
                        <p>
                          这道题是线段树<strong>区间修改</strong>最经典的模板题。
                          如果使用朴素的 O(N) 循环来一个个加，总复杂度会达到 O(NM)，在 N, M = 10^5 时会超时（需要约 100亿次运算）。
                        </p>
                        <p>
                          线段树通过<strong>懒惰标记</strong>将区间修改的复杂度降为 <strong>O(log N)</strong>。
                          核心思想是：<span className="text-white font-bold bg-white/10 px-1 rounded">“不到万不得已，不干活”</span>。
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                           <div className="bg-dark p-4 rounded-lg border border-gray-700">
                              <h4 className="text-primary font-bold mb-2">Update 时</h4>
                              <p className="text-sm text-gray-400">如果当前节点区间完全在修改范围内，直接修改该节点的值（Sum + len * k），打上 Tag，然后直接返回，不再递归。</p>
                           </div>
                           <div className="bg-dark p-4 rounded-lg border border-gray-700">
                              <h4 className="text-purple-400 font-bold mb-2">Push Down</h4>
                              <p className="text-sm text-gray-400">只有当以后需要访问该节点的子节点时（查询或更细粒度的修改），才把 Tag 下发给两个子节点。</p>
                           </div>
                        </div>
                     </div>
                  </section>

                  {/* Pitfalls */}
                  <section className="space-y-4">
                     <h2 className="text-2xl font-bold text-red-400 flex items-center gap-2">
                       <AlertTriangle className="w-6 h-6" />
                       避坑指南 (注意事项)
                     </h2>
                     <div className="bg-red-900/10 border border-red-900/30 rounded-xl p-6 space-y-3">
                        <div className="flex gap-3">
                           <span className="bg-red-500/20 text-red-400 font-mono text-xs px-2 py-1 rounded h-fit shrink-0">INT OVERFLOW</span>
                           <p className="text-sm text-gray-300">题目提示数据和可达 <span className="font-mono">2*10^18</span>。<code>int</code> 最大只有约 <span className="font-mono">2*10^9</span>，必爆！<strong className="text-white">必须全程使用 long long</strong>。</p>
                        </div>
                        <div className="flex gap-3">
                           <span className="bg-red-500/20 text-red-400 font-mono text-xs px-2 py-1 rounded h-fit shrink-0">ARRAY SIZE</span>
                           <p className="text-sm text-gray-300">线段树数组 <code>tree[]</code> 和 <code>lazy[]</code> 都要开 <strong className="text-white">4 * N</strong> 大小，否则会越界 (Runtime Error)。</p>
                        </div>
                        <div className="flex gap-3">
                           <span className="bg-red-500/20 text-red-400 font-mono text-xs px-2 py-1 rounded h-fit shrink-0">LAZY LOGIC</span>
                           <p className="text-sm text-gray-300">下放标记时，子节点的值增加量 = <code className="text-yellow-400">lazy * 区间长度</code>，不要忘了乘长度！同时标记是<strong className="text-white">累加 (+=)</strong> 而不是覆盖 (=)。</p>
                        </div>
                     </div>
                  </section>

                  {/* Code */}
                  <section className="space-y-4">
                     <div className="flex justify-between items-end">
                        <h2 className="text-2xl font-bold text-green-400 flex items-center gap-2">
                          <FileCode className="w-6 h-6" />
                          标准代码 (C++ Solution)
                        </h2>
                        <button 
                          onClick={handleCopy}
                          className="flex items-center gap-2 text-xs bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded transition"
                        >
                          {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                          {copied ? "已复制" : "复制代码"}
                        </button>
                     </div>
                     
                     <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-lg opacity-20 group-hover:opacity-40 transition blur"></div>
                        <div className="relative bg-[#1e1e1e] rounded-lg border border-gray-700 overflow-hidden shadow-2xl">
                           <div className="flex items-center gap-2 px-4 py-2 bg-[#2d2d2d] border-b border-black/30">
                              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                              <span className="ml-2 text-xs text-gray-500 font-mono">solution.cpp</span>
                           </div>
                           <pre className="p-6 overflow-x-auto text-sm font-mono leading-relaxed text-gray-300">
                             <code dangerouslySetInnerHTML={{
                               __html: solutionCode
                                 .replace(/</g, '&lt;')
                                 .replace(/>/g, '&gt;')
                                 .replace(/\/\/.*/g, '<span class="text-gray-500 italic">$&</span>')
                                 .replace(/\b(int|void|using|namespace|return|if|else|const|for|while|long long|typedef)\b/g, '<span class="text-purple-400">$1</span>')
                                 .replace(/\b(tree|arr|lazy|push_up|push_down|build|update|query|main)\b/g, '<span class="text-yellow-200">$1</span>')
                                 .replace(/#include\s+&lt;[^&]+&gt;/g, '<span class="text-blue-400">$&</span>')
                             }} />
                           </pre>
                        </div>
                     </div>
                  </section>
               </div>
            </div>
          )}

       </div>
    </div>
  );
};

export default ProblemPractice;
