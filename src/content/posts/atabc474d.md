---
title: "题解：AT_abc474_d [ABC474D] Outweigh"
published: 2026-09-07
publishedAt: 2026-09-07T16:09:50+08:00
category: "题解"
draft: false
---

简单题。

## 思路

根据题意，我们要构造一个序列 $W$，使得：

$$
\sum_{i=1}^{N}a_iW_i>\sum_{i=1}^{N}b_iW_i
$$

转化一下可以得到：

$$
\sum_{i=1}^{N}(a_i-b_i)W_i>0
$$

那么我们可以贪心地想，只要有任意一个 $i$ 满足 $a_i-b_i>0$，我们就可以令这个 $W_i$ 非常大，这样就保证有解了；其他的 $W_i$ 就可以任意输出一个较小的数，保证让负贡献不超过正贡献即可。

那么无解的情况就是没有一个 $i$ 能满足 $a_i-b_i>0$。

## Code

```cpp
#include<bits/stdc++.h>
using namespace std;
#define int long long
const int maxn=1e5+5;
int n,p=-1,a[maxn],b[maxn];
signed main() {
    ios::sync_with_stdio(false),cin.tie(0),cout.tie(0);
    cin>>n;
    for (int i=1;i<=n;i++)
        cin>>a[i];
    for (int i=1;i<=n;i++)
        cin>>b[i];
    for (int i=1;i<=n;i++)
        if (a[i]>b[i]) {
            p=i;
            break;
        }
    if (p==-1) cout<<"No";
    else {
        cout<<"Yes\n";
        for (int i=1;i<=n;i++)
            cout<<(i==p ? 1000000000000000 : 1)<<" ";
    }
    return 0;
}
```
