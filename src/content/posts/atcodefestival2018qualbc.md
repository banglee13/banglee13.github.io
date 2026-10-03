---
title: "题解：AT_code_festival_2018_qualb_c Special Cake for CODE FESTIVAL"
published: 2024-05-20
publishedAt: 2024-05-20T17:39:39+08:00
draft: false
---

## AT_code_festival_2018_qualb_c 题解
[题目传送门](https://www.luogu.com.cn/problem/AT_code_festival_2018_qualb_c)

## 正文

首先，这个问题有各种各样的解法。这个可能有很多人想到了，如下所示：
![](https://cdn.luogu.com.cn/upload/image_hosting/fkjhe2jh.png)
用这样的方法决定喷雾的位置的话，在 $H,W = 1000$ 的时候浇在 $250000$ 个蛋糕的左右上下界。因此，用这样的方式是不可行的。（下图中，在黑色的地方喷雾）
![](https://cdn.luogu.com.cn/upload/image_hosting/zx6u7tdh.png)
所以，我们需要改进这个方法。
例如，在上图的思路中，基本上只有当 $x + 2y \bmod 5 = 0 $ 时，才会喷洒到从上往下数第 $x$ 个、从左往右数第 $y$ 个蛋糕上。

然而，在下图中，有黄色点的黑色蛋糕只需要在满足 $x + 2y \bmod 5 = 0$  的方格上喷洒即可食用。因此，我们需要另外喷洒这些蛋糕。

那么，这样的蛋糕有多少个呢？如图所示，很明显，只有大约五分之一的边缘蛋糕符合条件，因此在 $H,W = 1000$ 时，大约有 $(1000 \times 4 - 4) \div 5 \approx 800$ 个这样的蛋糕。因此，大约需要喷洒 $200000 + 800 = 200800$ 次。由于限制次数是 $201800$ 次以内，符合题目要求，所以这种解法是正确的。

## 代码
```
#include<bits/stdc++.h>
using namespace std;
#define int long long
int n,dx[4]={1,0,0,-1},dy[4]={0,1,-1,0};
char a[1000][1000];
void solve(){
    for(int i=0;i<n;i++)
        for(int j=0;j<n;j++)
            a[i][j]='.';
    for(int i=0;i<n;i++)
        for(int j=0;j<n;j++)
            if((i+j*2)%5==0) a[i][j]='X';
    for(int i=0;i<n;i++)
        for(int j=0;j<n;j++)
            if(a[i][j]=='.')
            {
                bool flag=false;
                for(int k=0;k<4;k++)
                    if(0<=i+dx[k] && i+dx[k]<n && 0<=j+dy[k] && j+dy[k]<n && a[i+dx[k]][j+dy[k]]=='X') flag=true;
                if(!flag) a[i][j]='X';
            }
    for(int i=0;i<n;i++)
    {
        for(int j=0;j<n;j++)
            cout<<a[i][j];
        cout<<endl;
    }
}
signed main(){
    cin>>n;
    solve();
    return 0;
}
```
