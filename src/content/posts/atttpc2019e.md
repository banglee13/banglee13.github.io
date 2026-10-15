---
title: "题解：AT_ttpc2019_e N法陣"
published: 2024-12-20
publishedAt: 2024-12-20T13:59:21+08:00
category: "题解"
draft: false
---

## AT_ttpc2019_e N法陣 题解
[洛谷传送门](https://www.luogu.com.cn/problem/AT_ttpc2019_e)

[AtCoder 传送门](https://atcoder.jp/contests/ttpc2019/tasks/ttpc2019_e)
## 思路
考虑构建一个 $N \times N$ 的方阵，使其满足以下几个条件：使用的数字为 $1$ 到 $N^2$，没有重复数字，同时每行和每列的数字之和模 $N$ 的结果各不相同。

发现当 $N$ 是偶数时，无法构造出满足条件的方阵。为了理解原因，可以考虑每行和每列的和模 $N$ 的结果需要是不同的。那么如果是偶数，就存在 $N$ 个不同的余数，但是每个余数的组合在行和列上可能会产生冲突。因此，对于偶数的 $N$，我们直接输出 `No`。

当 $N$ 是奇数时，可以构建出合适的矩阵。可以将数填入方阵的对角线和其他位置，确保每个位置都用到并且所用数字独一无二。

对于每个点 $c_{i,j}$，当 $i$ 等于 $j$（主对角线），填入 $(n-i-1) \times (n+1)+1$ 来确保对角线上的数字与其他位置的不同。

最终输出就可以了。
## Code
```cpp
#include<bits/stdc++.h>
using namespace std;
#define int long long
int n;
signed main() {
    ios::sync_with_stdio(!(cin.tie(0) && cout.tie(0)));
    cin >> n;
    if (n % 2) {
        cout << "Yes\n";
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++) {
                if (i == j) cout << (n - i - 1) * (n + 1) + 1 << " \n"[j == n - 1];
                else cout << i * n + j + 1 << " \n"[j == n - 1];
            }
    }
    else cout << "No\n";
    return 0;
}
```
