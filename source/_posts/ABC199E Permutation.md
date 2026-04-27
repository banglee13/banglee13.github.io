---
title: ABC199E Permutation
date: 2026-03-20 13:28:00
tags: [状压 dp]
categories: [OI]
---

[题目传送门](https://www.luogu.com.cn/problem/AT_abc199_e)

## 思路
注意到 $N \le 18$，考虑状压。

设 $dp_{msk}$ 表示当前已经选了 $msk$ 这个集合里的数，填到了排列的前 $\text{popcount}(msk)$ 个位置，且满足所有条件的方案数。

那么状态转移就是枚举下一个位置放哪个还没用过的数。

关键在于什么时候检查条件。题目说“前 $X_i$ 个位置中，$\le Y_i$ 的数至多 $Z_i$ 个”，所以只有当 $\text{popcount}(msk) = X_i$ 的时候才需要检查第 $i$ 条条件。

检查方法就是数一下 $msk$ 里编号 $\le Y_i$ 的位有几个，超过 $Z_i$ 就说明当前状态不合法，直接跳过不往后转移。

时间复杂度为 $O(2^N \cdot (N+M))$。

## Code
```cpp
#include<bits/stdc++.h>
using namespace std;
#define int long long
int n,m,x[105],y[105],z[105],dp[1<<18];
signed main() {
	ios::sync_with_stdio(false),cin.tie(0),cout.tie(0);
	cin>>n>>m;
	for (int i=0;i<m;i++)
		cin>>x[i]>>y[i]>>z[i];
	dp[0]=1;
	for (int msk=0;msk<(1<<n);msk++) {
		if (dp[msk]==0) continue;
		int p=__builtin_popcount(msk);
		bool flag=true;
		for (int i=0;i<m;i++)
			if (x[i]==p) {
				int cnt=0;
				for (int j=0;j<y[i];j++)
					if (msk&(1<<j)) cnt++;
				if (cnt>z[i]) {
					flag=false;
					break;
				}
			}
		if (!flag) continue;
		for (int j=0;j<n;j++)
			if (!(msk&(1<<j))) dp[msk|(1<<j)]+=dp[msk];
	}
	cout<<dp[(1<<n)-1];
	return 0;
}
```