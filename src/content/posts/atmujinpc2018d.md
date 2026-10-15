---
title: "题解：AT_mujin_pc_2018_d うほょじご"
published: 2024-09-13
publishedAt: 2024-09-13T13:24:20+08:00
category: "题解"
draft: false
---

## AT_mujin_pc_2018_d うほょじご 题解
[题目传送门](https://www.luogu.com.cn/problem/AT_mujin_pc_2018_d)

## 正文
考虑为每一对的 $(x,y)$ 准备 $1$ 个顶点，使得 $0 \le x,y \le 999$，并为 $(x,y)$ 也看作 $1$ 个顶点（这里的 $(x,y)$ 指的是一个整体），使得 $1 \le x,y$，从顶点 $(x,y)$ 到 $x$ 所需的数量是 $(x,y)$，使得 $1 \le x \le N，1 \le y \le M$，并且它是从相应顶点沿边继续时将导致无限循环的顶点数量。相反，考虑计算不会导致无限循环的顶点数量，并从总数中减去它们，这样就可以得出答案了。

这可以通过向相反方向延伸上图中的边并计算从 $(0,x)$ 或 $(x,0)$ 形式的顶点（在给定范围内）可以到达的顶点数来实现。

## Code
```cpp
#include<bits/stdc++.h>
using namespace std;
#define int long long
int rev(int x){
	int n=0;
	x*=10;
	while(x)
		n=n*10+x%10,x/=10;
	return n;
}
int n,m,ans;
signed main(){
	cin>>n>>m;
	for(int i=1;i<=n;i++)
		for(int j=1;j<=m;j++)
		{
			int cnt=1010,ti=i,tj=j;
			while(--cnt && ti && tj)
			{
				if(ti<tj) ti=rev(ti);
				else tj=rev(tj);
				if(ti<tj) tj-=ti;
				else ti-=tj;
			}
			if(!cnt) ans++;
		}
	cout<<ans;
	return 0;
}
```
ps：部分参考了 [官方题解](https://atcoder.jp/contests/mujin-pc-2018/editorial)，文笔不好，轻喷~
