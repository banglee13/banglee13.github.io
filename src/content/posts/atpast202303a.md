---
title: "题解：AT_past202303_a シンプル石取りゲーム"
published: 2025-12-25
publishedAt: 2025-12-25T09:25:35+08:00
draft: false
---

### AT_past202303_a シンプル石取りゲーム 题解

[题目传送门](https://www.luogu.com.cn/problem/AT_past202303_a)

## 思路

首先考虑 $T=0$ 的情况。当 $N$ 为偶数时，后手获胜，因为后手取走了最后一块石子；而当 $N$ 为奇数时，先手获胜，因为先手取走了最后一块石子。

同样，当 $T=1$ 时，如果 $N$ 是偶数，那么先手获胜，因为后手取走了最后一块石子；如果 $N$ 是奇数，那么后手获胜，因为先手取走了最后一块石子。

那么我们只需要把每种情况输出即可。

## Code

```cpp line-numbers
#include<bits/stdc++.h>
using namespace std;
#define int long long
int n,s,t;
string fi,se;
signed main() {
	ios::sync_with_stdio(false),cin.tie(0),cout.tie(0);
	cin>>n>>s>>t;
	if (s==0) fi="Alice",se="Bob";
	else fi="Bob",se="Alice";
	if (t==0) {
		if (n%2==0) cout<<se;
		else cout<<fi;
	}
	else {
		if (n%2==0) cout<<fi;
		else cout<<se;
	}
	return 0;
}
```
