---
title: "题解：AT_mujin_pc_2018_c 右折"
published: 2024-09-13
publishedAt: 2024-09-13T12:42:45+08:00
draft: false
---

## AT_mujin_pc_2018_c 右折 题解
[题目传送门](https://www.luogu.com.cn/problem/AT_mujin_pc_2018_c)

## 正文
这是一道简单的模拟题。

~~在你的脑海里~~想象一个能旋转 $90$ 度的方格。如果能快速求出在某个方格中将方向改变 $90$ 度的起点和终点组的个数，就能解决这个问题。

这意味着，如果该方格的上下左右（不包括该方格）有 $u,d,l,r$ 块没有东西阻挡的方格，则有 $(u + d) \times (l + r)$ 就变成了该方格。由于从上、下、左、右依次查看正方形，所以可以在 $O(NM)$ 时间内找到 $u,d,l,r$。

## Code
```
#include<bits/stdc++.h>
using namespace std;
int n,m,w[2005][2005],h[2005][2005];
char a[2005][2005];
long long ans;
signed main(){
	cin>>n>>m;
	for(int i=0;i<n;i++)
	{
		cin>>a[i];
		int t=0;
		for(int j=0;j<=m;j++)
			if(a[i][j]!='.')
			{
				for(int k=t;k<j;k++)
					w[i][k]=j-t-1;
				t=j+1;
			}
	}
	for(int j=0;j<m;j++)
	{
		int t=0;
		for(int i=0;i<=n;i++)
			if(a[i][j]!='.')
			{
				for(int k=t;k<i;k++)
					h[k][j]=i-t-1;
				t=i+1;
			}
	}
	for(int i=0;i<n;i++)
		for(int j=0;j<m;j++)
			ans+=w[i][j]*h[i][j];
	cout<<ans;
	return 0;
}
```
