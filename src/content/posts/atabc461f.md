---
title: "题解：AT_abc461_f [ABC461F] Total Product is N"
published: 2026-06-08
publishedAt: 2026-06-08T12:36:02+08:00
draft: false
---

## 思路

注意到题目问“所有好序列的分数之和”，所以考虑把有序的问题转成无序的来做。

对一个大小为 $k$、元素之和为 $sum$ 的合法子集，它能生成 $k!$ 个有序序列，每个序列分数都是 $sum$，贡献是 $k! \cdot sum$。但 $1$ 比较特殊，加不加进去都不影响乘积，所以把它单独处理。

设 $S$ 是一个不含 $1$ 的、乘积为 $N$ 的 $k$ 元子集，元素和为 $sum$，它产生了两种序列：

- 不含 $1$ 的序列。$k!$ 个序列，每个分数是 $sum$，贡献 $k! \cdot sum$。
- 含 $1$ 的序列。$(k+1)!$ 个序列，每个分数 $sum+1$，贡献 $(k+1)! \cdot (sum+1)$。

合并一下就是 $k!(k+2) sum + (k+1)!$，所以只需对不含 $1$ 的合法子集统计方案数和元素和之和就行了。

设 $N$ 的因子排好序为 $d_1 < d_2 < \cdots < d_m$，我们定义 $dp1[i][j]$ 表示不含 $1$ 的且乘积恰为 $d_i$ 的 $j$ 元子集方案数，$dp2[i][j]$ 表示同条件下，所有方案中元素之和的总和。

枚举“当前加入的新元素”$d_i$（$i \ge 2$），找所有前驱状态 $d_p$，转移到 $d_{idx}=d_p \cdot d_i$，状态转移方程为：

$$
\begin{cases}
dp1[idx][j] \gets dp1[idx][j] + dp1[p][j-1] \\
dp2[idx][j] \gets dp2[idx][j] + dp2[p][j-1] + dp1[p][j-1] \cdot d_i
\end{cases}
$$

第二行后一项是把 $d_i$ 加入每个旧方案带来的新贡献。

最终对每个大小 $j$，把 $dp1[m][j]$ 和 $dp2[m][j]$ 代入公式累加即可。

## Code

```cpp line-numbers
#include<bits/stdc++.h>
using namespace std;
#define int long long
const int mod=998244353;
int n,m,d[8005],f[15],dp1[8005][15],dp2[8005][15];
signed main() {
	ios::sync_with_stdio(false),cin.tie(0),cout.tie(0);
	cin>>n;
	for (int i=1;i*i<=n;i++)
		if (n%i==0) {
			d[++m]=i;
			if (i*i!=n) d[++m]=n/i;
		}
	sort(d+1,d+1+m);
	dp1[1][0]=1;
	for (int i=2;i<=m;i++)
		for (int p=upper_bound(d+1,d+1+m,n/d[i])-d-1;p>=1;p--)
			if (n%(d[i]*d[p])==0) {
				int idx=lower_bound(d+1,d+1+m,d[i]*d[p])-d;
				for (int j=1;j<=12;j++) {
					if (dp1[p][j-1]==0) continue;
					dp1[idx][j]=(dp1[idx][j]+dp1[p][j-1])%mod;
					dp2[idx][j]=(dp2[idx][j]+dp2[p][j-1]+dp1[p][j-1]*(d[i]%mod))%mod;
				}
			}
	f[0]=1;
	for (int i=1;i<=14;i++)
		f[i]=f[i-1]*i%mod;
	int ans=0;
	for (int j=0;j<=12;j++) {
		if (dp1[m][j]==0) continue;
		int t1=f[j]*(j+2)%mod*dp2[m][j]%mod;
		int t2=f[j+1]*dp1[m][j]%mod;
		ans=(ans+t1+t2)%mod;
	}
	cout<<ans;
	return 0;
}
```
