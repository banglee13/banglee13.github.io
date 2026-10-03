---
title: "题解：AT_abc449_f [ABC449F] Grid Clipping"
published: 2026-03-19
publishedAt: 2026-03-19T13:44:08+08:00
draft: false
---

[题目传送门](https://www.luogu.com.cn/problem/AT_abc449_f)

## 思路

先想暴力，枚举每个 $(r_0,c_0)$，然后检查 $h\times w$ 区域内有没有黑格子。但 $H,W$ 到 $10^9$，显然会 TLE。

考虑正难则反。总放置方案数是 $(H-h+1)(W-w+1)$，减掉包含至少一个黑格子的方案数就行。

考虑一个黑格子 $(r,c)$ 会“毁掉”哪些放置位置。$(r_0,c_0)$ 不合法当且仅当 $r_0 \le r \le r_0+h-1$ 且 $c_0 \le c \le c_0+w-1$，解出来就是：

$$r_0 \in [\max(1, r-h+1),\ \min(H-h+1, r)],\\
c_0 \in [\max(1, c-w+1),\ \min(W-w+1, c)]$$

所以每个黑格子对应 $(r_0,c_0)$ 平面上的一个矩形。就变成一个经典的扫描线问题了。

注意到坐标范围很大，所以离散化 $y$ 坐标后拿线段树维护，时间复杂度为 $O(N \log N)$。

最后处理一些细节即可。

## Code

[Submission](https://atcoder.jp/contests/abc449/submissions/74111432)
