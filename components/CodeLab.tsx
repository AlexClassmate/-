import React from 'react';
import { Copy } from 'lucide-react';
import { CourseLevel } from '../types';

interface Props {
  level: CourseLevel;
}

const BASIC_CODE = `
#include <iostream>
using namespace std;

const int MAXN = 100005;
int arr[MAXN];
int tree[MAXN * 4];

// 1. 建树 (Build)
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

// 2. 单点修改 (Point Update)
void update(int node, int start, int end, int idx, int val) {
    if (start == end) {
        tree[node] = val;
        arr[idx] = val;
    } else {
        int mid = (start + end) / 2;
        if (idx <= mid) update(node * 2, start, mid, idx, val);
        else update(node * 2 + 1, mid + 1, end, idx, val);
        tree[node] = tree[node * 2] + tree[node * 2 + 1];
    }
}

// 3. 区间查询 (Query)
int query(int node, int start, int end, int L, int R) {
    if (R < start || L > end) return 0;
    if (L <= start && end <= R) return tree[node];
    
    int mid = (start + end) / 2;
    return query(node * 2, start, mid, L, R) + 
           query(node * 2 + 1, mid + 1, end, L, R);
}
`;

const ADVANCED_CODE = `
#include <iostream>
using namespace std;

const int MAXN = 100005;
int arr[MAXN];
int tree[MAXN * 4];
int lazy[MAXN * 4];

// 下放标记 (Push Down)
void pushDown(int node, int start, int end) {
    if (lazy[node] != 0) {
        int mid = (start + end) / 2;
        int left = node * 2, right = node * 2 + 1;

        tree[left] += lazy[node] * (mid - start + 1);
        lazy[left] += lazy[node];

        tree[right] += lazy[node] * (end - mid);
        lazy[right] += lazy[node];

        lazy[node] = 0;
    }
}

// 区间修改 (Range Update)
void updateRange(int node, int start, int end, int L, int R, int val) {
    if (L <= start && end <= R) {
        tree[node] += val * (end - start + 1);
        lazy[node] += val;
        return;
    }

    pushDown(node, start, end); // 重要：下放标记

    int mid = (start + end) / 2;
    if (L <= mid) updateRange(node * 2, start, mid, L, R, val);
    if (R > mid) updateRange(node * 2 + 1, mid + 1, end, L, R, val);

    tree[node] = tree[node * 2] + tree[node * 2 + 1];
}

int query(int node, int start, int end, int L, int R) {
    if (R < start || L > end) return 0;
    if (L <= start && end <= R) return tree[node];

    pushDown(node, start, end); // 重要：下放标记

    int mid = (start + end) / 2;
    return query(node * 2, start, mid, L, R) + 
           query(node * 2 + 1, mid + 1, end, L, R);
}
`;

const CodeLab: React.FC<Props> = ({ level }) => {
  const code = level === 'basic' ? BASIC_CODE : ADVANCED_CODE;
  const filename = level === 'basic' ? 'segment_tree_basic.cpp' : 'segment_tree_lazy.cpp';

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
           <button className="text-gray-400 hover:text-white transition">
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
                      .replace(/\b(int|void|using|namespace|return|if|else|const|for|while)\b/g, '<span class="text-purple-400 font-bold">$1</span>')
                      .replace(/#include\s+&lt;[^&]+&gt;/g, '<span class="text-blue-400">$&</span>')
                      .replace(/\b(tree|arr|lazy|build|update|updateRange|pushDown|query|main)\b/g, '<span class="text-yellow-200">$1</span>')
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
