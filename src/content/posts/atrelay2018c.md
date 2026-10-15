---
title: "题解：AT_relay2018_c 積まれた本"
published: 2024-10-31
publishedAt: 2024-10-31T17:17:35+08:00
category: "题解"
draft: false
---

## AT_relay2018_c 積まれた本 题解
[洛谷传送门](https://www.luogu.com.cn/problem/AT_relay2018_c)

[AtCoder 传送门](https://atcoder.jp/contests/cf18-relay-open/tasks/relay2018_c)

## 思路
考虑用深度优先搜索（DFS）或动态规划（DP）来解决这个问题，这篇题解介绍的是 DFS 的方法。

看题，首先应该找到可以被抽取的书，可以被抽取的书的高度应该小于等于 $H$。

在每一步，选择最上面的可以被抽取的书进行抽取。

抽取一本书后，剩下的书会下降到新的顶部。因此，需要在当前的可抽取书中进行选择，并计算不同的选择顺序。

## Code
有了以上思路，那就可以很快的写出代码了。

```cpp
#include <bits/stdc++.h>
using namespace std;
int n, h, a[15];
bool vis[15];
int dfs(int x, int d) {
    if (d == n) return 1;
    int ans = 0, height = 0;
    vis[x] = true;
    for (int i = 0; i < n; i++)
        if (!vis[i]) {
            height += a[i];
            if (height <= h) ans += dfs(i, d + 1);
            else break;
        }
    vis[x] = false;
    return ans;
}
signed main() {
    cin >> n >> h;
    for (int i = 0; i < n; i++)
        cin >> a[i];
    cout << dfs(10, 0) << '\n';
    return 0;
}
```
