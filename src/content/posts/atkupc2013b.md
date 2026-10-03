---
title: "题解：AT_kupc2013_b ライオン"
published: 2024-10-17
publishedAt: 2024-10-17T14:01:26+08:00
draft: false
---

## AT_kupc2013_b ライオン 题解
[题目传送门](https://www.luogu.com.cn/problem/AT_kupc2013_b)

## 思路
题目要求寻找所有可能的狮子分配方式，使得满足游客统计的信息。所以考虑使用深度优先搜索（DFS）。

可以从第 $0$ 个笼子开始，尝试填充数量，从 $0$ 到 $x$ 的每一个可能值。

对于每种分配方式，检查每位游客提供的区间统计是否与计算的结果相符。如果不相符，则回溯，并尝试下一个组合。

输出最优解即可。

## Code
```cpp
#include<bits/stdc++.h>
using namespace std;
#define rep(i,n) for(int i=0;i<n;i++)
int n, x, m, kk, sum, l[15], r[15], s[15], ans[15], tmp[15];

void dfs(int d) {
	if (d == n) {
		rep(i, m) {
			kk = 0;
			for (int j = l[i]; j <= r[i]; j++)
				kk += tmp[j];
			if (kk != s[i]) return;
		}
		kk = 0;
		rep(i, n) kk += tmp[i];
		if (kk > sum) {
			sum = kk;
			rep(i, n)
				ans[i] = tmp[i];
		}
		return;
	}
	rep(i, x+1) {
		tmp[d] = i;
		dfs(d + 1);
	}
}
signed main() {
	cin >> n >> x >> m;
	rep(i, m)
		cin >> l[i] >> r[i] >> s[i], l[i]--, r[i]--;
	sum = -1;
	dfs(0);
	if (sum < 0) cout << "-1\n";
	else
		rep(i, n)
			cout << ans[i] << ((i == n - 1) ? "\n" : " ");
	return 0;
}
```
