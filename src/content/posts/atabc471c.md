---
title: "题解：AT_abc471_c [ABC471C] Cookies and Greedy Takahashi"
published: 2026-08-16
publishedAt: 2026-08-16T08:34:59+08:00
draft: false
---

## 思路

考虑用一个 `set` 维护所有还没有被拾取的饼干坐标。

设当前位于 $cur$，那么我们可以用 `lower_bound` 找到右侧最近的饼干，它的前一个位置就是左侧最近的饼干。根据题意，比较两者的距离，如果距离相同就取左侧饼干。然后把取的饼干删除并更新当前位置即可。

## Code

```cpp
#include<bits/stdc++.h>
using namespace std;
#define int long long
int n,cur,ans;
set<int> a;
signed main() {
    ios::sync_with_stdio(false),cin.tie(0),cout.tie(0);
    cin>>n;
    for (int i=1,x;i<=n;i++)
        cin>>x,a.insert(x);
    while (!a.empty()) {
        auto r=a.lower_bound(cur);
        int nxt;
        if (r==a.begin()) nxt=*r;
        else if (r==a.end()) r--,nxt=*r;
        else {
            auto l=r;
            l--;
            if (cur-*l<=*r-cur) nxt=*l;
            else nxt=*r;
        }
        ans+=abs(nxt-cur);
        cur=nxt;
        a.erase(cur);
    }
    cout<<ans;
    return 0;
}
```
