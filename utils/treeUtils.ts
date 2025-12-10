import { TreeNode, LogStep } from '../types';

// Constants for layout
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 400;
const START_Y = 50;
const LEVEL_HEIGHT = 80;

/**
 * Calculates the positions of nodes for visualization.
 * We are using a fixed array size of 8 for the demo to keep visualization clean.
 */
export const generateTreeLayout = (arr: number[]): TreeNode[] => {
  const nodes: TreeNode[] = [];
  const n = arr.length;

  const build = (id: number, l: number, r: number, depth: number, x: number, rangeWidth: number) => {
    // Determine Y position based on depth
    const y = START_Y + depth * LEVEL_HEIGHT;

    // Create current node
    const node: TreeNode = {
      id,
      value: 0, // Placeholder, calculated later
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
    // Recursively build children
    // Adjust X spacing based on depth to prevent overlap
    const offset = rangeWidth / 4; 
    
    const leftVal = build(id * 2, l, mid, depth + 1, x - offset, rangeWidth / 2);
    const rightVal = build(id * 2 + 1, mid + 1, r, depth + 1, x + offset, rangeWidth / 2);
    
    node.value = leftVal + rightVal;
    return node.value;
  };

  build(1, 0, n - 1, 0, CANVAS_WIDTH / 2, CANVAS_WIDTH);
  
  // Sort by ID for easier array-like access simulation
  return nodes.sort((a, b) => a.id - b.id);
};

// Simulation helper to generate steps for animation
export const simulateQuery = (
  nodes: TreeNode[], 
  queryL: number, 
  queryR: number
): LogStep[] => {
  const steps: LogStep[] = [];

  const query = (nodeId: number, l: number, r: number, ql: number, qr: number) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return 0;

    steps.push({
      nodeId,
      message: `访问节点 [${l}, ${r}]`,
      highlight: 'visiting'
    });

    // Case 1: Range completely outside
    if (l > qr || r < ql) {
      return 0;
    }

    // Case 2: Range completely inside
    if (l >= ql && r <= qr) {
      steps.push({
        nodeId,
        message: `节点 [${l}, ${r}] 完全包含在查询区间 [${ql}, ${qr}] 内，返回 ${node.value}`,
        highlight: 'found'
      });
      return node.value;
    }

    // Case 3: Partial overlap
    steps.push({
      nodeId,
      message: `分裂：查询左子树和右子树`,
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

export const simulateUpdate = (
  nodes: TreeNode[],
  index: number,
  newValue: number
): { steps: LogStep[], newNodes: TreeNode[] } => {
  const steps: LogStep[] = [];
  // Deep copy nodes to avoid mutating state directly during simulation
  const nextNodes = JSON.parse(JSON.stringify(nodes));

  const update = (nodeId: number, l: number, r: number, idx: number, val: number) => {
    const nodeIndex = nextNodes.findIndex((n: TreeNode) => n.id === nodeId);
    if (nodeIndex === -1) return;

    steps.push({
      nodeId,
      message: `访问节点 [${l}, ${r}]`,
      highlight: 'visiting'
    });

    if (l === r) {
      nextNodes[nodeIndex].value = val;
      steps.push({
        nodeId,
        message: `叶子节点 [${l}, ${l}] 更新为 ${val}`,
        highlight: 'found'
      });
      return;
    }

    const mid = Math.floor((l + r) / 2);
    if (idx <= mid) {
      update(nodeId * 2, l, mid, idx, val);
    } else {
      update(nodeId * 2 + 1, mid + 1, r, idx, val);
    }

    // Push up
    const leftChild = nextNodes.find((n: TreeNode) => n.id === nodeId * 2);
    const rightChild = nextNodes.find((n: TreeNode) => n.id === nodeId * 2 + 1);
    
    if (leftChild && rightChild) {
      nextNodes[nodeIndex].value = leftChild.value + rightChild.value;
      steps.push({
        nodeId,
        message: `Push Up: 更新本节点值为 ${nextNodes[nodeIndex].value} (左:${leftChild.value} + 右:${rightChild.value})`,
        highlight: 'updating'
      });
    }
  };

  const root = nextNodes.find((n: TreeNode) => n.id === 1);
  if (root) {
    update(1, root.left, root.right, index, newValue);
  }

  return { steps, newNodes: nextNodes };
};
