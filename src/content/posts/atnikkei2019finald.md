---
title: "题解：AT_nikkei2019_final_d Deforestation"
published: 2024-10-29
publishedAt: 2024-10-29T17:54:22+08:00
category: "题解"
draft: false
---

## AT_nikkei2019_final_d Deforestation 题解
[洛谷传送门](https://www.luogu.com.cn/problem/AT_nikkei2019_final_d)

[AtCoder 传送门](https://atcoder.jp/contests/nikkei2019-final/tasks/nikkei2019_final_d)

## 思路
考虑从后往前遍历每个砍伐事件，并决定每个竹子在该时间之前的最大高度。

如果 $l_i$ 和 $r_i$ 在同一块内，直接遍历更新；如果在不同块内，分别处理块边界的竹子。

可以用两个数组分别记录每个竹子的生长时间及其在某一时间内的最大高度。

最后，遍历所有竹子的高度，计算它们在每次砍伐后的最大得分总和就是答案了。

## 优化
考虑通过平方根分块的方法来加速处理。在 $O(\sqrt n)$ 的块内更新砍伐事件，以减少时间复杂度。

## Code
既然楼上用了 `set`，那我就用 `vector` 吧。
```cpp
#include <bits/stdc++.h>
using namespace std;

signed main() {
    ios::sync_with_stdio(false), cin.tie(0), cout.tie(0);

    int n, m;
    cin >> n >> m;

    vector<int> t(m), l(m), r(m);
    for (int i = 0; i < m; i++) {
        cin >> t[i] >> l[i] >> r[i];
        l[i]--, r[i]--;
    }

    vector<int> G(n), I(n);
    const int B = sqrt(n);  //优化

    for (int i = m - 1; i >= 0; i--) {
        int li = l[i] / B, ri = r[i] / B;
        if (li == ri)
            for (int j = l[i]; j <= r[i]; j++)
                I[j] = max(I[j], t[i]);
        else {
            for (int j = li + 1; j <= ri - 1; j++)
                G[j] = max(G[j], t[i]);
            for (int j = l[i]; j < B * (li + 1); j++)
                I[j] = max(I[j], t[i]);
            for (int j = B * ri; j <= r[i]; j++)
                I[j] = max(I[j], t[i]);
        }
    }

    long long ans = 0;
    for (int i = 0; i < n; i++)
        ans += max(G[i / B], I[i]);
    cout << ans << '\n';
    return 0;
}
```
