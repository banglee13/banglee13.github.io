---
title: ABC232G 建图优化
date: 2026-04-18 09:49:00
tags: [建图优化]
categories: [OI]
---

[problem](https://www.luogu.com.cn/problem/AT_abc232_g)

## 思路
注意到 $2 \le n \le 2 \times 10^5$，$O(n^2)$ 暴力建图显然不行，考虑建图优化。

注意到权值为 $w(i,j) = (A_i + B_j) \bmod m$，改写为

$$
\begin{aligned}
w(i,j) &= \begin{cases}
A_i + B_j & (A_i + B_j < m) \\\\
A_i + B_j - m & (A_i + B_j \ge m)
\end{cases} \\\\
&= A_i + B_j - k \cdot m \quad (k \in \{0,1\})
\end{aligned}
$$

由于所有点出边的权值都与自己的 $A_i$ 相关，入边的权值与 $B_j$ 相关，考虑引入辅助节点。

定义 $1 \sim n$ 为原始顶点，$n+1 \sim 2n$ 为辅助节点。

### 连边
建立辅助节点 $P_1, P_2, \ldots, P_n$，将它们按 $B_j$ 的值从小到大排序。

1. 相邻的辅助节点 $P_k \to P_{k+1}$ 连边，权值就是 $B_{pos[k+1]} - B_{pos[k]}$。为了形成循环（即 $A_i + B_j \ge m$ 的情况），将最后一个辅助节点连向第一个，权值为 $m - (B_{max} - B_{min})$。此时图就是一个有向环了。
2. 在辅助环中找到了合适的位置，就可以免费回到真实的图中。即 $e[n+k] \to B_{pos[k]}.id, w=0$。
3. 对于每个原始点 $i$，找到一个最理想的切入点。由公式 $(A_i + B_j) \bmod m$，我们希望 $A_i + B_j$ 尽可能小或者尽可能接近 $m$（且 $\ge m$）。考虑用 `lower_bound` 找到第一个满足 $B_k \ge m - A_i$ 的辅助节点。从原始点 $i$ 向该辅助节点 $n+k$ 连一条边，权值为 $(A_i + B_k) \bmod m$。

## 实现
建图后跑 dijkstra 即可。