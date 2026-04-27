---
title: ABC440F Egoism
date: 2026-01-13 13:36:00
tags: [贪心, 树状数组]
categories: [OI]
---

## AT_abc440_f [ABC440F] Egoism 题解
[题目传送门](https://www.luogu.com.cn/problem/AT_abc440_f)

## 思路

设洗澡顺序为排列 $p = (p_1, p_2, \dots, p_N)$，则总满意度为：
$$
\mathrm{f}(p) = A_{p_1} + \sum_{i=2}^{N} A_{p_i} \cdot B_{p_{i-1}}
$$

可重写为：
$$
\mathrm{f}(p) = \sum_{i=1}^{N} A_i + \sum_{i=2}^{N} A_{p_i} \cdot (B_{p_{i-1}} - 1)
$$

因为 $B_j \in \{1, 2\}$，所以 $(B_j - 1) \in \{0, 1\}$。因此，第二项的值等于所有满足 $B_{p_{i-1}} = 2$ 的 $A_{p_i}$ 之和。

为了最大化总满意度，我们需要让尽可能多的大 $A$ 值出现在 $B=2$ 的马之后。

定义两个集合 $S_1 = \{ i \mid B_i = 1 \}$，$S_2 = \{ i \mid B_i = 2 \}$。
令 $n_1 = |S_1|$, $n_2 = |S_2|$。

最优策略分为两种情况讨论：
1. **序列以 $S_2$ 中的马结尾**：此时只有 $n_2 - 1$ 匹 $S_2$ 中的马后面有马，额外收益为所有 $A_i$ 中最大的 $n_2 - 1$ 个数之和。
2. **序列以 $S_1$ 中的马结尾**：此时所有 $n_2$ 匹 $S_2$ 中的马后面都有马，额外收益为所有 $A_i$ 中最大的 $n_2$ 个数之和。

可以用两个 `multiset` 分别维护 $S_1$ 和 $S_2$，一个树状数组（Fenwick Tree）维护值域 $[1, 10^6]$ 上的计数与加权和，从而高效查询前 $k$ 大值的和。

## Code

```cpp
#include<bits/stdc++.h>
using namespace std;
#define int long long
struct tree {
	int m,cnt[1000005],sum[1000005];
	void init(int n) {
		m=n;
		memset(cnt,0,sizeof(cnt));
		memset(sum,0,sizeof(sum));
	}
	int lowbit(int x) {
		return x&(-x);
	}
	void update(int x,int y) {
		for (int i=x;i<=m;i+=lowbit(i))
			cnt[i]+=y,sum[i]+=x*y;
	}
	int query1(int x) {
		int res=0;
		for (int i=x;i;i-=lowbit(i))
			res+=cnt[i];
		return res;
	}
	int query2(int x) {
		int res=0;
		for (int i=x;i;i-=lowbit(i))
			res+=sum[i];
		return res;
	}
	int query3(int k) {
		if (k<=0) return 0;
		int cntt=query1(m);
		if (k>=cntt) return query2(m);
		int idx=0,cur=0,tar=cntt-k;
		for (int i=1<<20;i>0;i/=2)
			if (idx+i<=m && cur+cnt[idx+i]<=tar) idx+=i,cur+=cnt[idx];
		return query2(m)-(query2(idx)+(tar-cur)*(idx+1));
	}
}c;
int n,q,sum,a[200005],b[200005];
multiset<int> s1,s2;
void add(int i) {
	c.update(a[i],1);
	sum+=a[i];
	if (b[i]==1) s1.insert(a[i]);
	else s2.insert(a[i]);
}
void remove(int i) {
	c.update(a[i],-1);
	sum-=a[i];
	if (b[i]==1) s1.erase(s1.find(a[i]));
	else s2.erase(s2.find(a[i]));
}
int solve() {
	if (n==1) return a[1];
	int n1=s1.size(),n2=s2.size(),ans=-2e18;
	if (n2>0) ans=max(ans,sum+c.query3(n2-1));
	if (n1>0) {
		int v=sum+c.query3(n2);
		if (n2>0) {
			int mins2=*s2.begin(),maxs1=*s1.rbegin();
			if (mins2>maxs1) v-=(mins2-maxs1);
		}
		ans=max(ans,v);
	}
	return ans;
}
signed main() {
	ios::sync_with_stdio(false),cin.tie(0),cout.tie(0);
	cin>>n>>q;
	c.init(1000005);
	for (int i=1;i<=n;i++)
		cin>>a[i]>>b[i],add(i);
	while (q--) {
		int w,x,y;
		cin>>w>>x>>y;
		remove(w);
		a[w]=x,b[w]=y;
		add(w);
		cout<<solve()<<'\n';
	}
	return 0;
}