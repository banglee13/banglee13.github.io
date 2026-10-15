---
title: "题解：AT_abc474_e One Time Coupon"
published: 2026-09-09
publishedAt: 2026-09-09T15:38:35+08:00
category: "题解"
draft: false
---

## 思路

首先我们考虑将这个问题转化一下，我们设其中的 $k$ 件商品是使用优惠券的，$S$ 表示用券集合，那么我们就可以得到基础花费：

$$
\sum_{i=1}^N A_i - \sum_{i \in S} (A_i-B_i)
$$

然后我们要让这个基础花费尽量的小，即让 $\sum_{i \in S} (A_i-B_i)$ 尽量的大，那么我们就可以按照 $A_i-B_i$ 排序，固定 $k$ 之后，前 $k$ 个商品用优惠券就一定是最优的。

那么此时，这 $N$ 件商品本身就能产生 $N-k$ 张优惠券，但是我们又用了 $k$ 张优惠券，这样有可能就会导致不够优惠券用，即 $k>N-k$ 的情况。这时，我们就要刷券，那么最优方案就是以 $\min A$ 的价格补上 $2k-N$ 张优惠券。

那么我们可以枚举最终用了多少张优惠券，最终答案就是：

$$
\sum_{i=1}^N A_i - \sum_{i \in S} (A_i-B_i)+[k>N-k] (2k-N) \times \min A
$$

## Code

```cpp
#include<bits/stdc++.h>
using namespace std;
#define int long long
const int maxn=2e5+5;
int T,a[maxn],b[maxn],c[maxn];
signed main() {
    ios::sync_with_stdio(false),cin.tie(0),cout.tie(0);
    cin>>T;
    while (T--) {
        int n,suma=0,mina=1e18;
        cin>>n;
        for (int i=1;i<=n;i++) {
            cin>>a[i]>>b[i];
            c[i]=a[i]-b[i];
            suma+=a[i];
            mina=min(mina,a[i]);
        }
        sort(c+1,c+1+n,greater<int>());
        int sumc=0,ans=1e18;
        for (int k=0;k<=n;k++) {
            sumc+=c[k];
            ans=min(ans,suma-sumc+(k>n-k ? (2*k-n)*mina : 0));
        }
        cout<<ans<<'\n';
    }
    return 0;
}
```
