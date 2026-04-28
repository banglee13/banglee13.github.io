---
title: ABC449F Grid Clipping
date: 2026-03-19 13:44
tags: [扫描线, 线段树]
categories: [OI]
---

[题目传送门](https://www.luogu.com.cn/problem/AT_abc449_f)

## 思路

先想暴力，枚举每个 $(r_0, c_0)$，然后检查 $h \times w$ 区域内有没有黑格子。但数据范围 $H, W$ 到 $10^9$，显然暴力会 TLE。

考虑**正难则反**。合法的放置方案数等于“总放置方案数”减去“包含至少一个黑格子的非法方案数”。
总方案数为 $(H-h+1) \times (W-w+1)$。

对于每个黑格子 $(r, c)$，它会使得所有包含它的放置方案（即左上角为 $(r_0, c_0)$ 的矩形区域）均不合法。
不合法当且仅当 $r_0 \le r \le r_0+h-1$ 且 $c_0 \le c \le c_0+w-1$，解不等式得：

$$
\begin{aligned}
r_0 &\in [\max(1, r-h+1),\ \min(H-h+1, r)] \\\\
c_0 &\in [\max(1, c-w+1),\ \min(W-w+1, c)]
\end{aligned}
$$

因此，每个黑格子在 $(r_0, c_0)$ 的坐标平面上对应一个矩形区域。问题转化为求这些**矩形并集的面积**。
由于坐标范围巨大，需要对坐标进行离散化，然后使用**扫描线算法**配合**线段树**维护，时间复杂度为 $O(N \log N)$。

最后处理好边界和离散化细节即可。

## Code

[Submission](https://atcoder.jp/contests/abc449/submissions/74111432)