---
title: "题解：AT_abc382_c [ABC382C] Kaiten Sushi"
published: 2024-12-02
publishedAt: 2024-12-02T13:32:02+08:00
category: "题解"
draft: false
---

## AT_abc382_c [ABC382C] Kaiten Sushi 题解
[洛谷传送门](https://www.luogu.com.cn/problem/AT_abc382_c)

[AtCoder 传送门](https://atcoder.jp/contests/abc382/tasks/abc382_c)
## 思路
考虑构建一个数组 $b$，$b_x$ 表示美味程度为 $x$ 的寿司将被哪个顾客所食用。

从最高的美味程度开始，遍历所有顾客，为每个美味程度 $x$ 填入一个食用该寿司的顾客编号。

对于每位顾客 $i$，检查其美食度。如果当前美味程度 $x$ 大于等于 $a_i$，就将 $b_x$ 更新为 $i$。这样，当递减美味程度时，能够保证 $b$ 数组中存储的顾客永远是第一个能够接受该美味寿司的顾客。

时间复杂度为 $\mathcal{O}(N + M)$。
### Code
```cpp
#include<bits/stdc++.h>
using namespace std;
#define int long long
int n,m,now=200000,a[200005],b[2000005];
signed main() {
    ios::sync_with_stdio(false),cin.tie(0),cout.tie(0);
    cin>>n>>m;
    for (int i=1;i<=n;i++)
        cin>>a[i];
    memset(b,-1,sizeof(b));
    for (int i=1;i<=n;i++)
        while (now>=a[i])
            b[now--]=i;
    for (int i=1,x;i<=m;i++)
        cin>>x,cout<<b[x]<<'\n';
    return 0;
}
```
