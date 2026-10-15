---
title: "题解：AT_pakencamp_2021_day2_g 進撃のパ研"
published: 2024-10-31
publishedAt: 2024-10-31T17:46:13+08:00
category: "题解"
draft: false
---

## AT_pakencamp_2021_day2_g 進撃のパ研
[洛谷传送门](https://www.luogu.com.cn/problem/AT_pakencamp_2021_day2_g)

[AtCoder 传送门](https://atcoder.jp/contests/pakencamp-2021-day2/tasks/pakencamp_2021_day2_g)

## 前置知识
`__builtin_popcount()` 可以返回输入数据中二进制中 $1$ 的个数。

对于不同的使用类型，可以采用采用以下函数：

```cpp
__builtin_popcount = int
__builtin_popcountl = long int
__builtin_popcountll = long long
```

ps：参考了 dlvector 大佬的[博客](https://blog.csdn.net/github_38148039/article/details/109598368)。
## 思路
考虑动态规划。

$dp_x$ 表示状态 $x$ 下的最大欣喜值。

设位掩码 $x$ 表示哪些房间已作为研究室（包括初始状态）。

从 $x$ 考虑可以加入的新房间 $j$。

新房间 $j$ 必须与当前已是研究室的房间相连。

更新到新状态 `next_x = x | (1 << (j - 1))`，即将房间 $j$ 加入。

时间复杂度为 $O(2^N \times N)$。
## Code
```cpp
#include <bits/stdc++.h>
using namespace std;

const int inf = 1001001001;
int n, m, dp[1 << 15];

signed main() {
    cin >> n >> m;
    vector<int> nxt(n);
    for (int i = 0, u, v; i < m; i++) {
        cin >> u >> v;
        u--, v--;
        nxt[u] |= (1 << v), nxt[v] |= (1 << u);
    }
    vector<vector<int>> a(n, vector<int>(n));
    for (int i = 1; i < n; i++)
        for (int j = 0; j < n; j++)
            cin >> a[i][j];
    for (int i = 0; i < (1 << n); i++)
        dp[i] = -inf;
    dp[1] = 0;
    for (int i = 1; i < (1 << n); i++) {
        int day = __builtin_popcount(i), tmp = 0;
        for (int j = 0; j < n; j++)
            if (1 & (i >> j)) tmp |= nxt[j];
        for (int j = 0; j < n; j++)
            if ((1 & (tmp >> j)) && !(1 & (i >> j))) dp[i | (1 << j)] = max(dp[i | (1 << j)], dp[i] + a[day][j]);
    }
    cout << dp[(1 << n) - 1] << '\n';
    return 0;
}
```
