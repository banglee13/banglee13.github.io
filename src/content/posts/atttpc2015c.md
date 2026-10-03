---
title: "题解：AT_ttpc2015_c おおおかやま"
published: 2025-11-10
publishedAt: 2025-11-10T13:01:30+08:00
draft: false
---

### AT_ttpc2015_c おおおかやま 题解  
[题目传送门](https://www.luogu.com.cn/problem/AT_ttpc2015_c)

## 思路
模拟。

1. 查找最长且最左的好字符串子串：
   - 遍历字符串，找到连续的 `o` 段；
   - 如果该段长度大于等于 $3$，并且后面是 `kayama`，则构成一个好字符串；
   - 记录最长、最靠左的一个字串。
2. 对好字符串 $t$ 反复进行操作：
   - 步骤 $1$：如果 $t$ 中有 `oo`，将最左边的 `oo` 替换为 `O`；
   - 步骤 $2$：紧接着，如果 $t$ 中有 `OO`，将最左边的 `OO` 替换为 `o`；
   - 重复 $1,2$ 步骤，直到 $t$ 中不再包含 `oo`，此时 $t$ 处理完毕。

3. 将变换后的 $t$ 替换回原字符串，然后重新开始整个查找过程（因为替换可能产生新的好字符串，也可能破坏旧的）。

当字符串中不再存在任何好字符串时，退出循环并输出即可。

:::warning[注意]{open}
每次只能处理**一个**好字符串，处理完后必须**从头重新扫描**整个字符串。
:::

## Code

```cpp line-numbers
#include<bits/stdc++.h>
using namespace std;
#define int long long
string s;
signed main() {
	ios::sync_with_stdio(false),cin.tie(0),cout.tie(0);
	cin>>s;
	// 只要还能找到“好字符串”，就继续处理
	while (true) {
		int maxl=0;               // 当前找到的最长好字符串的长度
		int l=string::npos;    // 最长好字符串的起始位置
		// 寻找所有可能的好字符串
		for (int i=0;i<s.length();i++) {
			if (s[i]=='o') {
				// 找出从位置 i 开始的连续 'o' 的结束位置 j
				int j=i;
				while (j<s.length() && s[j]=='o')
					j++;
				// 连续 o 的个数为 j - i
				if (j-i>=3 && j+6<=s.length() && s.substr(j,6)=="kayama") {
					int len=(j-i)+6;  // 整个好字符串的长度 = o 的个数+"kayama" 的 6 个字符
					if (len>maxl) {
						maxl=len;  // 更新最长长度
						l=i;       // 记录起始位置
					}
				}
			}
		}
		// 如果没有找到任何好字符串
		if (l==string::npos) break;
		// 找到的最长且最靠左的好字符串
		string t=s.substr(l,maxl);
		// 反复执行替换
		while (true) {
			// 查找最左边的 "oo"
			int p=t.find("oo");
			if (p==string::npos) break;  // 没有 "oo" 了
			// 将最左边的 "oo" 替换为 "O"
			t.replace(p,2,"O");
			// 是否有 "OO"
			p=t.find("OO");
			if (p!=string::npos) t.replace(p,2,"o"); // 如果有，将最左边的 "OO" 替换为 "o"
		}
		// 将处理完毕的 t 替换回原字符串 s 中对应位置
		s.replace(l,maxl,t);
	}
	cout<<s<<'\n';
	return 0;
}
```

[提交记录](https://atcoder.jp/contests/ttpc2015/submissions/70843292)
