---
title: "题解：AT_yahoo_procon2018_final_c 木の問題"
published: 2024-05-28
publishedAt: 2024-05-28T17:28:12+08:00
category: "题解"
draft: false
---

## AT_yahoo_procon2018_final_c 木の問題 题解
[题目传送门](https://www.luogu.com.cn/problem/AT_yahoo_procon2018_final_c)

## 题目概括
给定一个 $N$ 个顶点的树。

回答下面的 $Q$ 个问题：求从顶点 $v_i$ 出发，正好通过 $k_i$ 条边可以到达的顶点个数。

- $N,Q \le 10^5$。

## 正文
考虑重心分解的树上的路径。

树上的路径，要么通过重心，要么不通过。

从 $v$ 到距离 $d$ 的点中，对于从 $v$ 开始可以不经过重心的点，我们可以使用递归，只考虑经过重心的点。

设重心为 $c$，$v$ 与 $c$ 的距离设为 $dep(v)$。

此时，$u$ 到 $v$ 的路径通过 $c$ 的顶点 $u,v$ 之间的距离为 $dep(u)+dep(v)$。

因此，此时从 $v$ 的距离为 $d$，其路径通过 $c$ 的个数为 $dep(u) = d-dep(v)$，从 $u$ 的个数来看，$dep(u) = d-dep(v)$。与 $v$ 属于同一子树的顶点 $u$ 的个数相减。

两者都是通过从重心的 dfs 得到的。

重复以上的递归方法，就能解决这个问题。

时间复杂度为 $O((N + Q) \log N)$，够通过这题了。

## 代码
[link](https://www.luogu.com.cn/paste/0605i4fd)
