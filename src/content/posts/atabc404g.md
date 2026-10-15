---
title: "题解：AT_abc404_g [ABC404G] Specified Range Sums"
published: 2026-07-20
publishedAt: 2026-07-20T21:03:38+08:00
category: "题解"
draft: false
---

设 $P_i$ 表示数列 $A$ 的前缀和，规定 $P_0=0$。

首先可以将 $\sum\limits_{j=L_i}^{R_i}A_j=S_i$ 转化为 $P_{R_i}-P_{L_i-1}=S_i$，再拆分成两个不等式：
1. $P_{R_i}-P_{L_i-1}\ge S_i$
2. $P_{L_i-1}-P_{R_i}\ge -S_i$

又因为题目说 $A$ 的每个元素都是正整数，所以 $P_i-P_{i-1}\ge 1(1\le i\le N)$。

发现这三个不等式正好是差分约束的形式，所以跑最长路。

我们从源点 $P_0=0$ 出发跑最长路，求出来的就是满足所有约束的最小 $P_i$：一个点如果能经过多条路径从源点到达，每条路径都会给它一个下界，取这些下界里最大的（也就是最长路）才是能取到的最小值。这样求出来的每个 $P_i$ 都同时最小，$P_N$ 自然也最小，答案 $\sum A_i=P_N-P_0=P_N$ 就是所求的最小值。

如果图中存在正环，就说明无解。

## Code

```cpp
#include<bits/stdc++.h>
using namespace std;
#define int long long
struct edge {
	int v,w;
};
int n,m,dis[4005],cnt[4005];
bool inq[4005];
vector<edge> g[4005];
queue<int> q;
void spfa(int s) {
	fill(dis,dis+1+n,-1e18);
	dis[s]=0,q.push(s),inq[s]=true;
	while (!q.empty()) {
		int u=q.front(); q.pop();
		inq[u]=false;
		for (auto [v,w]:g[u])
			if (dis[u]+w>dis[v]) {
				dis[v]=dis[u]+w;
				cnt[v]=cnt[u]+1;
				if (cnt[v]>=n+2) {
					cout<<-1;
					exit(0);
				}
				if (!inq[v]) q.push(v),inq[v]=true;
			}
	}
}
signed main() {
	ios::sync_with_stdio(false),cin.tie(0),cout.tie(0);
	cin>>n>>m;
	for (int i=1;i<=n;i++)
		g[i-1].push_back({i,1});
	for (int i=1,a,b,c;i<=m;i++)
		cin>>a>>b>>c,g[a-1].push_back({b,c}),g[b].push_back({a-1,-c});
	spfa(0);
	cout<<dis[n];
	return 0;
}
```
