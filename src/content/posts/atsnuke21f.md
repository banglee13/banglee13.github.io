---
title: "题解：AT_snuke21_f Lake"
published: 2025-04-06
publishedAt: 2025-04-06T16:20:45+08:00
category: "题解"
draft: false
---

## AT_snuke21_f Lake 题解
[洛谷传送门](https://www.luogu.com.cn/problem/AT_snuke21_f)

[AtCoder 传送门](https://atcoder.jp/contests/snuke21/tasks/snuke21_f)

## 思路
**形式化**题意：在湖边上新增 $k$ 个赛艇码头，使得湖边上任意两点间移动所花费的最长时间达到最小。

所以考虑二分查找。

用一个 `check` 函数来判断是否可以通过新增 $k$ 个码头，让所有相邻码头间的距离都不超过 $mid$。

对于每个相邻码头间的距离 $a_i$，计算在这个距离内最多能插入多少个码头，然后将这些数量累加起来。若累加值不超过 $k$，则说明可以通过新增 $k$ 个码头让所有相邻码头间的距离都不超过 $x$。

记得保留 $12$ 位小数。
## Code
```cpp
#include<bits/stdc++.h>
using namespace std;
#define int long long
#define db long double
int l, n, k, a[100005];
bool check(db x, int c) {
	for (int i = 1; i <= n; i++)
		c -= floor(a[i] / x);
	return c >= 0;
}
db solve(int x) {
	db l = 1e-10, r = 1e10;
	for (int i = 1; i <= 100; i++) {
		db mid = (l + r) / 2;
		if (check(mid, x)) r = mid;
		else l = mid;
	}
	return l;
}
signed main() {
	ios::sync_with_stdio(false), cin.tie(0), cout.tie(0);
	cin >> l >> n >> k;
	a[n] = l;
	for (int i = 0; i < n; i++)
		cin >> a[i];
	for (int i = n; i >= 1; i--)
		a[i] -= a[i - 1];
	db t = solve(k + 1), r = 1e9;
	for (int i = 1; i <= n; i++)
		if (a[i] > t + 1e-9) r = min(r, a[i] - .0L);
	cout << fixed << setprecision(12) << min(solve(k), (t + r) / 2);
	return 0;
}
```
