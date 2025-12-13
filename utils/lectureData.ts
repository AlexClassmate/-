
import { LectureStep } from '../types';

// ================= RECURSION MODULE =================

export const RECURSION_FACTORIAL_LECTURE: LectureStep[] = [
  {
    id: 1,
    type: 'theory',
    title: '1. 阶乘：定义的递归',
    content: `
### 什么是阶乘？
一个正整数 n 的阶乘 (factorial) 是所有小于及等于 n 的正整数的积。
记作 \`n!\`。
- 3! = 3 × 2 × 1 = 6
- 5! = 5 × 4 × 3 × 2 × 1 = 120

### 递归定义
我们可以把定义换个写法：
\`n! = n × (n-1)!\`
这简直就是天然的递归结构！只要解决了 (n-1)!，乘上 n 就是 n!。
    `
  },
  {
    id: 2,
    type: 'experiment',
    title: '2. 实验：层层展开',
    content: `
**实验目标**：观察递归函数的“递”与“归”。

**操作步骤**：
1. 点击控制台的 **Calculate Factorial(5)**。
2. 观察屏幕中央的算式展开过程。
   - 递：它会一直问 "fact(4) 是多少？", "fact(3) 是多少？"... 直到 fact(1)。
   - 归：fact(1) 告诉 fact(2) 答案，fact(2) 算完告诉 fact(3)...
3. 注意右侧的递归栈，它会越堆越高，直到触底反弹。
    `
  },
  {
    id: 3,
    type: 'conclusion',
    title: '3. 实验结论',
    content: `
### 递归的代价
你注意到了吗？右侧的栈每调用一次就会长高一截。
每一次函数调用 \`factorial(n)\` 都会在内存的**栈 (Stack)** 中开辟一块空间，用来保存当前的 n 值和返回地址。

- 计算 5! 需要 6 层栈帧（5,4,3,2,1,0）。
- 计算 10000! 需要 10001 层栈帧。

**风险**：如果 n 太大，栈空间会被耗尽，导致 **Stack Overflow** 错误。工程中通常使用迭代或尾递归优化来解决。
    `
  },
  {
    id: 4,
    type: 'code',
    title: '4. 实战填空：递归基',
    content: `所有的递归都需要一个停止的条件，否则会无限循环（Stack Overflow）。`,
    codeProblem: {
      template: `int factorial(int n) {
    // 递归出口
    if ({{0}}) {
        return 1;
    }
    // 递归调用
    return n * factorial(n - 1);
}`,
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
    content: `
### 问题描述
编写一个函数，计算给定非负整数 n 的阶乘。

### 样例
**Input**: 5
**Output**: 120
    `,
    codeSnippet: `long long factorial(int n) {
    // 递归基：0! = 1, 1! = 1
    // 当规模减小到最小时，直接返回结果
    if (n <= 1) return 1;
    
    // 递归步：n! = n * (n-1)!
    // 相信 factorial(n-1) 能算出正确结果，利用它
    return n * factorial(n - 1);
}`
  }
];

export const RECURSION_GCD_LECTURE: LectureStep[] = [
  {
    id: 1,
    type: 'theory',
    title: '1. 辗转相除法：古老的智慧',
    content: `
### 最大公约数 (GCD)
求两个数 a 和 b 的最大公约数。
早在 2300 年前，欧几里得就发现了这个神级算法：
\`gcd(a, b) = gcd(b, a % b)\`

例子：gcd(48, 18)
- 48 % 18 = 12 -> 转化为 gcd(18, 12)
- 18 % 12 = 6  -> 转化为 gcd(12, 6)
- 12 % 6 = 0   -> 转化为 gcd(6, 0)
- 当第二个数为 0 时，第一个数就是答案！(6)
    `
  },
  {
    id: 2,
    type: 'experiment',
    title: '2. 实验：快速收敛',
    content: `
**实验目标**：感受对数级的收敛速度。

**操作步骤**：
1. 点击 **GCD(48, 18)**。
2. 观察数字是如何迅速变小的。
3. 即使是很大的数字，通常只需要几十次递归就能算出来。这也是现代加密算法的基础。
    `
  },
  {
    id: 3,
    type: 'conclusion',
    title: '3. 实验结论',
    content: `
### 为什么这么快？
每次递归，参数从 \`(a, b)\` 变成了 \`(b, a % b)\`。
- 如果 \`a < b\`，第一步只是交换顺序。
- 如果 \`a >= b\`，那么 \`a % b\` 必然小于 \`a / 2\`。

这意味着每经过两次递归，数字的大小至少**减半**。
**时间复杂度：O(log n)**。这比减法模拟除法（更相减损术）要快得多。
    `
  },
  {
    id: 4,
    type: 'code',
    title: '4. 实战填空：一行代码',
    content: `辗转相除法是代码最短的递归算法之一。`,
    codeProblem: {
      template: `int gcd(int a, int b) {
    // 递归基：余数为 0
    if ({{0}}) return a;
    
    // 递归步
    return gcd(b, {{1}});
}`,
      blanks: [
        { id: 0, question: "什么时候结束？", options: [{ label: "b == 0", value: "b == 0", isCorrect: true }, { label: "a == 0", value: "a == 0", isCorrect: false }] },
        { id: 1, question: "新的参数", options: [{ label: "a % b", value: "a % b", isCorrect: true }, { label: "a / b", value: "a / b", isCorrect: false }] }
      ]
    }
  },
  {
    id: 5,
    type: 'quiz',
    title: '5. 复杂度分析',
    content: '它为什么快？',
    quizData: {
      id: 1,
      question: "欧几里得算法的时间复杂度是多少？",
      options: ["O(a)", "O(b)", "O(log(min(a,b)))", "O(a*b)"],
      correctAnswer: 2,
      explanation: "每次取模，数字至少减半（近似），所以是 O(log n)。这非常快。"
    }
  },
  {
    id: 6,
    type: 'full_code',
    title: '6. 代码实现',
    content: `
### 问题描述
输入两个正整数 a 和 b，求它们的最大公约数。

### 样例
**Input**: 48 18
**Output**: 6
    `,
    codeSnippet: `int gcd(int a, int b) {
    // 递归基：当除数 b 为 0 时，被除数 a 即为最大公约数
    if (b == 0) return a;
    
    // 递归步：根据欧几里得原理，gcd(a, b) = gcd(b, a % b)
    // 问题的规模迅速减小
    return gcd(b, a % b);
}`
  }
];

export const RECURSION_STRING_REV_LECTURE: LectureStep[] = [
  {
    id: 1,
    type: 'theory',
    title: '1. 字符串反转：分而治之',
    content: `
### 任务
将字符串 "HELLO" 变成 "OLLEH"。

### 递归思路
我们可以只关注**首尾两个字符**。
1. 交换第一个和最后一个字符。
2. 剩下的中间部分（子串），交给递归函数去处理。
3. 当只剩 0 个或 1 个字符时，停止。

例如：Reverse("HELLO")
- 交换 H, O -> "O" + Reverse("ELL") + "H"
- Reverse("ELL") -> 交换 E, L -> "L" + Reverse("L") + "E"
    `
  },
  {
    id: 2,
    type: 'experiment',
    title: '2. 实验：双指针向中心汇聚',
    content: `
**实验目标**：观察指针的变化。

**操作步骤**：
1. 点击 **Reverse String**。
2. 观察高亮的两个格子（左指针 L 和右指针 R）。
3. 它们交换内容后，分别向中间移动一步，进入下一层递归。
    `
  },
  {
    id: 3,
    type: 'conclusion',
    title: '3. 实验结论',
    content: `
### 空间换时间？
在这个递归版本中，我们不需要创建一个新的字符串副本，而是直接修改原字符串（In-place）。
但是，递归本身隐式地使用了 **O(N)** 的栈空间。

**工程启示**：
虽然代码看起来很优雅，但对于简单的反转，我们通常用 \`while\` 循环（迭代法）来节省这部分栈空间，实现真正的 O(1) 空间复杂度。
    `
  },
  {
    id: 4,
    type: 'code',
    title: '4. 实战填空：控制范围',
    content: `我们需要两个参数 left 和 right 来标记当前处理的范围。`,
    codeProblem: {
      template: `void reverse(string &s, int l, int r) {
    // 递归基：指针相遇或错过
    if (l >= r) return;
    
    // 交换首尾
    swap(s[l], s[r]);
    
    // 递归处理剩下的内部
    reverse(s, {{0}}, {{1}});
}`,
      blanks: [
        { id: 0, question: "左指针移动", options: [{ label: "l + 1", value: "l + 1", isCorrect: true }, { label: "l", value: "l", isCorrect: false }] },
        { id: 1, question: "右指针移动", options: [{ label: "r - 1", value: "r - 1", isCorrect: true }, { label: "r", value: "r", isCorrect: false }] }
      ]
    }
  },
  {
    id: 5,
    type: 'quiz',
    title: '5. 边界思考',
    content: '关于奇偶长度。',
    quizData: {
      id: 1,
      question: "对于字符串 'ABCDE' (长度5)，递归停止时，左指针 L 和 右指针 R 的位置关系是？",
      options: ["L < R", "L == R", "L > R", "L == R + 2"],
      correctAnswer: 1,
      explanation: "长度为奇数时，指针最终会重合在中间字符 ('C') 上，此时 L == R，满足终止条件 (L >= R)，停止递归。"
    }
  },
  {
    id: 6,
    type: 'full_code',
    title: '6. 代码实现',
    content: `
### 问题描述
编写一个函数，原地反转给定的字符串。

### 样例
**Input**: "hello"
**Output**: "olleh"
    `,
    codeSnippet: `void reverseString(string &s, int l, int r) {
    // 递归基：左指针 >= 右指针，说明已交换完毕
    if (l >= r) return;
    
    // 交换首尾字符
    swap(s[l], s[r]);
    
    // 递归处理剩下的子串（缩小范围）
    reverseString(s, l + 1, r - 1);
}`
  }
];

export const RECURSION_REVERSE_LIST_LECTURE: LectureStep[] = [
  {
    id: 1,
    type: 'theory',
    title: '1. 链表逆序输出：递归的“归”',
    content: `
### 难题
单向链表 (A -> B -> C -> D) 只能从头走到尾。如果想**先输出 D，再输出 C...** 怎么办？
普通做法可能需要把链表反转，或者用一个显式的栈。

### 利用系统栈
递归函数天然就是一个栈！
\`void print(Node* head)\`
1. 先递归调用 \`print(head->next)\`（去处理后面的节点）。
2. **等它回来后**，再打印自己的值 \`cout << head->val\`。

这样，最先被打印的一定是到达终点后回溯时的第一个节点（即最后一个节点）。
    `
  },
  {
    id: 2,
    type: 'experiment',
    title: '2. 实验：回马枪',
    content: `
**实验目标**：理解“后序遍历”的执行时机。

**操作步骤**：
1. 点击 **Reverse Print List**。
2. 观察黄色光标：它会一路向右冲到 Null (递)。
3. **关键点**：注意看 **Output** 区域。数字是在光标**向左回退 (归)** 的时候才出现的！
    `
  },
  {
    id: 3,
    type: 'conclusion',
    title: '3. 实验结论',
    content: `
### 系统栈模拟显式栈
我们并没有显式地创建一个 \`Stack<Node>\` 数据结构，而是利用了程序执行的**调用栈 (Call Stack)**。
- 递归进入时：相当于 \`stack.push(node)\`。
- 递归返回时：相当于 \`stack.pop()\`, 此时执行打印操作。

这就是**后序遍历 (Post-order Traversal)** 的本质：先访问子节点，再访问根节点。
    `
  },
  {
    id: 4,
    type: 'code',
    title: '4. 实战填空：打印时机',
    content: `代码顺序决定了是正序还是逆序。`,
    codeProblem: {
      template: `void reversePrint(ListNode* head) {
    if (head == nullptr) return;
    
    // 1. 先去下一层
    reversePrint(head->next);
    
    // 2. 回来后再打印
    cout << {{0}} << endl;
}`,
      blanks: [
        { id: 0, question: "打印谁？", options: [{ label: "head->val", value: "head->val", isCorrect: true }, { label: "head->next->val", value: "head->next->val", isCorrect: false }] }
      ]
    }
  },
  {
    id: 5,
    type: 'quiz',
    title: '5. 思考题',
    content: '如果把顺序反过来？',
    quizData: {
      id: 1,
      question: "如果把 `cout` 放在递归调用 `reversePrint` 之前，会发生什么？",
      options: ["正序打印 (A->B->C)", "逆序打印 (C->B->A)", "不打印", "死循环"],
      correctAnswer: 0,
      explanation: "先打印再递归，就是标准的前序遍历，输出顺序和链表顺序一致。"
    }
  },
  {
    id: 6,
    type: 'full_code',
    title: '6. 代码实现',
    content: `
### 问题描述
给定一个单链表，从尾到头打印每个节点的值。

### 样例
**Input**: 1 -> 2 -> 3 -> NULL
**Output**: 3 2 1
    `,
    codeSnippet: `void reversePrint(ListNode* head) {
    // 递归基：到达链表尾部 (NULL)
    if (head == nullptr) return;
    
    // 递：先去处理下一个节点
    reversePrint(head->next);
    
    // 归：从深层返回后，打印当前节点
    // 这样最先打印的是最后一个节点
    cout << head->val << " ";
}`
  }
];

export const RECURSION_FIB_LECTURE: LectureStep[] = [
  {
    id: 1,
    type: 'theory',
    title: '1. 斐波那契：兔子的繁衍',
    content: `
### 问题背景
斐波那契数列 (Fibonacci Sequence) 描述了理想情况下兔子的繁衍过程：
- 第 1 个月，有一对小兔子。
- 第 2 个月，小兔子长大了。
- 第 3 个月，大兔子生了一对小兔子（现有 2 对）。
- 第 4 个月，大兔子又生了一对，原来的小兔子也长大了（现有 3 对）。

### 数学定义
\`f(n) = f(n-1) + f(n-2)\`
即：**当前月份的兔子数 = 上个月的兔子数 + 两个月前的兔子数**。
    `
  },
  {
    id: 2,
    type: 'theory',
    title: '2. 递归实现的隐患',
    content: `
### 代码直译
如果我们直接把公式写成代码：
\`\`\`cpp
int fib(int n) {
    if (n <= 2) return 1;
    return fib(n-1) + fib(n-2);
}
\`\`\`

### 爆炸的调用树
计算 \`fib(5)\` 需要计算 \`fib(4)\` 和 \`fib(3)\`。
而计算 \`fib(4)\` **又**需要计算 \`fib(3)\` 和 \`fib(2)\`。
**注意：\`fib(3)\` 被重复计算了！** 随着 n 增大，这种重复会呈指数级爆炸。
    `
  },
  {
    id: 3,
    type: 'experiment',
    title: '3. 实验：观察递归树',
    content: `
**实验目标**：直观感受重复计算的严重性。

**操作步骤**：
1. 点击控制台的 **Calculate Fib(5)**。
2. 盯着屏幕上的节点。
3. 观察有多少次黄色的光点跑到了标有 **f(3)** 或 **f(2)** 的节点上？

> 思考：如果算 f(50)，这棵树会有多大？
    `,
    experimentConfig: { hint: "注意看右侧子树，是不是把左侧做过的事情又做了一遍？" }
  },
  {
    id: 4,
    type: 'conclusion',
    title: '4. 实验结论',
    content: `
### 你看到了什么？
在计算 f(5) 的过程中，f(3) 被计算了 2 次，f(2) 被计算了 3 次，f(1) 被计算了 5 次。
这棵树的节点总数接近 **2^n**。

### 复杂度分析
- **时间复杂度**：O(2^n)。这是极慢的指数级算法。
- **优化方案**：**记忆化搜索 (Memoization)**。算过一次 f(3) 后，把结果记在本子上，下次直接查，不再算。
    `
  },
  {
    id: 5,
    type: 'code',
    title: '5. 实战填空：递归基',
    content: `让我们开始写代码。递归函数的第一步永远是**处理边界条件（递归基）**，否则会无限循环。`,
    codeProblem: {
      template: `int fib(int n) {
    // 1. 递归基（出口）
    if ({{0}}) {
        return 1;
    }
    // 2. 递归步骤
    return fib(n-1) + fib(n-2);
}`,
      blanks: [
        { id: 0, question: "斐波那契数列的前两项是多少？", options: [{ label: "n <= 2", value: "n <= 2", isCorrect: true }, { label: "n == 0", value: "n == 0", isCorrect: false }] }
      ]
    }
  },
  {
    id: 6,
    type: 'code',
    title: '6. 实战填空：记忆化数组',
    content: `为了避免重复计算，我们需要一个数组 \`memo\` 来记录已经算过的结果。初始化时，通常设为一个特殊值表示“未计算”。`,
    codeProblem: {
      template: `int memo[100]; // 记忆本

void init() {
    // 初始化 memo 数组
    // 将所有位置设为 -1，表示“我还没算过”
    for(int i=0; i<100; i++) {
        memo[i] = {{0}};
    }
}`,
      blanks: [
        { id: 0, question: "用什么值表示未计算？", options: [{ label: "-1", value: "-1", isCorrect: true }, { label: "0", value: "0", isCorrect: false }] }
      ]
    }
  },
  {
    id: 7,
    type: 'code',
    title: '7. 实战填空：记忆化搜索逻辑',
    content: `将记忆化逻辑加入递归函数。这是从 O(2^n) 优化到 O(n) 的关键一步！`,
    codeProblem: {
      template: `int fib(int n) {
    if (n <= 2) return 1;
    
    // 1. 查备忘录：如果算过，直接返回
    if (memo[n] != -1) {
        return {{0}};
    }
    
    // 2. 没算过：计算并记下来
    int ans = fib(n-1) + fib(n-2);
    {{1}} = ans;
    
    return ans;
}`,
      blanks: [
        { id: 0, question: "查到了什么？", options: [{ label: "memo[n]", value: "memo[n]", isCorrect: true }, { label: "n", value: "n", isCorrect: false }] },
        { id: 1, question: "把结果存在哪里？", options: [{ label: "memo[n]", value: "memo[n]", isCorrect: true }, { label: "return", value: "return", isCorrect: false }] }
      ]
    }
  },
  {
    id: 8,
    type: 'quiz',
    title: '8. 学习成果检验',
    content: '关于复杂度的理解。',
    quizData: {
      id: 1,
      question: "使用记忆化搜索优化后，计算 fib(n) 的时间复杂度是多少？",
      options: ["O(2^n)", "O(n^2)", "O(n)", "O(log n)"],
      correctAnswer: 2,
      explanation: "因为每个 fib(i) 只会被计算一次（第一次遇到时），共有 n 个不同的输入，所以是 O(n)。"
    }
  },
  {
    id: 9,
    type: 'quiz',
    title: '9. 空间复杂度分析',
    content: '除了时间，我们还要关心空间。',
    quizData: {
      id: 2,
      question: "计算 fib(n) 时，递归调用栈的最大深度是多少？",
      options: ["n", "2^n", "1", "log n"],
      correctAnswer: 0,
      explanation: "最深的调用链是 fib(n) -> fib(n-1) -> ... -> fib(1)，深度为 n。所以空间复杂度是 O(n)。"
    }
  },
  {
    id: 10,
    type: 'quiz',
    title: '10. 逻辑追踪',
    content: '考察对执行顺序的理解。',
    quizData: {
      id: 3,
      question: "在计算 fib(5) 的过程中，fib(4) 和 fib(3) 谁先被计算完成并返回？",
      options: ["fib(4)", "fib(3)", "同时", "随机"],
      correctAnswer: 1,
      explanation: "根据代码 `return fib(n-1) + fib(n-2)`，程序会先深入左分支 `fib(n-1)`。计算 fib(5) 需先算 fib(4)，计算 fib(4) 需先算 fib(3)。最底层的 fib(3) 会最先返回。"
    }
  },
  {
    id: 11,
    type: 'full_code',
    title: '11. 代码实现 (记忆化搜索)',
    content: `
### 问题描述
求斐波那契数列的第 n 项。要求时间复杂度为 O(n)。

### 样例
**Input**: 5
**Output**: 5 (1, 1, 2, 3, 5)
    `,
    codeSnippet: `int memo[100]; // 备忘录，初始化为 -1

int fib(int n) {
    if (n <= 2) return 1;
    
    // 查表：如果之前算过，直接返回结果
    if (memo[n] != -1) return memo[n];
    
    // 计算并记录到备忘录中
    memo[n] = fib(n - 1) + fib(n - 2);
    return memo[n];
}`
  }
];

export const RECURSION_HANOI_LECTURE: LectureStep[] = [
  {
    id: 1,
    type: 'theory',
    title: '1. 汉诺塔：婆罗门的诅咒',
    content: `
### 游戏规则
有三根柱子 A、B、C。A 柱上有 N 个盘子，从小到大叠放。
你需要把所有盘子从 A 移到 C，规则如下：
1. 每次只能移动一个盘子。
2. **大盘子永远不能压在小盘子上面**。

传说当 64 个盘子全部移完时，世界就会毁灭。
    `
  },
  {
    id: 2,
    type: 'theory',
    title: '2. 宏观思维：外包策略',
    content: `
### 不要陷入细节
面对 N 个盘子，我们不要去想“第1步移谁，第2步移谁”，那样脑子会炸。
我们要**宏观地**看问题：

要把 N 个盘子从 A 移到 C，只需要三步：
1. **外包**：先把上面 N-1 个盘子，视为一个整体，从 A 移到 B（借助 C）。
2. **搬运**：把剩下的那个最大的盘子（第 N 个），从 A 直接移到 C。
3. **收尾**：把 B 上的那 N-1 个盘子，从 B 移到 C（借助 A）。

至于那 N-1 个盘子怎么移？那是递归函数下一层该操心的事，我不管！
    `
  },
  {
    id: 3,
    type: 'experiment',
    title: '3. 实验：验证宏观策略',
    content: `
**实验目标**：观察“整体移动”的过程。

**操作步骤**：
1. 点击 **Solve Hanoi(3)**。
2. 重点观察：最大的盘子（蓝色/黄色最底下的那个）是在什么时候移动的？
3. 是不是在它移动之前，上面的所有小盘子都已经跑到了 B 柱（中间柱）上？

> 这验证了我们的策略：先清空上方，再移动底层，最后把上方移回来。
    `
  },
  {
    id: 4,
    type: 'conclusion',
    title: '4. 实验结论',
    content: `
### 递归的魔力
你是否发现，解决 3 个盘子的问题，中间包含了解决 2 个盘子的问题？
解决 2 个盘子，又包含了 1 个盘子。

### 移动次数
- 1 个盘子：1 次
- 2 个盘子：3 次
- 3 个盘子：7 次
- N 个盘子：**2^n - 1** 次。
如果是 64 个盘子，需要移动 18446744073709551615 次，即便一秒移一次，也要 5800 亿年。
    `
  },
  {
    id: 5,
    type: 'code',
    title: '5. 实战填空：函数定义',
    content: `我们需要定义一个函数，表示“把 n 个盘子从 from 柱 移到 to 柱，aux 柱作为辅助”。`,
    codeProblem: {
      template: `void hanoi(int n, char from, char aux, char to) {
    // 1. 递归基：只有一个盘子，直接移
    if (n == 1) {
        cout << "Move disk 1 from " << from << " to " << to << endl;
        return;
    }
    // ... 后续代码
}`,
      blanks: [
        { id: 0, question: "如果 n == 1，还需要辅助柱吗？", options: [{ label: "不需要，直接从 from 到 to", value: "不需要", isCorrect: true }, { label: "需要", value: "需要", isCorrect: false }] }
      ]
    }
  },
  {
    id: 6,
    type: 'code',
    title: '6. 实战填空：第一阶段 (外包)',
    content: `先把 n-1 个盘子移开，腾出底层的第 n 个盘子。`,
    codeProblem: {
      template: `    // 把 n-1 个盘子从 'from' 移到 'aux'，借助 'to'
    hanoi(n - 1, from, {{0}}, {{1}});
    
    // 移动第 n 个盘子
    cout << "Move disk " << n << " from " << from << " to " << to << endl;`,
      blanks: [
        { id: 0, question: "辅助柱是谁？", options: [{ label: "to", value: "to", isCorrect: true }, { label: "aux", value: "aux", isCorrect: false }] },
        { id: 1, question: "目标柱是谁？", options: [{ label: "aux", value: "aux", isCorrect: true }, { label: "to", value: "to", isCorrect: false }] }
      ]
    }
  },
  {
    id: 7,
    type: 'code',
    title: '7. 实战填空：第三阶段 (收尾)',
    content: `最后，把暂存在 aux 上的 n-1 个盘子移到目标柱 to 上。`,
    codeProblem: {
      template: `    // 把 n-1 个盘子从 'aux' 移到 'to'，借助 'from'
    hanoi(n - 1, {{0}}, from, {{1}});
}`,
      blanks: [
        { id: 0, question: "现在的起点是谁？", options: [{ label: "aux", value: "aux", isCorrect: true }, { label: "from", value: "from", isCorrect: false }] },
        { id: 1, question: "最终终点是谁？", options: [{ label: "to", value: "to", isCorrect: true }, { label: "aux", value: "aux", isCorrect: false }] }
      ]
    }
  },
  {
    id: 8,
    type: 'quiz',
    title: '8. 理解测验',
    content: '关于移动规则的考察。',
    quizData: {
      id: 1,
      question: "在 hanoi(3, A, B, C) 的执行过程中，最大的盘子（第3号）被移动了几次？",
      options: ["1次", "2次", "3次", "无数次"],
      correctAnswer: 0,
      explanation: "无论 N 是多少，最大的第 N 号盘子只在中间步骤被从起点直接移到终点 1 次。其他的移动都是在倒腾那 N-1 个小盘子。"
    }
  },
  {
    id: 9,
    type: 'quiz',
    title: '9. 辅助柱的角色',
    content: '考察对参数变化的理解。',
    quizData: {
      id: 2,
      question: "当我们调用 hanoi(n-1, from, to, aux) 时（第一阶段），原本的'目标柱 to'变成了什么角色？",
      options: ["辅助柱 (Auxiliary)", "起点 (Source)", "终点 (Target)", "没用"],
      correctAnswer: 0,
      explanation: "我们要把盘子移到 aux 去，所以原来的 aux 是终点，而原来的 to 只能作为中转站（辅助柱）。"
    }
  },
  {
    id: 10,
    type: 'quiz',
    title: '10. 栈深度',
    content: '考察空间复杂度。',
    quizData: {
      id: 3,
      question: "计算 Hanoi(n) 时，递归栈的最大深度是多少？",
      options: ["n", "2^n", "1", "n^2"],
      correctAnswer: 0,
      explanation: "虽然调用次数是指数级的，但递归的层数（栈的深度）只有 n 层。处理完一层就会退栈。"
    }
  },
  {
    id: 11,
    type: 'full_code',
    title: '11. 代码实现',
    content: `
### 问题描述
打印将 n 个盘子从 'A' 柱移动到 'C' 柱的所有步骤，'B' 柱为辅助。

### 样例
**Input**: 2
**Output**:
Move disk 1 from A to B
Move disk 2 from A to C
Move disk 1 from B to C
    `,
    codeSnippet: `// n: 盘子数, from: 起点, aux: 辅助, to: 终点
void hanoi(int n, char from, char aux, char to) {
    // 递归基：只有一个盘子，直接移动到终点
    if (n == 1) {
        printf("Move disk 1 from %c to %c\\n", from, to);
        return;
    }
    
    // 1. 将 n-1 个盘子从 from 移到 aux (借助 to)
    hanoi(n - 1, from, to, aux);
    
    // 2. 将第 n 个盘子从 from 移到 to
    printf("Move disk %d from %c to %c\\n", n, from, to);
    
    // 3. 将 n-1 个盘子从 aux 移到 to (借助 from)
    hanoi(n - 1, aux, from, to);
}`
  }
];

export const RECURSION_FRACTAL_LECTURE: LectureStep[] = [
  {
    id: 1,
    type: 'theory',
    title: '1. 分形树：代码生成的自然',
    content: `
### 什么是分形 (Fractal)？
分形是指具有**自相似性**的几何结构。
你看一棵树：
- 树干分出两个树枝。
- 每个树枝又分出两个小树枝。
- 每个小树枝又分出两个细枝...

**局部和整体长得一模一样**，只是大小不同。这简直就是为递归量身定做的！
    `
  },
  {
    id: 2,
    type: 'theory',
    title: '2. 绘制算法',
    content: `
### 递归定义
定义函数 \`draw(x, y, length, angle)\`：
1. 从 (x, y) 出发，沿着 angle 方向画一条长为 length 的线。
2. 计算线段终点 (x2, y2)。
3. **递归调用**：在 (x2, y2) 处，向左偏 30 度，画一根长为 length * 0.7 的树枝。
4. **递归调用**：在 (x2, y2) 处，向右偏 30 度，画一根长为 length * 0.7 的树枝。

### 终止条件
当 length 小于某个阈值（比如 5像素）时，停止递归。
    `
  },
  {
    id: 3,
    type: 'experiment',
    title: '3. 实验：生长动画',
    content: `
**实验目标**：观察简单的规则如何生成复杂的图形。

**操作步骤**：
1. 点击 **Grow Fractal Tree**。
2. 观察树的生长顺序。
3. 注意：它是先画完一整根左侧的枝条（深入到底），还是层层推进？

> 提示：这其实是一个**深度优先搜索 (DFS)** 的过程。
    `
  },
  {
    id: 4,
    type: 'conclusion',
    title: '4. 实验结论',
    content: `
### 几何级数增长
- 第 1 层：1 根树干
- 第 2 层：2 根树枝
- 第 3 层：4 根树枝
- ...
- 第 N 层：2^(N-1) 根树枝

短短几行递归代码，生成了成百上千条线段。这就是递归在图形学和生成艺术中的威力。
    `
  },
  {
    id: 5,
    type: 'code',
    title: '5. 实战填空：终止条件',
    content: `防止无限递归画出原子级别的树枝。`,
    codeProblem: {
      template: `void drawBranch(double x, double y, double len, double angle) {
    // 递归出口
    if (len < {{0}}) return;
    
    // ... 画线逻辑
}`,
      blanks: [
        { id: 0, question: "设定最小长度阈值", options: [{ label: "2.0", value: "2.0", isCorrect: true }, { label: "-10", value: "-10", isCorrect: false }] }
      ]
    }
  },
  {
    id: 6,
    type: 'code',
    title: '6. 实战填空：计算终点',
    content: `高中三角函数知识：已知起点、长度、角度，求终点。`,
    codeProblem: {
      template: `    // 极坐标转换
    double x2 = x + len * cos(angle);
    double y2 = y - len * {{0}}; // 注意屏幕坐标系y向下为正，向上需减
    
    drawLine(x, y, x2, y2);`,
      blanks: [
        { id: 0, question: "计算 Y 轴增量", options: [{ label: "sin(angle)", value: "sin(angle)", isCorrect: true }, { label: "tan(angle)", value: "tan(angle)", isCorrect: false }] }
      ]
    }
  },
  {
    id: 7,
    type: 'code',
    title: '7. 实战填空：递归生成子树',
    content: `生成左右两个分叉。`,
    codeProblem: {
      template: `    // 左分叉：长度减小，角度增加
    drawBranch(x2, y2, len * 0.7, angle + 30);
    
    // 右分叉：长度减小，角度减少
    drawBranch(x2, y2, {{0}}, {{1}});
}`,
      blanks: [
        { id: 0, question: "右分叉长度", options: [{ label: "len * 0.7", value: "len * 0.7", isCorrect: true }, { label: "len", value: "len", isCorrect: false }] },
        { id: 1, question: "右分叉角度", options: [{ label: "angle - 30", value: "angle - 30", isCorrect: true }, { label: "angle + 30", value: "angle + 30", isCorrect: false }] }
      ]
    }
  },
  {
    id: 8,
    type: 'quiz',
    title: '8. 深度理解',
    content: '关于递归深度的影响。',
    quizData: {
      id: 1,
      question: "如果我们把长度衰减系数从 0.7 改成 0.5，画出来的树会发生什么变化？",
      options: ["树会变得更稀疏、更小", "树会变得更大", "树枝数量变多", "没有变化"],
      correctAnswer: 0,
      explanation: "长度衰减得更快，意味着更快达到终止阈值，递归深度变浅，树整体变小且细节减少。"
    }
  },
  {
    id: 9,
    type: 'quiz',
    title: '9. 分支因子',
    content: '考察对指数增长的理解。',
    quizData: {
      id: 2,
      question: "如果每个节点分叉出 3 根树枝而不是 2 根，第 5 层的树枝数量是多少？",
      options: ["3^4 = 81", "2^4 = 16", "3^5 = 243", "15"],
      correctAnswer: 0,
      explanation: "第 1 层 1 个，第 k 层有 3^(k-1) 个。第 5 层是 3^4 = 81。"
    }
  },
  {
    id: 10,
    type: 'quiz',
    title: '10. 几何特性',
    content: '自相似性的本质。',
    quizData: {
      id: 3,
      question: "分形树的每一根树枝，如果单独截取下来放大，看起来像什么？",
      options: ["像一棵完整的树", "像一条直线", "像一个圆", "毫无规律"],
      correctAnswer: 0,
      explanation: "这就是“自相似性”：局部包含整体的形状信息。"
    }
  },
  {
    id: 11,
    type: 'full_code',
    title: '11. 代码实现',
    content: `
### 问题描述
模拟二叉分形树的绘制逻辑。假设有函数 drawLine(x1,y1,x2,y2)。

### 参数
x, y: 起点坐标; len: 树枝长度; angle: 角度。
    `,
    codeSnippet: `void drawTree(double x, double y, double len, double angle) {
    // 递归基：树枝太短，停止生长
    if (len < 2) return;
    
    // 计算终点坐标 (极坐标转换)
    double x2 = x + len * cos(angle);
    double y2 = y - len * sin(angle);
    
    // 画当前树枝
    drawLine(x, y, x2, y2);
    
    // 递归画左分叉 (长度减小，角度偏转 +30度)
    drawTree(x2, y2, len * 0.7, angle + 30);
    
    // 递归画右分叉 (长度减小，角度偏转 -30度)
    drawTree(x2, y2, len * 0.7, angle - 30);
}`
  }
];

export const RECURSION_PERM_LECTURE: LectureStep[] = [
  {
    id: 1,
    type: 'theory',
    title: '1. 全排列：排排坐',
    content: `
### 问题描述
给定 N 个不重复的数字（例如 1, 2, 3），请列出它们所有的排列方式。
例如 N=3 时：
- [1, 2, 3], [1, 3, 2]
- [2, 1, 3], [2, 3, 1]
- [3, 1, 2], [3, 2, 1]

### 递归思维：填坑法
我们可以把这个问题想象成 **“填空”**。
有 N 个空位 \`[ _ _ _ ]\`，我们需要按顺序决定每个空位填哪个数字。
1. 第 1 个空位：可以填 1、2 或 3。
2. 第 2 个空位：从未被选用的数字里挑一个。
3. ...
4. 当所有空位都填满时，我们就找到了一个解！
    `
  },
  {
    id: 2,
    type: 'experiment',
    title: '2. 实验：填空过程',
    content: `
**实验目标**：理解“选择-递归-回溯”的过程。

**操作步骤**：
1. 点击 **Start Permutations (3)**。
2. 观察下方的盒子 \`[ ] [ ] [ ]\` 和数字池。
3. **关键观察**：
   - 当程序填入 \`1\` 后，它会继续去填第二个格子。
   - 当填满 \`[1, 2, 3]\` 后，它会把 \`3\` 拿出来（回溯），然后再把 \`2\` 拿出来，尝试别的组合。
   - 注意看递归栈，它记录了当前我们在第几层（第几个格子）。
    `
  },
  {
    id: 3,
    type: 'conclusion',
    title: '3. 核心概念：回溯 (Backtracking)',
    content: `
### 为什么要“拿出来”？
这就是**回溯**的精髓。
当我们探索完 \`[1, 2, ...]\` 的所有可能性后，为了探索 \`[1, 3, ...]\`，我们必须把占用的 \`2\` 释放出来，**恢复现场**，就好像我们从来没选过它一样。

如果不恢复现场，\`used[2]\` 一直是 true，后面的递归就永远用不了 2 了。
    `
  },
  {
    id: 4,
    type: 'code',
    title: '4. 实战填空：状态标记',
    content: `我们需要一个数组 \`used\` 来记录哪些数字已经被选了。`,
    codeProblem: {
      template: `bool used[10]; // 记录数字是否被使用
int path[10];  // 记录当前排列

void dfs(int index, int n) {
    if (index == n) {
        print(path);
        return;
    }
    
    for (int i = 1; i <= n; i++) {
        // 如果数字 i 还没被用过
        if ({{0}}) {
            path[index] = i;
            used[i] = true; // 标记占用
            
            dfs(index + 1, n);
            
            // 回溯：恢复现场
            used[i] = {{1}}; 
        }
    }
}`,
      blanks: [
        { id: 0, question: "检查条件", options: [{ label: "!used[i]", value: "!used[i]", isCorrect: true }, { label: "used[i]", value: "used[i]", isCorrect: false }] },
        { id: 1, question: "回溯操作", options: [{ label: "false", value: "false", isCorrect: true }, { label: "true", value: "true", isCorrect: false }] }
      ]
    }
  },
  {
    id: 5,
    type: 'quiz',
    title: '5. 复杂度爆炸',
    content: '关于全排列的数量级。',
    quizData: {
      id: 1,
      question: "N 个数字的全排列一共有多少种？（时间复杂度）",
      options: ["N^2", "2^N", "N!", "N^N"],
      correctAnswer: 2,
      explanation: "第1位有N种选法，第2位有N-1种... 总数是 N*(N-1)*...*1 = N!。增长速度极快，N=13时计算机通常就跑不动了。"
    }
  },
  {
    id: 6,
    type: 'quiz',
    title: '6. 递归深度',
    content: '关于栈的消耗。',
    quizData: {
      id: 2,
      question: "生成 N 个数的全排列，递归栈的最大深度是多少？",
      options: ["N!", "N", "N^2", "1"],
      correctAnswer: 1,
      explanation: "虽然解的数量是 N!，但我们是一层层填空的，最多填 N 个空，所以栈深是 N。"
    }
  },
  {
    id: 7,
    type: 'full_code',
    title: '7. 代码实现',
    content: `
### 问题描述
生成数字 1 到 n 的所有全排列。

### 样例
**Input**: 3
**Output**: [1,2,3], [1,3,2], [2,1,3] ...
    `,
    codeSnippet: `void permute(vector<int>& nums, vector<int>& track, vector<bool>& used) {
    // 递归基：路径长度等于数组长度，说明找到一个排列
    if (track.size() == nums.size()) {
        print(track);
        return;
    }
    
    for (int i = 0; i < nums.size(); ++i) {
        if (used[i]) continue; // 剪枝：已使用的数字跳过
        
        // 做选择
        track.push_back(nums[i]);
        used[i] = true;
        
        // 进入下一层
        permute(nums, track, used);
        
        // 撤销选择 (回溯)：恢复到选择前的状态
        track.pop_back();
        used[i] = false;
    }
}`
  }
];

export const RECURSION_SUBSET_LECTURE: LectureStep[] = [
  {
    id: 1,
    type: 'theory',
    title: '1. 子集生成：选与不选',
    content: `
### 问题描述
给定一个集合，比如 \`{A, B, C}\`，请列出它所有的子集。
结果应包含：空集, {A}, {B}, {C}, {A,B}, {A,C}, {B,C}, {A,B,C}。

### 递归思维：二叉决策树
对于集合中的每一个元素，我们只有两个选择：
1. **选它**：把它加入当前子集。
2. **不选它**：直接跳过。

无论选不选，我们都处理下一个元素。当处理完所有元素时，就是一个子集。
    `
  },
  {
    id: 2,
    type: 'experiment',
    title: '2. 实验：二叉分叉',
    content: `
**实验目标**：观察“选/不选”的决策过程。

**操作步骤**：
1. 点击 **Generate Subsets (3)**。
2. 观察下方的元素列表 \`[1, 2, 3]\`。
3. **绿色勾**表示“选”，**红色叉**表示“不选”。
4. 每一层递归都在处理一个数字。注意看它是如何遍历完所有“选1”的情况，再回头去遍历“不选1”的情况的。
    `
  },
  {
    id: 3,
    type: 'code',
    title: '3. 实战填空：递归逻辑',
    content: `我们需要一个 index 指针来表示当前正在考虑第几个数字。`,
    codeProblem: {
      template: `int arr[] = {1, 2, 3};
vector<int> subset;

void dfs(int index) {
    // 递归基：所有数字都考虑完了
    if (index == 3) {
        print(subset);
        return;
    }
    
    // 决策 1：选当前数字 arr[index]
    subset.push_back(arr[index]);
    dfs(index + 1);
    {{0}}; // 回溯：把刚刚加进去的弹出来！
    
    // 决策 2：不选当前数字
    dfs(index + 1);
}`,
      blanks: [
        { id: 0, question: "恢复现场", options: [{ label: "subset.pop_back()", value: "subset.pop_back()", isCorrect: true }, { label: "subset.clear()", value: "subset.clear()", isCorrect: false }] }
      ]
    }
  },
  {
    id: 4,
    type: 'quiz',
    title: '4. 子集数量',
    content: '关于子集的数学知识。',
    quizData: {
      id: 1,
      question: "包含 N 个元素的集合，一共有多少个子集？",
      options: ["N^2", "N!", "2^N", "N"],
      correctAnswer: 2,
      explanation: "每个元素都有“选”或“不选”2种可能，N个元素就是 2*2*...*2 = 2^N。"
    }
  },
  {
    id: 5,
    type: 'quiz',
    title: '5. 另一种思路',
    content: '二进制枚举。',
    quizData: {
      id: 2,
      question: "除了递归，我们还可以用什么方法快速生成子集？",
      options: ["二进制位运算", "排序", "二分查找", "并查集"],
      correctAnswer: 0,
      explanation: "可以用 0 到 2^N-1 的整数代表子集，二进制第 i 位为 1 表示选中第 i 个元素。这种方法叫二进制枚举 (Bitmask)。"
    }
  },
  {
    id: 6,
    type: 'full_code',
    title: '6. 代码实现',
    content: `
### 问题描述
生成数组 nums 的所有子集。

### 样例
**Input**: [1,2,3]
**Output**: [], [1], [2], [3], [1,2], [1,3], [2,3], [1,2,3]
    `,
    codeSnippet: `void subsets(vector<int>& nums, int start, vector<int>& track) {
    // 每一个节点的状态都是一个合法的子集，直接输出/收集
    print(track);
    
    for (int i = start; i < nums.size(); i++) {
        // 做选择：加入 nums[i]
        track.push_back(nums[i]);
        
        // 递归：从 i+1 开始选择，避免重复和回头
        subsets(nums, i + 1, track);
        
        // 撤销选择 (回溯)
        track.pop_back();
    }
}`
  }
];


// ================= SEGMENT TREE =================
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


// ================= BFS MASTER CLASS =================

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

// ================= STRING MODULE =================

export const AC_AUTOMATON_LECTURE: LectureStep[] = [
  { id: 1, type: 'theory', title: 'AC自动机', content: 'AC自动机是多模式匹配算法。' }
];

export const KMP_LECTURE: LectureStep[] = [
  { id: 1, type: 'theory', title: 'KMP算法', content: 'KMP算法用于字符串匹配。' }
];

export const MANACHER_LECTURE: LectureStep[] = [
  { id: 1, type: 'theory', title: 'Manacher算法', content: 'Manacher算法用于查找最长回文子串。' }
];

export const BALANCED_TREE_LECTURE: LectureStep[] = [
    { id: 1, type: 'theory', title: '平衡树', content: '平衡树维持树的高度平衡以保证操作效率。' }
];

// ================= GRAPH ALGORITHMS =================

export const MST_LECTURE: LectureStep[] = [
    { id: 1, type: 'theory', title: '最小生成树', content: '最小生成树包含图中所有顶点，且边权和最小。' }
];

export const SHORTEST_PATH_LECTURE: LectureStep[] = [
    { id: 1, type: 'theory', title: '最短路径', content: '最短路径问题旨在寻找两点间路径权重最小的路径。' }
];

export const TARJAN_LECTURE: LectureStep[] = [
    { id: 1, type: 'theory', title: 'Tarjan算法', content: 'Tarjan算法用于求强连通分量。' }
];

export const DIFF_CONSTRAINTS_LECTURE: LectureStep[] = [
    { id: 1, type: 'theory', title: '差分约束', content: '差分约束系统可以转化为最短路问题。' }
];

// ================= MISC ALGORITHMS =================

export const SWEEP_LINE_LECTURE: LectureStep[] = [
    { id: 1, type: 'theory', title: '扫描线', content: '扫描线算法常用于几何问题。' }
];

// ================= TREE ALGORITHMS =================

export const TREE_DIAMETER_LECTURE: LectureStep[] = [
  {
    id: 1,
    type: 'theory',
    title: '1. 树的直径',
    content: `
### 定义
树中距离最远的两个节点之间的路径称为**树的直径**。
这条路径的长度就是直径的大小。

### 求解方法
1. **两次 BFS/DFS**：
   - 第一次：从任意点 u 出发，找到离它最远的点 x。
   - 第二次：从 x 出发，找到离 x 最远的点 y。
   - x 到 y 的路径就是直径。
2. **树形 DP**：
   - 对于每个节点，计算以它为根的子树中，向下延伸的最长链和次长链。
   - 直径经过该节点时，长度 = 最长链 + 次长链。
    `
  },
  {
    id: 2,
    type: 'experiment',
    title: '2. 实验：寻找最远节点',
    content: `
**实验步骤**：
1. 观察右侧的树。
2. 在控制台中点击 **1. 从 Node 1 开始 BFS**。观察找到了哪个最远点？(通常是直径的一个端点)
3. 假设找到了点 U，再点击 **2. 从 Node U 开始 BFS**。
4. 这次找到的最远点 V，到 U 的距离就是直径。
    `
  }
];

export const TREE_CENTROID_LECTURE: LectureStep[] = [
    { id: 1, type: 'theory', title: '树的重心', content: '删除该点后，最大连通块的节点数最小。' }
];

export const TREE_CENTER_LECTURE: LectureStep[] = [
    { id: 1, type: 'theory', title: '树的中心', content: '树中距离所有节点最大距离最小的节点。' }
];

export const TREE_DP_LECTURE: LectureStep[] = [
    { id: 1, type: 'theory', title: '树形DP', content: '在树结构上进行的动态规划。' }
];

export const TREE_KNAPSACK_LECTURE: LectureStep[] = [
    { id: 1, type: 'theory', title: '树上背包', content: '树形依赖背包问题。' }
];

// ================= BASIC DATA STRUCTURES =================

export const TRIE_LECTURE: LectureStep[] = [
    { id: 1, type: 'theory', title: '字典树', content: '用于处理字符串前缀匹配的数据结构。' }
];

export const HASH_LECTURE: LectureStep[] = [
    { id: 1, type: 'theory', title: '哈希表', content: '通过哈希函数映射键值对的数据结构。' }
];

export const UNION_FIND_LECTURE: LectureStep[] = [
    { id: 1, type: 'theory', title: '并查集', content: '用于处理不交集合并及查询的数据结构。' }
];
