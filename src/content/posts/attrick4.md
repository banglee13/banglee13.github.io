---
title: "题解：AT_tricky_4 高橋くんレーシング"
published: 2025-04-25
publishedAt: 2025-04-25T13:26:19+08:00
draft: false
---

## AT_tricky_4 高橋くんレーシング 题解
[洛谷传送门](https://www.luogu.com.cn/problem/AT_tricky_4)

[AtCoder 传送门](https://atcoder.jp/contests/tricky/tasks/tricky_4)

## 思路
一道多种算法结合的好题。

用 $mp$ 来记录每个选手的编号，给每个选手分配编号，将选手名字映射到一个唯一的整数编号。

对于每一条超车记录，如果超车的选手和被超车的选手是同一个人，返回 `false`，表示记录矛盾。

如果是高桥超车或被超车，根据情况更新高桥选手的排名，如果更新后的排名超出了合法范围，那么也返回 `false`。

那么如何处理超车的选手和被超车的选手之间的顺序关系呢？很简单，用一个并查集维护即可。

最后用 dp 判断是否存在一种排列方式，使高桥前面的选手数量和后面的选手数量都在合法范围内。

**坑点：** 记得要处理好顺序词，~~根据小学知识得到~~ `1st, 2nd, 3rd`。
## Code
```cpp
#include <bits/stdc++.h>
using namespace std;

int in() {
	int x;
	scanf("%d", &x);
	return x;
}

typedef unsigned long long UInt;

UInt atoull(const char *s) {
	UInt ret = 0;
	for (; *s && isdigit(*s); ++s) {
		ret = ret * 10 + (*s - '0');
	}
	return ret;
}
const char *suffix(UInt t) {
	if (t % 100 == 11) return "th";
	if (t % 100 == 12) return "th";
	if (t % 100 == 13) return "th";
	if (t % 10 == 1) return "st";
	if (t % 10 == 2) return "nd";
	if (t % 10 == 3) return "rd";
	return "th";
}

int M;
map<string, int> mp;

int getRacer(const string &name) {
	if (!mp.count(name)) return (mp[name] = M++);
	return mp[name];
}

const int maxn = 800010;

int fa[maxn];
int find(int u) {
	return (fa[u] < 0) ? u : (fa[u] = find(fa[u]));
}
bool merge(int u, int v) {
	u = find(u);
	v = find(v);
	if (u == v) return 0;
	if (fa[u] > fa[v]) swap(u, v);
	fa[u] += fa[v];
	fa[v] = u;
	return 1;
}

UInt N, S;
int R;
int A[maxn], B[maxn];
int pre[maxn], nxt[maxn];

int cnt[maxn];
bool dp[maxn];

bool solve(UInt &place) {
	int i;

	memset(fa, ~0, M * 4);
	memset(pre, ~0, M * 4);
	memset(nxt, ~0, M * 4);

	place = S;
	for (i = 0; i < R; ++i) {
		if (A[i] == B[i]) return 0;
		if (A[i] == 0) {
			if (place == 1) return 0;
			--place;
		}
		if (B[i] == 0) {
			if (place == N) return 0;
			++place;
		}
		if (!~pre[A[i]] && !~nxt[B[i]]) {
			if (!merge(A[i], B[i])) return 0;
			pre[A[i]] = B[i], nxt[B[i]] = A[i];
		}
		if (pre[A[i]] != B[i] || nxt[B[i]] != A[i]) return 0;
		int na = nxt[A[i]];
		int pb = pre[B[i]];
		pre[A[i]] = pb;
		nxt[A[i]] = B[i];
		pre[B[i]] = A[i];
		nxt[B[i]] = na;
		if (~pb) nxt[pb] = A[i];
		if (~na) pre[na] = B[i];
	}
	int u;
	int r = find(0);
	int head = (int)min(place - 1, (UInt)M * 2);
	int tail = (int)min(N - place, (UInt)M * 2);
	for (u = 0; ~(u = pre[u]); --head);
	for (u = 0; ~(u = nxt[u]); --tail);
	memset(cnt, 0, (M + 1) * 4);
	int total = 0;
	for (u = 0; u < M; ++u)
		if (fa[u] < 0 && u != r) ++cnt[-fa[u]], total += -fa[u];
	memset(dp, 0, M + 1);
	dp[0] = 1;
	int c, y;
	for (c = 1; c <= M; ++c)
		if (cnt[c]) {
			int lot = cnt[c];
			for (int l = 1; l < lot; l <<= 1) {
				int w = c * l;
				for (y = M; y >= w; --y)
					if (dp[y - w]) dp[y] = 1;
				lot -= l;
			}
			int w = c * lot;
			for (y = M; y >= w; --y)
				if (dp[y - w]) dp[y] = 1;
		}
	for (y = 0; y <= M; ++y)
		if (dp[y] && y <= head && total - y <= tail) return 1;
	return 0;
}
signed main() {
	char buf[110];
	int T;
	cin >> T;
	while (T--) {
		scanf("%llu%d", &N, &R);
		scanf("%*s%*s%*s%s%*s", buf);
		S = atoull(buf);
		M = 0;
		mp.clear();
		getRacer("Takahashi");
		for (int i = 0; i < R; ++i) {
			scanf("%s", buf);
			A[i] = getRacer(buf);
			scanf("%s", buf);
			scanf("%s", buf);
			B[i] = getRacer(buf);
		}
		UInt t;
		if (solve(t)) printf("Takahashi might get the %llu%s place\n", t, suffix(t));
		else puts("The memo must be wrong");
	}
	return 0;
}
```
[提交记录](https://atcoder.jp/contests/tricky/submissions/65182502)
