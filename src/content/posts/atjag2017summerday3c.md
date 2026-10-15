---
title: "题解：AT_jag2017summer_day3_c Ninja Map"
published: 2025-02-26
publishedAt: 2025-02-26T13:21:46+08:00
category: "题解"
draft: false
---

## AT_jag2017summer_day3_c Ninja Map 题解
[洛谷传送门](https://www.luogu.com.cn/problem/AT_jag2017summer_day3_c)

[AtCoder 传送门](https://atcoder.jp/contests/jag2017summer-day3/tasks/jag2017summer_day3_c)
## 思路
考虑构建一个图。

对于每一对相邻的交叉点编号 $a_i$ 和 $b_i$，在图中添加一条连接它们的边。

因为一个交叉点在网格中的邻居数量是固定的，所以对于网格中的每个位置 $(i,j)$，计算它在网格中合法的邻居数量，存储在 $cnt$ 数组中。

从左上角开始，依次遍历网格中的每个位置。对于每个未填充的位置 $(i,j)$，根据其相邻已填充位置的邻居信息，找出符合条件的交叉点编号进行填充。具体来说，统计相邻已填充位置的邻居编号出现的次数，然后在未访问的交叉点中，找到邻居数量与当前位置的合法邻居数量相等，且在统计中出现次数满足要求的交叉点编号进行填充，并标记为已访问。
## Code
```cpp
#include<bits/stdc++.h>
using namespace std;
#define int long long
int n,a[105][105],cnt[105][105];
bool vis[10005];
vector<int> G[10005];
const int dx[4]={0,1,0,-1},dy[4]={1,0,-1,0};
signed main() {
	ios::sync_with_stdio(false),cin.tie(0),cout.tie(0);
	cin>>n;
	for (int a,b;cin>>a>>b;)
		G[a].push_back(b),G[b].push_back(a);
	for (int i=0;i<n;i++)
		for (int j=0;j<n;j++)
			for (int r=0;r<4;r++) {
				int nx=i+dx[r],ny=j+dy[r];
				cnt[i][j]+=(nx>=0 && ny>=0 && nx<n && ny<n);
			}
	for (int i=0;i<n;i++)
		for (int j=0;j<n;j++) {
			if (i==0 && j==0) {
				int k;
				for (k=1;G[k].size()!=2;k++);
				vis[k]=true,a[i][j]=k;
			}
			else {
				int c[10005]={},ret=0;
				for (int r=0;r<4;r++) {
					int nx=i+dx[r],ny=j+dy[r];
					if (nx<0 || ny<0 || nx>=n || ny>=n)continue;
					if (a[nx][ny]==0)continue;
					ret++;
					for (int u:G[a[nx][ny]])
						c[u]++;
				}
				for (int u=1;u<=n*n;u++) {
					if (cnt[i][j]!=G[u].size()) continue;
					if (vis[u]) continue;
					if (c[u]<ret) continue;
					a[i][j]=u,vis[u]=true;
					break;
				}
			}
		}
	for (int i=0;i<n;i++) {
		for (int j=0;j<n;j++)
			cout<<a[i][j]<<" ";
		cout<<'\n';
	}
	return 0;
}
```
