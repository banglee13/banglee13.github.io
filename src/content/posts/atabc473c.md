---
title: "题解：AT_abc473_c [ABC473C] Change Schools"
published: 2026-08-31
publishedAt: 2026-08-31T15:25:12+08:00
category: "题解"
draft: false
---

## 思路

考虑用一个数组 $cnt$ 去统计第 $i$ 个班级有多少名学生，那么如果当高桥选择第 $i$ 个班时，第 $i$ 个班的人数就会变为 $cnt_i+1$ 人。

当 $\max cnt \le cnt_i+1$ 时，说明没有班级的人数比高桥所在的班级人数多了，此时高桥会感到高兴；反之，高桥会感到难过。

## Code

```cpp
#include<bits/stdc++.h>
using namespace std;
#define int long long
int n,k,mx,ans,a[200005];
signed main() {
    ios::sync_with_stdio(false),cin.tie(0),cout.tie(0);
    cin>>n>>k;
    for (int i=1,x;i<=n;i++)
        cin>>x,a[x]++,mx=max(mx,a[x]);
    for (int i=1;i<=k;i++)
        if (a[i]+1>=mx) ans++;
    cout<<ans;
    return 0;
}
```
