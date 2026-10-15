---
title: "题解：AT_pakencamp_2020_day2_e 老朽化対策"
published: 2025-03-06
publishedAt: 2025-03-06T13:08:39+08:00
category: "题解"
draft: false
---

### AT_pakencamp_2020_day2_e 老朽化対策 题解
[洛谷传送门](https://www.luogu.com.cn/problem/AT_pakencamp_2020_day2_e)

[AtCoder 传送门](https://atcoder.jp/contests/pakencamp-2020-day2/tasks/pakencamp_2020_day2_e)
## 思路
考虑计算所有可能的拆除方式下，位于至少一条未被拆除直线上的点的总数。通过分别计算每个点的贡献并将它们相加来解决这个问题。

每个点的贡献等于所有可能的拆除方式中，至少有一条该点所在的直线未被拆除的方式数。所以可以通过总方式数减去所有该点所在直线都被拆除的方式数来计算每个点的贡献。

将直线分为低斜率和高斜率两类。低斜率直线的斜率绝对值较小，高斜率直线的斜率绝对值较大。

对于低斜率直线，预处理每个斜率对应的截距列表。对于高斜率直线，预处理每个截距对应的直线数量。

对于每个点，统计其所在的低斜率和高斜率直线的数量，从而计算其贡献。
## Code
```cpp
#include<bits/stdc++.h>
using namespace std;
#define int long long
const int mod=1e9+7;
int n,m,ans,L=50000,K=224;
signed main() {
	ios::sync_with_stdio(false),cin.tie(0),cout.tie(0);
	cin>>n>>m;
	vector<int> ni(n+1,1);
	for (int i=0;i<n;i++)
		ni[i+1]=(ni[i]*2)%mod;
	vector<vector<int>> ten(2*K+1,vector<int>(L+1)),sen(2*K+1,vector<int>(L+1));
	for (int i=0,a,b;i<n;i++) {
		cin>>a>>b;
		if (a*a<L) sen[a+K][b]++;
		else {
			int A=(L-b)/a,B=(L+b)/a;
			B*=-1;
			for (int j=max(0LL,min(A,B)-1);j<=max(A,B)+1;j++) {
				if (a*j+b>L || a*j+b<0) continue;
				else ten[j][a*j+b]++;
			}
		}
	}
	for (int i=0,x,y;i<m;i++) {
		int A=0;
		cin>>x>>y;
		if (x<=2*K) A+=ten[x][y];
		for (int j=-223;j<224;j++)
			if (y-j*x>=0 && y-j*x<=L) A+=sen[j+K][y-j*x];
		ans+=ni[n]-ni[n-A],ans%=mod;
	}
	cout<<(ans+mod)%mod<<'\n';
	return 0;
}
```
