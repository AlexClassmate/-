
import React, { useState } from 'react';
import { BookOpen, Lightbulb, AlertTriangle, FileCode, Copy, Check } from 'lucide-react';
import { Topic } from '../types';

interface Props {
    topic?: Topic;
}

const P3372_DATA = {
    id: "P3372",
    title: "【模板】线段树 1",
    desc: `如题，已知一个数列 \`{a_i}\`，你需要进行下面两种操作：
1. 将某区间 \`[x, y]\` 每一个数加上 \`k\`。
2. 求出某区间 \`[x, y]\` 每一个数的和。`,
    inputDesc: `第一行包含两个整数 n, m，分别表示该数列数字的个数和操作的总个数。
第二行包含 n 个用空格分隔的整数 a_i。
接下来 m 行每行包含 3 或 4 个整数，表示一个操作：
- 1 x y k：区间加
- 2 x y：区间求和`,
    outputDesc: `输出包含若干行整数，即为所有操作 2 的结果。`,
    sampleInput: `5 5
1 5 4 2 3
2 2 4
1 2 3 2
2 3 4
1 1 5 1
2 1 4`,
    sampleOutput: `11
8
20`,
    hint: `n <= 10^5, m <= 10^5. 注意使用 long long。`,
    solutionDesc: `线段树区间修改模板题。
核心在于 **Lazy Tag**。当修改区间时，如果当前节点区间完全包含在修改范围内，直接修改该节点值并打标记返回。只有在查询或修改涉及到子区间时，才将标记下放 (Push Down)。`,
    code: `#include <iostream>
using namespace std;
typedef long long ll;
const int MAXN = 100005;
ll arr[MAXN], tree[MAXN * 4], lazy[MAXN * 4];
int n, m;

void push_down(int node, int start, int end) {
    if (lazy[node] == 0) return;
    int mid = (start + end) / 2;
    tree[node*2] += lazy[node] * (mid - start + 1);
    lazy[node*2] += lazy[node];
    tree[node*2+1] += lazy[node] * (end - mid);
    lazy[node*2+1] += lazy[node];
    lazy[node] = 0;
}

void update(int node, int start, int end, int L, int R, ll k) {
    if (L <= start && end <= R) {
        tree[node] += k * (end - start + 1);
        lazy[node] += k;
        return;
    }
    push_down(node, start, end);
    int mid = (start + end) / 2;
    if (L <= mid) update(node*2, start, mid, L, R, k);
    if (R > mid) update(node*2+1, mid+1, end, L, R, k);
    tree[node] = tree[node*2] + tree[node*2+1];
}

ll query(int node, int start, int end, int L, int R) {
    if (L <= start && end <= R) return tree[node];
    push_down(node, start, end);
    int mid = (start + end) / 2;
    ll sum = 0;
    if (L <= mid) sum += query(node*2, start, mid, L, R);
    if (R > mid) sum += query(node*2+1, mid+1, end, L, R);
    return sum;
}

int main() {
    ios::sync_with_stdio(0); cin.tie(0);
    cin >> n >> m;
    for(int i=1; i<=n; i++) { cin >> arr[i]; update(1, 1, n, i, i, arr[i]); } 
    // Build 也可以用专门的 build 函数，这里复用 update 简化
    for(int i=0; i<m; i++) {
        int op, x, y; cin >> op >> x >> y;
        if(op == 1) { ll k; cin >> k; update(1, 1, n, x, y, k); }
        else cout << query(1, 1, n, x, y) << "\\n";
    }
    return 0;
}`
};

const P1816_DATA = {
    id: "P1816",
    title: "忠诚",
    desc: `老管家为财主工作了整整 10 年。财主把每次的账目按 1, 2, 3... 编号，然后不定时地问管家：在 a 到 b 号账中最少的一笔是多少？
为了让管家没时间作假，他总是一次问多个问题。`,
    inputDesc: `第一行输入两个数 m, n，表示有 m 笔账和 n 个问题。
第二行输入 m 个数，分别表示账目的钱数。
接下来 n 行分别输入 n 个问题，每行 2 个数字，分别表示开始的账目编号 a 和结束的账目编号 b。`,
    outputDesc: `第一行输出每个问题的答案，每个答案中间以一个空格分隔。`,
    sampleInput: `10 3
1 2 3 4 5 6 7 8 9 10
2 7
3 9
1 10`,
    sampleOutput: `2 3 1`,
    hint: `1 <= m, n <= 10^5. 本题只需要建树和查询，无需修改。`,
    solutionDesc: `经典的区间最小值查询 (RMQ) 问题。
我们可以建立一棵维护 **最小值** 的线段树。
- **Push Up**: 父节点的值 = min(左子节点值, 右子节点值)。
- **Query**: 如果查询区间覆盖当前节点，直接返回 \`tree[node]\`；否则递归查询左右子树，取较小值。`,
    code: `#include <iostream>
#include <algorithm>
using namespace std;
const int MAXN = 100005;
const int INF = 2147483647;
int arr[MAXN], tree[MAXN * 4];
int m, n;

void build(int node, int start, int end) {
    if (start == end) {
        tree[node] = arr[start];
        return;
    }
    int mid = (start + end) / 2;
    build(node * 2, start, mid);
    build(node * 2 + 1, mid + 1, end);
    // Push Up: 取最小值
    tree[node] = min(tree[node * 2], tree[node * 2 + 1]);
}

int query(int node, int start, int end, int L, int R) {
    if (L <= start && end <= R) {
        return tree[node];
    }
    int mid = (start + end) / 2;
    int res = INF;
    if (L <= mid) res = min(res, query(node * 2, start, mid, L, R));
    if (R > mid) res = min(res, query(node * 2 + 1, mid + 1, end, L, R));
    return res;
}

int main() {
    ios::sync_with_stdio(0); cin.tie(0);
    cin >> m >> n;
    for(int i = 1; i <= m; i++) cin >> arr[i];
    
    build(1, 1, m);
    
    for(int i = 0; i < n; i++) {
        int l, r;
        cin >> l >> r;
        cout << query(1, 1, m, l, r) << " ";
    }
    return 0;
}`
};

const ProblemPractice: React.FC<Props> = ({ topic }) => {
  const [activeTab, setActiveTab] = useState<'problem' | 'solution'>('problem');
  const [copied, setCopied] = useState(false);

  // Decide which problem to show based on topic
  const data = topic === 'seg_min' ? P1816_DATA : P3372_DATA;

  const handleCopy = () => {
    navigator.clipboard.writeText(data.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // --- MARKDOWN RENDERER ---
  const parseInline = (text: string) => {
    // Split by **bold** or `code`
    const parts = text.split(/(\*\*.*?\*\*|`[^`]+`)/g);
    return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i} className="text-white font-bold">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('`') && part.endsWith('`')) {
            return <code key={i} className="bg-blue-500/20 text-blue-300 border border-blue-500/30 px-1.5 py-0.5 rounded font-mono text-sm mx-1">{part.slice(1, -1)}</code>;
        }
        return part;
    });
  };

  const renderMarkdown = (content: string) => {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeLines: string[] = [];

    lines.forEach((line, idx) => {
        // Code Block Handling
        if (line.trim().startsWith('```')) {
            if (inCodeBlock) {
                elements.push(
                    <div key={`code-${idx}`} className="relative group my-4">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg blur opacity-50"></div>
                        <pre className="relative bg-[#1e1e1e] p-4 rounded-lg overflow-x-auto border border-gray-700 text-sm font-mono leading-relaxed">
                            <code className="text-gray-300">{codeLines.join('\n')}</code>
                        </pre>
                    </div>
                );
                codeLines = [];
                inCodeBlock = false;
            } else {
                inCodeBlock = true;
            }
            return;
        }
        if (inCodeBlock) {
            codeLines.push(line);
            return;
        }

        // Headers
        if (line.startsWith('### ')) {
            elements.push(
                <h3 key={idx} className="text-lg font-bold text-primary mt-4 mb-2 flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-primary rounded-full"></div>
                    {parseInline(line.slice(4))}
                </h3>
            );
            return;
        }
        if (line.startsWith('## ')) {
             elements.push(<h2 key={idx} className="text-xl font-bold text-white mt-5 mb-3">{parseInline(line.slice(3))}</h2>);
             return;
        }

        // List
        if (line.trim().startsWith('- ')) {
            elements.push(
                <div key={idx} className="flex gap-2 mb-1 ml-4 text-gray-300">
                    <span className="text-primary">•</span>
                    <span>{parseInline(line.trim().slice(2))}</span>
                </div>
            );
            return;
        }

        // Paragraph (skip empty lines if purely visual spacer)
        if (line.trim()) {
            elements.push(<p key={idx} className="mb-2 leading-relaxed text-gray-300">{parseInline(line)}</p>);
        } else {
             elements.push(<div key={idx} className="h-2"></div>);
        }
    });

    return elements;
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
                  <div className="bg-primary/20 px-3 py-1 rounded text-primary font-mono font-bold text-lg">{data.id}</div>
                  <h1 className="text-3xl font-bold text-white">{data.title}</h1>
                </div>
                
                <div className="space-y-8">
                  {/* Description */}
                  <section>
                    <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-primary pl-4 flex items-center">
                      题目描述
                    </h2>
                    <div className="prose prose-invert max-w-none whitespace-pre-wrap">
                      {data.desc}
                    </div>
                  </section>

                  {/* Input Format */}
                  <section>
                    <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-primary pl-4">输入格式</h2>
                    <div className="text-gray-300 whitespace-pre-wrap">
                      {data.inputDesc}
                    </div>
                  </section>

                  {/* Output Format */}
                  <section>
                    <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-primary pl-4">输出格式</h2>
                    <p>{data.outputDesc}</p>
                  </section>
                  
                  {/* Examples */}
                   <section>
                    <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-primary pl-4">输入输出样例</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-black/40 rounded-lg overflow-hidden border border-gray-700">
                         <div className="bg-gray-800/50 px-4 py-2 text-xs text-gray-400 border-b border-gray-700 font-mono">输入 #1</div>
                         <pre className="p-4 font-mono text-sm text-gray-300 overflow-x-auto">
{data.sampleInput}
                         </pre>
                      </div>
                       <div className="bg-black/40 rounded-lg overflow-hidden border border-gray-700">
                         <div className="bg-gray-800/50 px-4 py-2 text-xs text-gray-400 border-b border-gray-700 font-mono">输出 #1</div>
                         <pre className="p-4 font-mono text-sm text-gray-300 overflow-x-auto">
{data.sampleOutput}
                         </pre>
                      </div>
                    </div>
                  </section>

                  {/* Hint */}
                  <section>
                    <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-primary pl-4">说明/提示</h2>
                    <div className="bg-blue-900/10 border border-blue-900/30 rounded-lg p-5">
                      <ul className="list-disc pl-5 space-y-2 text-sm text-gray-300">
                        <li>{data.hint}</li>
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
                       解题思路
                     </h2>
                     <div className="text-gray-300 leading-relaxed">
                        {renderMarkdown(data.solutionDesc)}
                     </div>
                  </section>

                  {/* Code */}
                  <section className="space-y-4">
                     <div className="flex justify-between items-end">
                        <h2 className="text-2xl font-bold text-green-400 flex items-center gap-2">
                          <FileCode className="w-6 h-6" />
                          参考代码 (C++)
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
                               __html: data.code
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
