---
title: "题解：AT_s8pc_2_b Division 2"
published: 2024-11-12
publishedAt: 2024-11-12T13:43:44+08:00
category: "题解"
draft: false
---

## AT_s8pc_2_b Division 2 题解
[洛谷传送门](https://www.luogu.com.cn/problem/AT_s8pc_2_b)

[AtCoder 传送门](https://atcoder.jp/contests/s8pc-2/tasks/s8pc_2_b)

## 思路
考虑 **DFS**。

要解决这个问题，我们需要模拟兔子对从 $1$ 到 $n$ 的所有整数进行一系列除法操作的过程。具体来说，兔子会依次用给定的数字 $a_i$ 去尝试减少所有能被这些数字整除的数。由于 $n \le 10^{13}$，直接操作每个数是不现实的，因此我们需要一个高效的递归方法来计算结果。

### 实现部分
定义一个 `dfs` 函数，函数接收两个参数：当前正在处理的操作下标 $i$ 和当前考虑的数 $now$。需要判断以下几种情况：

如果当前考虑的数 $now$ 超过了 $n$，说明这种情况下无法继续，返回 $0$。

如果没有更多的操作可以进行（即 $i \le 0$），这意味着已经处理完所有的 $a_i$，并且这个时候返回 $1$，表示这是一个有效的结束状态。

如果 $now$ 可以被当前的 $a_i$ 整除，这时我们可以选择继续将 $now$ 乘以 $a_i$，并递归调用 `dfs` 函数，继续处理下一项操作。

如果 $now$ 不能被 $a_i$ 整除，有两种选择：要么不使用当前的 $a_i$，继续进入下一个操作，要么将 $now$ 乘以 $a_i$，减少能被整除的数。

整个深搜过程将通过选择当前操作是否应用于 $now$，来累计所有可能的结果。最终的结果为所有有效状态的总和，代表最终能够得到多少个 $1$。

## Code
~~不开 `long long` 见祖宗。~~
```cpp
#include<bits/stdc++.h>
using namespace std;
#define int long long
int n,q,a[25];
int dfs(int i,int now) {
    if(now>n) return 0;
    if(i<=0) return 1;
    if(now%a[i]==0) return dfs(i-1,now*a[i]);
    return dfs(i-1,now)+dfs(i-1,now*a[i]);
}
signed main() {
    cin>>n>>q;
    for(int i=1;i<=q;i++)
        cin>>a[i];
    cout<<dfs(q,1)<<'\n';
    return 0;
}
```
