---
title: "题解：AT_abc460_c [ABC460C] Sushi"
published: 2026-05-31
publishedAt: 2026-05-31T14:14:37+08:00
category: "题解"
draft: false
---

## 思路

将 $A$ 和 $B$ 分别排序后，贪心双指针。

用指针 $i$ 扫寿司饭，$j$ 扫配料。若 $B_j \le 2A_i$，则配对成功，两个指针同时右移；否则当前 $A_i$ 太轻，$i$ 右移换更重的寿司饭。

::::success[正确性]{open}
当 $B_j>2A_i$ 时，$A_i$ 连当前最轻的配料 $B_j$ 都配不上，更配不上更重的，所以直接跳过 $A_i$。$B_j$ 如果能配上 $A_i$，用 $A_i$ 而不是更重的寿司饭来配，不会更差。
::::

## Code

```cpp line-numbers
#include<bits/stdc++.h>
using namespace std;
#define int long long
int n,m,a[200005],b[200005];
signed main() {
	ios::sync_with_stdio(false),cin.tie(0),cout.tie(0);
	cin>>n>>m;
	for (int i=1;i<=n;i++)
		cin>>a[i];
	for (int i=1;i<=m;i++)
		cin>>b[i];
	sort(a+1,a+1+n);
	sort(b+1,b+1+m);
	int i=1,j=1,ans=0;
	while (i<=n && j<=m) {
		if (b[j]<=2*a[i]) ans++,i++,j++;
		else i++;
	}
	cout<<ans;
	return 0;
}
```
