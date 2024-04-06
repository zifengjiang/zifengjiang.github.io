---
title: "树节点的第 K 个祖先"
description: 
date: 2024-04-06T16:33:45+08:00
image: ../categories/leetcode/cover.png
math: 
license: 
hidden: false
comments: true
draft: true
categories:
  - leetcode
tags:
  - 二进制提升
---
# 题目描述

给你一棵树，树上有 `n` 个节点，按从 `0` 到 `n-1` 编号。树以父节点数组的形式给出，其中 `parent[i]` 是节点 `i` 的父节点。树的根节点是编号为 `0` 的节点。

树节点的第 `k` 个祖先节点是从该节点到根节点路径上的第 `k` 个节点。

实现 `TreeAncestor` 类：

`TreeAncestor（int n， int[] parent）` 对树和父数组中的节点数初始化对象。
`getKthAncestor(int node, int k)` 返回节点 `node` 的第 `k` 个祖先节点。如果不存在这样的祖先节点，返回 `-1` 。

# 思路

## 无限递归

一开始发可以这样递归的找到指定的 `parent`，提交后发现会超时。

```c++
class TreeAncestor {

public:
    vector<int> p;
    unordered_map<int,unordered_map<int,int>> record;
    TreeAncestor(int n, vector<int>& parent) {
        this->p = parent;
    }
  
    int getKthAncestor(int node, int k) {
        if (node<0) return -1;
        if (k==0) return node;
        int cur_parent = this->p[node];
        return getKthAncestor(cur_parent,k-1);
    }
};

```

## 使用备忘录

使用备忘录记录每个节点的信息，如果之前访问过就直接返回，避免进入递归，但还是超时了。

```c++
class TreeAncestor {

public:
    vector<int> p;
    unordered_map<int,unordered_map<int,int>> record;
    TreeAncestor(int n, vector<int>& parent) {
        this->p = parent;
    }
  
    int getKthAncestor(int node, int k) {
        auto it = record.find(node);
        if (it != record.end()){
            auto r = it->second;
            auto i = r.find(k);
            if (i!=r.end()){
                return i->second;
            }
        }
        if (node<0) {
            record[node][k] = -1;
            return -1;
        }
        if (k==0) {
            return node;
        }
        int cur_parent = this->p[node];
        int res = getKthAncestor(cur_parent,k-1);
        record[node][k] = res;
        return res;
    }
};

```

## 二进制提升

这个问题可以通过预处理和动态规划的方法来解决。我们的目标是快速查询树中任意节点的第 \(k\) 个祖先节点。由于直接逐个遍历祖先节点可能会导致查询时间过长，特别是在树很大或查询很频繁的情况下，我们可以使用一种名为“二进制提升”的技术进行优化。

二进制提升的基本思想是预处理每个节点的第 \(1, 2, 4, 8, \ldots, 2^i\) 个祖先节点（这里的 \(i\) 使得 \(2^i\) 小于等于树的高度）。这样，对于任意的查询 `getKthAncestor(node, k)`，我们可以将 \(k\) 表示为二进制数，并通过已预处理的祖先信息以对数时间复杂度找到答案。

### 实现步骤

1. **初始化**：

   - 创建一个数组 `ancestor[node][i]`，其中 `ancestor[node][i]` 表示节点 `node` 的第 \(2^i\) 个祖先是谁。对于初始化，`ancestor[node][0]` 是给定的 `parent[node]`。
2. **预处理**：

   - 使用动态规划填充 `ancestor` 数组。对于每个节点 `node` 和每个 \(i > 0\)，有 `ancestor[node][i] = ancestor[ancestor[node][i-1]][i-1]`。这里的意思是，节点 `node` 的第 \(2^i\) 个祖先是其第 \(2^{i-1}\) 个祖先的第 \(2^{i-1}\) 个祖先。
3. **查询**：

   - 对于查询 `getKthAncestor(node, k)`，将 \(k\) 转换为二进制表示。然后从高位开始，对于每个为 `1` 的位 `i`，更新 `node = ancestor[node][i]`。如果在某次更新中 `node` 变成了 `-1` 或在过程结束后 `node` 为 `-1`，则返回 `-1` 表示不存在第 \(k\) 个祖先。否则，返回最终的 `node`。

### 示例代码（C++）

```cpp
class TreeAncestor {
public:
    vector<vector<int>> ancestor;

    TreeAncestor(int n, vector<int>& parent) {
        ancestor = vector<vector<int>>(n, vector<int>(20, -1));
        for (int i = 0; i < n; ++i) {
            ancestor[i][0] = parent[i];
        }

        for (int j = 1; j < 20; ++j) {
            for (int i = 0; i < n; ++i) {
                if (ancestor[i][j-1] != -1) {
                    ancestor[i][j] = ancestor[ancestor[i][j-1]][j-1];
                }
            }
        }
    }

    int getKthAncestor(int node, int k) {
        for (int i = 0; i < 20; ++i) {
            if (k & (1 << i)) {
                node = ancestor[node][i];
                if (node == -1) break;
            }
        }
        return node;
    }
};
```

这个实现能够在对数时间内处理每次查询，从而显著提高查询效率，尤其是在面对大量查询的情况下。
