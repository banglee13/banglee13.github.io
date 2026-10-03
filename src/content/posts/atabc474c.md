---
title: "题解：AT_abc474_c Remove and Append"
published: 2026-09-07
publishedAt: 2026-09-07T10:18:37+08:00
draft: false
---

## 思路

我们发现每次操作就是将一个数移到序列的末尾，那么对答案有影响的只可能是被操作过的数。对于没有被操作过的数，它们在整个过程中相对位置不会改变，并且最终一定排在所有被操作过的数前面，所以我们可以先输出这些数。

接下来考虑被操作过的数，一个数最后一次被操作的时间越晚，它最终就越靠后。所以，被操作过的数应该按照它们最后一次被操作的顺序输出。

## Code

```cpp 
#include<bits/stdc++.h>
using namespace std;
#define int long long
const int maxn=2e5+5;
int n,q,cnt,a[maxn],b[maxn],c[maxn];
bool vis[maxn];
signed main() {
    ios::sync_with_stdio(false),cin.tie(0),cout.tie(0);
    cin>>n>>q;
    for (int i=1;i<=n;i++)
        cin>>a[i];
    for (int i=1;i<=q;i++)
        cin>>b[i];
    for (int i=q;i>=1;i--)
        if (!vis[b[i]]) vis[b[i]]=true,c[++cnt]=b[i];
    for (int i=1;i<=n;i++)
        if (!vis[a[i]]) cout<<a[i]<<" ";
    for (int i=cnt;i>=1;i--)
        cout<<c[i]<<" ";
    return 0;
}
```
