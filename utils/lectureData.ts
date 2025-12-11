
import { LectureStep } from '../types';

// ================= SEGMENT TREE (Keep existing) =================
export const SEGMENT_TREE_LECTURE: LectureStep[] = [
  {
    id: 1,
    type: 'theory',
    title: '线段树：包工头的智慧',
    content: `
### 搬砖工的烦恼
想象你是一个搬砖工，你面前有 N 堆砖头（数组）。老板经常会让你做两件事：
1. **“把第 3 堆砖头给我加 5 块！”** (单点修改)
2. **“把第 1 到第 100 堆砖头的总数报给我！”** (区间查询)

如果你老老实实去数，每次都要跑断腿 (O(N))。如果有 100 万堆砖头，老板问 100 万次，你就累死了。

### 层级管理制度
聪明的你决定搞个“管理层”：
- 你找了两个组长，左组长管前一半，右组长管后一半。
- 组长又找了小队长，小队长管更少的砖堆。
- ...
- 最后，你自己（根节点）只需要问两个组长：“你们那边一共多少？” 

这就是 **O(log N)** 的快乐。老板问总数，你只需要问下面几个人，不用自己数！
    `
  },
  {
    id: 2,
    type: 'experiment',
    title: '实验：层级结构',
    content: `
观察右边的线段树结构。
- 每个节点代表一个区间 [L, R]。
- 根节点代表整个数组 [0, 7]。
- 叶子节点代表具体的每一堆砖头。

**任务**：
1. 试着在控制台中点击 **查询**，比如查询 [0, 7]，看看系统是如何通过询问左右子节点得到结果的。
2. 注意观察，只需要访问很少的节点就能得到总和，而不是遍历所有叶子。
    `,
    experimentConfig: { hint: "尝试查询 [0, 3] 或 [4, 7]，看看是否直接命中某个节点。" }
  },
  {
    id: 3,
    type: 'theory',
    title: '有人偷懒？(单点修改)',
    content: `
### 修改业绩
突然，第 3 堆砖头多了 10 块。
这事儿不能只有第 3 堆的负责人知道，他的上级、上级的上级... 直到你（根节点）都需要更新账本。

### Push Up (向上汇报)
这个过程叫 **Push Up**。
下面的数据变了，必须层层向上汇报，重新计算总和：
\`tree[node] = tree[left_child] + tree[right_child]\`
    `
  },
  {
    id: 4,
    type: 'experiment',
    title: '实验：单点修改',
    content: `
**任务**：
1. 在控制台中找到 **单点修改**。
2. 将 Index 2 的值改为 99。
3. 仔细观察动画：绿色的光点是如何从叶子节点一路向上“汇报”直到根节点的。
    `,
    experimentConfig: { hint: "每次修改复杂度仅为树的高度 (log N)。" }
  },
  {
    id: 5,
    type: 'theory',
    title: '老板疯了：所有人涨薪 (区间修改)',
    content: `
### 偷懒的艺术 (Lazy Tag)
老板突然发神经：“把第 1 到 10000 号工人的工资都涨 10 块！”
如果你一个个去改，又回到 O(N) 了。

### 贴便利贴 (Lazy Tag)
机智的经理（区间节点）不会立刻跑下去通知每一个人。
他会在自己门口贴张便利贴：**“欠下面每人 10 块，下次再说”**。
然后立马修改自己的总账（总额 + 人数 * 10），就回去睡觉了。

只有当有人要查具体的某个人，或者要给下面的人再派任务时，经理才会把便利贴撕下来，贴给下面两个小队长。这叫 **Push Down**。
    `
  },
  {
    id: 6,
    type: 'experiment',
    title: '实验：懒惰标记',
    content: `
此实验需切换到 **Advanced** 难度才能看到 Lazy 效果。
**任务**：
1. 在控制台找到 **区间修改 (Lazy)**。
2. 给区间 [0, 3] 加上 5。
3. 观察节点上出现的 **粉色 "L" 标记**。注意，只有被完全覆盖的节点才会被打标，而且不会继续往下走！
4. 然后试着 **查询** [0, 1]，观察 Push Down 如何把标记推下去。
    `,
    experimentConfig: { hint: "Lazy Tag 只有在不得已的时候才下发。" }
  },
  {
    id: 7,
    type: 'code',
    title: '实战填空：Push Up 与 Push Down',
    content: `把刚才的理论变成代码。`,
    codeProblem: {
      template: `// 1. 向上汇报
void push_up(int node) {
    tree[node] = tree[node*2] + {{0}};
}

// 2. 向下下发标记
void push_down(int node, int l, int r) {
    if(lazy[node]) {
        int mid = (l + r) / 2;
        // 左孩子接锅
        lazy[node*2] += lazy[node];
        tree[node*2] += lazy[node] * ({{1}}); 
        
        // 右孩子接锅
        lazy[node*2+1] += lazy[node];
        tree[node*2+1] += lazy[node] * (r - mid);
        
        lazy[node] = 0; // 撕掉便利贴
    }
}`,
      blanks: [
        { id: 0, question: "右子节点", options: [{ label: "tree[node*2+1]", value: "tree[node*2+1]", isCorrect: true }, { label: "tree[node+1]", value: "tree[node+1]", isCorrect: false }] },
        { id: 1, question: "左区间长度", options: [{ label: "mid - l + 1", value: "mid - l + 1", isCorrect: true }, { label: "l - mid", value: "l - mid", isCorrect: false }] }
      ]
    }
  },
  {
    id: 8,
    type: 'quiz',
    title: '线段树终极测验',
    content: '看看你学会了吗？',
    quizData: {
      id: 1,
      question: "对于区间修改，为什么要用 Lazy Tag？",
      options: ["为了让代码更难写", "将区间修改的时间复杂度从 O(N) 降为 O(log N)", "为了节省内存", "防止整数溢出"],
      correctAnswer: 1,
      explanation: "Lazy Tag 避免了每次修改都遍历到叶子节点，实现了“按需下发”，保证了对数级的复杂度。"
    }
  }
];

// ==================================================================================
// ========================= DFS MASTER CLASS =======================================
// ==================================================================================

// --- DFS BASIC ---
export const DFS_BASIC_LECTURE: LectureStep[] = [
  {
    id: 1,
    type: 'theory',
    title: '1. DFS：不撞南墙不回头',
    content: `
### 一条道走到黑
**深度优先搜索 (DFS)** 的性格极其倔强。
如果说 BFS 是“水波纹扩散”，那 DFS 就是“走迷宫的愣头青”。

- 它选择一条路，就一直往下走，直到无路可走（撞了南墙）。
- 撞墙后，它回退一步（回溯），看看还有没有别的路。
- 如果有，就换条路继续走到黑；如果没有，继续回退。

### 核心武器：栈 (Stack) / 递归
DFS 天然符合 **LIFO (后进先出)** 的特性。
我们通常直接用**递归函数**来实现，系统栈会自动帮我们保存回退的路径。
    `
  },
  {
    id: 2,
    type: 'experiment',
    title: '2. 实验：DFS 遍历顺序',
    content: `
**实验步骤**：
1. 观察右侧的图，我们从 Node 1 开始。
2. 点击 **Start DFS**。
3. **关键观察点**：
   - 注意它是一条线扎下去的 (1 -> 2 -> 4 -> ...)。
   - 当它在 Node 4 无路可走时，会变红（回溯），退回 Node 2，再去找 Node 5。
   - 这种“深入敌后”的特性，让它非常适合解决连通性、全排列等问题。
    `
  },
  {
    id: 3,
    type: 'code',
    title: '3. 实战填空：递归模板',
    content: `DFS 的代码比 BFS 更短，更有艺术感。`,
    codeProblem: {
      template: `bool visited[MAXN];

void dfs(int u) {
    visited[u] = true;
    cout << "Visiting " << u << endl;

    for(int v : adj[u]) {
        if({{0}}) {
            dfs(v); // 递归调用
        }
    }
}`,
      blanks: [
        { id: 0, question: "访问邻居的条件", options: [{ label: "!visited[v]", value: "!visited[v]", isCorrect: true }, { label: "visited[v]", value: "visited[v]", isCorrect: false }] }
      ]
    }
  }
];

// --- DFS CONNECTIVITY ---
export const DFS_CONNECT_LECTURE: LectureStep[] = [
  {
    id: 1,
    type: 'theory',
    title: '应用一：连通性检测',
    content: `
### 孤岛危机
给定一张图，可能有好几个互不相连的圈子（连通分量）。
如何数出一共有多少个圈子？

### 染色法
1. 遍历所有点 1...N。
2. 如果点 i 没被访问过，说明发现了一块新大陆！计数器 +1。
3. 立刻从点 i 发动 DFS，把和它相连的所有点都打上标记（染成同一种颜色）。
4. 无论这个圈子多复杂，DFS 都能顺藤摸瓜把它们一网打尽。
    `
  },
  {
    id: 2,
    type: 'experiment',
    title: '实验：数岛屿',
    content: `
右侧图中有几个断开的部分。
**实验步骤**：
1. 点击 **Count Components**。
2. 观察 DFS 如何把一个连通块全部染绿，然后停下来。
3. 主循环继续寻找下一个未染色的点，再次发动 DFS。
    `
  }
];

// --- DFS PERMUTATIONS ---
export const DFS_PERM_LECTURE: LectureStep[] = [
  {
    id: 1,
    type: 'theory',
    title: '应用二：全排列 (回溯法)',
    content: `
### 暴力枚举的艺术
有 3 个盒子，3 张牌 (1, 2, 3)。要把牌全部放进盒子里，有多少种放法？
这无法用简单的循环解决（如果有 N 个盒子呢？）。

### 决策树
DFS 可以模拟**决策过程**：
1.站在第 1 个盒子前，手里的牌有 {1, 2, 3}。我选 1。
2.走到第 2 个盒子前，手里剩 {2, 3}。我选 2。
3.走到第 3 个盒子前，手里剩 {3}。我选 3。
4.放完了！记录结果 [1, 2, 3]。
5.**回溯**：把 3 号牌拿回来，看看还能不能放别的？没别的了。
6.退回第 2 个盒子，把 2 号牌拿回来。手里有 {2, 3}。这次我选 3！
    `
  },
  {
    id: 2,
    type: 'code',
    title: '代码填空：回溯模板',
    content: `回溯法最重要的就是“恢复现场”。`,
    codeProblem: {
      template: `void dfs(int step) {
    if (step == n + 1) {
        print_result();
        return;
    }
    for (int i = 1; i <= n; i++) {
        if (!used[i]) {
            used[i] = true; // 标记占用
            path[step] = i;
            
            dfs(step + 1); // 进下一层
            
            {{0}}; // 回溯：恢复现场！
        }
    }
}`,
      blanks: [
        { id: 0, question: "回溯操作", options: [{ label: "used[i] = false", value: "used[i] = false", isCorrect: true }, { label: "path[step] = 0", value: "path[step] = 0", isCorrect: false }] }
      ]
    }
  }
];

// --- DFS MAZE ---
export const DFS_MAZE_LECTURE: LectureStep[] = [
  {
    id: 1,
    type: 'theory',
    title: '应用三：迷宫寻路',
    content: `
### 摸着墙走
在迷宫里，DFS 策略就是：
随便选一个方向走，只要不撞墙、不走回头路，就一直走。
如果走进死胡同，就退回到上一个路口，换个方向走。

### 优缺点
- **优点**：内存占用小（只存一条路径）。
- **缺点**：找出的路**不一定是最短路**！它可能绕了地球一圈才找到终点。
- **对比**：找最短路请用 BFS。找“存不存在一条路”或者“遍历所有路”，用 DFS。
    `
  },
  {
    id: 2,
    type: 'experiment',
    title: '实验：迷宫探险',
    content: `
**实验步骤**：
1. 点击 **Start Maze DFS**。
2. 观察红色探路者是如何钻进死胡同，然后变色回退的。
3. 注意：它找到终点时，路径可能是弯弯曲曲的。
    `
  }
];

// --- DFS N-QUEENS ---
export const DFS_NQUEENS_LECTURE: LectureStep[] = [
  {
    id: 1,
    type: 'theory',
    title: '应用四：N 皇后问题',
    content: `
### 皇家的烦恼
在 N×N 的棋盘上放 N 个皇后，使得她们互不攻击（不在同一行、同一列、同一对角线）。
这是一个经典的**约束满足问题**。

### 按行搜索
我们一行一行地放。
1. 在第 1 行，尝试放在第 1 列。
2. 在第 2 行，检查哪一列安全？尝试放在安全的位置。
3. ...
4. 如果到了第 k 行，发现所有列都被攻击了，说明前面的摆法有问题！**回溯**！
    `
  },
  {
    id: 2,
    type: 'experiment',
    title: '实验：八皇后演示',
    content: `
**实验步骤**：
1. 点击 **Start N-Queens** (默认演示 4皇后或8皇后)。
2. 观察棋盘：
   - **Q**：尝试放置的皇后。
   - **红色X**：被攻击的区域。
   - 当一行全红时，算法会回溯到上一行，移动那个皇后。
    `
  }
];

// --- DFS KNAPSACK/SUBSET SUM ---
export const DFS_BAG_LECTURE: LectureStep[] = [
  {
    id: 1,
    type: 'theory',
    title: '应用五：子集和问题',
    content: `
### 选还是不选
给定一堆数字，能不能从中选出几个，让它们的和恰好等于 Target？
或者：背包容量为 W，怎么选价值最大？

对于每个物品，我们只有两个选择：
1. **选它**：Target 减去当前值，去考虑下一个物品。
2. **不选它**：Target 不变，去考虑下一个物品。

这构成了一棵**二叉搜索树**。DFS 可以遍历这棵树的所有叶子，找到答案。
    `
  }
];

// --- DFS GRAPH ALGO ---
export const DFS_GRAPH_ALGO_LECTURE: LectureStep[] = [
  {
    id: 1,
    type: 'theory',
    title: '应用六：图的环检测',
    content: `
### 这里的路我好像走过
怎么判断一个有向图里有没有环？
简单的 \`visited\` 数组不够用，我们需要**三色标记法**：

- **白色 (0)**：未访问。
- **灰色 (1)**：正在访问（在递归栈中，还没回溯）。
- **黑色 (2)**：已访问完毕（回溯完了）。

如果在 DFS 过程中，你遇到了一个**灰色**的节点，说明你绕了一圈回到了自己的祖先节点——**有环！**
    `
  },
  {
    id: 2,
    type: 'experiment',
    title: '实验：找环',
    content: `
**实验步骤**：
1. 观察图中的箭头。
2. 点击 **Detect Cycle**。
3. 节点变**黄**表示正在递归（灰色状态）。
4. 如果一条黄色的路撞到了黄色的点，瞬间标红——发现环！
    `
  }
];

// --- DFS PRUNING ---
export const DFS_PRUNING_LECTURE: LectureStep[] = [
  {
    id: 1,
    type: 'theory',
    title: '应用七：剪枝技巧',
    content: `
### 别去南墙了
DFS 的搜索空间往往是指数级的。如果不加控制，程序会跑几亿年。
**剪枝 (Pruning)** 就是在搜索过程中，提前判断“这条路肯定没戏”，然后直接回溯，不再浪费时间。

### 常见剪枝
1. **可行性剪枝**：当前和已经超过 Target，后面全是正数，不用再加了。
2. **最优性剪枝**：当前花费已经超过了之前找到的最优解，后面再好也没用了。
    `
  }
];


// ================= BFS & EXISTING =================
// (Include all existing BFS lectures here to avoid overwrite issues)

export const BFS_BASIC_LECTURE: LectureStep[] = [
  {
    id: 1,
    type: 'theory',
    title: '1. BFS：水波纹战术',
    content: `
### 像病毒一样扩散
**广度优先搜索 (BFS)** 是一种极其自然的搜索方式，就像丧尸病毒爆发。
想象你往平静的湖面扔了一颗石子，涟漪会一圈一圈向外扩散。

- **第 0 秒**：只有起点（你）被感染。
- **第 1 秒**：所有和你**直接相连**的朋友被感染（距离为 1）。
- **第 2 秒**：你朋友的朋友被感染（距离为 2）。

这就是 BFS 的核心：**按层遍历**。

### 核心武器：队列 (Queue)
为了保证“先来后到”（先被感染的先去感染别人），我们需要一个**队列**。
队列的特点是 **FIFO (先进先出)**，就像排队买奶茶。
    `
  },
  {
    id: 2,
    type: 'experiment',
    title: '2. 实验：层层推进',
    content: `
**实验步骤**：
1. 观察右侧的图，我们默认从 **Node 1** 开始。
2. 在控制台点击 **Start BFS** 按钮。
3. **关键观察点**：
   - 它是如何“先把 Node 1 的所有邻居（Node 2, 3）都访问完”，**然后**才去访问 Node 2 的邻居（Node 4, 5）的？
   - 注意下方**队列**的变化，新发现的节点总是排在队尾。
   - 这种顺序保证了我们首次访问到某个点时，路径是最短的（在无权图中）。
    `
  },
  {
    id: 3,
    type: 'conclusion',
    title: '3. 总结：三步走战略',
    content: `
恭喜你完成了实验！BFS 的代码实现其实只有三步：

1. **入队**：把起点放入队列，标记为“已访问”。
2. **循环**：只要队列不空，就取出队头元素 U。
3. **扩散**：找到 U 的所有邻居 V。如果 V 没来过，就把 V 放入队列，标记 V。

> **记忆口诀**：入队、取头、推邻居。
    `
  },
  {
    id: 4,
    type: 'code',
    title: '4. 实战填空：初始化',
    content: `让我们开始写代码吧！第一步是准备工作。`,
    codeProblem: {
      template: `void bfs(int start) {
    queue<int> q;
    q.push(start);
    visited[start] = {{0}}; 
    
    while({{1}}) {
        // ...
    }
}`,
      blanks: [
        { id: 0, question: "标记起点状态", options: [{ label: "true", value: "true", isCorrect: true }, { label: "false", value: "false", isCorrect: false }] },
        { id: 1, question: "循环继续的条件", options: [{ label: "!q.empty()", value: "!q.empty()", isCorrect: true }, { label: "q.size() > 1", value: "q.size() > 1", isCorrect: false }] }
      ]
    }
  },
  {
    id: 5,
    type: 'code',
    title: '5. 实战填空：处理邻居',
    content: `核心逻辑：取出队头，把没见过的邻居拉下水。`,
    codeProblem: {
      template: `    while(!q.empty()) {
        int u = q.front(); 
        q.pop();

        for(int v : adj[u]) {
            if({{0}}) {
                visited[v] = true;
                q.push({{1}});
            }
        }
    }`,
      blanks: [
        { id: 0, question: "邻居 v 满足什么条件才入队？", options: [{ label: "!visited[v]", value: "!visited[v]", isCorrect: true }, { label: "visited[v]", value: "visited[v]", isCorrect: false }] },
        { id: 1, question: "把谁加入队列？", options: [{ label: "v", value: "v", isCorrect: true }, { label: "u", value: "u", isCorrect: false }] }
      ]
    }
  },
  {
    id: 6,
    type: 'quiz',
    title: '6. 知识点测验',
    content: '检测一下你是否真正掌握了 BFS。',
    quizData: {
      id: 1,
      question: "BFS 使用什么数据结构来维护待访问的节点？",
      options: ["栈 (Stack)", "队列 (Queue)", "堆 (Heap)", "链表 (List)"],
      correctAnswer: 1,
      explanation: "队列保证了先进先出 (FIFO)，从而实现了按层遍历的特性。"
    }
  },
  {
    id: 7,
    type: 'quiz',
    title: '7. 进阶测验',
    content: '关于复杂度的思考。',
    quizData: {
      id: 2,
      question: "如果一个图有 V 个节点和 E 条边，使用邻接表存储，BFS 的时间复杂度是？",
      options: ["O(V)", "O(E)", "O(V + E)", "O(V * E)"],
      correctAnswer: 2,
      explanation: "每个节点入队一次 O(V)，每条边被检查一次（或两次，无向图）O(E)。所以是 O(V+E)。"
    }
  },
  {
    id: 8,
    type: 'quiz',
    title: '8. 场景判断',
    content: 'BFS 适合解决什么问题？',
    quizData: {
      id: 3,
      question: "在一个迷宫中，每一步代价都为 1，求起点到终点的最少步数，应该用？",
      options: ["DFS (深度优先)", "BFS (广度优先)", "随机游走", "二分查找"],
      correctAnswer: 1,
      explanation: "BFS 按距离逐层扩散，第一次遇到终点时一定是最短路径。"
    }
  }
];

// --- BFS SHORTEST PATH ---
export const BFS_SHORTEST_PATH_LECTURE: LectureStep[] = [
  {
    id: 1,
    type: 'theory',
    title: '1. 无权图最短路',
    content: `
### 为什么又是 BFS？
在之前的实验中，你可能已经发现：BFS 总是先访问距离起点为 1 的点，再访问距离为 2 的点...

这意味着：**在边权都相等（比如都是 1）的图中，BFS 第一次摸到某个点时，走过的路一定是最近的！**
绝对不可能存在一条路，先绕到第 5 层，再折回来访问第 3 层的节点。

> **注意**：如果地图上有的路平坦（权值1），有的路泥泞（权值100），BFS 就失效了，那时候得请出 **Dijkstra** 大神。
    `
  },
  {
    id: 2,
    type: 'experiment',
    title: '2. 实验：寻找最短路',
    content: `
**实验步骤**：
1. 点击控制台的 **Start BFS**。
2. 这一次，请特别关注节点旁边的黄色文字 **d:X** (distance)。
3. 观察这个 **d** 值是如何随着层级增加而 +1 的。
4. 想象一下，如果是 DFS（一条道走到黑），d 值会是这样规律递增的吗？显然不是。
    `
  },
  {
    id: 3,
    type: 'code',
    title: '3. 实战填空：记录距离',
    content: `我们需要一个 dist 数组来记录每个点离起点多远。`,
    codeProblem: {
      template: `// dist[i] 初始化为 -1 或无穷大
dist[start] = 0;
q.push(start);

while(!q.empty()) {
    int u = q.front(); q.pop();
    for(int v : adj[u]) {
        if(dist[v] == -1) { // 没来过
            dist[v] = {{0}}; 
            q.push(v);
        }
    }
}`,
      blanks: [
        { id: 0, question: "如何更新 v 的距离？", options: [{ label: "dist[u] + 1", value: "dist[u] + 1", isCorrect: true }, { label: "dist[u]", value: "dist[u]", isCorrect: false }] }
      ]
    }
  },
  {
    id: 4,
    type: 'quiz',
    title: '4. 理解测验',
    content: '关于最短路的理解。',
    quizData: {
      id: 1,
      question: "如果边权不全是 1（例如有的边长是 5），普通 BFS 还能保证求出最短路吗？",
      options: ["能", "不能"],
      correctAnswer: 1,
      explanation: "不能。因为 BFS 只看“边数”最少，不看“总权重”最小。边数少的路径可能权值非常大。"
    }
  }
];

// --- BFS FLOOD FILL ---
export const BFS_FLOOD_FILL_LECTURE: LectureStep[] = [
  {
    id: 1,
    type: 'theory',
    title: '1. 洪水填充：油漆桶工具',
    content: `
### 甚至连连看
你在画图软件里用过“油漆桶”吗？点一下某个区域，整个封闭区域都会变色。
或者在玩扫雷、连连看时，点开一个空地，周围一大片都会打开。

这就是 **Flood Fill (洪水填充)** 算法。
我们将网格看作一个图：
- 每个格子是一个**节点**。
- 上下左右相邻的格子之间有**边**。

**目标**：找出有多少个“岛屿”（连通块），或者染满整个区域。
    `
  },
  {
    id: 2,
    type: 'experiment',
    title: '2. 实验：岛屿计数',
    content: `
右侧是一个网格地图。
- 🟦 **蓝色**：大海 (Visited / Water)
- ⬜ **灰白**：陆地 (Land)
- ⬛ **黑色**：障碍/墙壁

**实验步骤**：
1. 点击 **Start Flood Fill**。
2. 观察算法是如何找到一块陆地，然后疯狂向四周扩散，直到填满整个岛屿的。
3. 当一个岛屿填满后，它会继续扫描下一个未访问的陆地，开启新一轮扩散。
    `
  },
  {
    id: 3,
    type: 'code',
    title: '3. 实战填空：方向数组',
    content: `在网格中，我们通常用 dx, dy 数组来表示上下左右四个方向的位移。`,
    codeProblem: {
      template: `// 上下左右
int dx[] = {-1, 1, 0, 0};
int dy[] = {0, 0, -1, 1};

for(int i = 0; i < 4; i++) {
    int nx = x + dx[i];
    int ny = y + {{0}};
    
    // 边界检查：千万别走出地图！
    if(nx >= 0 && nx < rows && ny >= 0 && {{1}}) {
        // ...
    }
}`,
      blanks: [
        { id: 0, question: "计算新纵坐标", options: [{ label: "dy[i]", value: "dy[i]", isCorrect: true }, { label: "dx[i]", value: "dx[i]", isCorrect: false }] },
        { id: 1, question: "纵坐标边界检查", options: [{ label: "ny < cols", value: "ny < cols", isCorrect: true }, { label: "ny > cols", value: "ny > cols", isCorrect: false }] }
      ]
    }
  },
  {
    id: 4,
    type: 'quiz',
    title: '4. 连通性测验',
    content: '关于 Flood Fill 的细节。',
    quizData: {
      id: 1,
      question: "如果是“八连通”（允许对角线移动），方向数组的大小应该是多少？",
      options: ["4", "6", "8", "9"],
      correctAnswer: 2,
      explanation: "上下左右 + 4个对角线方向，共 8 个。"
    }
  },
  {
    id: 5,
    type: 'quiz',
    title: '5. 性能测验',
    content: 'DFS vs BFS',
    quizData: {
      id: 2,
      question: "在做 Flood Fill 时，用 DFS（递归）可能会遇到什么问题？",
      options: ["速度太慢", "栈溢出 (Stack Overflow)", "找不到所有连通块", "代码太难写"],
      correctAnswer: 1,
      explanation: "如果区域非常大（例如 1000x1000 的全白区域），递归深度可能达到 100万层，导致爆栈。BFS 用队列则不会。"
    }
  }
];

// --- BFS TOPO SORT ---
export const BFS_TOPO_SORT_LECTURE: LectureStep[] = [
  {
    id: 1,
    type: 'theory',
    title: '1. 拓扑排序：游戏技能树',
    content: `
### 解锁技能
玩游戏时，想学“大招”，必须先学“前置技能A”和“前置技能B”。
大学选课也一样，想修“高级算法”，得先修“数据结构”。

这种依赖关系构成了一个 **DAG (有向无环图)**。
我们需要排出一个顺序，让所有前置条件都被满足。

### Kahn 算法 (基于 BFS)
核心概念：**入度 (In-Degree)** —— 有多少箭头指向我（我有多少个未完成的前置条件）。
- 如果一个点入度为 0，说明它没有门槛，**现在就能学**！
    `
  },
  {
    id: 2,
    type: 'experiment',
    title: '2. 实验：Kahn 算法演示',
    content: `
**实验步骤**：
1. 观察图中的节点，特别是那些没有箭头指向它们的点（入度=0）。
2. 点击 **Run Kahn Algorithm**。
3. **流程观察**：
   - 第一波被“拿走”的（变绿）一定是入度为0的点。
   - 当一个点被拿走，它发出的箭头就消失了（邻居的入度 -1）。
   - 邻居如果入度变成了 0，马上加入下一轮队列。
   - 观察下方**队列**的变动，只有入度为0的点才有资格排队。
    `
  },
  {
    id: 3,
    type: 'conclusion',
    title: '3. 总结：剥洋葱',
    content: `
拓扑排序就像剥洋葱，每次都把最外面一层（入度为0，没有任何依赖）的皮剥掉。
剥掉一层后，里面的一层就露出来了（入度变为0），接着剥。

如果最后洋葱剥不完（队列空了但还有节点剩下），说明什么？
说明**有环**！比如 A依赖B，B依赖A，死锁了，谁都学不了。
    `
  },
  {
    id: 4,
    type: 'code',
    title: '4. 实战填空：计算入度',
    content: `第一步：统计每个点的入度。`,
    codeProblem: {
      template: `int in_degree[MAXN];
// 建图时统计
for(auto edge : edges) {
    int u = edge.from;
    int v = edge.to;
    adj[u].push_back(v);
    
    // v 多了一个前置条件 u
    {{0}}; 
}`,
      blanks: [
        { id: 0, question: "更新 v 的入度", options: [{ label: "in_degree[v]++", value: "in_degree[v]++", isCorrect: true }, { label: "in_degree[u]++", value: "in_degree[u]++", isCorrect: false }] }
      ]
    }
  },
  {
    id: 5,
    type: 'code',
    title: '5. 实战填空：核心逻辑',
    content: `第二步：不断把入度为0的点放入队列。`,
    codeProblem: {
      template: `// 初始：将所有入度为0的点入队
for(int i=1; i<=n; i++) 
    if(in_degree[i] == 0) q.push(i);

while(!q.empty()) {
    int u = q.front(); q.pop();
    result.push_back(u);

    for(int v : adj[u]) {
        in_degree[v]--; // 既然u修完了，v的限制就少一个
        if({{0}}) {
            q.push(v);
        }
    }
}`,
      blanks: [
        { id: 0, question: "v 入队的条件？", options: [{ label: "in_degree[v] == 0", value: "in_degree[v] == 0", isCorrect: true }, { label: "in_degree[v] < 0", value: "in_degree[v] < 0", isCorrect: false }] }
      ]
    }
  },
  {
    id: 6,
    type: 'quiz',
    title: '6. 环的检测',
    content: '拓扑排序不仅能排序，还能判环。',
    quizData: {
      id: 1,
      question: "如果 Kahn 算法结束后，结果集中的节点数量小于总节点数 N，说明图中？",
      options: ["存在环 (Cycle)", "是森林", "是连通图", "没有环"],
      correctAnswer: 0,
      explanation: "如果存在环，环上的节点入度永远不会减为 0，因此永远不会入队，也就不会进入结果集。"
    }
  }
];

// --- BFS STATE SPACE SEARCH ---
export const BFS_STATE_SPACE_LECTURE: LectureStep[] = [
  {
    id: 1,
    type: 'theory',
    title: '1. 状态空间搜索：隐式图',
    content: `
### 看不见的图
有时候，题目没有给你一张画好的图（没有明确的点和边）。
只告诉你：
- **初始状态**：比如“水桶里有 0 升水”。
- **允许操作**：比如“把水桶加满”、“倒掉一半”。
- **目标状态**：比如“得到 4 升水”。

这其实也是图论！
- **节点** = 每一个可能的状态。
- **边** = 每一个操作（状态转移）。

我们的任务就是在这个“隐式图”中，找到从起点到终点的最短路径（最少操作次数）。
    `
  },
  {
    id: 2,
    type: 'experiment',
    title: '2. 实验：状态演变',
    content: `
虽然我们展示的还是一个普通图，但请把它想象成**状态的转移**。
- 节点 1 是初始状态。
- 连接它的边，是你可以做的操作（比如 +1, *2）。
- 你的目标是到达节点 8。

**实验步骤**：
1. 点击 **Start BFS**。
2. 观察它是如何探索所有可能性的。
3. 它不会一条路走到黑，而是尝试所有“一步能做到的事”，然后尝试“两步能做到的事”。
    `
  },
  {
    id: 3,
    type: 'theory',
    title: '3. 关键挑战：重复状态',
    content: `
### 别走回头路
在状态搜索中，很容易绕圈子。
比如：
- 状态 1 -> (+1) -> 状态 2
- 状态 2 -> (-1) -> 状态 1
如果不加控制，程序会死循环。

**判重 (Visited)** 非常关键！
通常我们需要一个 \`set\` 或者哈希表 \`unordered_set\` 来记录：“这个状态我已经处理过了，别再浪费时间”。
    `
  },
  {
    id: 4,
    type: 'code',
    title: '4. 实战填空：定义状态',
    content: `首先我们要定义什么是“状态”。如果是简单的数字变化，用 int 就行；如果是复杂的棋盘，可能需要 struct。`,
    codeProblem: {
      template: `struct State {
    int x, y; // 比如两个水杯的水量
    int step; // 走到这一步用了多少次操作
};

queue<State> q;
// 初始状态入队
q.push({0, 0, 0});
visited[0][0] = {{0}};`,
      blanks: [
        { id: 0, question: "标记起点已访问", options: [{ label: "true", value: "true", isCorrect: true }, { label: "1", value: "1", isCorrect: true }] }
      ]
    }
  },
  {
    id: 5,
    type: 'code',
    title: '5. 实战填空：状态转移',
    content: `尝试每一种可能的操作，生成新状态。`,
    codeProblem: {
      template: `State curr = q.front(); q.pop();

if (curr.x == target) return curr.step;

// 尝试操作：倒满 A 杯 (假设容量 MAX_A)
int next_x = MAX_A;
int next_y = curr.y;

// 只有没见过的状态才入队
if (!visited[next_x][next_y]) {
    visited[next_x][next_y] = true;
    q.push({next_x, next_y, {{0}}});
}`,
      blanks: [
        { id: 0, question: "步数如何更新？", options: [{ label: "curr.step + 1", value: "curr.step + 1", isCorrect: true }, { label: "curr.step", value: "curr.step", isCorrect: false }] }
      ]
    }
  },
  {
    id: 6,
    type: 'quiz',
    title: '6. 知识点测验',
    content: '关于状态空间的复杂度。',
    quizData: {
      id: 1,
      question: "为什么状态空间搜索容易 '爆内存' (Memory Limit Exceeded)？",
      options: ["因为状态数量可能呈指数级增长", "因为队列本身很占内存", "因为递归太深", "因为整数溢出"],
      correctAnswer: 0,
      explanation: "状态空间经常非常巨大（例如魔方、数独），BFS 需要把某一层的所有状态都存入队列，宽度可能极大。"
    }
  }
];

// --- BFS BIPARTITE CHECK ---
export const BFS_BIPARTITE_LECTURE: LectureStep[] = [
  {
    id: 1,
    type: 'theory',
    title: '1. 二分图判定：非黑即白',
    content: `
### 势不两立
**二分图 (Bipartite Graph)** 是这样一种图：
你可以把所有点分成两组（比如“红队”和“蓝队”），使得**所有边**都是连接红队和蓝队的。
**同队之间绝对没有边相连**。

### 染色法
如何判断一个图是不是二分图？
我们尝试给它染色：
1. 挑一个点染成黑色。
2. 它的所有邻居必须染成白色。
3. 邻居的邻居必须染成黑色...
如果在染色过程中，发现一个点两边的邻居颜色和它一样，那就**冲突**了，说明不是二分图。
    `
  },
  {
    id: 2,
    type: 'experiment',
    title: '2. 实验：染色过程',
    content: `
**实验步骤**：
1. 右侧展示了一个可能含有冲突的图。
2. 点击 **Check Bipartite**。
3. 观察 BFS 过程：
   - 黑色节点的邻居变白色。
   - 白色节点的邻居变黑色。
   - 如果遇到 **Fail** 红色高亮，说明发生了冲突（比如试图给一个已经是白色的节点的邻居染白色）。
    `
  },
  {
    id: 3,
    type: 'conclusion',
    title: '3. 总结：奇环定理',
    content: `
一个重要的数学结论：
**一个图是二分图，当且仅当它不包含“奇数长度的环”**。

- 三角形 (环长3)：A-B-C-A。A黑->B白->C黑->A(白?)。冲突！
- 四边形 (环长4)：A-B-C-D-A。A黑->B白->C黑->D白->A(黑)。没问题。

BFS 染色法本质上就是在检测是否存在奇环。
    `
  },
  {
    id: 4,
    type: 'code',
    title: '4. 实战填空：染色逻辑',
    content: `我们需要一个 color 数组，0 表示未染色，1 表示黑，2 表示白。`,
    codeProblem: {
      template: `int color[MAXN]; // 初始化为 0

bool bfs(int start) {
    queue<int> q;
    q.push(start);
    color[start] = 1; // 染成黑色

    while(!q.empty()) {
        int u = q.front(); q.pop();
        for(int v : adj[u]) {
            if(color[v] == 0) {
                // 没染过色，染成相反颜色
                color[v] = 3 - color[u]; // 1变2，2变1
                q.push(v);
            } else if(color[v] == {{0}}) {
                // 颜色冲突！
                return false;
            }
        }
    }
    return true;
}`,
      blanks: [
        { id: 0, question: "发生冲突的条件？", options: [{ label: "color[u]", value: "color[u]", isCorrect: true }, { label: "3 - color[u]", value: "3 - color[u]", isCorrect: false }] }
      ]
    }
  },
  {
    id: 5,
    type: 'quiz',
    title: '5. 概念测验',
    content: '检测对二分图的理解。',
    quizData: {
      id: 1,
      question: "下列哪种图形一定不是二分图？",
      options: ["一条直线 (链)", "一个三角形", "一个正方形", "一棵树"],
      correctAnswer: 1,
      explanation: "三角形是长度为 3 的环（奇环），无法进行二染色。"
    }
  },
  {
    id: 6,
    type: 'quiz',
    title: '6. 应用场景',
    content: '二分图有什么用？',
    quizData: {
      id: 2,
      question: "二分图最典型的应用场景是？",
      options: ["最短路径计算", "匹配问题 (如男女配对)", "拓扑排序", "最小生成树"],
      correctAnswer: 1,
      explanation: "二分图最大匹配是经典问题，常用于分配任务、相亲配对等场景。"
    }
  }
];

// --- BFS MULTI-SOURCE ---
export const BFS_MULTI_SOURCE_LECTURE: LectureStep[] = [
  {
    id: 1,
    type: 'theory',
    title: '1. 多源 BFS：僵尸围城',
    content: `
### 到处都在爆发
普通的 BFS 只有一个起点。
但如果是“僵尸爆发”问题呢？僵尸可能同时在城市 A、城市 B 和城市 C 出现。
你想知道离你最近的僵尸有多远。

### 超级源点 (Super Source)
我们可以假想有一个虚拟的“超级源点 0”，连接到所有真实的起点（A, B, C），边权为 0。
从超级源点做一次 BFS，就等价于从所有起点同时开始扩散！

在代码实现上，我们不需要真的建这个点，只需要**一开始把所有起点都 push 进队列**，并把它们的距离设为 0。
    `
  },
  {
    id: 2,
    type: 'experiment',
    title: '2. 实验：多点开花',
    content: `
**实验步骤**：
1. 观察图中的 **Node 1** 和 **Node 6**，它们都是红色的（表示感染源）。
2. 点击 **Start BFS (Nodes 1 & 6)**。
3. 观察波纹是如何从这两个点**同时**向外扩散的。
4. 这种方式求出的 \`dist[i]\`，就是点 i 到 **最近的** 那个起点的距离。
    `
  },
  {
    id: 3,
    type: 'code',
    title: '3. 实战填空：初始化队列',
    content: `多源 BFS 的唯一区别就在于初始化。`,
    codeProblem: {
      template: `queue<int> q;
// sources 是所有起点的列表
for(int start_node : sources) {
    dist[start_node] = 0;
    visited[start_node] = true;
    q.push({{0}});
}

while(!q.empty()) {
    // 后面和普通 BFS 一模一样！
    int u = q.front(); q.pop();
    // ...
}`,
      blanks: [
        { id: 0, question: "将谁入队？", options: [{ label: "start_node", value: "start_node", isCorrect: true }, { label: "0", value: "0", isCorrect: false }] }
      ]
    }
  },
  {
    id: 4,
    type: 'quiz',
    title: '4. 效率测验',
    content: '多源 BFS 会变慢吗？',
    quizData: {
      id: 1,
      question: "假设有 K 个起点，图的点数为 V，边数为 E。多源 BFS 的时间复杂度是？",
      options: ["O(K * (V + E))", "O(V + E)", "O(K * V)", "O(E^2)"],
      correctAnswer: 1,
      explanation: "虽然有多个起点，但每个节点依然只会在第一次被访问时处理一次，每条边也只扫描常数次。复杂度依然是 O(V+E)。"
    }
  },
  {
    id: 5,
    type: 'quiz',
    title: '5. 应用场景',
    content: '01-BFS',
    quizData: {
      id: 2,
      question: "经典的 '01 矩阵中求每个点到最近的 0 的距离' 是什么问题？",
      options: ["多源 BFS", "DFS", "Dijkstra", "动态规划"],
      correctAnswer: 0,
      explanation: "将所有 '0' 的位置作为起点放入队列，做一次多源 BFS 即可得到答案。"
    }
  }
];

// ================= STRING ALGORITHMS =================

export const KMP_LECTURE: LectureStep[] = [
  {
    id: 1,
    type: 'theory',
    title: 'KMP：不再回头的匹配',
    content: `
### 暴力匹配的痛点
普通字符串匹配 (Brute Force) 当遇到不匹配字符时，指针 \`i\` 会回溯。
例如 \`AAAAAB\` 匹配 \`AAAB\`，每次都要重头来。

### Next 数组 (前缀表)
KMP 的核心是利用已匹配部分的信息。
\`next[i]\` 表示子串 \`p[0...i]\` 的 **最长相等前后缀长度**。
如果不匹配，我们不需要回溯主串指针，只需要查表看看模式串指针应该跳到哪里。
    `
  },
  {
    id: 2,
    type: 'code',
    title: '实战：Next 数组构建',
    content: `构造 Next 数组是 KMP 的精髓。`,
    codeProblem: {
      template: `for (int i = 1, j = 0; i < n; i++) {
    while (j > 0 && p[i] != p[j]) {
        j = {{0}}; // 回退 j
    }
    if (p[i] == p[j]) {
        j++;
    }
    next[i] = j;
}`,
      blanks: [
        { id: 0, question: "j 回退到哪里？", options: [{ label: "next[j-1]", value: "next[j-1]", isCorrect: true }, { label: "0", value: "0", isCorrect: false }] }
      ]
    }
  }
];

export const MANACHER_LECTURE: LectureStep[] = [
  {
    id: 1,
    type: 'theory',
    title: 'Manacher：回文串之王',
    content: `
### 奇偶性的尴尬
找最长回文子串，暴力法是以每个点为中心向外扩。
但 \`aba\` (奇数) 和 \`abba\` (偶数) 的中心不同，处理很麻烦。

### 马拉车变换
Manacher 第一步：在字符间插入 \`#\`。
\`aba\` -> \`^#a#b#a#$\`
\`abba\` -> \`^#a#b#b#a#$\`
所有回文串都变成了奇数长度！利用回文的对称性，我们可以复用之前计算过的半径，达到 O(N)。
    `
  }
];

export const AC_AUTOMATON_LECTURE: LectureStep[] = [
  {
    id: 1,
    type: 'theory',
    title: 'AC 自动机：KMP 上树',
    content: `
### 多模式匹配
KMP 只能查一个词。如果要在文章里查 1000 个敏感词，跑 1000 遍 KMP 太慢了。

### Trie + Fail 指针
AC 自动机建立在 Trie 树之上。
我们为 Trie 的每个节点加一个 **Fail 指针**。
它的含义和 KMP 的 Next 数组一样：**“这里匹配失败了，我该跳到哪个节点继续尝试？”**
这个跳转节点，一定是当前已匹配后缀的最长前缀。
    `
  }
];

// ================= DATA STRUCTURES =================

export const TRIE_LECTURE: LectureStep[] = [
  {
    id: 1,
    type: 'theory',
    title: 'Trie：高效前缀树',
    content: `Trie 树利用字符串的公共前缀来减少查询时间，最大限度地减少无谓的字符串比较。`,
  },
  {
    id: 2,
    type: 'experiment',
    title: '实验：插入与查询',
    content: `观察 Trie 树的结构。点击“算法演示”页签可以更详细地操作。`,
    experimentConfig: { hint: "尝试在脑海中模拟 'apple' 和 'app' 的路径。" }
  }
];

export const HASH_LECTURE: LectureStep[] = [
  {
    id: 1,
    type: 'theory',
    title: 'Hash：映射的魔力',
    content: `哈希表通过哈希函数 Hash(key) 将键映射到数组下标，实现 O(1) 查找。`,
  }
];

export const UNION_FIND_LECTURE: LectureStep[] = [
  {
    id: 1,
    type: 'theory',
    title: '并查集：连通性管理',
    content: `并查集维护不相交集合。核心操作：Find（找老大）和 Union（合并）。路径压缩将树高度压扁至近乎 O(1)。`,
  }
];

export const BALANCED_TREE_LECTURE: LectureStep[] = [
  {
    id: 1,
    type: 'theory',
    title: 'Treap：随机的艺术',
    content: `
### Tree + Heap
Treap 给每个节点一个随机的 Priority。
- 也就是：BST 的性质（Key 左小右大） + 堆的性质（Priority 父大子小）。
- 依靠随机性，Treap 几乎不可能退化成链，保持平衡 O(log N)。
    `
  }
];

// ================= GRAPH ALGORITHMS =================

export const MST_LECTURE: LectureStep[] = [
  {
    id: 1,
    type: 'theory',
    title: '最小生成树：修路省钱',
    content: `
### 连通且成本最低
要在 N 个城市间修路，让所有城市连通，且总造价最低。这就是 MST。
- **Kruskal 算法**：贪心。把所有边按权值排序，从小到大选。如果这条边连接的两个点还未连通（用并查集判断），就选它。
- **Prim 算法**：类似 Dijkstra。从一个点开始，每次把离当前连通块最近的点吸纳进来。
    `
  }
];

export const SHORTEST_PATH_LECTURE: LectureStep[] = [
  {
    id: 1,
    type: 'theory',
    title: 'Dijkstra：导航原理',
    content: `
### 松弛操作 (Relax)
Dijkstra 维护 \`dist[]\` 数组。
每次从优先队列中取出距离起点最近的未访问点 \`u\`。
遍历 \`u\` 的邻居 \`v\`，如果 \`dist[u] + w < dist[v]\`，说明找到了一条更近的路，更新 \`dist[v]\`。
**注意**：Dijkstra 不能处理负权边。
    `
  }
];

export const TARJAN_LECTURE: LectureStep[] = [
  {
    id: 1,
    type: 'theory',
    title: 'Tarjan：强连通分量',
    content: `
### 环的缩影
在有向图中，如果两个点能互相到达，它们就在同一个强连通分量 (SCC) 中。
Tarjan 算法利用 DFS 序的时间戳 \`dfn\` 和 追溯值 \`low\`。
如果 \`dfn[u] == low[u]\`，说明 \`u\` 是这个 SCC 的根，它下面的所有节点构成一个强连通分量。
    `
  }
];

export const DIFF_CONSTRAINTS_LECTURE: LectureStep[] = [
  {
    id: 1,
    type: 'theory',
    title: '差分约束：不等式组',
    content: `
### 转化为最短路
形如 \`x - y <= k\` 的不等式组。
移项得 \`x <= y + k\`。
这看起来是不是很像最短路的松弛条件 \`dist[v] <= dist[u] + w\`？
我们可以建立一条从 y 到 x，权值为 k 的边。跑一遍最短路（SPFA/Bellman-Ford）即可求出一组解。
    `
  }
];

// ================= TREE ALGORITHMS =================

export const TREE_DIAMETER_LECTURE: LectureStep[] = [
  {
    id: 1,
    type: 'theory',
    title: '树的直径：最远的两人',
    content: `
### 定义
树上最远的两个节点之间的路径长度。

### 两次 BFS 法
1. 随便选一点 P，做一次 BFS 找到离 P 最远的点 Q。
2. 从 Q 出发，再做一次 BFS，找到离 Q 最远的点 R。
3. Q 到 R 的路径就是直径。
    `
  },
  {
    id: 2,
    type: 'experiment',
    title: '实验：两次 BFS',
    content: `
**任务**：
1. 点击控制台的 **Start BFS** 按钮两次。
2. 第一次可能会停在一个边缘节点。
3. 第二次从那个边缘节点出发，一定能走到树的另一端。
    `
  }
];

export const TREE_CENTROID_LECTURE: LectureStep[] = [
  {
    id: 1,
    type: 'theory',
    title: '树的重心：平衡点',
    content: `
### 定义
找到一个点，如果把这个点删掉，剩下的最大连通块（子树）的大小最小。
重心通常用于点分治算法，能保证递归层数最少 (log N)。
    `
  },
  {
    id: 2,
    type: 'experiment',
    title: '实验：寻找重心',
    content: `
尝试移除不同的节点，观察最大子连通块的大小。
**任务**：
在控制台输入节点 ID，点击 **计算最大连通块**。
找到那个让数值最小的节点。
    `
  }
];

export const TREE_CENTER_LECTURE: LectureStep[] = [
  {
    id: 1,
    type: 'theory',
    title: '树的中心',
    content: `
### 定义
树的中心是到树中其他节点的最远距离最小的节点。
它通常位于树的直径的中点附近。
    `
  }
];

export const TREE_DP_LECTURE: LectureStep[] = [
  {
    id: 1,
    type: 'theory',
    title: '树形 DP：没有上司的舞会',
    content: `
### 状态设计
经典问题：选了父节点就不能选子节点，求最大权值。
\`dp[u][0]\`：不选 u，子节点可选可不选。
\`dp[u][1]\`：选 u，子节点绝对不能选。
    `
  },
  {
    id: 2,
    type: 'experiment',
    title: '实验：状态转移',
    content: `
点击 **执行状态转移**。
观察 DP 值是如何从叶子节点一步步汇聚到根节点的。
    `
  }
];

export const TREE_KNAPSACK_LECTURE: LectureStep[] = [
  {
    id: 1,
    type: 'theory',
    title: '树上背包',
    content: `
### 泛化物品
在树上选 M 个点，必须连通（依赖父节点），求最大权值。
这就是树上分组背包问题。
\`dp[u][k]\` 表示以 u 为根的子树选 k 个点的最大价值。
需要合并子节点的背包。
    `
  }
];

// ================= ALGORITHMS =================

export const SWEEP_LINE_LECTURE: LectureStep[] = [
  {
    id: 1,
    type: 'theory',
    title: '扫描线：矩形面积并',
    content: `
### 想象一根线
求平面上一堆矩形的覆盖总面积。
想象一根竖直线从左扫到右。
我们需要维护扫描线被矩形覆盖的长度。
这通常结合 **线段树** 来实现。
    `
  }
];
