---
title: "题解：AT_code_festival_2018_final_c Telephone Charge"
published: 2024-05-22
publishedAt: 2024-05-22T17:33:10+08:00
draft: false
---

## AT_code_festival_2018_final_c Telephone Charge 题解
[题目传送门](https://www.luogu.com.cn/problem/AT_code_festival_2018_final_c)

## 正文
读题，题目说了有 $N$ 种电话计划。

在 $A_i$ 分钟内的通话按一律 $B_i$ 元计费，超出部分每多一分钟加收 $1$ 元。

但是，恰好 $A_i$ 分钟的通话时，计划 $i$ 是最便宜的。

有 $M$ 个人，每个人的通话时间是 $T_i$ 分钟。

求每个人通话费用的最低价。

- $1 \le N \le 10^5,1 \le M \le 10^5$。

注意条件 “恰好 $A_i$ 分钟的通话时，计划 $i$ 是最便宜的” 可以看出 $A_i$ 和 $B_i$ 之间存在相关关系。

由于超出时间的额外费用在每个计划中每分钟都是 $1$ 元，所以对于 $x$ 分钟的通话，最便宜的计划是：

- 满足 $x \le A_i$ 的计划中 $A_i$ 最小的那个 或 满足 $x>A_i$ 的计划中 $A_i$ 最大的那个。

假设我们按 $T_i$ 的大小顺序求解。

“满足 $x \le A_i$ 的计划中 $A_i$ 最小的那个”和“满足 $x>A_i$ 的计划中 $A_i$ 最大的那个”，可以通过预先将 $(A_i,B_i)$ 按升序排序来找到。因此，对于每个 $T_i$，比较这两者中较小的一个，就可以得出正确答案。

## 代码
```
#include<bits/stdc++.h>
using namespace std;
int n,m,T;
int main(){
    cin>>n;
    vector<pair<int,int>> a(n);
    for(auto& [x, y] : a)
        cin>>x>>y;
    sort(a.begin(),a.end());
    cin>>m;
    for(int i=1;i<=m;i++)
    {
        cin>>T;
        auto itr=lower_bound(a.begin(),a.end(),make_pair(T, 0));
        long long money=10000000000;
        if(itr!=a.end()) money=(*itr).second;
        long long money2=money;
        if(itr!=a.begin())
        {
            itr--;
            int mt2=(*itr).first;
            money2=(*itr).second+abs(mt2-T);
        }
        cout<<min(money,money2)<<endl;
    }
    return 0;
}
```
