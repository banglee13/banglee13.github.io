---
title: "题解：AT_otemae2019_d FizzBuzz (FizzBuzz)"
published: 2025-04-01
publishedAt: 2025-04-01T13:55:38+08:00
category: "题解"
draft: false
---

### AT_otemae2019_d FizzBuzz (FizzBuzz) 题解
[洛谷传送门](https://www.luogu.com.cn/problem/AT_otemae2019_d)

[AtCoder 传送门](https://atcoder.jp/contests/otemae2019/tasks/otemae2019_d)
## 思路
考虑 dp。

设 $dp_{j,k}$ 表示已经处理了前 $i$ 位数字，并且已经说了 $j$ 次话，当前数字对 $15$ 取模的结果为 $k$ 的方案数。

对于每一位数字，枚举所有可能的取值 $(0-9)$，但要注意第一位不能为 $0$。

最终结果就是处理完 $N$ 位数字后，所有可能的余数状态下的方案数之和。
## Code
```cpp
#include <bits/stdc++.h>
#include <atcoder/all>
using namespace std;
using namespace atcoder;

using mint17 = modint1000000007;

int main() {
	int n, m;
	cin >> n >> m;
	vector<string> s(m);
	for (string &i : s) cin >> i;
	vector dp(m + 1, vector<mint17>(15));
	dp[0][0] = 1;
	for (int i = 0; i < n; i++) {
		vector ndp(m + 1, vector<mint17>(15));
		for (int j = 0; j <= m; j++)
			for (int k = 0; k < 15; k++)
				for (int l = 0; l < 10; l++) {
					if (i == 0 && l == 0) continue;
					int nxt = (k * 10 + l) % 15;
					if (nxt == 0) {
						if (j < m && s[j] == "FizzBuzz") ndp[j + 1][nxt] += dp[j][k];
					}
					else if (nxt % 3 == 0) {
						if (j < m && s[j] == "Fizz") ndp[j + 1][nxt] += dp[j][k];
					}
					else if (nxt % 5 == 0) {
						if (j < m && s[j] == "Buzz") ndp[j + 1][nxt] += dp[j][k];
					}
					else {
						ndp[j][nxt] += dp[j][k];
					}
				}
		swap(dp, ndp);
	}
	mint17 ans = 0;
	for (int i = 0; i < 15; i++)
		ans += dp.back()[i];
	cout << ans.val() << '\n';
	return 0;
}
```
[提交记录](https://atcoder.jp/contests/otemae2019/submissions/64410442)
