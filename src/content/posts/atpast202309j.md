---
title: "题解：AT_past202309_j 除夜の鐘"
published: 2026-05-15
publishedAt: 2026-05-15T13:23:13+08:00
draft: false
---

## 思路

根据题意，$A_i-A_j$ 一定是 $d$ 的倍数，即 $d$ 必须是所有相邻项差值的最大公约数 $g=\gcd(A_2-A_1,A_3-A_2,\ldots,A_K-A_{K-1})$ 的因子。

$N$ 次钟声的区间总长度为 $(N-1) \cdot d$。要让这 $N$ 次钟声能够完整覆盖到高桥听到的最早时刻和最晚时刻，即 $A_1$ 和 $A_K$，必须满足：

$$
(N-1) \cdot d \ge A_K-A_1
$$

由此可得 $d$ 的下界：

$$
d \ge \lceil \frac{A_K-A_1}{N-1} \rceil
$$

于是，先 $O(K)$ 求出 $g$ 的值，再 $O(\sqrt{g})$ 枚举 $g$ 的所有因子，筛选出满足下界的因子并排序输出即可。

## Code

```cpp line-numbers
#include<bits/stdc++.h>
using namespace std;
#define int long long
int n,k,a[200005];
vector<int> ans;
signed main() {
	ios::sync_with_stdio(false),cin.tie(0),cout.tie(0);
	cin>>n>>k;
	for (int i=1;i<=k;i++)
		cin>>a[i];
	int g=0;
	for (int i=1;i<k;i++)
		g=__gcd(g,a[i+1]-a[i]);
	int mind=ceil((a[k]-a[1])*1.0/(n-1));
	for (int i=1;i*i<=g;i++)
		if (g%i==0) {
			if (i>=mind) ans.push_back(i);
			if (i*i!=g && g/i>=mind) ans.push_back(g/i);
		}
	sort(ans.begin(),ans.end());
	cout<<ans.size()<<'\n';
	for (int x:ans)
		cout<<x<<" ";
	return 0;
}

```
