---
title: "题解：AT_abc459_c [ABC459C] Drop Blocks"
published: 2026-05-25
publishedAt: 2026-05-25T14:02:01+08:00
category: "题解"
draft: false
---

## 思路

直接暴力模拟消除显然 $O(NQ)$ 会 TLE，考虑怎么优化。

注意到消除操作本质是对所有格子整体 $-1$，没必要真的去改每个格子，维护一个全局变量 $k$ 记录总共消除了多少次即可，同时用 $cnt[x]$ 记录格子 $x$ 累计放入的块数。这样格子 $x$ 当前真实的块数就是 $cnt[x]-k$。

:::info[什么时候 $k$ 会增加？]
当所有格子的 $cnt[x]$ 都 $\ge k+1$ 时。
:::

对于操作 2，真实块数 $\ge y$ 等价于 $cnt[x] \ge y+k$，所以再维护一个桶 $sum[v]$ 表示累计放入块数 $\ge v$ 的格子数，查询的时候直接输出 $sum[y+k]$。

操作 1 时，$cnt[x]$ 加 $1$，对应 $sum[cnt[x]]$ 加 $1$，然后检查 $sum[k+1]$ 是否等于 $n$，是的话 $k$ 加一。

## Code

```cpp line-numbers
#include<bits/stdc++.h>
using namespace std;
#define int long long
int n,q,k,cnt[300005],sum[300005];
signed main() {
    ios::sync_with_stdio(false),cin.tie(0),cout.tie(0);
    cin>>n>>q;
    sum[0]=n;
    for (int i=1;i<=q;i++) {
        int op;
        cin>>op;
        if (op==1) {
            int x;
            cin>>x;
            cnt[x]++;
            sum[cnt[x]]++;
            if (sum[k+1]==n) k++;
        }
        else {
            int y;
            cin>>y;
            int tar=y+k;
            if (tar>q) cout<<"0\n";
            else cout<<sum[tar]<<'\n';
        }
    }
    return 0;
}
```
