---
title: "题解：AT_code_thanks_festival_14_quala_e 儀式"
published: 2025-02-18
publishedAt: 2025-02-18T21:03:34+08:00
category: "题解"
draft: false
---

## AT_code_thanks_festival_14_quala_e 儀式
[洛谷传送门](https://www.luogu.com.cn/problem/AT_code_thanks_festival_14_quala_e)

[AT 传送门](https://atcoder.jp/contests/code-thanks-festival-2014-a-open/tasks/code_thanks_festival_14_quala_e)
## 思路
考虑模拟。

用一个二维数组 $a$ 来记录每个石像被旋转的次数。对于每个顺序，将该顺序的石像的旋转次数加 $1$。

假设每个顺序被遗忘，重新计算朝南的石像个数。对于每个石像，如果它在被假设遗忘的顺序范围内，且旋转次数对 $4$ 取余等于 $1$（因为旋转 $4$ 次会回到朝南的状态，旋转 $1$ 次后是朝东，也就是原本朝南旋转一次后符合未执行该顺序时朝南的情况），则认为它朝南；如果不在该范围内，且旋转次数对 $4$ 取余等于 $0$，则认为它朝南。统计朝南的石像个数，如果等于 $M$，则说明该顺序可能被遗忘，将其输出。
## Code
```cpp
#include <bits/stdc++.h>

#define rep(i,n) for(int i=0;i<(n);i++)

using namespace std;

int main(){
	int h,w,m,n;
  scanf("%d%d%d%d",&h,&w,&m,&n);
	vector<int> t(n),b(n),l(n),r(n);
	rep(i,n)
      scanf("%d%d%d%d",&t[i],&b[i],&l[i],&r[i]), t[i]--, l[i]--;

	int a[50][50]={};
	rep(i,n)
      for(int y=t[i];y<b[i];y++)
        for(int x=l[i];x<r[i];x++)
            a[y][x]++;

	rep(i,n){
		int cnt=0;
		rep(y,h)
            rep(x,w) {
    			if(t[i]<=y && y<b[i] && l[i]<=x && x<r[i]){
    				if(a[y][x]%4==1) cnt++;
    			}
    			else if(a[y][x]%4==0) cnt++;
    		}
		if(cnt==m) printf("%d\n",i+1);
	}
	return 0;
}
```
