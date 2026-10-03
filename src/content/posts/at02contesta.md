---
title: "[AT1202Contest_a] DEGwer's Doctoral Dissertation 题解"
published: 2023-12-08
publishedAt: 2023-12-08T21:33:10+08:00
draft: false
---

# [AT1202Contest_a] DEGwer's Doctoral Dissertation 题解
[题目传送门](https://www.luogu.com.cn/problem/AT1202Contest_a)

# 正文
现有 $K$ 个小于等于 $N$ 个的的正整数。请你求出至少删除多少个数，才能保证 $A$ 数组中每个数相差 $\ge T$。

那么我们便可以通过遍历 $A$ 数组，判断每个数是否和前一个数相差小于 $T$，或者和前一个数相等，然后再排一遍序。但观察数据范围，$1\ \le\ K\ \le\ 2\ \times\ 10^5$，用这样的方法，很明显会超时。因此，我们需要进行优化。

那么怎么优化呢？很简单，我们可以先对 $A$ 数组排一遍序，然后遍历 $A$ 数组，如果 $a_i - maxl \ge\ t$，那么就要此删除数字，也就是 $maxl \gets a_i,ans \gets ans + 1$，最后输出 $k - ans$ 就可以了。

# AC 代码
```cpp
#include<bits/stdc++.h>
using namespace std;
int n,k,t,ans,maxl=-200000,a[200005];  //定义变量 
int main(){
    scanf("%d %d %d",&n,&k,&t);
    for(int i=1;i<=k;i++)
        scanf("%d",&a[i]);  //输入，因为 k<=2*10^5，也就是 k<=200000，如果使用 cin，很可能会超时 
    sort(a+1,a+1+k);  //排序 
    for(int i=1;i<=k;i++)
        if(a[i]-maxl>=t) maxl=a[i],ans++;  //删除当前数字
    printf("%d",k-ans);  //输出 
    return 0;
}
```
