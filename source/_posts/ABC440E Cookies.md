---
title: ABC440E Cookies
date: 2026-01-13 13:20
tags: [贪心, 搜索]
categories: [OI]
---

## AT_abc440_e [ABC440E] Cookies 题解
[题目传送门](https://www.luogu.com.cn/problem/AT_abc440_e)

## 思路

选 $K$ 个饼干，相当于求非负整数解 $(c_1, c_2, \dots, c_N)$，其中 $\sum c_i = K$，总美味度为 $\sum c_i A_i$。

要得到最大和，所以尽可能多选美味度高的饼干。因此，先将 $A$ 降序排序。

从当前最优选择开始，通过将一个高美味度饼干换成下一个较低美味度饼干来生成次优解即可。

## Code
```cpp
#include<bits/stdc++.h>
using namespace std;
#define int long long
struct node {
	vector<int> cnt;
	int sum;
	bool operator < (const node& x) const {
		return sum<x.sum;
	}
};
int n,k,x,a[55];
priority_queue<node> pq;
map<vector<int>,bool> vis;
signed main() {
	ios::sync_with_stdio(false),cin.tie(0),cout.tie(0);
	cin>>n>>k>>x;
	for (int i=1;i<=n;i++)
		cin>>a[i];
	sort(a+1,a+1+n,greater<int>());
	vector<int> t(n+1,0);
	t[1]=k;
	pq.push({t,k*a[1]}),vis[t]=true;
	while (x--) {
		node cur=pq.top(); pq.pop();
		cout<<cur.sum<<'\n';
		for (int i=1;i<n;i++)
			if (cur.cnt[i]>0) {
				vector<int> ncnt=cur.cnt;
				ncnt[i]--,ncnt[i+1]++;
				if (!vis[ncnt]) vis[ncnt]=true,pq.push({ncnt,cur.sum-a[i]+a[i+1]});
			}
	}
	return 0;
}
```