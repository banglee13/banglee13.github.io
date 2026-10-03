---
title: "题解：AT_jag2017summer_day1_a しりとり"
published: 2024-09-13
publishedAt: 2024-09-13T17:14:33+08:00
draft: false
---

## AT_jag2017summer_day1_a しりとり 题解
[题目传送门](https://www.luogu.com.cn/problem/AT_jag2017summer_day1_a)
## 题目解读
给定一个字母表，有 $26$ 个英文字母，~~应该不用我说了吧~~，黑猫 Snuke 在玩单人接龙游戏。

Snuke 可以使用任意长度的字母串，不一定是真正的单词。
Snuke 一共用了 $N$ 个字母串。

要求找到满足条件的最小总字母数。

## 思路
### 关键点：
- 每个单词的第一个字母必须与前一个单词的最后一个字母相同。
- 为了最小化总字母数，我们应该尽可能地重复使用字母。

### 算法：
核心思想是将输入的 $n$ 分解成不同层级的计数，每一层级代表一种字符串的组合方式。通过逐层计算并累加，最终得到满足条件的字符串总数。

当 $n$ 较小时，直接计算求和，对应着一些简单的字符串组合。

模拟一个多进制计数的过程，每一位的基数是 $26$。通过不断进位和累加，计算出不同层级的字符串数量。

## Code
```cpp
#include<bits/stdc++.h>
using namespace std;
long long n,sum,i,j;
int main(){
	cin>>n;
	if(n<53)
	{
		cout<<n*3/2;
		return 0;
	}
	for(i=26,j=1;i<=n;n-=i,i*=26,j++)
	    sum+=i*j;
	cout<<sum+n*j;
	return 0;
}
```
