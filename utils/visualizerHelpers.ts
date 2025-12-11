

import { TreeNode, LogStep, HashItem, GraphNode, GraphEdge, GridCell } from '../types';

// --- TRIE UTILS ---
export const generateTrieLayout = (words: string[]): TreeNode[] => {
  const nodes: TreeNode[] = [];
  // Root
  nodes.push({ id: 0, value: 'ROOT', x: 400, y: 50, depth: 0, children: [], isEnd: false, count: 0 });
  
  let nextId = 1;
  
  words.forEach(word => {
    let currId = 0;
    nodes[0].count = (nodes[0].count || 0) + 1;
    
    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      const currNode = nodes.find(n => n.id === currId)!;
      
      let childId = currNode.children?.find(cid => nodes.find(n => n.id === cid)?.value === char);
      
      if (!childId) {
        childId = nextId++;
        nodes.push({ 
          id: childId, 
          value: char, 
          x: 0, y: 0, 
          depth: currNode.depth + 1, 
          children: [], 
          isEnd: false,
          count: 0
        });
        currNode.children?.push(childId);
      }
      
      currId = childId;
      const childNode = nodes.find(n => n.id === currId)!;
      childNode.count = (childNode.count || 0) + 1;
    }
    nodes.find(n => n.id === currId)!.isEnd = true;
  });

  // Basic Layout Logic (Reused for AC Automaton base)
  const getWidth = (id: number): number => {
      const node = nodes.find(n => n.id === id)!;
      if (!node.children || node.children.length === 0) return 60; 
      let w = 0;
      node.children.forEach(c => w += getWidth(c));
      return w;
  };
  
  const setX = (id: number, startX: number) => {
      const node = nodes.find(n => n.id === id)!;
      const myWidth = getWidth(id);
      node.x = startX + myWidth / 2;
      node.y = 50 + node.depth * 70; // Depth spacing
      
      let currX = startX;
      node.children?.forEach(c => {
          setX(c, currX);
          currX += getWidth(c);
      });
  };
  
  setX(0, 50); // Start from left 50
  
  return nodes;
};

// --- AC AUTOMATON UTILS ---
// Extends Trie Layout by calculating Fail Pointers
export const generateACLayout = (words: string[]): TreeNode[] => {
  // 1. Build Trie
  const nodes = generateTrieLayout(words);
  
  // 2. Build Fail Pointers (BFS)
  const queue: number[] = [];
  
  // Root's children fail to Root
  const root = nodes.find(n => n.id === 0)!;
  root.failId = 0; // Root fails to itself (or null conceptually)
  
  root.children?.forEach(cid => {
    const child = nodes.find(n => n.id === cid)!;
    child.failId = 0; // Depth 1 fails to root
    queue.push(cid);
  });

  // BFS
  let head = 0;
  while(head < queue.length) {
    const uId = queue[head++];
    const u = nodes.find(n => n.id === uId)!;
    
    u.children?.forEach(vId => {
       const v = nodes.find(n => n.id === vId)!; // v is child of u
       const char = v.value;
       
       let failCandidate = u.failId!;
       // Jump up the fail chain until we find a node that has a child 'char'
       // Or we hit root
       while (failCandidate !== 0 && !nodes.find(n => n.id === failCandidate)?.children?.some(cid => nodes.find(chk => chk.id === cid)?.value === char)) {
          failCandidate = nodes.find(n => n.id === failCandidate)!.failId!;
       }
       
       // Check if failCandidate has child 'char'
       const target = nodes.find(n => n.id === failCandidate)?.children?.find(cid => nodes.find(chk => chk.id === cid)?.value === char);
       
       if (target !== undefined) {
         v.failId = target;
       } else {
         v.failId = 0;
       }
       
       queue.push(vId);
    });
  }

  return nodes;
};

// --- HASH UTILS ---
export const generateHashState = (values: number[], size: number): HashItem[][] => {
    const table: HashItem[][] = Array.from({ length: size }, () => []);
    values.forEach(val => {
        const idx = val % size;
        table[idx].push({ id: val, val: val });
    });
    return table;
};

// --- UNION FIND UTILS ---
export const generateUFNodes = (parent: number[]): TreeNode[] => {
    // Convert parent array to tree nodes for visualization
    const nodes: TreeNode[] = parent.map((p, i) => ({
        id: i,
        value: i,
        parentId: p,
        x: 0, y: 0,
        depth: 0,
        children: []
    }));

    // Build children relationships
    nodes.forEach((node, i) => {
        if (node.parentId !== i) {
            const pNode = nodes[node.parentId!];
            if (pNode) {
                if (!pNode.children) pNode.children = [];
                pNode.children.push(i);
            }
        }
    });

    // Determine roots
    const roots = nodes.filter(n => n.parentId === n.id);
    
    // Layout
    const canvasWidth = 800;
    const sectionWidth = canvasWidth / roots.length;
    
    roots.forEach((root, idx) => {
        const cx = sectionWidth * idx + sectionWidth / 2;
        const layoutNode = (n: TreeNode, x: number, y: number, width: number) => {
            n.x = x;
            n.y = y;
            const children = n.children || [];
            if (children.length > 0) {
                const step = width / children.length;
                children.forEach((cid, cIdx) => {
                    const child = nodes[cid];
                    layoutNode(child, x - width/2 + step/2 + cIdx*step, y + 60, step);
                });
            }
        };
        layoutNode(root, cx, 80, sectionWidth);
    });

    return nodes;
};

// --- KMP UTILS ---
export const calculateKMPNext = (pattern: string): number[] => {
    const next: number[] = new Array(pattern.length).fill(0);
    for (let i = 1, j = 0; i < pattern.length; i++) {
        while (j > 0 && pattern[i] !== pattern[j]) {
            j = next[j - 1];
        }
        if (pattern[i] === pattern[j]) {
            j++;
        }
        next[i] = j;
    }
    return next;
};

// --- MANACHER UTILS ---
export const transformManacherString = (s: string): string => {
    if (!s) return "";
    return "^#" + s.split("").join("#") + "#$";
};

// --- TREAP UTILS ---
interface TreapNodeRaw {
    key: number;
    priority: number;
    left: TreapNodeRaw | null;
    right: TreapNodeRaw | null;
}

export const insertTreapNode = (root: TreapNodeRaw | null, key: number, priority: number): TreapNodeRaw => {
    if (!root) {
        return { key, priority, left: null, right: null };
    }
    if (key < root.key) {
        root.left = insertTreapNode(root.left, key, priority);
        // Heap property: max-heap
        if (root.left.priority > root.priority) {
            // Right Rotate
            const temp = root.left;
            root.left = temp.right;
            temp.right = root;
            return temp;
        }
    } else {
        root.right = insertTreapNode(root.right, key, priority);
        if (root.right.priority > root.priority) {
            // Left Rotate
            const temp = root.right;
            root.right = temp.left;
            temp.left = root;
            return temp;
        }
    }
    return root;
};

export const generateTreapLayout = (keys: {val: number, pri: number}[]): TreeNode[] => {
    if (keys.length === 0) return [];
    
    let root: TreapNodeRaw | null = null;
    keys.forEach(k => {
        root = insertTreapNode(root, k.val, k.pri);
    });

    const nodes: TreeNode[] = [];
    
    // In-order traversal to assign X
    let order = 0;
    const traverse = (node: TreapNodeRaw | null, depth: number) => {
        if (!node) return;
        traverse(node.left, depth + 1);
        
        nodes.push({
            id: node.key, // Use key as ID
            value: node.key,
            priority: node.priority,
            x: order * 60 + 50,
            y: depth * 70 + 50,
            depth: depth,
            left: node.left ? node.left.key : undefined,
            right: node.right ? node.right.key : undefined,
            children: [] 
        });
        order++;
        
        traverse(node.right, depth + 1);
    };

    traverse(root, 0);

    // Center the tree
    const totalWidth = order * 60;
    const offset = (800 - totalWidth) / 2;
    nodes.forEach(n => n.x += Math.max(0, offset));

    return nodes;
};

// --- TREE DEMO UTILS ---
export const generateDemoTree = (): { nodes: GraphNode[], edges: GraphEdge[] } => {
    const nodes: GraphNode[] = [
        { id: 1, x: 400, y: 50, label: '1' },
        { id: 2, x: 250, y: 150, label: '2' },
        { id: 3, x: 550, y: 150, label: '3' },
        { id: 4, x: 150, y: 250, label: '4' },
        { id: 5, x: 350, y: 250, label: '5' },
        { id: 6, x: 650, y: 250, label: '6' },
        { id: 7, x: 300, y: 350, label: '7' },
        { id: 8, x: 400, y: 350, label: '8' },
    ];
    const edges: GraphEdge[] = [
        { u: 1, v: 2, weight: 1 },
        { u: 1, v: 3, weight: 1 },
        { u: 2, v: 4, weight: 1 },
        { u: 2, v: 5, weight: 1 },
        { u: 3, v: 6, weight: 1 },
        { u: 5, v: 7, weight: 1 },
        { u: 5, v: 8, weight: 1 },
    ];
    return { nodes, edges };
};

// --- BFS UTILS ---

export const generateBFSGrid = (rows: number, cols: number): GridCell[][] => {
    const grid: GridCell[][] = [];
    for (let r = 0; r < rows; r++) {
        const rowArr: GridCell[] = [];
        for (let c = 0; c < cols; c++) {
            // Randomly assign some obstacles
            const isObs = Math.random() < 0.2;
            rowArr.push({
                row: r,
                col: c,
                type: isObs ? 'obstacle' : 'land',
                visited: false
            });
        }
        grid.push(rowArr);
    }
    // Ensure start (0,0) and typical end are clear
    grid[0][0].type = 'land';
    return grid;
};

export const generateDAG = (): { nodes: GraphNode[], edges: GraphEdge[] } => {
    // Directed Acyclic Graph for Topo Sort
    const nodes: GraphNode[] = [
        { id: 1, x: 100, y: 200, label: 'CS101', inDegree: 0 },
        { id: 2, x: 250, y: 100, label: 'CS201', inDegree: 0 },
        { id: 3, x: 250, y: 300, label: 'CS202', inDegree: 0 },
        { id: 4, x: 400, y: 200, label: 'CS301', inDegree: 0 },
        { id: 5, x: 550, y: 200, label: 'CS401', inDegree: 0 },
        { id: 6, x: 100, y: 350, label: 'MATH', inDegree: 0 },
    ];
    const edges: GraphEdge[] = [
        { u: 1, v: 2, weight: 0, directed: true }, // 101 -> 201
        { u: 1, v: 3, weight: 0, directed: true }, // 101 -> 202
        { u: 2, v: 4, weight: 0, directed: true }, // 201 -> 301
        { u: 3, v: 4, weight: 0, directed: true }, // 202 -> 301
        { u: 4, v: 5, weight: 0, directed: true }, // 301 -> 401
    ];
    
    // Calc Indegree
    edges.forEach(e => {
        const n = nodes.find(x => x.id === e.v);
        if(n) n.inDegree = (n.inDegree || 0) + 1;
    });

    return { nodes, edges };
};

export const generateBipartiteGraph = (isBipartite: boolean): { nodes: GraphNode[], edges: GraphEdge[] } => {
    const nodes: GraphNode[] = [
        { id: 1, x: 200, y: 100, label: '1', group: 0 },
        { id: 2, x: 200, y: 200, label: '2', group: 0 },
        { id: 3, x: 200, y: 300, label: '3', group: 0 },
        { id: 4, x: 600, y: 100, label: '4', group: 1 },
        { id: 5, x: 600, y: 200, label: '5', group: 1 },
        { id: 6, x: 600, y: 300, label: '6', group: 1 },
    ];
    
    const edges: GraphEdge[] = [
        { u: 1, v: 4, weight: 0 },
        { u: 1, v: 5, weight: 0 },
        { u: 2, v: 4, weight: 0 },
        { u: 2, v: 6, weight: 0 },
        { u: 3, v: 5, weight: 0 },
        { u: 3, v: 6, weight: 0 },
    ];

    if (!isBipartite) {
        // Add edge within group 0 to violate bipartite
        edges.push({ u: 1, v: 2, weight: 0 });
    }

    return { nodes, edges };
};

// --- DFS UTILS ---
export const generateNQueensBoard = (n: number): GridCell[][] => {
    const grid: GridCell[][] = [];
    for (let r = 0; r < n; r++) {
        const rowArr: GridCell[] = [];
        for (let c = 0; c < n; c++) {
            rowArr.push({
                row: r,
                col: c,
                type: 'land', // Default empty
                visited: false
            });
        }
        grid.push(rowArr);
    }
    return grid;
}

export const generateCycleGraph = (): { nodes: GraphNode[], edges: GraphEdge[] } => {
    const nodes: GraphNode[] = [
        { id: 1, x: 100, y: 200, label: '1' },
        { id: 2, x: 250, y: 100, label: '2' },
        { id: 3, x: 400, y: 200, label: '3' },
        { id: 4, x: 250, y: 300, label: '4' },
        { id: 5, x: 550, y: 200, label: '5' },
    ];
    // 1->2->3->4->2 (Cycle 2-3-4-2)
    const edges: GraphEdge[] = [
        { u: 1, v: 2, weight: 0, directed: true },
        { u: 2, v: 3, weight: 0, directed: true },
        { u: 3, v: 4, weight: 0, directed: true },
        { u: 4, v: 2, weight: 0, directed: true }, // Cycle back to 2
        { u: 3, v: 5, weight: 0, directed: true },
    ];
    return { nodes, edges };
}
