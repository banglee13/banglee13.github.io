---
title: "题解：AT_abc473_e [ABC473E] K-Divisible Subarrays"
published: 2026-08-31
publishedAt: 2026-08-31T15:26:12+08:00
category: "题解"
draft: false
---

这题和 P14359 是类似的吧。~~场上被这道题撞飞了记忆深刻。~~

这 trick 我已经不知道见过几遍了。

## 思路

设 $S_i=(\sum_{j=1}^i A_j) \bmod K$，其中 $S_0=0$。那么当 $S_l=S_r$ 时区间 $A_{l+1},A_{l+2},\ldots,A_r$ 的和是 $K$ 的倍数。

于是问题转化为：在 $S_0,S_1,\ldots,S_N$ 中选出尽量多组两两不相交、且 $l<r$ 的 $(l,r)$，满足 $S_l=S_r$，最大化能选出的组数。

这就是一个经典贪心了，我们从左往右扫描 $r=1,2,\ldots,N$，只要当前的 $S_r$ 在“上一次选完之后”出现过的 $S$ 值里能找到相同的，就立刻选上这一段，答案加一。

:::success[为什么这样贪心是对的]
提前结束当前这一段剩下能选的区间只会更多、不会更少，所以能选就选、选得越早越好，这样得到的结果不会比其他任何方案差。
:::

选上一段之后，这一段内部记录过的 $S$ 值都不能再拿来配对了（再用就会和刚选的这段重叠），所以要清空之前记录的集合，只留下当前的 $S_r$，作为下一段的起点继续往后记录。

当前段内出现过的所有前缀和用一个 `set` 维护即可。

时间复杂度为 $O(N \log N)$。

## Code

```cpp
#include<bits/stdc++.h>
using namespace std;
#define int long long
int n,k,sum,ans,a[200005];
set<int> s;
signed main() {
    ios::sync_with_stdio(false),cin.tie(0),cout.tie(0);
    cin>>n>>k;
    for (int i=1;i<=n;i++)
        cin>>a[i];
    s.insert(0);
    for (int i=1;i<=n;i++) {
        sum=(sum+a[i])%k;
        if (s.count(sum)) ans++,s.clear();
        s.insert(sum);
    }
    cout<<ans;
    return 0;
}
```
