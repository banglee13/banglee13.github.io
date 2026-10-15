---
title: "题解：AT_jag2017summer_day1_b リス"
published: 2024-09-18
publishedAt: 2024-09-18T13:57:28+08:00
category: "题解"
draft: false
---

## AT_jag2017summer_day1_b リス 题解
[题目传送门](https://www.luogu.com.cn/problem/AT_jag2017summer_day1_b)

## 题目大意
这道题描述了一个由两种动物（假设为 $A$ 和 $B$）组成的队列，每个动物都有一个优先级。我们需要找到一种方法来将队列重新排序，使得 $A$ 类动物的优先级严格高于 $B$ 类动物。

## 思路
考虑使用线段树维护优先级。

线段树中的每个节点表示存储该区间内剩余的 $A$ 类动物数量。

从后往前遍历动物，根据其优先级找到合适的位置插入。

在插入动物后，更新线段树对应位置的剩余 $A$ 类动物数量。

 最后，求出重排后的队列中 $A$ 类动物的优先级的最长上升子序列长度，即为答案。

## Code
```cpp
#include<bits/stdc++.h>
using namespace std;
const int MAXN=300005;
int n,a[MAXN],b[MAXN];
vector<int> d;
struct segtree{
	int v[4*MAXN],l;
  //初始化线段树 
	void init(){
		l=1;
		while(l<=n)
			l<<=1;
		for(int i=1;i<=n;i++)
			v[i+l]=1; //初始时，所有动物都是 A 类 
		for(int i=l;--i;)
			v[i]=v[2*i]+v[2*i+1];
	}
  //更新线段树 
	void upd(int P,int V){
		P+=l;
		while(P)
			v[P]+=V,P>>=1;
	}
  //查询剩余 A 类动物的数量 
	int get(int I){
		int P=1;
		I++;
		while(P<l)
		{
			if(v[2*P+1]>=I) P=2*P+1;
			else I-=v[2*P+1],P=2*P;
		}
		return P-l;
	}
}seg;
signed main(){
	ios::sync_with_stdio(false),cin.tie(0),cout.tie(0);
	cin>>n;
	seg.init();
	for(int i=1;i<=n;i++)
		cin>>b[i];
	for(int i=n;i>=1;i--)
	{
		int I=seg.get(b[i]); //找到合适的插入位置 
		a[I]=i,seg.upd(I,-1); //插入动物并更新线段树 
	}
  //求最长上升子序列 
	for(int i=1;i<=n;i++)
	{
		auto it=lower_bound(d.begin(),d.end(),a[i]);
		if(it==d.end()) d.push_back(a[i]);
		else *it=a[i];
	}
	cout<<d.size();
	return 0;
}
```
