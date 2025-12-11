import React from 'react';
import { Copy } from 'lucide-react';
import { CourseLevel, Topic } from '../types';

interface Props {
  level: CourseLevel;
  topic?: Topic;
}

// --- SEGMENT TREE ---
const SEG_BASIC = `
#include <iostream>
using namespace std;
const int MAXN = 100005;
int arr[MAXN], tree[MAXN * 4];

void build(int node, int start, int end) {
    if (start == end) {
        tree[node] = arr[start];
    } else {
        int mid = (start + end) / 2;
        build(node * 2, start, mid);
        build(node * 2 + 1, mid + 1, end);
        tree[node] = tree[node * 2] + tree[node * 2 + 1];
    }
}

void update(int node, int start, int end, int idx, int val) {
    if (start == end) {
        tree[node] = val;
    } else {
        int mid = (start + end) / 2;
        if (idx <= mid) update(node * 2, start, mid, idx, val);
        else update(node * 2 + 1, mid + 1, end, idx, val);
        tree[node] = tree[node * 2] + tree[node * 2 + 1];
    }
}

int query(int node, int start, int end, int L, int R) {
    if (R < start || L > end) return 0;
    if (L <= start && end <= R) return tree[node];
    int mid = (start + end) / 2;
    return query(node * 2, start, mid, L, R) + query(node * 2 + 1, mid + 1, end, L, R);
}
`;

const SEG_ADV = `
// 懒惰标记版本
int lazy[MAXN * 4];

void push_down(int node, int start, int end) {
    if (lazy[node]) {
        int mid = (start + end) / 2;
        tree[node*2] += lazy[node] * (mid - start + 1);
        lazy[node*2] += lazy[node];
        tree[node*2+1] += lazy[node] * (end - mid);
        lazy[node*2+1] += lazy[node];
        lazy[node] = 0;
    }
}
// update 和 query 中需加入 push_down(node, start, end);
`;

const SEG_EXP = `
// RMQ 最大值版本
void push_up(int node) {
    tree[node] = max(tree[node*2], tree[node*2+1]);
}
// 记得查询时返回 -INF 而不是 0
`;

// --- TRIE ---
const TRIE_BASIC = `
#include <iostream>
using namespace std;
const int N = 100010;
int son[N][26], idx; // son[p][u] 存储节点 p 的子节点 u 的索引
int cnt[N]; // 存储以该节点结尾的单词数量

void insert(char *str) {
    int p = 0;
    for (int i = 0; str[i]; i++) {
        int u = str[i] - 'a';
        if (!son[p][u]) son[p][u] = ++idx;
        p = son[p][u];
    }
    cnt[p]++;
}

int query(char *str) {
    int p = 0;
    for (int i = 0; str[i]; i++) {
        int u = str[i] - 'a';
        if (!son[p][u]) return 0;
        p = son[p][u];
    }
    return cnt[p];
}
`;

const TRIE_ADV = `
// 前缀统计：将 cnt 含义改为“有多少单词经过此节点”
void insert(char *str) {
    int p = 0;
    for (int i = 0; str[i]; i++) {
        int u = str[i] - 'a';
        if (!son[p][u]) son[p][u] = ++idx;
        p = son[p][u];
        cnt[p]++; // 路径上每个节点都+1
    }
}
// query 返回 cnt[p] 即可得到以 str 为前缀的单词数
`;

const TRIE_EXP = `
// 01 Trie (解决最大异或对)
int son[N*31][2]; // 只有0和1两个方向

void insert(int x) {
    int p = 0;
    for (int i = 30; i >= 0; i--) {
        int u = (x >> i) & 1; // 取第 i 位
        if (!son[p][u]) son[p][u] = ++idx;
        p = son[p][u];
    }
}

int query(int x) {
    int p = 0, res = 0;
    for (int i = 30; i >= 0; i--) {
        int u = (x >> i) & 1;
        // 贪心：如果存在相反的位，就走相反的（异或得1）
        if (son[p][!u]) {
            p = son[p][!u];
            res += (1 << i);
        } else {
            p = son[p][u];
        }
    }
    return res;
}
`;

// --- HASH ---
const HASH_BASIC = `
#include <vector>
using namespace std;
const int P = 131; // 经验值 P
const int MOD = 100003; // 质数

// 简单的数值哈希 (拉链法)
vector<int> h[MOD];

void insert(int x) {
    int k = (x % MOD + MOD) % MOD; // 防止负数
    h[k].push_back(x);
}

bool find(int x) {
    int k = (x % MOD + MOD) % MOD;
    for (int v : h[k]) {
        if (v == x) return true;
    }
    return false;
}
`;

const HASH_ADV = `
// 开放寻址法 (Open Addressing)
const int N = 200003, null = 0x3f3f3f3f;
int h[N];

int find_slot(int x) {
    int k = (x % N + N) % N;
    // 如果位置有人且不是x，就往后找（蹲坑法）
    while (h[k] != null && h[k] != x) {
        k++;
        if (k == N) k = 0;
    }
    return k;
}

// 插入: h[find_slot(x)] = x;
`;

const HASH_EXP = `
// 字符串哈希 (Rolling Hash)
typedef unsigned long long ull; // 自动溢出相当于取模 2^64
const int P = 131;
ull h[N], p[N]; // h[i]是前缀哈希，p[i]是P的i次方

void init(char *str, int n) {
    p[0] = 1;
    for (int i = 1; i <= n; i++) {
        p[i] = p[i-1] * P;
        h[i] = h[i-1] * P + str[i];
    }
}

// 获取子串 str[l...r] 的哈希值 O(1)
ull get(int l, int r) {
    return h[r] - h[l-1] * p[r-l+1];
}
`;

// --- UNION FIND ---
const UF_BASIC = `
const int N = 100010;
int p[N]; // 父节点数组

// 初始化：每个人是自己的老大
void init(int n) {
    for (int i = 1; i <= n; i++) p[i] = i;
}

// 查找（不带路径压缩）
int find(int x) {
    if (p[x] != x) return find(p[x]);
    return p[x];
}

// 合并
void unite(int a, int b) {
    p[find(a)] = find(b);
}
`;

const UF_ADV = `
// 路径压缩：查找时直接把沿途节点挂在根下
int find(int x) {
    if (p[x] != x) p[x] = find(p[x]); // 递归回溯时更新父节点
    return p[x];
}

// 按秩合并 (启发式合并)
// size[i] 维护集合大小
void unite(int a, int b) {
    int rootA = find(a), rootB = find(b);
    if (rootA != rootB) {
        // 把小的合并到大的上面，树高更矮
        if (size[rootA] < size[rootB]) swap(rootA, rootB);
        p[rootB] = rootA;
        size[rootA] += size[rootB];
    }
}
`;

const UF_EXP = `
// 扩展域并查集 (敌人的敌人是朋友)
// x: 朋友域, x+n: 敌人域
void merge_enemy(int x, int y) {
    // x 的敌人是 y 的朋友
    unite(x + n, y);
    // y 的敌人是 x 的朋友
    unite(y + n, x);
}

// 带权并查集 (维护到根节点的距离 d[])
int find(int x) {
    if (p[x] != x) {
        int root = find(p[x]);
        d[x] += d[p[x]]; // 路径压缩时累加距离
        p[x] = root;
    }
    return p[x];
}
`;


const CodeLab: React.FC<Props> = ({ level, topic = 'segment_tree' }) => {
  let code = "";
  let filename = "";

  if (topic === 'segment_tree') {
      if (level === 'basic') { code = SEG_BASIC; filename = "segtree_basic.cpp"; }
      else if (level === 'advanced') { code = SEG_ADV; filename = "segtree_lazy.cpp"; }
      else { code = SEG_EXP; filename = "segtree_rmq.cpp"; }
  } else if (topic === 'trie') {
      if (level === 'basic') { code = TRIE_BASIC; filename = "trie_basic.cpp"; }
      else if (level === 'advanced') { code = TRIE_ADV; filename = "trie_count.cpp"; }
      else { code = TRIE_EXP; filename = "trie_xor.cpp"; }
  } else if (topic === 'hash') {
      if (level === 'basic') { code = HASH_BASIC; filename = "hash_chain.cpp"; }
      else if (level === 'advanced') { code = HASH_ADV; filename = "hash_open.cpp"; }
      else { code = HASH_EXP; filename = "hash_string.cpp"; }
  } else if (topic === 'union_find') {
      if (level === 'basic') { code = UF_BASIC; filename = "dsu_basic.cpp"; }
      else if (level === 'advanced') { code = UF_ADV; filename = "dsu_compress.cpp"; }
      else { code = UF_EXP; filename = "dsu_weighted.cpp"; }
  }

  return (
    <div className="max-w-5xl mx-auto h-full flex flex-col animate-fade-in">
      <div className="bg-dark-lighter rounded-xl border border-gray-700 shadow-xl overflow-hidden flex flex-col h-full">
        <div className="bg-gray-800 px-6 py-3 border-b border-gray-700 flex justify-between items-center">
           <div className="flex gap-2">
             <div className="w-3 h-3 rounded-full bg-red-500"></div>
             <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
             <div className="w-3 h-3 rounded-full bg-green-500"></div>
           </div>
           <span className="text-gray-400 text-sm font-mono">{filename}</span>
           <button 
             onClick={() => navigator.clipboard.writeText(code)}
             className="text-gray-400 hover:text-white transition"
           >
             <Copy className="w-4 h-4" />
           </button>
        </div>
        
        <div className="flex-1 overflow-auto bg-[#0d1117] p-6">
          <pre className="font-mono text-sm text-gray-300 leading-relaxed">
            <code>
              {code.trim().split('\n').map((line, i) => (
                <div key={i} className="table-row">
                  <span className="table-cell text-gray-600 select-none text-right pr-4 border-r border-gray-800 w-8">{i + 1}</span>
                  <span className="table-cell pl-4 whitespace-pre-wrap">
                     <span dangerouslySetInnerHTML={{ __html: line
                      .replace(/</g, '&lt;')
                      .replace(/>/g, '&gt;')
                      .replace(/\/\/.*/g, '<span class="text-gray-500 italic">$&</span>')
                      .replace(/\b(int|void|using|namespace|return|if|else|const|for|while|push_down|push_up|insert|find|unite|query)\b/g, '<span class="text-purple-400 font-bold">$1</span>')
                      .replace(/#include\s+&lt;[^&]+&gt;/g, '<span class="text-blue-400">$&</span>')
                      .replace(/\b(tree|arr|lazy|son|cnt|idx|p|h|d|size)\b/g, '<span class="text-yellow-200">$1</span>')
                     }} />
                  </span>
                </div>
              ))}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default CodeLab;
