---
title: "题解：AT_kupc2014_b 数当てゲーム"
published: 2024-05-23
publishedAt: 2024-05-23T17:52:07+08:00
draft: false
---

## AT_kupc2014_b 数当てゲーム 题解
[题目传送门](https://www.luogu.com.cn/problem/AT_kupc2014_b)

## 问题概括
- 进行猜测 AI 所持有的暗号（$1$ 以上 $1000$ 以下）的游戏
- 可以向 AI 询问暗号是否可以被某个数（$1$ 以上 $1000$ 以下）整除。
- 总共可以进行 $200$ 次提问和输入暗号。

## 解法
- 将暗号进行质因数分解。
- 对于 $1$ 至 $1000$ 之间的素数，询问AI暗号可以被该素数的多少次幂整除。
- 求得素数的乘积即为答案。

## 代码
```
#include<bits/stdc++.h>
using namespace std;
int ans=1;
int main(){
    for(int i=2;i<=1000;i++)
    {
        int cnt=0;
        for(int j=1;j<=i;j++)
            if(i%j==0) cnt++;
        if(cnt!=2) continue;
        int cur=i;
        while(true)
        {
            if(cur>1000) break;
            cout<<"? "<<cur<<endl;
            string s;
            cin>>s;
            if(s=="Y") cur*=i,ans*=i;
            else break;
        }
    }
    cout<<"! "<<ans;
    return 0;
}
```
