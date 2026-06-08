---
title: ABC457F Second Gap
date: 2026-05-11 13:27
tags: [动态规划,排列计数,双指针]
categories: [OI,AtCoder]
---

## 思路

注意到 $D_i$ 的限制很严，考虑对后缀最值的位置 dp。

设 $dp_i$ 为后缀中两个最值里，较左的那个恰好在位置 $i$ 的方案数，另一个最值就固定在 $y=i+D_i$。

讨论转移。$P_i$ 被移出后，$y$ 升为最大值，新的次大值在 $z=y \pm D_{i+1}$，令 $nxt=\min(y,z)$。从 $i+1$ 到 $nxt$ 这段区间，两个最值位置不变，所以这段 $D$ 值必须全相等，预处理 $r_k$ 表示从 $k$ 开始 $D$ 连续相等的最右端点，这样 $O(1)$ 就能判断合法性。

合法时，剩余 $N-i-1$ 个值里要选 $nxt-i-1$ 个排在中间，系数就是排列数 $\frac{(N-i-1)!}{(N-nxt)!}$。维护前缀积 $pre$ 及其逆元即可 $O(1)$ 算出。

初始化时，枚举第一对最值中较左的位置 $i$（其中 $r_1 \ge i$，不然答案不合法），贡献 $2 \cdot pre_{i-1}$（两个最值谁大谁小各一种）。

答案为 $dp_{n-1}$，总时间复杂度 $O(N)$。

## Code
```cpp line-numbers
#include<bits/stdc++.h>
using namespace std;
#define int long long
const int mod=998244353;
int qpow(int a,int b) {
	int res=1;
	while (b) {
		if (b&1) res=res*a%mod;
		a=a*a%mod,b>>=1;
	}
	return res;
}
int n,a[200005],r[200005],pre[200005],inv[200005],dp[200005];
signed main() {
	ios::sync_with_stdio(false),cin.tie(0),cout.tie(0);
	cin>>n;
	for (int i=1;i<n;i++)
		cin>>a[i];
		
	//r[i] 预处理从 i 开始连续相等的 D 数组的最右端点
	for (int i=n-1;i>=1;i--) {
		if (i==n-1 || a[i]!=a[i+1]) r[i]=i;
		else r[i]=r[i+1];
	}
	
	//pre[i] 计算排列数的分子部分前缀积
	pre[0]=inv[0]=1;
	for (int i=1;i<n;i++)
		pre[i]=pre[i-1]*(n-i-1)%mod,inv[i]=qpow(pre[i],mod-2);
		
	//枚举第一对最值出现的较左位置
	for (int i=1;i<=n-a[1];i++)
		if (r[1]>=i) dp[i]=2*pre[i-1]%mod;
		
	// 状态转移
	for (int i=1;i<=n-2;i++) {
		if (dp[i]==0) continue;
		int y=i+a[i];
		int op[2]={y+a[i+1],y-a[i+1]};
		for (int z:op)
			if (z>=i+1 && z<=n && z!=y) {
				int nxt=min(y,z);
				if (r[i+1]>=nxt) {
					int w=pre[nxt-1]*inv[i]%mod;
					dp[nxt]=(dp[nxt]+dp[i]*w)%mod;
				}
			}
	}
	cout<<dp[n-1];
	return 0;
}
```