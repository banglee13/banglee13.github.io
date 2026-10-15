---
title: "题解：AT_abc405_c [ABC405C] Sum of Product"
published: 2025-05-13
publishedAt: 2025-05-13T13:05:36+08:00
category: "题解"
draft: false
---

### AT_abc405_c [ABC405C] Sum of Product 题解
[洛谷传送门](https://www.luogu.com.cn/problem/AT_abc405_c)

[AtCoder 传送门](https://atcoder.jp/contests/abc405/tasks/abc405_c)

## 题目大意
给定一个长度为 $N$ 的整数序列 $A=(A_1,A_2,\dots,A_N)$，求 $\displaystyle\ \sum_{1\leq\ i\ <\ j\leq\ N}\ A_iA_j$。

## 思路
显然可以暴力，但观察到 $2 \le N \le 3 \times 10^5$，因此暴力是不可行的。

考虑优化。

观察到：

$$
\left(\sum_{i=1}^N A_i \right)^2 = \sum_{i=1}^N A_i^2 + 2 \sum_{1 \leq i < j \leq N} A_i A_j
$$

因此，可以推导出：

$$
\sum_{1 \leq i < j \leq N} A_i A_j = \frac{1}{2} \left( \left( \sum_{i=1}^N A_i \right)^2 - \sum_{i=1}^N A_i^2 \right)
$$

这样，我们就可以只计算 $A$ 的总和和平方和，然后带进公式计算即可。

时间复杂度为 $O(n)$。
## Code
```cpp
#include<bits/stdc++.h>
using namespace std;
#define int long long
int n,sum,sqsum;
signed main() {
	ios::sync_with_stdio(false),cin.tie(0),cout.tie(0);
	cin>>n;
	for (int i=1,x;i<=n;i++)
		cin>>x,sum+=x,sqsum+=x*x;
	cout<<(sum*sum-sqsum)/2;
	return 0;
}
```
[通过记录](https://atcoder.jp/contests/abc405/submissions/65751743)
