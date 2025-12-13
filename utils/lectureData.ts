
import { LectureStep } from '../types';

// ... (Keep existing lectures: RECURSION, DFS, BFS, GRAPH, ETC.) ...
// Preserving exports for other modules to avoid breaking them
export const RECURSION_FACTORIAL_LECTURE: LectureStep[] = [
  {
    id: 1,
    type: 'theory',
    title: '1. 阶乘：定义的递归',
    content: `### 什么是阶乘？\n一个正整数 n 的阶乘 (factorial) 是所有小于及等于 n 的正整数的积。\n记作 \`n!\`。\n- 3! = 3 × 2 × 1 = 6\n- 5! = 5 × 4 × 3 × 2 × 1 = 120\n\n### 递归定义\n我们可以把定义换个写法：\n\`n! = n × (n-1)!\`\n这简直就是天然的递归结构！只要解决了 (n-1)!，乘上 n 就是 n!。`
  },
  {
    id: 2,
    type: 'experiment',
    title: '2. 实验：层层展开',
    content: `**实验目标**：观察递归函数的“递”与“归”。\n\n**操作步骤**：\n1. 点击控制台的 **Calculate Factorial(5)**。\n2. 观察屏幕中央的算式展开过程。\n   - 递：它会一直问 "fact(4) 是多少？", "fact(3) 是多少？"... 直到 fact(1)。\n   - 归：fact(1) 告诉 fact(2) 答案，fact(2) 算完告诉 fact(3)...\n3. 注意右侧的递归栈，它会越堆越高，直到触底反弹。`
  },
  {
    id: 3,
    type: 'conclusion',
    title: '3. 实验结论',
    content: `### 递归的代价\n你注意到了吗？右侧的栈每调用一次就会长高一截。\n每一次函数调用 \`factorial(n)\` 都会在内存的**栈 (Stack)** 中开辟一块空间，用来保存当前的 n 值和返回地址。\n\n- 计算 5! 需要 6 层栈帧（5,4,3,2,1,0）。\n- 计算 10000! 需要 10001 层栈帧。\n\n**风险**：如果 n 太大，栈空间会被耗尽，导致 **Stack Overflow** 错误。工程中通常使用迭代或尾递归优化来解决。`
  },
  {
    id: 4,
    type: 'code',
    title: '4. 实战填空：递归基',
    content: `所有的递归都需要一个停止的条件，否则会无限循环（Stack Overflow）。`,
    codeProblem: {
      template: `int factorial(int n) {\n    // 递归出口\n    if ({{0}}) {\n        return 1;\n    }\n    // 递归调用\n    return n * factorial(n - 1);\n}`,
      blanks: [
        { id: 0, question: "最小的子问题是什么？", options: [{ label: "n <= 1", value: "n <= 1", isCorrect: true }, { label: "n == 0", value: "n == 0", isCorrect: true }] }
      ]
    }
  },
  {
    id: 5,
    type: 'quiz',
    title: '5. 理解测试',
    content: '关于栈溢出。',
    quizData: {
      id: 1,
      question: "如果没有写递归基 (Base Case)，程序会发生什么？",
      options: ["计算出错误结果", "一直运行直到内存耗尽 (Stack Overflow)", "自动停止", "返回 0"],
      correctAnswer: 1,
      explanation: "函数会无限次调用自己，每一层调用都需要占用栈空间，最终导致栈溢出崩溃。"
    }
  },
  {
    id: 6,
    type: 'full_code',
    title: '6. 代码实现',
    content: `### 问题描述\n编写一个函数，计算给定非负整数 n 的阶乘。\n\n### 样例\n**Input**: 5\n**Output**: 120`,
    codeSnippet: `long long factorial(int n) {\n    // 递归基：0! = 1, 1! = 1\n    // 当规模减小到最小时，直接返回结果\n    if (n <= 1) return 1;\n    \n    // 递归步：n! = n * (n-1)!\n    // 相信 factorial(n-1) 能算出正确结果，利用它\n    return n * factorial(n - 1);\n}`
  }
];

export const RECURSION_GCD_LECTURE: LectureStep[] = [{id:1,type:'theory',title:'GCD',content:'...'}]; 
export const RECURSION_STRING_REV_LECTURE: LectureStep[] = [{id:1,type:'theory',title:'String Rev',content:'...'}];
export const RECURSION_REVERSE_LIST_LECTURE: LectureStep[] = [{id:1,type:'theory',title:'List Rev',content:'...'}];
export const RECURSION_FIB_LECTURE: LectureStep[] = [{id:1,type:'theory',title:'Fib',content:'...'}];
export const RECURSION_HANOI_LECTURE: LectureStep[] = [{id:1,type:'theory',title:'Hanoi',content:'...'}];
export const RECURSION_FRACTAL_LECTURE: LectureStep[] = [{id:1,type:'theory',title:'Fractal',content:'...'}];
export const RECURSION_PERM_LECTURE: LectureStep[] = [{id:1,type:'theory',title:'Perm',content:'...'}];
export const RECURSION_SUBSET_LECTURE: LectureStep[] = [{id:1,type:'theory',title:'Subset',content:'...'}];

export const DFS_BASIC_LECTURE: LectureStep[] = [{ id: 1, type: 'theory', title: 'DFS', content: '...' }];
export const BFS_BASIC_LECTURE: LectureStep[] = [{ id: 1, type: 'theory', title: 'BFS', content: '...' }];
export const DFS_CONNECT_LECTURE: LectureStep[] = []; export const DFS_PERM_LECTURE: LectureStep[] = []; export const DFS_MAZE_LECTURE: LectureStep[] = []; export const DFS_NQUEENS_LECTURE: LectureStep[] = []; export const DFS_BAG_LECTURE: LectureStep[] = []; export const DFS_GRAPH_ALGO_LECTURE: LectureStep[] = []; export const DFS_PRUNING_LECTURE: LectureStep[] = []; 
export const BFS_SHORTEST_PATH_LECTURE: LectureStep[] = []; export const BFS_STATE_SPACE_LECTURE: LectureStep[] = []; export const BFS_FLOOD_FILL_LECTURE: LectureStep[] = []; export const BFS_TOPO_SORT_LECTURE: LectureStep[] = []; export const BFS_BIPARTITE_LECTURE: LectureStep[] = []; export const BFS_MULTI_SOURCE_LECTURE: LectureStep[] = [];
export const AC_AUTOMATON_LECTURE: LectureStep[] = []; export const KMP_LECTURE: LectureStep[] = []; export const MANACHER_LECTURE: LectureStep[] = [];
export const BALANCED_TREE_LECTURE: LectureStep[] = []; export const MST_LECTURE: LectureStep[] = []; export const SHORTEST_PATH_LECTURE: LectureStep[] = []; export const TARJAN_LECTURE: LectureStep[] = []; export const DIFF_CONSTRAINTS_LECTURE: LectureStep[] = []; export const SWEEP_LINE_LECTURE: LectureStep[] = [];
export const TREE_DIAMETER_LECTURE: LectureStep[] = []; export const TREE_CENTROID_LECTURE: LectureStep[] = []; export const TREE_CENTER_LECTURE: LectureStep[] = []; export const TREE_DP_LECTURE: LectureStep[] = []; export const TREE_KNAPSACK_LECTURE: LectureStep[] = [];

// ================= SEGMENT TREE MODULE (NEWLY POPULATED) =================

export const SEG_BASIC_LECTURE: LectureStep[] = [
  {
    id: 1,
    type: 'theory',
    title: '1. 包工头的烦恼',
    content: `
### 问题背景
想象你是一个包工头，手下有 N 个工人排成一排，每人每天搬不同数量的砖。
你需要频繁处理两种请求：
1. **点名查账**：查询第 L 到第 R 个工人一共搬了多少砖？(Range Sum)
2. **突发情况**：第 i 个工人突然多搬了 k 块砖，或者偷懒少搬了。(Point Update)

### 为什么数组不行？
- 用普通数组：修改 O(1)，查询 O(N)。如果有 10万次查询，每次查 10万人，直接超时 (TLE)。
- 用前缀和：查询 O(1)，但修改需要更新后面所有前缀和，O(N)，还是超时。

### 线段树：层级管理
我们引入**层级管理制度**。
- 根节点（大老板）管所有人 [1, N]。
- 左孩子管 [1, N/2]，右孩子管 [N/2+1, N]。
- 一直到叶子节点（具体工人）。
这样，查询和修改都只需要找相关的“经理”，复杂度降为 **O(log N)**。
    `
  },
  {
    id: 2,
    type: 'experiment',
    title: '2. 实验：建树 (Build)',
    content: `
**实验目标**：观察线段树是如何从底层数据构建起来的。

**操作步骤**：
1. 点击控制台的 **Build Tree** 按钮。
2. 观察动画：
   - 它是**递归**进行的。先一直走到叶子节点（工人）。
   - 然后 **Push Up**（向上汇报）：父节点的值 = 左孩子 + 右孩子。
   - 比如根节点的值，就是所有数据的总和。
    `
  },
  {
    id: 3,
    type: 'experiment',
    title: '3. 实验：单点修改',
    content: `
**实验目标**：修改一个数据，如何同步更新管理层？

**操作步骤**：
1. 在控制台“单点修改”区域，设置 **Idx=2, Val=99**。
2. 点击闪电图标。
3. 观察动画：
   - 先找到叶子节点 [2, 2] 修改数值。
   - 然后**一路向上 (Push Up)** 更新所有受影响的父节点。
   - 没受影响的分支（如右子树）完全不动，这就是快的秘诀。
    `
  },
  {
    id: 4,
    type: 'experiment',
    title: '4. 实验：区间查询',
    content: `
**实验目标**：查询 [2, 6] 的和。

**操作步骤**：
1. 在控制台“区间查询”区域，设置 **L=2, R=6**。
2. 点击放大镜图标。
3. 观察：
   - 系统不会一个一个加。
   - 它会找到 [2, 2], [3, 4], [5, 6] 这几个包含在查询范围内的“最大整块”。
   - 只把这 3 个节点的值加起来就行了，不用问具体的工人。
    `
  },
  {
    id: 5,
    type: 'code',
    title: '5. 核心代码：Push Up',
    content: `不管怎么改，线段树的核心维护逻辑都在 Push Up 函数里。`,
    codeProblem: {
      template: `void push_up(int node) {
    // 父亲的值 = 左孩子的值 + 右孩子的值
    tree[node] = tree[node * 2] + {{0}};
}`,
      blanks: [
        { id: 0, question: "右孩子的索引是？", options: [{ label: "node * 2 + 1", value: "tree[node * 2 + 1]", isCorrect: true }, { label: "node + 1", value: "tree[node + 1]", isCorrect: false }] }
      ]
    }
  }
];

export const SEG_LAZY_LECTURE: LectureStep[] = [
  {
    id: 1,
    type: 'theory',
    title: '1. 懒惰的经理 (Lazy Tag)',
    content: `
### 区间修改的噩梦
如果大老板下令：“第 1 到 第 10000 号工人工资全涨 10 块！”
如果用单点修改的方法，你需要跑 10000 次 update，复杂度退化成 O(N log N)，太慢了！

### 懒惰标记
聪明的经理（区间节点）不会立刻给手下 5000 人打电话。
他会做两件事：
1. **立刻修改自己的账本**：我管 5000 人，每人涨 10 块，那我这里的总账增加 50000 块。
2. **贴个便利贴 (Lazy Tag)**：在门口贴条“欠下属每人 10 块”。
3. **下班**。

只有当上面有人要来查具体的下属，或者要修改下属时，他才被迫把便利贴撕下来，把任务传给下一级经理 (**Push Down**)。
    `
  },
  {
    id: 2,
    type: 'experiment',
    title: '2. 实验：区间加法',
    content: `
**实验目标**：观察懒标记是如何打上和下传的。

**操作步骤**：
1. 点击 **Build Tree** 重置。
2. 在“区间修改 (Lazy)”区域，设置 **L=1, R=3, Add=5**。
3. 点击紫色闪电。
4. 观察：
   - 节点 [0, 3] 被完全覆盖吗？如果是，它直接更新值，并打上 **L: 5** 的标记，不再向下递归。
   - 节点变成了粉色边框（表示有 Tag）。
    `,
    experimentConfig: { initialData: ["1", "3", "5", "7", "9", "11", "13", "15"] }
  },
  {
    id: 3,
    type: 'experiment',
    title: '3. 实验：Push Down',
    content: `
**实验目标**：什么时候标记会下传？

**操作步骤**：
1. 接着上一步，现在我们需要查询具体的 **L=2, R=2**。
2. 点击查询。
3. 观察：
   - 查询路过 [0, 3] 时，发现有标记。
   - **Push Down** 触发！标记下传给 [0, 1] 和 [2, 3]，自己的标记清除。
   - 最终查询到了正确更新后的值。
    `
  },
  {
    id: 4,
    type: 'quiz',
    title: '4. 理解测试',
    content: '关于 Push Down 的时机。',
    quizData: {
      id: 1,
      question: "我们在什么时候执行 push_down？",
      options: ["每次 update 结束时", "访问到一个节点，且需要进入其子节点时", "建树时", "心情好的时候"],
      correctAnswer: 1,
      explanation: "如果当前节点的任务还没下发，直接进入子节点会读到旧数据。所以必须在进入子节点前把“欠的债”还了（下发标记）。"
    }
  }
];

export const SEG_RMQ_LECTURE: LectureStep[] = [
  {
    id: 1,
    type: 'theory',
    title: '1. 区间最值 (RMQ)',
    content: `
### 谁是单挑王？
老板现在不关心总业绩了，他想知道在第 L 到 R 个工人里，**谁搬得最多**？
这就是 Range Maximum Query (RMQ) 问题。

### 同样的配方，不同的味道
线段树结构完全不变。
- **Push Up**: \`tree[node] = max(tree[left], tree[right])\`
- **Query**: 左右两边取最大值返回。
    `
  },
  {
    id: 2,
    type: 'experiment',
    title: '2. 实验：寻找最大值',
    content: `
**实验目标**：构建一棵维护最大值的树。

**操作步骤**：
1. 点击 **Build Tree**。注意节点上的值现在是区间内的 Max，而不是 Sum。
2. 进行 **区间查询 L=2, R=6**。
3. 观察它如何合并结果：\`max(left_result, right_result)\`。
    `
  },
  {
    id: 3,
    type: 'code',
    title: '3. 代码调整',
    content: `求最大值时，Push Up 怎么写？`,
    codeProblem: {
      template: `void push_up(int node) {
    // 维护区间最大值
    tree[node] = max(tree[node * 2], {{0}});
}`,
      blanks: [
        { id: 0, question: "右孩子", options: [{ label: "tree[node * 2 + 1]", value: "tree[node * 2 + 1]", isCorrect: true }, { label: "tree[right]", value: "tree[right]", isCorrect: false }] }
      ]
    }
  }
];

export const SEGMENT_TREE_MIN_LECTURE: LectureStep[] = [
  {
    id: 1,
    type: 'theory',
    title: '1. 题目背景：忠诚 (P1816)',
    content: `
### 题目描述
老管家为财主工作了 10 年。财主把每次的账目按 1, 2, 3... 编号。
他不时问：在第 a 到 b 笔账中，**最少**的一笔是多少？

### 分析
这就从 RMQ (Max) 变成了 Range Minimum Query (Min)。
原理完全一样，只是把所有 \`max\` 换成 \`min\`。
    `
  },
  {
    id: 2,
    type: 'experiment',
    title: '2. 实验：区间最小值',
    content: `
**实验目标**：验证区间最小值查询。

**操作步骤**：
1. 初始数据已设为 P1816 样例：\`1 2 3 4 5 6 7 8 9 10\`。
2. 点击 **Build Tree**。
3. 查询 **L=2, R=7**。
4. 树上显示的是 MIN 值，结果应该是 2。
    `,
    experimentConfig: { initialData: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"] }
  },
  {
    id: 3,
    type: 'full_code',
    title: '3. 完整代码',
    content: `### C++ 解决方案\n注意初始化时，如果查询范围无效，应返回一个极大值 (INF)，以免干扰 min 计算。`,
    codeSnippet: `#include <iostream>
#include <algorithm>
using namespace std;
const int MAXN = 100005;
const int INF = 2147483647;
int arr[MAXN], tree[MAXN * 4];

void build(int node, int start, int end) {
    if (start == end) {
        tree[node] = arr[start];
        return;
    }
    int mid = (start + end) / 2;
    build(node * 2, start, mid);
    build(node * 2 + 1, mid + 1, end);
    tree[node] = min(tree[node * 2], tree[node * 2 + 1]);
}

int query(int node, int start, int end, int L, int R) {
    if (L <= start && end <= R) return tree[node];
    int mid = (start + end) / 2;
    int res = INF;
    if (L <= mid) res = min(res, query(node * 2, start, mid, L, R));
    if (R > mid) res = min(res, query(node * 2 + 1, mid + 1, end, L, R));
    return res;
}
// main...`
  }
];

// Placeholder for backward compatibility if needed, though we split them above
export const SEGMENT_TREE_LECTURE: LectureStep[] = SEG_BASIC_LECTURE;

// === TRIE, HASH, UF LECTURES ===

export const TRIE_LECTURE: LectureStep[] = [
  {
    id: 1,
    type: 'theory',
    title: '1. 什么是字典树 (Trie)？',
    content: `### 查字典的智慧\n想象你在查字典找单词 "Apple"。\n你不会从第一页开始翻，你会先找 'A' 的分区，再找 'P'，再找 'P'...\n**字典树 (Trie)** 就是把这个过程数据结构化。\n\n### 结构特点\n- 根节点不包含字符。\n- 从根节点到某一节点，路径上经过的字符连接起来，就是该节点对应的字符串。\n- 每个节点的所有子节点包含的字符都不相同。`
  },
  {
    id: 2,
    type: 'experiment',
    title: '2. 实验：插入与查找',
    content: `**实验步骤**：\n1. 观察右侧的树，初始只有 ROOT。\n2. 在输入框输入 "cat" 并点击**插入**。\n3. 再输入 "car" 并点击**插入**。\n4. 注意 "cat" 和 "car" 会共享前缀 "c" -> "a"。\n5. 这种**前缀共享**极大地节省了空间。`,
    experimentConfig: { initialData: ["cat", "car", "dog"] }
  },
  {
    id: 3,
    type: 'code',
    title: '3. 实战填空：插入逻辑',
    content: `如何把一个单词插入到树中？`,
    codeProblem: {
      template: `void insert(string word) {\n    int p = 0; // 从根节点开始\n    for (char c : word) {\n        int u = c - 'a';\n        // 如果子节点不存在，创建一个新的\n        if (!son[p][u]) son[p][u] = {{0}};\n        // 移动到子节点\n        p = son[p][u];\n    }\n    // 标记单词结束\n    is_end[p] = true;\n}`,
      blanks: [
        { id: 0, question: "分配新节点索引", options: [{ label: "++idx", value: "++idx", isCorrect: true }, { label: "idx", value: "idx", isCorrect: false }] }
      ]
    }
  }
];

export const HASH_LECTURE: LectureStep[] = [
  {
    id: 1,
    type: 'theory',
    title: '1. 哈希表：极速查找',
    content: `### 这里的书我来管\n哈希表就像一个巨大的储物柜。\n当你想存一个数字 \`x\` 时，你通过一个数学公式（哈希函数）算出一个下标 \`idx\`。\n然后把 \`x\` 直接扔进 \`table[idx]\` 里。\n\n### O(1) 的魔法\n理想情况下，你可以瞬间找到任何元素，不需要遍历，不需要二分。`
  },
  {
    id: 2,
    type: 'experiment',
    title: '2. 实验：哈希冲突',
    content: `**实验目标**：观察当两个数映射到同一个位置时会发生什么。\n\n**操作步骤**：\n1. 假设哈希函数是 \`x % 7\`。\n2. 插入 10 -> index 3。\n3. 插入 3 -> index 3。\n4. **冲突！** 观察右侧，我们通常用**拉链法**（链表）把它们串起来。`
  }
];

export const UNION_FIND_LECTURE: LectureStep[] = [
  {
    id: 1,
    type: 'theory',
    title: '1. 并查集：朋友圈',
    content: `### 找老大\n并查集维护了一堆集合。\n每个元素都有一个“父节点”。如果 \`parent[i] == i\`，那它就是老大（根节点）。\n想知道两个人是不是一伙的？看看他们的老大是不是同一个人！`
  },
  {
    id: 2,
    type: 'experiment',
    title: '2. 实验：路径压缩',
    content: `**实验目标**：观察合并与查找。\n1. 输入 A=1, B=2，点击 **合并**。\n2. 输入 A=3, B=4，点击 **合并**。\n3. 输入 A=2, B=4，点击 **合并** -> 此时 1 和 3 也连通了！`
  }
];
