---
title: "题解：AT_s8pc_6_c Infinite Grid"
published: 2025-02-04
publishedAt: 2025-02-04T14:59:43+08:00
category: "题解"
draft: false
---

## AT_s8pc_6_c Infinite Grid 题解
[洛谷传送门](https://www.luogu.com.cn/problem/AT_s8pc_6_c)

[AtCoder 传送门](https://atcoder.jp/contests/s8pc-6/tasks/s8pc_6_c)
## 思路
看到题目后第一时间想到 DFS，难点在于如何复制网格。

如果按照题目所说，将原网格复制成 $H \times (10^9 \times W)$ 的网格，显然是不现实的。

所以考虑将大网格缩小。题目中的大网格是由 $H \times W$ 的小网格不断重复拼接而成的。这意味着在水平方向上，每间隔 $W$ 列，网格的图案就会重复出现。

再次观察题目，发现 $1 \le H,W \le 100$，那不妨将原网格复制 $100$ 次，就能**保证**出现一个周期。

那接下来就很简单了，直接 DFS 即可。
## Code
```cpp
#include<bits/stdc++.h>
using namespace std;
#define int long long
int h,w;
char a[105][10005];
bool vis[105][10005];
void dfs(int x,int y) {
	vis[x][y]=true;
	if (x+1<h && a[x+1][y]=='.' && !vis[x+1][y]) dfs(x+1,y);
	if (y+1<100*w && a[x][y+1]=='.' && !vis[x][y+1]) dfs(x,y+1);
}
signed main() {
	ios::sync_with_stdio(false),cin.tie(0),cout.tie(0);
	cin>>h>>w;
	for (int i=0;i<h;i++)
		for (int j=0;j<w;j++) {
			cin>>a[i][j];
			for (int k=1;k<=100;k++)
				a[i][j+k*w]=a[i][j];
		}
	dfs(0,0);
	cout<<(vis[h-1][100*w-1] ? "Yay!" : ":(");
	return 0;
}
```
