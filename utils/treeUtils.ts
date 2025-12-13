
import { TreeNode, LogStep } from '../types';

// Constants for layout
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 400;
const START_Y = 50;
const LEVEL_HEIGHT = 80;

type AggregationMode = 'SUM' | 'MAX' | 'MIN';

export const generateTreeLayout = (arr: number[], mode: AggregationMode = 'SUM'): TreeNode[] => {
  const nodes: TreeNode[] = [];
  const n = arr.length;

  const build = (id: number, l: number, r: number, depth: number, x: number, rangeWidth: number) => {
    const y = START_Y + depth * LEVEL_HEIGHT;

    const node: TreeNode = {
      id,
      value: 0,
      lazy: 0,
      left: l,
      right: r,
      x,
      y,
      depth
    };
    nodes.push(node);

    if (l === r) {
      node.value = arr[l];
      return node.value as number;
    }

    const mid = Math.floor((l + r) / 2);
    const offset = rangeWidth / 4; 
    
    const leftVal = build(id * 2, l, mid, depth + 1, x - offset, rangeWidth / 2);
    const rightVal = build(id * 2 + 1, mid + 1, r, depth + 1, x + offset, rangeWidth / 2);
    
    if (mode === 'SUM') {
      node.value = leftVal + rightVal;
    } else if (mode === 'MAX') {
      node.value = Math.max(leftVal, rightVal);
    } else {
      node.value = Math.min(leftVal, rightVal);
    }
    return node.value as number;
  };

  build(1, 0, n - 1, 0, CANVAS_WIDTH / 2, CANVAS_WIDTH);
  return nodes.sort((a, b) => a.id - b.id);
};

export const simulateBuild = (
  arr: number[],
  mode: AggregationMode = 'SUM'
): { steps: LogStep[], nodes: TreeNode[] } => {
  const steps: LogStep[] = [];
  // 1. Generate the FULL tree topology with calculated values first
  const fullTree = generateTreeLayout(arr, mode);
  
  // 2. Create the "Initial" tree state where all values are '?' (or initial)
  // We clone the topology but reset values
  const initialNodes: TreeNode[] = fullTree.map(n => ({
      ...n,
      value: '?', // Display placeholder initially
      lazy: 0
  }));

  const buildRecursive = (nodeId: number, l: number, r: number) => {
      // Find the "Final" node to get the correct value to set later
      const targetNode = fullTree.find(n => n.id === nodeId);
      if (!targetNode) return;

      steps.push({
          nodeId,
          message: `递归访问区间 [${l}, ${r}]`,
          highlight: 'visiting'
      });

      if (l === r) {
          steps.push({
              nodeId,
              message: `到达叶子节点 [${l}, ${l}]，赋值 ${targetNode.value}`,
              highlight: 'found',
              treeUpdates: [{ id: nodeId, value: targetNode.value }] // Reveal value
          });
          return;
      }

      const mid = Math.floor((l + r) / 2);
      
      // Left
      buildRecursive(nodeId * 2, l, mid);
      
      // Right
      buildRecursive(nodeId * 2 + 1, mid + 1, r);
      
      // Push Up
      steps.push({
          nodeId,
          message: `回溯 Push Up: 更新 [${l}, ${r}] = ${mode}(Left, Right) = ${targetNode.value}`,
          highlight: 'updating',
          treeUpdates: [{ id: nodeId, value: targetNode.value }] // Reveal value
      });
  };

  buildRecursive(1, 0, arr.length - 1);
  return { steps, nodes: initialNodes };
};

// Helper: Apply lazy to children (Simulation only, simplified for visualizer)
// Note: This logic primarily targets Sum aggregation for Advanced level.
const simulatePushDown = (nodeId: number, nodes: TreeNode[], steps: LogStep[]) => {
  const nodeIndex = nodes.findIndex(n => n.id === nodeId);
  if (nodeIndex === -1) return;
  const node = nodes[nodeIndex];

  // Safeguard accesses
  const lazyVal = node.lazy || 0;
  const left = node.left;
  const right = node.right;

  if (lazyVal !== 0 && left !== undefined && right !== undefined && left !== right) {
    const mid = Math.floor((left + right) / 2);
    const leftChildIdx = nodes.findIndex(n => n.id === nodeId * 2);
    const rightChildIdx = nodes.findIndex(n => n.id === nodeId * 2 + 1);

    if (leftChildIdx !== -1) {
      nodes[leftChildIdx].lazy = (nodes[leftChildIdx].lazy || 0) + lazyVal;
      // Note: For MAX, lazy add is just value += lazy, for SUM it's value += lazy * len
      // Here we assume SUM logic as Advanced level uses SUM. Expert uses Point update usually.
      const currentVal = nodes[leftChildIdx].value as number;
      nodes[leftChildIdx].value = currentVal + lazyVal * (mid - left + 1);
    }
    if (rightChildIdx !== -1) {
      nodes[rightChildIdx].lazy = (nodes[rightChildIdx].lazy || 0) + lazyVal;
      const currentVal = nodes[rightChildIdx].value as number;
      nodes[rightChildIdx].value = currentVal + lazyVal * (right - mid);
    }
    
    steps.push({
      nodeId,
      message: `Push Down: 懒标记 ${lazyVal} 下传给子节点`,
      highlight: 'pushdown'
    });

    node.lazy = 0; // Clear tag
  }
};

export const simulateQuery = (
  nodes: TreeNode[], 
  queryL: number, 
  queryR: number,
  useLazy: boolean = false,
  mode: AggregationMode = 'SUM'
): LogStep[] => {
  const steps: LogStep[] = [];
  
  const query = (nodeId: number, l: number, r: number, ql: number, qr: number): number => {
    const node = nodes.find(n => n.id === nodeId);
    
    // Check mode for default return value
    const identityVal = mode === 'SUM' ? 0 : (mode === 'MAX' ? -Infinity : 2147483647);
    
    if (!node) return identityVal;

    steps.push({
      nodeId,
      message: `访问节点 [${l}, ${r}]`,
      highlight: 'visiting'
    });

    if (l > qr || r < ql) {
        steps.push({
            nodeId,
            message: `区间 [${l}, ${r}] 与查询无交集，返回 ${mode === 'MIN' ? 'INF' : '0'}`,
            highlight: 'normal' // grey out or simple visit
        });
        return identityVal;
    }

    if (l >= ql && r <= qr) {
      steps.push({
        nodeId,
        message: `完全包含，返回 ${node.value}`,
        highlight: 'found'
      });
      // Safety check for value type
      return (typeof node.value === 'number') ? node.value : identityVal;
    }

    if (useLazy && node.lazy !== 0) {
       steps.push({
        nodeId,
        message: `Push Down 检查`,
        highlight: 'pushdown'
      });
      // In simulation we update the tree model to reflect pushdown so deeper queries are correct
      simulatePushDown(nodeId, nodes, []); 
    }

    steps.push({
      nodeId,
      message: `分裂查询左右子树`,
      highlight: 'partial'
    });

    const mid = Math.floor((l + r) / 2);
    const leftRes = query(nodeId * 2, l, mid, ql, qr);
    const rightRes = query(nodeId * 2 + 1, mid + 1, r, ql, qr);
    
    if (mode === 'SUM') return leftRes + rightRes;
    if (mode === 'MAX') return Math.max(leftRes, rightRes);
    return Math.min(leftRes, rightRes);
  };

  const root = nodes.find(n => n.id === 1);
  if (root && root.left !== undefined && root.right !== undefined) {
    query(1, root.left, root.right, queryL, queryR);
  }
  
  return steps;
};

export const simulatePointUpdate = (
  nodes: TreeNode[],
  index: number,
  newValue: number,
  mode: AggregationMode = 'SUM'
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
      const leftVal = leftChild.value as number;
      const rightVal = rightChild.value as number;

      if (mode === 'SUM') {
        nextNodes[nodeIndex].value = leftVal + rightVal;
      } else if (mode === 'MAX') {
        nextNodes[nodeIndex].value = Math.max(leftVal, rightVal);
      } else {
        nextNodes[nodeIndex].value = Math.min(leftVal, rightVal);
      }
      
      steps.push({
        nodeId,
        message: `Push Up: 更新本节点值为 ${nextNodes[nodeIndex].value}`,
        highlight: 'updating'
      });
    }
  };

  const root = nextNodes.find((n: TreeNode) => n.id === 1);
  if (root && root.left !== undefined && root.right !== undefined) {
    update(1, root.left, root.right, index, newValue);
  }

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

    if (l <= start && end <= r) {
      node.value = (node.value as number) + v * (end - start + 1);
      node.lazy = (node.lazy || 0) + v;
      steps.push({
        nodeId,
        message: `区间完全包含。打上懒标记 +${v}，更新当前值为 ${node.value}`,
        highlight: 'found'
      });
      return;
    }

    simulatePushDown(nodeId, nextNodes, steps);

    const mid = Math.floor((start + end) / 2);
    if (l <= mid) updateRange(nodeId * 2, start, mid, l, r, v);
    if (r > mid) updateRange(nodeId * 2 + 1, mid + 1, end, l, r, v);

    const leftChild = nextNodes.find((n: TreeNode) => n.id === nodeId * 2);
    const rightChild = nextNodes.find((n: TreeNode) => n.id === nodeId * 2 + 1);
    if (leftChild && rightChild) {
       node.value = (leftChild.value as number) + (rightChild.value as number);
       steps.push({
        nodeId,
        message: `Push Up: 更新本节点值为 ${node.value}`,
        highlight: 'updating'
      });
    }
  };

  const root = nextNodes.find((n: TreeNode) => n.id === 1);
  if (root && root.left !== undefined && root.right !== undefined) {
    updateRange(1, root.left, root.right, L, R, val);
  }

  return { steps, newNodes: nextNodes };
};
