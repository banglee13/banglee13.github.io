---
title: "题解：AT_abc376_b [ABC376B] Hands on Ring (Easy)"
published: 2025-10-26
publishedAt: 2025-10-26T21:02:59+08:00
draft: false
---

### AT_abc376_b [ABC376B] Hands on Ring (Easy) 题解
[题目传送门](https://www.luogu.com.cn/problem/AT_abc376_b)

~~某区区赛 T3。~~

## 思路
观察到 $N \le 100$，考虑模拟。

一开始左手在 $1$，右手在 $2$。

每次只动一只手，根据 $H_i$ 决定动左手还是右手，另一只手保持不动。

每次移动从当前位置移动到目标位置，在环上有顺时针和逆时针两条路径，两次循环分别模拟要操作多少次，然后取两种操作数的最小值即可。

注意移动过程中不能经过另一只手当前所在的位置。
## Code
```cpp line-numbers
#include<bits/stdc++.h>
using namespace std;
#define int long long
int n,q,l=1,r=2,ans;
int cal(int cur,int end,int y) {
	int s1=0,s2=0,t=cur;
	while (t!=end) {
		t++;
		if (t>n) t=1;
		s1++;
		if (t==y) {
			s1=1e9;
			break;
		}
	}
	t=cur;
	while (t!=end) {
		t--;
		if (t<1) t=n;
		s2++;
		if (t==y) {
			s2=1e9;
			break;
		}
	}
	return min(s1,s2);
}
signed main() {
	ios::sync_with_stdio(false),cin.tie(0),cout.tie(0);
	cin>>n>>q;
	while (q--) {
		char op;
		int x;
		cin>>op>>x;
		if (op=='L') ans+=cal(l,x,r),l=x;
		else ans+=cal(r,x,l),r=x;
	}
	cout<<ans;
	return 0;
}
```

[提交记录](https://atcoder.jp/contests/abc376/submissions/70484705)
