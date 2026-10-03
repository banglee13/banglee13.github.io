---
title: "题解：AT_joisc2013_joi_poster JOIポスター (JOI Poster)"
published: 2025-11-08
publishedAt: 2025-11-08T15:31:27+08:00
draft: false
---

### AT_joisc2013_joi_poster JOIポスター (JOI Poster) 题解

[题目传送门](https://www.luogu.com.cn/problem/AT_joisc2013_joi_poster)

## 思路

求满足条件的四元组 $(A,B,C,D)$ 的数量，其中：

- 以 $A$ 为圆心、$B$ 为圆上一点作圆 $O_1$，以 $C$ 为圆心、$D$ 为圆上一点作圆 $O_2$；
- 要求 $O_2$ **严格包含于** $O_1$ 内部；
- 且两个圆都必须**完全包含在海报矩形 $[0,W] \times [0,H]$ 内**。

观察到 $N \le 50$，所以可以直接四重循环枚举所有互不相同的 $A,B,C,D$。

对于每组四元组，先计算两个圆的半径平方，再检查两个圆是否在海报范围内，最后检查是否严格包含，统计数量即可。

:::warning[精度误差]{open}
由于浮点数计算时可能有误差，所以可以加上一个浮点数来避免误差。
:::

:::warning[换行]{open}
由于这是一道 2013 年的题目，你需要在末尾输出换行，否则你会 WA。
:::

## Code

```cpp line-numbers
#include<bits/stdc++.h>
using namespace std;
#define int long long
#define db double
int n,w,h,ans,x[55],y[55];
//计算两点间距离的平方
int dis(int i,int j) {
	return (x[i]-x[j])*(x[i]-x[j])+(y[i]-y[j])*(y[i]-y[j]);
}
//检查以 c 为圆心、半径平方为 rr 的圆是否完全在海报内
bool check(int c,int rr) {
	db r=sqrt(rr); //实际半径
	//圆心 (x[c],y[c]) 到四边的距离必须>=r
	return (x[c]-r>=0) && (x[c]+r<=w) && (y[c]-r>=0) && (y[c]+r<=h);
}
signed main() {
	ios::sync_with_stdio(false),cin.tie(0),cout.tie(0);
	cin>>n>>w>>h;
	for (int i=1;i<=n;i++)
		cin>>x[i]>>y[i];
	for (int A=1;A<=n;A++) {
		for (int B=1;B<=n;B++) {
			if (B==A) continue;
			int R1=dis(A,B); //外圆半径平方
			if (!check(A,R1)) continue; //外圆超出海报，跳过
			for (int C=1;C<=n;C++) {
				if (C==A || C==B) continue;
				for (int D=1;D<=n;D++) {
					if (D==A || D==B || D==C) continue;
					int R2=dis(C,D); //内圆半径平方
					if (!check(C,R2)) continue; //内圆超出海报，跳过
					int d=dis(A,C); //两圆圆心距离的平方
					//判断是否 R1 对应的圆严格包含 R2 对应的圆
					db r1=sqrt((db)R1),r2=sqrt((db)R2),dist=sqrt((db)d);
					if (r1>r2+dist+1e-9) ans++; //加 1e-9 防浮点误差
				}
			}
		}
	}
	cout<<ans<<'\n';
	return 0;
}
```

[提交记录](https://atcoder.jp/contests/joisc2013-day1/submissions/70750826)
