---
title: "题解：AT_pakencamp_2021_day2_h PuraPrime"
published: 2025-03-24
publishedAt: 2025-03-24T13:57:23+08:00
category: "题解"
draft: false
---

### AT_pakencamp_2021_day2_h PuraPrime 题解
[洛谷传送门](https://www.luogu.com.cn/problem/AT_pakencamp_2021_day2_h)

[AT 传送门](https://atcoder.jp/contests/pakencamp-2021-day2/tasks/pakencamp_2021_day2_h)

搬运官方题解。
## 思路
对于所有的 $P_i$，找到能被 $P_i^{S_i}$ 整除的最小的 $N$。

显然可以用二分来做。

此时，如果即使 $N=10^{18}$，对于所有的 $P_i$，$N$ 都不能被 $P_i^{S_i}$ 整除，则输出 `-1`。

之后，只需检查所求得的值是否与条件不矛盾即可。

时间复杂度为 $O(M \log N)$。
## Code
```cpp
#include<bits/stdc++.h>
using namespace std;
#define int long long

const int inf = LLONG_MAX;
int m;
vector<int> P(100005), S(100005);

bool check1(int x) {
	for (int i = 0; i < m; i++) {
		int cnt = 0, tmp = P[i];
		while (tmp <= x) {
			cnt += x / tmp;
			if (x / P[i] >= tmp) tmp *= P[i];
			else break;
		}
		if (cnt < S[i]) return false;
	}
	return true;
}

bool check2(int x) {
	for (int i = 0; i < m; i++) {
		int cnt = 0, tmp = P[i];
		while (tmp <= x) {
			cnt += x / tmp;
			if (x / P[i] >= tmp) tmp *= P[i];
			else break;
		}
		if (cnt != S[i]) return false;
	}
	return true;
}

signed main() {
	ios::sync_with_stdio(false), cin.tie(0), cout.tie(0);
	cin >> m;
	for (int i = 0; i < m; i++)
		cin >> P[i] >> S[i];
	if (!check1(inf)) {
		cout << -1;
		return 0;
	}
	int l = 0, r = inf;
	while (l + 1 < r) {
		int mid = (l + r) / 2;
		if (check1(mid)) r = mid;
		else l = mid;
	}
	if (!check2(r)) {
		cout << -1;
		return 0;
	}
	cout << r;
	return 0;
}
```
[提交记录](https://atcoder.jp/contests/pakencamp-2021-day2/submissions/64155115)
