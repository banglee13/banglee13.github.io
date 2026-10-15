---
title: "题解：AT_indeednow_2015_finala_e Page Rank"
published: 2025-01-20
publishedAt: 2025-01-20T15:56:05+08:00
category: "题解"
draft: false
---

### AT_indeednow_2015_finala_e Page Rank 题解
[洛谷传送门](https://www.luogu.com.cn/problem/AT_indeednow_2015_finala_e)

[AtCoder 传送门](https://atcoder.jp/contests/indeednow-finala-open/tasks/indeednow_2015_finala_e)
## 思路
考虑构建一个有向图。

其中每个员工是一个顶点，如果员工 $a$ 认为员工 $b$ 优秀，就从顶点 $a$ 向顶点 $b$ 添加一条有向边。

通过迭代的方法来更新每个员工的 `Page Rank` 值。每个员工的能力值等于一个固定的初始值加上其认为优秀的所有员工的能力值的加权和。在这个题目中，固定的初始值是 $0.1$，权重是 $0.9$，且认为某个员工优秀的员工数量越多，该员工对被认为优秀的员工的能力值贡献越小。

在每次迭代中，遍历所有员工，根据公式计算新的 `Page Rank` 值，并用这个新值来更新旧的 `Page Rank` 值。

最终输出即可。
## Code
```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
	int n, m;
    cin >> n >> m;
	vector<int> num(n), g[n];
	for (int i=0; i<m; i++) {
		int a, b;
        cin >> a >> b;
		g[--b].emplace_back(--a);
		num[a]++;
	}
	vector<double> res(n, 1.0);
	for (int k=0; k<500; k++)
        for (int i=0; i<n; i++) {
            double t = .1;
            for (int j : g[i])
                t += .9 * res[j] / num[j];
            res[i] = t;
	    }
	for (auto x : res)
        printf("%.10f\n", x);
	return 0;
}
```
