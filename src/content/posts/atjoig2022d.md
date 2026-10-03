---
title: "题解：AT_joig2022_d いちご 2 (Strawberry 2)"
published: 2026-02-11
publishedAt: 2026-02-11T16:27:44+08:00
draft: false
---

## AT_joig2022_d いちご 2 (Strawberry 2) 题解
[题目传送门](https://www.luogu.com.cn/problem/AT_joig2022_d)

## 思路
如果去枚举每一个可能的 $3 \times 3$ 的区域，绝对会 TLE 且 MLE。

考虑观察每一个草莓能对哪些区域产生贡献。

一个坐标为 $(A_i, B_i)$ 的草莓，如果能被一个左上角坐标为 $(r, c)$ 的 $3 \times 3$ 区域覆盖，必须满足 $2 \le r \le A_i$ 且 $B_i - 2 \le c \le B_i$。

同时，区域的起点必须合法。

那么对于每一个草莓，可以暴力枚举这 $9$ 个可能的左上角坐标 $(i, j)$，用一个 `map` 来存储这些左上角坐标出现的次数即可。

## Code
```cpp line-numbers
#include<bits/stdc++.h>
using namespace std;
#define int long long
#define pii pair<int,int>
int h,w,n,ans;
map<pii,int> cnt;
signed main() {
	ios::sync_with_stdio(false),cin.tie(0),cout.tie(0);
	cin>>h>>w>>n;
	while (n--) {
		int a,b;
		cin>>a>>b;
		for (int i=a-2;i<=a;i++) {
			if (i<1 || i>h-2) continue;
			for (int j=b-2;j<=b;j++) {
				if (j<1 || j>w-2) continue;
				cnt[{i,j}]++;
			}
		}
	}
	for (auto [x,y]:cnt)
		ans=max(ans,y);
	cout<<ans;
	return 0;
}
```
