---
title: "题解：AT_dwacon2018_final_b だんだん強く"
published: 2025-07-21
publishedAt: 2025-07-21T19:36:48+08:00
category: "题解"
draft: false
---

### AT_dwacon2018_final_b だんだん強く题解
[洛谷传送门](https://www.luogu.com.cn/problem/AT_dwacon2018_final_b)

[AtCoder 传送门](https://atcoder.jp/contests/dwacon2018-final/tasks/dwacon2018_final_b)

## 题目大意
有 $N$ 天，每天可以选择是否直播，直播的音量是 $v_i$。

希望选出一个子序列（不一定要连续），使得：
- 音量是严格递增的；
- 最多可以有 $K$ 次例外（也就是可以出现音量不递增的情况）

问最多能选多少天直播？

## 思路
这道题是一个 LIS（最长递增子序列）的变种。

如果用原始 LIS 的解法，时间复杂度为 $O(N^2)$，而 $1 \le N \le 10^5$，无法通过此题。

于是考虑贪心。

维护一个二维数组 $dp_{k,i}$，其中 $dp_{k,i}$ 表示使用了 $k$ 次例外机会、长度为 $i+1$ 的递增子序列的最小结尾值。

每次处理一个新值时，尝试在 $dp_k$ 中插入这个值，以维护尽可能小的结尾值，从而构造更长的递增序列。

最终答案就是所有 $dp_{k,i}$ 中最大的有效长度。

时间复杂度为 $O(nk \log n)$。

## Code
```cpp
#include <bits/stdc++.h>
using namespace std;
const int inf = 2e9;
int n, k, ans;
int v[100000];
int dp[105][100005];
signed main() {
	ios::sync_with_stdio(false);
	cin.tie(0);
	cout.tie(0);
	cin >> n >> k;
	for (int i = 0; i < n; i++)
		cin >> v[i];
	for (int i = 0; i <= n + 2; i++)
		for (int j = 0; j <= k; j++)
			dp[j][i] = inf;
	
	// 遍历每一天的音量
	for (int i = 0; i < n; i++) {
		int val = v[i];
		
		// 先处理“有例外机会”的情况
		for (int j = k; j >= 1; j--) {
			// 找 dp[j - 1] 中第一个 inf 的位置，得到当前最大长度 m
			auto p = lower_bound(dp[j - 1], dp[j - 1] + n + 1, inf);
			int m = p - dp[j - 1];
			
			// 从后往前尝试插入 val 到 dp[j] 中（用一次例外机会）
			while (m >= 0 && dp[j][m] != -1) {
				if (m == p - dp[j - 1]) {
					// 如果当前值更小，就替换它
					if (dp[j][m] > val)
						dp[j][m] = val;
				} else {
					// 否则标记为无效
					dp[j][m] = -1;
				}
				m--;
			}
		}
		// 再处理“不使用例外机会”的情况（正常递增）
		for (int j = 0; j <= k; j++) {
			// 在 dp[j] 中找第一个 >= val 的位置
			auto p = lower_bound(dp[j], dp[j] + n + 1, val);
			*p = val;
		}
	}
	for (int i = 0; i < n; i++)
		for (int j = 0; j <= k; j++)
			if (dp[j][i] != inf) ans = max(ans, i + 1);
	cout << ans << '\n';
	return 0;
}
```
