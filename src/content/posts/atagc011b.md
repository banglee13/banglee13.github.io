---
title: "题解：AT_agc011_b [AGC011B] Colorful Creatures"
published: 2024-05-23
publishedAt: 2024-05-23T17:34:19+08:00
draft: false
---

## AT_agc011_b [AGC011B] Colorful Creatures 题解
[题目传送门](https://www.luogu.com.cn/problem/AT_agc011_b)

## 正文
通过对生物按大小进行排序，不失一般性，可以认为 $A_1 \le A_2 \le \dots \le A_N$。设 $t$ 为满足 $2 \sum^k_{i=1} A_i < A_{k+1}$ 的最大的 $k$。（如果不存在这样的 $k$，则 $t = 0$）为了让第 $1,2,\dots,t$ 号生物能够一直保留到最后，需要在吸收第 $t + 1$ 号生物之前变得比 $\frac{A_{t + 1}}{2}$ 更大，但是因为即使第 $1,2,\dots,t$ 号的生物全部合并也做不到这一点，所以这是不可能的。（当然，也不可能先吸收比第 $t + 1$ 号更大的生物）另一方面，第 $t + 1,t + 2,\dots,N$ 号的生物可以通过依次吸收较小的生物最终剩下来。

因此，计算上述的 $t$（左侧的总和可以通过顺序尝试 $k = 1, 2,\dots,N$ 全部在 $O(N)$ 时间内求出），输出 $N - t$ 就可以了。

## 代码
```
#include<bits/stdc++.h>
using namespace std;
int n,cnt;
int main(){
    scanf("%d",&n);
    vector<long long> a(n),b(n);
    vector<bool> ans(n+1,false);
    for(int i=0;i<n;i++)
        scanf("%lld",&a[i]);
    sort(a.begin(),a.end());
    for(int i=0;i<n;i++)
    {
        if(i==0) b[i]=a[i];
        else b[i]=b[i-1]+a[i];
    }
    ans[n]=true;
    for(int i=n-1;i>=0;i--)
    {
        long long v=b[i]*2ll;
        int h=upper_bound(a.begin(),a.end(),v)-a.begin()-1;
        ans[i]=ans[h];
        if(i==n-1) ans[i]=true;
    }
    for(int i=0;i<n;i++)
        if(ans[i]) cnt++;
    printf("%d",cnt);
    return 0;
}
```
