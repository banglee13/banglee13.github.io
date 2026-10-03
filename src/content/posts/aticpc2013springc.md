---
title: "题解：AT_icpc2013spring_c Iyasugigappa"
published: 2024-11-05
publishedAt: 2024-11-05T13:43:13+08:00
draft: false
---

## AT_icpc2013spring_c Iyasugigappa 题解
[AtCoder 传送门](https://atcoder.jp/contests/JAG2013Spring/tasks/icpc2013spring_c)

## 题目大意
有三名玩家（青蛙、河童和鼬），每位玩家手中有 $2$ 张行动卡，桌上有 $12$ 张贵族卡。游戏的目标是尽可能地积累分数。

## 思路
考虑 **DFS** 来模拟每个玩家的最佳策略。

游戏轮流进行，每位玩家在他们的回合里可以选择使用一张行动卡或跳过。

使用行动卡时，根据卡片值选择桌面上的贵族卡，如果选择的编号超过剩余贵族卡数量，则无效。

从桌面移走一张贵族卡后，玩家获得该卡的分数。
最终目标是消耗所有的贵族卡。

青蛙和鼬都假设其他玩家会尽量提高自己的得分来做出选择。

河童则采取相反的策略，目的是尽量降低青蛙的得分。

河童的策略需要在选择中考虑青蛙的得分。

把游戏状态封装为结构体，包括当前轮到哪个玩家，剩余的贵族卡以及每个玩家的行动卡。

### Code
```cpp
#include <bits/stdc++.h>
using namespace std;

const int INF = 1e9;
typedef vector<int> Cards;
typedef vector<int> Score;
typedef pair<int, Score> P;

struct State {
    int player;
    Cards x, c[3];

    State(Cards x, Cards frog, Cards kappa, Cards weasel)
        : player(0), x(x), c{frog, kappa, weasel} {}

    bool end() const { return x.empty(); }

    int stay() {
        int res = x[0];
        // 移动贵族卡位置
        for (int i = 0; i < (int)x.size() - 1; i++)
            x[i] = x[i + 1];
        x.pop_back();
        player = (player + 1) % 3; // 轮到下一个玩家
        return res;
    }

    int play(int n) {
        if (n < 0) return stay();
        if (n >= (int)c[player].size()) return -INF;
        int v = c[player][n] - 1; // 选择的贵族卡的索引
        for (int i = n; i < (int)c[player].size() - 1; i++)
            c[player][i] = c[player][i + 1];
        c[player].pop_back();
        if (v >= (int)x.size()) return stay();
        int res = x[v];
        for (int i = v; i < (int)x.size() - 1; i++)
            x[i] = x[i + 1];
        x.pop_back();
        player = (player + 1) % 3;
        return res;
    }
};

// 标准DFS算法，用于青蛙和鼬
P dfs(const State &st) {
    if (st.end()) return P(0, Score(3));
    const int p = st.player;
    Score ma = {-INF, -INF, -INF};
    int action = -1;
    for (int i = -1;; ++i) {
        State nst = st;
        int val = nst.play(i);
        if (val == -INF) break; // 无法继续
        Score s = dfs(nst).second;
        s[p] += val; // 更新分数
        if (ma[p] < s[p]) {
            ma = s;
            action = i; // 更新最优选择
        }
    }
    return P(action, ma);
}

// 河童的最小化策略
P dfs_kappa(const State &st) {
    if (st.end()) return P(0, Score(3));
    const int p = st.player;
    if (p != 1) { // 对于青蛙和鼬
        State nst = st;
        int val = nst.play(dfs(nst).first);
        P res = dfs_kappa(nst);
        res.second[p] += val;
        return res;
    }
    Score mi = {INF, INF, INF};
    int action = -1;
    for (int i = -1;; ++i) {
        State nst = st;
        int val = nst.play(i);
        if (val == -INF) break;
        Score s = dfs_kappa(nst).second;
        s[p] += val;
        if (mi[0] > s[0]) { // 寻找最小
            mi = s;
            action = i;
        }
    }
    return P(action, mi);
}

int main() {
    vector<int> x(12), a(2), b(2), c(2);
    for (int i = 0; i < 12; i++)
        cin >> x[i];
    // 读取行动卡
    for (int i = 0; i < 2; i++)
        cin >> a[i];
    sort(a.begin(), a.end());
    for (int i = 0; i < 2; i++)
        cin >> b[i];
    sort(b.begin(), b.end());
    for (int i = 0; i < 2; i++)
        cin >> c[i];
    sort(c.begin(), c.end());

    // 将贵族卡倒序处理
    reverse(x.begin(), x.end());
    State st(x, a, b, c);
    Score sc = {0, 0, 0};
    while (!st.end()) {
        const int p = st.player;
        int val = st.play(p == 1 ? dfs_kappa(st).first : dfs(st).first);
        sc[p] += val; // 更新最终得分
    }
    cout << sc[0] << " " << sc[1] << " " << sc[2] << '\n';
    return 0;
}
```
