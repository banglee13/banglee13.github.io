---
title: "题解：AT_arc097_c [ARC097E] Sorted and Sorted"
published: 2026-07-17
publishedAt: 2026-07-17T07:47:57+08:00
category: "题解"
draft: false
---

模拟赛 T6。

## Part 1

暴力。

考虑枚举最终序列中哪些位置放白球。

一共有 $C^N_{2N}$ 种排列方式。确定颜色顺序后，每个位置对应的具体球也就确定了。最少相邻交换次数就是所得序列的逆序对数量，这里可以 $O(N^2)$ 计算。

时间复杂度为 $O(C^N_{2N} N^2)$。

~~原本想放暴力代码的但是没保存不见了。~~

## Part 2

暴力的瓶颈在于，许多的排列方式都有着相同的前缀。例如，只要确定了前 $i$ 个白球和前 $j$ 个黑球，后面可以选择的球就是完全相同的，所以没有必要区分之前用的是哪种排列方式。

考虑 dp。我们定义 $dp[i][j]$ 表示将前 $i$ 个白球和前 $j$ 个黑球放入最终序列前 $i+j$ 个位置时，需要的最少交换次数。

当状态为 $(i,j)$ 时，下一步就有两种选择，在下一个位置放白球或黑球。

放 $W_{i+1}$ 时，新增的白黑逆序对数为

$$
f_W(i+1,j)=|\{k\le j:\operatorname{pos}_B[k]>\operatorname{pos}_W[i+1]\}|+|\{k>j:\operatorname{pos}_B[k]<\operatorname{pos}_W[i+1]\}|
$$

前一项是已放入的黑球中原位置在 $W_{i+1}$ 右边的，后一项是未放入的黑球中原位置在 $W_{i+1}$ 左边的。放 $B_{j+1}$ 时的代价同理。

我们发现同色球之间的逆序对与排列方式无关，所以单独预处理即可；白黑之间的逆序对由 dp 最小化。转移方程为 $dp[i][j]=\min(dp[i-1][j]+f_W(i,j),dp[i][j-1]+f_B(j,i))$，暴力计算每次就是 $O(N)$。

时间复杂度为 $O(N^3)$。

:::info[$O(N^3)$ 代码]
```cpp
#include<bits/stdc++.h>
using namespace std;
#define int long long
int n,b[2005],pw[2005],pb[2005],dp[2005][2005];
char a[2005];
inline int cal1(int i,int j) {
	int cnt=0;
	for (int k=1;k<pw[i];k++) {
		if (a[k]=='W') {
			if (b[k]>i) cnt++;
		}
		else {
			if (b[k]>j) cnt++;
		}
	}
	return cnt;
}
inline int cal2(int i,int j) {
	int cnt=0;
	for (int k=1;k<pb[j];k++) {
		if (a[k]=='W') {
			if (b[k]>i) cnt++;
		}
		else {
			if (b[k]>j) cnt++;
		}
	}
	return cnt;
}
signed main() {
	ios::sync_with_stdio(false),cin.tie(0),cout.tie(0);
	cin>>n;
	for (int i=1;i<=2*n;i++) {
		cin>>a[i]>>b[i];
		if (a[i]=='W') pw[b[i]]=i;
		else pb[b[i]]=i;
	}
	memset(dp,0x3f,sizeof(dp));
	dp[0][0]=0;
	for (int i=0;i<=n;i++)
		for (int j=0;j<=n;j++) {
			if (i==0 && j==0) continue;
			if (i>0) dp[i][j]=min(dp[i][j],dp[i-1][j]+cal1(i,j));
			if (j>0) dp[i][j]=min(dp[i][j],dp[i][j-1]+cal2(i,j));
		}
	cout<<dp[n][n];
	return 0;
}
```
:::

## Part 3

我们发现 $O(N^3)$ 的做法的瓶颈在于每一次都要重新计算一遍代价。考虑预处理。

对于固定的 $i+1$，我们观察 $f_W(i+1,j)$ 关于 $j$ 的变化：从 $j-1$ 到 $j$，$B_j$ 由“未放入”变为“已放入”，

$$
f_W(i+1,j)=f_W(i+1,j-1)+
\begin{cases}
+1&\operatorname{pos}_B[j]>\operatorname{pos}_W[i+1]\\
-1&\operatorname{pos}_B[j]<\operatorname{pos}_W[i+1]
\end{cases}
$$

注意边界 $f_W(i+1,0)=|\{k:\operatorname{pos}_B[k]<\operatorname{pos}_W[i+1]\}|$。

对于每个 $i+1$，递推一遍是 $O(N)$ 的，全部预处理 $O(N^2)$，$f_B$ 同理。这样每次转移就是 $O(1)$。

时间复杂度降为 $O(N^2)$。

:::info[$O(N^2)$ 代码]
```cpp
#include<bits/stdc++.h>
using namespace std;
#define int long long
const int maxn=2005;
int n,pw[maxn],pb[maxn],dp[maxn][maxn];
int sumw[maxn][maxn],sumb[maxn][maxn];
int cntw[maxn],cntb[maxn];
signed main() {
	ios::sync_with_stdio(false),cin.tie(0),cout.tie(0);
	cin>>n;
	for (int i=1;i<=2*n;i++) {
		char c;
		int x;
		cin>>c>>x;
		if (c=='W') pw[x]=i;
		else pb[x]=i;
	}
	for (int i=1;i<=n;i++) {
		int cnt=0;
		for (int j=1;j<=n;j++) {
			if (pw[j]<pw[i] && j>i) cnt++;
			sumb[i][j]=sumb[i][j-1]+(pb[j]<pw[i]);
		}
		cntw[i]=cnt;
	}
	for (int i=1;i<=n;i++) {
		int cnt=0;
		for (int j=1;j<=n;j++) {
			if (pb[j]<pb[i] && j>i) cnt++;
			sumw[i][j]=sumw[i][j-1]+(pw[j]<pb[i]);
		}
		cntb[i]=cnt;
	}
	memset(dp,0x3f,sizeof(dp));
	dp[0][0]=0;
	for (int i=0;i<=n;i++)
		for (int j=0;j<=n;j++) {
			if (i==0 && j==0) continue;
			if (i>0) dp[i][j]=min(dp[i][j],dp[i-1][j]+cntw[i]+(sumb[i][n]-sumb[i][j]));
			if (j>0) dp[i][j]=min(dp[i][j],dp[i][j-1]+cntb[j]+(sumw[j][n]-sumw[j][i]));
		}
	cout<<dp[n][n];
	return 0;
}
```
:::
