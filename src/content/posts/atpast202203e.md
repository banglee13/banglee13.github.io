---
title: "题解：AT_past202203_e 良い日付"
published: 2024-05-15
publishedAt: 2024-05-15T13:15:44+08:00
category: "题解"
draft: false
---

# AT_past202203_e 良い日付 题解
[题目传送门](https://www.luogu.com.cn/problem/AT_past202203_e)

## 前置知识
众所周知，```set``` 就是集合的意思，集合的特点就是不会出现重复的内容，一般用来作查重或去重操作。

```set``` 的常用命令：
```
    begin();            // 返回指向第一个元素的迭代器
    end();              // 返回指向最后一个元素的后一个位置的迭代器
    clear();            // 清除所有元素
    count();            // 返回某个值元素的个数，用于判断 set 中是否有该元素
    size();             // 返回集合中元素的数目
    empty();            // 如果集合为空，返回 true，否则返回 false
    insert();           // 在集合中插入元素 
    erase();            // 删除集合中的元素
    find();            // 返回一个指向被查找到元素的迭代器
    max_size();         // 返回集合能容纳的元素的最大限值
    rbegin();           // 返回 set 反转后的开始指针(即原来的 end-1)
```

## 正文
题目说了，所有出现的数字为 $2$ 种及以下时，称为“好日期”。我们第一反应就是用下标计数，但这样很麻烦。因此，我们可以使用 ```set```，```set``` 自带去重和排序功能，那我们不就可以用 ```set``` 来解决这道题了吗？

这里枚举日期的时候要注意一下几个特殊的月份，例如 2 月。

## 代码
```
#include<bits/stdc++.h>
using namespace std;
int y,m,d;
int main(){
    scanf("%d/%d/%d",&y,&m,&d); //scanf 的特性，用 scanf 读掉斜杠，当然也可以用下面这种格式
    //cin>>y>>a>>m>>b>>d; a,b 为 char 类型
    while(true) //枚举日期
    {
        set<int> s; //定义一个 set，在循环内定义可以每次循环自动清空
        int yy=y,mm=m,dd=d;
        for(int i=1;i<=4;i++) //年份有四位
            s.insert(yy%10),yy/=10;
        for(int i=1;i<=2;i++) //月份最多有两位
            s.insert(mm%10),mm/=10;
        for(int i=1;i<=2;i++) //日最多有两位
            s.insert(dd%10),dd/=10;
        if(s.size()<=2) //好日期判断条件：所有出现的数字为2种及以下 
        {
            printf("%04d/%02d/%02d\n",y,m,d); //输出日期 
            break;
        }
        if(m==2) //特判 2 月 
        {
            if(d==28) m=3,d=1;
            else d++;
        }
        else if(m==4 || m==6 || m==9 || m==11)
        {
            if(d==30) m++,d=1;
            else d++;
        }
        else if(m==12)
        {
            if(d==31) y++,m=1,d=1;
            else d++;
        }
        else
        {
            if(d==31) m++,d=1;
            else d++;
        }
    }
    return 0;
}
```
