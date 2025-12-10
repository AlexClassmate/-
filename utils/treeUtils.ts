import { TreeNode, LogStep } from '../types';

// Constants for layout
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 400;
const START_Y = 50;
const LEVEL_HEIGHT = 80;

export const generateTreeLayout = (arr: number[]): TreeNode[] => {
  const nodes: TreeNode[] = [];
  const n = arr.length;

  const build = (id: number, l: number, r: number, depth: number, x: number, rangeWidth: number) => {
    const y = START_Y + depth * LEVEL_HEIGHT;

    const node: TreeNode = {
      id,
      value: 0,
      lazy: 0, // Initialize lazy tag
      left: l,
      right: r,
      x,
      y,
      depth
    };
    nodes.push(node);

    if (l === r) {
      node.value = arr[l];
      return node.value;
    }

    const mid = Math.floor((l + r) / 2);
    const offset = rangeWidth / 4; 
    
    const leftVal = build(id * 2, l, mid, depth + 1, x - offset, rangeWidth / 2);
    const rightVal = build(id * 2 + 1, mid + 1, r, depth + 1, x + offset, rangeWidth / 2);
    
    node.value = leftVal + rightVal;
    return node.value;
  };

  build(1, 0, n - 1, 0, CANVAS_WIDTH / 2, CANVAS_WIDTH);
  return nodes.sort((a, b) => a.id - b.id);
};

// Helper: Apply lazy to children (Simulation only)
const simulatePushDown = (nodeId: number, nodes: TreeNode[], steps: LogStep[]) => {
  const nodeIndex = nodes.findIndex(n => n.id === nodeId);
  if (nodeIndex === -1) return;
  const node = nodes[nodeIndex];

  if (node.lazy !== 0 && node.left !== node.right) {
    const mid = Math.floor((node.left + node.right) / 2);
    const leftChildIdx = nodes.findIndex(n => n.id === nodeId * 2);
    const rightChildIdx = nodes.findIndex(n => n.id === nodeId * 2 + 1);

    if (leftChildIdx !== -1) {
      nodes[leftChildIdx].lazy += node.lazy;
      nodes[leftChildIdx].value += node.lazy * (mid - node.left + 1);
    }
    if (rightChildIdx !== -1) {
      nodes[rightChildIdx].lazy += node.lazy;
      nodes[rightChildIdx].value += node.lazy * (node.right - mid);
    }
    
    steps.push({
      nodeId,
      message: `Push Down: 懒标记 ${node.lazy} 下传给子节点`,
      highlight: 'pushdown'
    });

    node.lazy = 0; // Clear tag
  }
};

export const simulateQuery = (
  nodes: TreeNode[], 
  queryL: number, 
  queryR: number,
  useLazy: boolean = false
): LogStep[] => {
  const steps: LogStep[] = [];
  // Use a copy to simulate pushdowns without affecting the main visual state immediately 
  // (In a real app, query might modify state if it triggers pushdown, here we just show logs usually, 
  // but for visualization consistency we might need to be careful. For this demo, we won't mutate the *input* nodes permanently in query)
  
  // NOTE: To properly visualize query with lazy, we conceptually need to know values. 
  // Since we don't return newNodes from query, we just simulate traversal logic.
  
  const query = (nodeId: number, l: number, r: number, ql: number, qr: number) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return 0;

    steps.push({
      nodeId,
      message: `访问节点 [${l}, ${r}]`,
      highlight: 'visiting'
    });

    if (l > qr || r < ql) return 0;

    if (l >= ql && r <= qr) {
      steps.push({
        nodeId,
        message: `完全包含，返回 ${node.value}`,
        highlight: 'found'
      });
      return node.value;
    }

    // Lazy Pushdown Check
    if (useLazy && node.lazy !== 0) {
       steps.push({
        nodeId,
        message: `查询路径遇到懒标记 ${node.lazy}，虽然逻辑上需要下传，但查询函数通常在回溯时合并值。此处为展示逻辑。`,
        highlight: 'pushdown'
      });
    }

    steps.push({
      nodeId,
      message: `分裂查询左右子树`,
      highlight: 'partial'
    });

    const mid = Math.floor((l + r) / 2);
    const leftSum = query(nodeId * 2, l, mid, ql, qr);
    const rightSum = query(nodeId * 2 + 1, mid + 1, r, ql, qr);
    
    return leftSum + rightSum;
  };

  const root = nodes.find(n => n.id === 1);
  if (root) {
    query(1, root.left, root.right, queryL, queryR);
  }
  
  return steps;
};

export const simulatePointUpdate = (
  nodes: TreeNode[],
  index: number,
  newValue: number
): { steps: LogStep[], newNodes: TreeNode[] } => {
  const steps: LogStep[] = [];
  const nextNodes = JSON.parse(JSON.stringify(nodes));

  const update = (nodeId: number, l: number, r: number, idx: number, val: number) => {
    const nodeIndex = nextNodes.findIndex((n: TreeNode) => n.id === nodeId);
    if (nodeIndex === -1) return;

    steps.push({ nodeId, message: `访问节点 [${l}, ${r}]`, highlight: 'visiting' });

    if (l === r) {
      nextNodes[nodeIndex].value = val;
      steps.push({ nodeId, message: `叶子节点更新为 ${val}`, highlight: 'found' });
      return;
    }

    const mid = Math.floor((l + r) / 2);
    if (idx <= mid) update(nodeId * 2, l, mid, idx, val);
    else update(nodeId * 2 + 1, mid + 1, r, idx, val);

    const leftChild = nextNodes.find((n: TreeNode) => n.id === nodeId * 2);
    const rightChild = nextNodes.find((n: TreeNode) => n.id === nodeId * 2 + 1);
    
    if (leftChild && rightChild) {
      nextNodes[nodeIndex].value = leftChild.value + rightChild.value;
      steps.push({
        nodeId,
        message: `Push Up: 更新和为 ${nextNodes[nodeIndex].value}`,
        highlight: 'updating'
      });
    }
  };

  const root = nextNodes.find((n: TreeNode) => n.id === 1);
  if (root) update(1, root.left, root.right, index, newValue);

  return { steps, newNodes: nextNodes };
};

export const simulateRangeUpdate = (
  nodes: TreeNode[],
  L: number,
  R: number,
  val: number
): { steps: LogStep[], newNodes: TreeNode[] } => {
  const steps: LogStep[] = [];
  const nextNodes = JSON.parse(JSON.stringify(nodes));

  const updateRange = (nodeId: number, start: number, end: number, l: number, r: number, v: number) => {
    const nodeIndex = nextNodes.findIndex((n: TreeNode) => n.id === nodeId);
    if (nodeIndex === -1) return;
    const node = nextNodes[nodeIndex];

    steps.push({ nodeId, message: `访问节点 [${start}, ${end}]`, highlight: 'visiting' });

    // Case 1: Fully within range
    if (l <= start && end <= r) {
      node.value += v * (end - start + 1);
      node.lazy += v;
      steps.push({
        nodeId,
        message: `区间完全包含。打上懒标记 +${v}，更新当前值为 ${node.value}`,
        highlight: 'found'
      });
      return;
    }

    // Case 2: Partial overlap, Push Down first
    simulatePushDown(nodeId, nextNodes, steps);

    const mid = Math.floor((start + end) / 2);
    if (l <= mid) updateRange(nodeId * 2, start, mid, l, r, v);
    if (r > mid) updateRange(nodeId * 2 + 1, mid + 1, end, l, r, v);

    // Push Up
    const leftChild = nextNodes.find((n: TreeNode) => n.id === nodeId * 2);
    const rightChild = nextNodes.find((n: TreeNode) => n.id === nodeId * 2 + 1);
    if (leftChild && rightChild) {
       node.value = leftChild.value + rightChild.value;
       steps.push({
        nodeId,
        message: `Push Up: 更新本节点值为 ${node.value}`,
        highlight: 'updating'
      });
    }
  };

  const root = nextNodes.find((n: TreeNode) => n.id === 1);
  if (root) updateRange(1, root.left, root.right, L, R, val);

  return { steps, newNodes: nextNodes };
};
