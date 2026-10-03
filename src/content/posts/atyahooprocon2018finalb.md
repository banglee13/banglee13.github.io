---
title: "题解：AT_yahoo_procon2018_final_b 経路が色々"
published: 2024-05-27
publishedAt: 2024-05-27T09:19:24+08:00
draft: false
---

## AT_yahoo_procon2018_final_b 経路が色々 题解
[题目传送门](https://www.luogu.com.cn/problem/AT_yahoo_procon2018_final_b)

## 正文
$100 \times 100$ 以下大小的网格的每个格子都涂黑或白，从左上到右下，最短距离的数正好是 $K$。
- $K \le 10^{18}$.

这个图形从左上到右下有三种路径：
![](https://cdn.luogu.com.cn/upload/image_hosting/p9a4lck2.png)

我们再把这个图形拓展一下，变成这样：
![](https://cdn.luogu.com.cn/upload/image_hosting/uqqiwzk8.png)

再拓展亿下下，又变成了这样：
![](https://cdn.luogu.com.cn/upload/image_hosting/ivia0vhk.png)

$K$ 的三进制符号的第 $i$ 位是 $0,1,2$ 的时候，第 $i$ 个块各生 $0,1,2$ 根。

$3^{40} > 10^{18}$，所以 $80 \times 80$ 位就足够了。

这道题就解决了。

## 代码
```
#include<bits/stdc++.h>
using namespace std;
#define int long long
int k;
char c[105][105];
signed main(){
	cin>>k;
	for(int i=0;i<100;i++)
		for(int j=0;j<100;j++)
			c[i][j]='#';
	for(int i=0;i<100;i++)
		c[99][i] = '.',c[i][99] = '.';
	for(int i=0;i<40;i++)
	{
		for(int j=i*2;j<100;j++)
			c[i*2][j]='.',c[j][i*2]='.';
		c[i*2+1][i*2+1]='.',c[i*2+2][i*2+1]='.';
	}
	for(int i=0;i<40;i++)
	{
		if(k%3==0) c[98][i*2]='#',c[i*2][98]='#';
		if(k%3==1) c[98][i*2]='#';
		k/=3;
	}
	cout<<"100 100\n";
	for(int i=0;i<100;i++)
	{
		for(int j=0;j<100;j++)
			cout<<c[i][j];
		cout<<endl;
	}
	return 0;
}
```
