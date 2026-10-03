---
title: "题解：AT_abc443_c [ABC443C] Chokutter Addiction"
published: 2026-02-01
publishedAt: 2026-02-01T14:24:20+08:00
draft: false
---

### AT_abc443_c [ABC443C] Chokutter Addiction 题解
[题目传送门](https://www.luogu.com.cn/problem/AT_abc443_c)

## 思路
模拟。

显然逐秒模拟会 TLE。

考虑用一个变量 $s$ 表示当前 chokutter 下一次打开的时间。

遍历每个 Aoki 经过的时间 $A_i$，如果当前的时间大于等于 $s$，那么从 $s$ 到 $A_i$ 这段时间是有效的观看时间，下次打开时间为 $A_i+100$，更新 $s$ 变量。

最后，如果 $s<T$，说明从 $s$ 到 $T$ 之间 chokutter 一直处于打开状态，要把答案加上 $T-s$。

时间复杂度为 $O(N)$。
## Code
```cpp line-numbers
#include<bits/stdc++.h>
using namespace std;
#define int long long
int n,t,s,ans,a[300005];
signed main() {
	ios::sync_with_stdio(false),cin.tie(0),cout.tie(0);
	cin>>n>>t;
	for (int i=1;i<=n;i++)
		cin>>a[i];
	for (int i=1;i<=n;i++)
		if (a[i]>=s) ans+=a[i]-s,s=a[i]+100;
	if (s<t) ans+=t-s;
	cout<<ans;
	return 0;
}
```
