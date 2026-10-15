---
title: "题解：AT_code_festival_2018_final_a 2540"
published: 2024-04-20
publishedAt: 2024-04-20T15:02:17+08:00
category: "题解"
draft: false
---

# AT_code_festival_2018_final_a 2540 题解
[题目传送门](https://www.luogu.com.cn/problem/AT_code_festival_2018_final_a)

## 前置知识
和楼上两位大佬的思路相同，可以开一个二维数组，来储存每个车站的信息。

但众所周知，数组最大只能开到 $10^7$。所以用二维数组内存会溢出。

这时，我们就可以用到 vector 或者 map 了。

vector 和 map 不像普通数组一样，普通数组是将 0 到指定的范围内申请空间，而 vector 和 map 则会自动将你不需要的空间给释放掉。

## 思路
设 $a_{i,j}$ 为从 $i$ 车站出发，计算到总距离 $2540$ 但还剩 $j$ 距离的方案数。接下来，我们就可以边输入，边计算答案了。

那怎么计算答案呢？其实很简单，只需要总和每次累加上 $a_{i,j} + a_{i,2540-j}$ 就行了。

最后输出总和，这道题就解决了。

看大佬们都用 map，那我就用 vector 吧。

## 代码
```
#include<bits/stdc++.h>
using namespace std;
#define int long long  //开 long long 保险  
int n,m,sum;
signed main(){
	cin>>n>>m;
	vector<map<int,int> > x(n+5);  //记得要加空格，不然会 CE 
	for(int i=1;i<=m;i++)
	{
		int a,b,l;
		cin>>a>>b>>l;
		a--,b--,sum+=x[a][2540-l]+x[b][2540-l],x[a][l]++,x[b][l]++;
	}
	cout<<sum;
	return 0;
}
```
