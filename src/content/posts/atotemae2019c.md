---
title: "题解：AT_otemae2019_c カード並べ 2 (Arranging Card 2)"
published: 2024-11-20
publishedAt: 2024-11-20T14:01:29+08:00
draft: false
---

### AT_otemae2019_c カード並べ 2 (Arranging Card 2) 题解
[洛谷传送门](https://www.luogu.com.cn/problem/AT_otemae2019_c)

[AtCoder 传送门](https://atcoder.jp/contests/otemae2019/tasks/otemae2019_c)
### 思路
为了解决这个问题，需要计算对于给定的两组卡片，如何在每一轮中调用第一个组的前 $i$ 张卡片的数列时，第二组卡片的排列能够最大化数列的连续出现次数。

考虑如何利用组 $B$ 中的元素去最大化匹配到组 $A$ 的前 $i$ 张卡片。

用下标计数统计出 $C_i$ 在 $B$ 中的最大出现次数在一个哈希表中（例如 `map`）。接下来，逐步构建 $C_i$ 数列，每次搜索 $C_i$ 中的数字在 $B$ 中的对应频率。

在计算每个 $C_i$ 的最大出现次数时，检查组成 $C_i$ 的每个元素在 $B$ 中的总数量，然后根据 $B$ 中这些元素的频率，利用最小频率原则来判定 $C_i$ 作为一个整体能够在 $B$ 中出现的次数。即，$C_i$ 的出现次数等于 $B$ 中与 $C_i$ 中元素对应的频率的最小值除以 $C_i$ 中对应元素的数量。

最后输出当前的最小出现次数即可。

时间复杂度为 $O(N)$。
### Code
```cpp
#include <bits/stdc++.h>
using namespace std;
#define int long long
int n, a[100005], minn = INT_MAX;
map<int,int> m, m2;
signed main() {
    ios::sync_with_stdio(false), cin.tie(0), cout.tie(0);
    cin >> n;
    for (int i = 1; i <= n; i++)
        cin >> a[i];
    for (int i = 1, x; i <= n; i++)
        cin >> x, m[x]++;
    for (int i = 1; i <= n; i++) {
        m2[a[i]]++, minn = min(minn, m[a[i]] / m2[a[i]]);
        cout << minn << '\n';
    }
    return 0;
}
```
