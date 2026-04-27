---
title: 文章标题
date: 2026-04-27 13:43:15
tags: [搜索]
categories: [OI]
---

## 思路
注意到 $1 \le N \le 20$，考虑 dfs，每次移动有两个方向选择。

但初始位置是 $0.5$，所以可以将所有坐标乘 $2$，这样初始坐标就变成 $1$ 了。

这样时间复杂度是 $O(2^N)$。

## Code
```cpp line-numbers
#include<bits/stdc++.h>
using namespace std;
#define int long long
int n,ans,a[25];
void dfs(int i,int p,int cnt) {
    if (i==n+1) {
        ans=max(ans,cnt);
        return;
    }
    for (int d=-1;d<=1;d+=2) {
        int np=p+d*2*a[i];
        int ncnt=cnt+((p>0)!=(np>0));
        dfs(i+1,np,ncnt);
    }
}
signed main() {
    ios::sync_with_stdio(false),cin.tie(0),cout.tie(0),cout.tie(0);
    cin>>n;
    for (int i=1;i<=n;i++)
        cin>>a[i];
    dfs(1,1,0);
    cout<<ans;
    return 0;
}
```