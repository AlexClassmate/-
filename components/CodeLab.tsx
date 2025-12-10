import React from 'react';
import { Copy } from 'lucide-react';

const CPP_CODE = `
#include <iostream>
#include <vector>

using namespace std;

const int MAXN = 100005;
int arr[MAXN];
int tree[MAXN * 4];
int lazy[MAXN * 4]; // 懒惰标记数组

// 辅助函数: 下放标记 (Push Down)
// 将当前节点的懒惰标记下传给左右子节点
void pushDown(int node, int start, int end) {
    if (lazy[node] != 0) {
        int mid = (start + end) / 2;
        int left_node = 2 * node;
        int right_node = 2 * node + 1;

        // 下发给左子节点
        // 注意：区间和需要加上 (区间长度 * 增加值)
        tree[left_node] += lazy[node] * (mid - start + 1);
        lazy[left_node] += lazy[node];

        // 下发给右子节点
        tree[right_node] += lazy[node] * (end - mid);
        lazy[right_node] += lazy[node];

        // 清除当前节点的标记
        lazy[node] = 0;
    }
}

// 1. 建树 (Build)
void build(int node, int start, int end) {
    lazy[node] = 0; // 初始化懒惰标记
    if (start == end) {
        tree[node] = arr[start];
    } else {
        int mid = (start + end) / 2;
        int left_node = 2 * node;
        int right_node = 2 * node + 1;
        
        build(left_node, start, mid);
        build(right_node, mid + 1, end);
        
        tree[node] = tree[left_node] + tree[right_node];
    }
}

// 2. 区间修改 (Range Update)
// [L, R]: 修改范围, val: 增加的值
void updateRange(int node, int start, int end, int L, int R, int val) {
    // Case 1: 当前区间完全在修改范围内
    if (L <= start && end <= R) {
        tree[node] += val * (end - start + 1);
        lazy[node] += val;
        return;
    }

    // Case 2: 需要访问子区间，先下放标记
    pushDown(node, start, end);

    int mid = (start + end) / 2;
    int left_node = 2 * node;
    int right_node = 2 * node + 1;

    if (L <= mid) updateRange(left_node, start, mid, L, R, val);
    if (R > mid) updateRange(right_node, mid + 1, end, L, R, val);

    // Push Up
    tree[node] = tree[left_node] + tree[right_node];
}

// 3. 区间查询 (Query)
int query(int node, int start, int end, int L, int R) {
    if (R < start || L > end) return 0;
    
    if (L <= start && end <= R) return tree[node];

    pushDown(node, start, end); // 重要：查询前也要下放标记

    int mid = (start + end) / 2;
    int left_node = 2 * node;
    int right_node = 2 * node + 1;
    
    return query(left_node, start, mid, L, R) + 
           query(right_node, mid + 1, end, L, R);
}

int main() {
    int n = 6;
    int input[] = {1, 3, 5, 7, 9, 11};
    for(int i=0; i<n; i++) arr[i] = input[i];
    
    build(1, 0, n-1);
    
    cout << "Init Sum [0, 5]: " << query(1, 0, n-1, 0, 5) << endl; 
    
    // 区间修改: [1, 3] 每个元素 + 2
    // 原数组: 1, 3, 5, 7, 9, 11
    // 修改后: 1, 5, 7, 9, 9, 11
    cout << "Update Range [1, 3] by adding 2..." << endl;
    updateRange(1, 0, n-1, 1, 3, 2); 
    
    cout << "New Sum [0, 5]: " << query(1, 0, n-1, 0, 5) << endl;
    
    return 0;
}
`;

const CodeLab: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto h-full flex flex-col animate-fade-in">
      <div className="bg-dark-lighter rounded-xl border border-gray-700 shadow-xl overflow-hidden flex flex-col h-full">
        <div className="bg-gray-800 px-6 py-3 border-b border-gray-700 flex justify-between items-center">
           <div className="flex gap-2">
             <div className="w-3 h-3 rounded-full bg-red-500"></div>
             <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
             <div className="w-3 h-3 rounded-full bg-green-500"></div>
           </div>
           <span className="text-gray-400 text-sm font-mono">segment_tree_lazy.cpp</span>
           <button className="text-gray-400 hover:text-white transition">
             <Copy className="w-4 h-4" />
           </button>
        </div>
        
        <div className="flex-1 overflow-auto bg-[#0d1117] p-6">
          <pre className="font-mono text-sm text-gray-300 leading-relaxed">
            <code>
              {CPP_CODE.split('\n').map((line, i) => (
                <div key={i} className="table-row">
                  <span className="table-cell text-gray-600 select-none text-right pr-4 border-r border-gray-800 w-8">{i + 1}</span>
                  <span className="table-cell pl-4 whitespace-pre-wrap">
                     <span dangerouslySetInnerHTML={{ __html: line
                      .replace(/</g, '&lt;')
                      .replace(/>/g, '&gt;')
                      .replace(/\/\/.*/g, '<span class="text-gray-500 italic">$&</span>')
                      .replace(/\b(int|void|using|namespace|return|if|else|const|for|while)\b/g, '<span class="text-purple-400 font-bold">$1</span>')
                      .replace(/#include\s+&lt;[^&]+&gt;/g, '<span class="text-blue-400">$&</span>')
                      .replace(/\b(tree|arr|lazy|build|updateRange|pushDown|query|main)\b/g, '<span class="text-yellow-200">$1</span>')
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
