---
title: "题解：AT_nikkei2019_final_c Come Together"
published: 2024-09-18
publishedAt: 2024-09-18T12:59:59+08:00
category: "题解"
draft: false
---

## AT_nikkei2019_final_c Come Together 题解
[题目传送门](https://www.luogu.com.cn/problem/AT_nikkei2019_final_c)

## 正文
一道模拟题。

考虑将行方向移动和列方向移动视为完全分开。首先，找到收集同一行中的所有碎片所需的最少操作数。同样，如果找到收集同一行中的所有碎片所需的最少操作次数，则答案是找到的两个值的总和。

收集同一行上的所有棋子时，最优方案是收集在所有棋子的中线上。虽然列出所有棋子的行号会花费太多时间，但是可以从序列 $W_1,W_2,\cdots,W_R$ 中找到中值，其中 $W_i$ 是第 $i$ 行中的棋子数。假设件数的一半为 $H$，中位数就是累计和第一次大于等于 $H$ 的地方。

预计时间复杂度为 $O(H + W + K)$。

## Code
```cpp
#include<bits/stdc++.h>
using namespace std;
#define int long long
int h,w,k,pi,pj,cnt,ans;
signed main(){
	cin>>h>>w>>k;
	vector<int> nr(h,w),nc(w,h);
	for(int i=0;i<k;i++)
	{
		int r,c;
		cin>>r>>c;
		nr[r-1]--,nc[c-1]--; //由于下标从 0 开始，所以要 -1
	}
	int mid=(h*w-k)/2; //中值 
	for(int i=0;i<h;i++)
	{
		cnt+=nr[i];
		if(cnt>mid) {pi=i; break;}
	}
	for(int i=0;i<h;i++)
		ans+=abs(i-pi)*nr[i];
	cnt=0;
	for(int i=0;i<w;i++)
	{
		cnt+=nc[i];
		if(cnt>mid) {pj=i; break;}
	}
	for(int i=0;i<w;i++)
		ans+=abs(i-pj)*nc[i];
	cout<<ans;
	return 0;
}
```
```
