---
title: "题解：AT_joi2007ho_c 最古の遺跡"
published: 2024-09-05
publishedAt: 2024-09-05T13:25:37+08:00
category: "题解"
draft: false
---

## AT_joi2007ho_c 最古の遺跡 题解
[题目传送门](https://www.luogu.com.cn/problem/AT_joi2007ho_c)

## 前置知识
### set
众所周知，`set` 就是集合的意思，集合的特点就是不会出现重复的内容，一般用来作查重或去重操作。

`set` 的常用命令：

```
begin();            // 返回指向第一个元素的迭代器
end();              // 返回指向最后一个元素的后一个位置的迭代器
clear();            // 清除所有元素
count();            // 返回某个值元素的个数，用于判断 set 中是否有该元素
size();             // 返回集合中元素的数目
empty();            // 如果集合为空，返回 true，否则返回 false
insert();           // 在集合中插入元素 
erase();            // 删除集合中的元素
find();             // 返回一个指向被查找到元素的迭代器
max_size();         // 返回集合能容纳的元素的最大限值
rbegin();           // 返回 set 反转后的开始指针(即原来的 end-1)
```

### pair
`pair` 是将 $2$ 个数据组合成一组数据，当需要这样的需求时就可以使用 `pair`，如 `map` 就是将 key 和 value 放在一起来保存。另一个应用是，当一个函数需要返回 $2$ 个数据的时候，可以选择 `pair`。`pair` 的实现是一个结构体，主要的两个成员变量是 `first` 和 `second` 因为是使用 `struct` 不是 `class`，所以可以直接使用 `pair` 的成员变量。（[引用自 csdn](https://blog.csdn.net/sevenjoin/article/details/81937695)）

### C++11：范围 for 循环的扩展
在 C++11 以后的版本中，范围 `for` 循环的功能得到了扩展。

除了遍历容器，还可以遍历初始化列表、数组、字符串等。甚至可以使用 `auto` 关键字来自动推导元素类型。

遍历的原理：自动取遍历目标的每一个元素，再放到给定的临时变量中，自动判断结束。

`auto` 会根据遍历目标的元素类型自动推导。

```
std::initializer_list<int> numbers = {1, 2, 3, 4, 5};
for (auto num : numbers)
{
    // ...
}
```


就是取 `numbers` 的元素放到 `num` 中，自动判断循环结束，直接写数组的类型也可以。（[引用自 csdn](https://blog.csdn.net/m0_74195626/article/details/132256931)）

## 正文
接下来，我会介绍一种 $O(n^2 \log n)$ 的算法。

首先，将给定的 $n$ 个点 $p_1,\dots,p_n$ 的坐标按照字典序进行排序，这样，在给定 $x,y$ 时，通过二分查找在 $O(\log n)$ 时间内查找 $p$ 中是否有具有坐标 $(x,y)$。当然，也可以使用哈希表 ~~（如果你会的话）~~。另外，因为坐标是从 $0$ 到 $5000$ 的整数，也可以用位图保存。

然后，对于所有的 $p_i,p_j(1 \le i,j \le n,i \ne j)$ 是以线段 $p_i,p_j$ 为边的正方形，从 $p_i$ 到 $p_j$ 的方向是逆时针绕正方形的。检查剩下的 $2$ 个顶点是否包含在 $p$ 中。

$$q=(x_j - y_j + y_i,y_j + x_j - x_i),$$
$$r=(x_i - y_j + y_i,y_i + x_j - x_i)$$

所以，检查 $q$ 和 $r$ 是否都包含在 $P$ 中。综上所述，这个正方形的面积是 $(x_i - x_j)^2 + (y_i - y_j)^2$。

以上可以找到所有由 $P$ 点构成的正方形，所以也可以从中找到面积最大的正方形。

如果用上面的方法，必须要找到四次相同的正方形，所以，我们要考虑优化算法。

## 优化算法

$p_1,\dots,p_n$ 可以按照字典序排序，也可以用上面的方法限定为 $i < j$ 的情况（因为对于每个正方形，正方形的四个顶点中的下标最小的为 $p$，当我们以逆时针方向看，排在 $p_i$ 之后的是 $p_j$，那么 $i < j$。另外，将 $p_1,\dots,p_n$ 按照坐标的字典序进行排序时，如果限定 $i < j$，则每个正方形正好找到 $2$ 次）。

至此，优化完成，从原来的 $4$ 次优化到了 $2$ 次。

## Code

```cpp
#include<bits/stdc++.h>
using namespace std;
#define int long long
int n,maxl;
set<pair<int,int>> s; //看前置知识
signed main(){
    ios::sync_with_stdio(false),cin.tie(0),cout.tie(0);
    cin>>n;
    for(int i=1;i<=n;i++)
    {
        int x,y;
        cin>>x>>y;
        s.insert(make_pair(x,y));
    }
    for(auto u:s) //c++ 11 引进的便利 STL 容器的新型方法 等价于 for(set<pair<int,int>>::iterator u=s.begin();u!=s.end();u++)
        for(auto v:s)
        {
            if(u==v) continue;
            int x1=u.first,y1=u.second,x2=v.first,y2=v.second;
            int x3=x1+y1-y2; int y3=-x1+x2+y1,x4=x2+y1-y2,y4=-x1+x2+y2;
            if(s.find(make_pair(x3,y3))!=s.end() && s.find(make_pair(x4,y4))!=s.end())
                maxl=max(maxl,(x2-x1)*(x2-x1)+(y2-y1)*(y2-y1)); //正文讲到的公式
        }
    cout<<maxl<<'\n';
    return 0;
}
```

ps：部分内容参考了 [官方题解](https://atcoder.jp/contests/joi2007ho/editorial)。
