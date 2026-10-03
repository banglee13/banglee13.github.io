---
title: "题解：AT_abc473_d [ABC473D] Coefficient Stair"
published: 2026-08-31
publishedAt: 2026-08-31T15:25:30+08:00
draft: false
---

## 思路

注意到 $1 \le N \le 10$ 且保证满足条件的序列数不超过 $3 \times 10^5$，考虑 dfs。

然后我们就可以 dfs 出每一个序列了，但是这样会 TLE，所以需要剪枝。

那么怎么剪枝呢？首先显然当 $N=1$ 时直接输出 $K$；当 $N \ge 2$ 时，枚举到第 $N-1$ 项时，我们设剩余的数值为 $r$。此时必须满足 $r-(N-1) \times A_{N-1} \ge 0$ 且 $(r-(N-1) \times A_{N-1}) \equiv 0 \pmod N$。

根据模运算的性质，$(N-1) \equiv -1 \pmod N$，因此 $A_{N-1} \equiv -r \equiv (N-(r \bmod N)) \bmod N \pmod N$。设 $start$ 为 $(N-(r \bmod N)) \bmod N$，则 $A_{N-1}$ 只需要从 $start$ 开始枚举，步长为 $N$。如果已经确定了 $A_{N-1}$，$A_N=\frac{r-(N-1)A_{N-1}}{N}$ 就也可以确定了。

## Code

```cpp
#include<bits/stdc++.h>
using namespace std;
#define int long long
int n,k,a[15];
void dfs(int p,int r) {
    if (p==n-1) {
        for (int i=(n-(r%n))%n;i*p<=r;i+=n) {
            a[n-1]=i;
            a[n]=(r-i*p)/n;
            for (int i=1;i<=n;i++)
                cout<<a[i]<<" ";
            cout<<'\n';
        }
        return;
    }
    for (int i=0;i*p<=r;i++) {
        a[p]=i;
        dfs(p+1,r-i*p);
    }
}
signed main() {
    ios::sync_with_stdio(false),cin.tie(0),cout.tie(0);
    cin>>n>>k;
    if (n==1) {
        cout<<k;
        return 0;
    }
    dfs(1,k);
    return 0;
}
```
