---
title: "LCA&树上差分"
published: 2025-08-14
publishedAt: 2025-08-14T19:26:31+08:00
draft: false
---

# LCA&树上差分
## LCA（最近公共祖先）
### 基本概念
LCA 是指在一棵树中，两个节点 $u$ 和 $v$ 最近的公共祖先节点。例如：
```
        A
       / \
      B   C
     / \   \
    D   E   F
```
- LCA(D,E) = B
- LCA(D,F) = A

### 常见解法
#### 朴素算法
将 $u,v$ 中较深的节点向上走到和深度较浅的节点同一深度，然后两个节点一起向上走，直到走到同一个节点，这个节点就是 $u,v$ 的最近公共祖先。

时间复杂度：预处理 $O(n)$，查询 $O(n)$。

```cpp
int lca(int u, int v) {
    while (dep[u]>dep[v])
        u=fa[u];
    while (dep[v]>dep[u])
        v=fa[v];
    // 一起向上找
    while (u!=v)
        u=fa[u],v=fa[v];
    return u;
}
```
#### 倍增法
倍增算法是最经典的 LCA 求法，他是朴素算法的改进算法。

$fa_{x,i}$ 表示点 $x$ 的第 $2^i$ 个祖先。

$fa_{x,i}$ 数组可以通过 dfs 预处理出来。

我们要将 $u,v$ 两点跳转到同一深度。可以计算出 $u,v$ 两点的深度之差，设其为 $y$。通过将 $y$ 进行二进制拆分，将 $y$ 次跳转优化为 “$y$ 的二进制表示所含 $1$ 的个数” 次跳转。 

然后，从最大的 $i$ 开始循环尝试，一直尝试到 $0$，如果 $fa_{u,i} \not= fa_{v,i}$，则 $u \gets fa_{u,i}, v \gets fa_{v,i}$，那么最后的 LCA 为 
$fa_{u,0}$。

时间复杂度：预处理 $O(n \log n)$，查询 $O(\log n)$。
```cpp
const int maxn=5e5+5;
int n,m,s,fa[maxn][25],dep[maxn];
bool vis[maxn];
vector<int> e[maxn];
void dfs(int u,int f) {
	fa[u][0]=f,dep[u]=dep[f]+1;
	for (auto v:e[u])
		if (v!=f) dfs(v,u);
}
int lca(int u,int v) {
	if (dep[u]<dep[v]) swap(u,v);
	for (int i=20;i>=0;i--)
		if (dep[fa[u][i]]>=dep[v]) u=fa[u][i];
	if (u==v) return u;
	for (int i=20;i>=0;i--)
		if (fa[u][i]!=fa[v][i]) u=fa[u][i],v=fa[v][i];
	return fa[u][0];
}
void init() {
	for (int j=1;(1<<j)<=n;j++)
		for (int i=1;i<=n;i++)
			fa[i][j]=fa[fa[i][j-1]][j-1];
}
```

## 树上差分
### 定义
树上差分是差分思想在树结构上的扩展，用于高效处理树上的路径修改与查询问题。它结合了差分数组的思想和树的结构特性，常用于解决“对树上某条路径上的所有节点或边进行增减操作，最后统计每个节点或边的权值”这类问题。

### 基本思想
差分的核心思想是：将区间操作转化为端点操作，最后通过一次遍历进行前缀和还原。

在树结构中，由于路径是唯一的（树中任意两点间有且仅有一条简单路径），我们可以利用 LCA 来定位路径，然后通过差分技巧在路径端点处打标记，最后通过一次后序遍历（自底向上）将差分标记下传，得到每个节点或边的实际值。

### 常见形式

#### 点差分

模型：给定一棵树，多次操作：对路径 $u \to v$ 上的所有节点权值加 $d$。最后询问每个节点的权值。

设 $diff_u$ 表示以 $u$ 为根的子树中，所有节点需要额外增加的权值（差分数组）。

对于路径 $u \to v$，设 $lca = \text{LCA}(u, v)$。

差分操作：
```cpp
diff[u]+=d;
diff[v]+=d;
diff[lca]-=d;
if (fa[lca]) diff[fa[lca]]-=d;
```

解释：
$u$ 和 $v$ 处加 $d$ 表示从根到 $u$ 和 $v$ 的路径上所有节点都会加上 $d$。

因为 $lca$ 是公共祖先，上方不应被加两次，所以要减去一次 $d$。

再减去 $fa_{lca}$ 是为了防止影响 $lca$ 以上的节点。

还原方式：

从叶子节点向上 dfs，每个节点 $u$ 的最终权值为：
$$
val_u = \sum_{v \in \text{子树}(u)} diff_v
$$

即 dfs 回溯时，将子树的 $diff$ 值累加到当前节点。

#### 边差分

模型：对路径 $u \to v$ 上的所有边权加 $d$，最后统计每条边的权值。

同样设 $diff_u$ 为差分数组。

操作：
```
diff[u]+=d
diff[v]+=d
diff[lca]-=2*d
```

解释：

边的贡献只影响从根到该节点路径上的边。

$u$ 和 $v$ 加 $d$ 表示从根到 $u$ 和 $v$ 的所有边都加 $d$。

因为 $lca$ 到根的路径被加了两次，需要抵消，所以要减去 $2d$。

注意，**不需要减父节点**，因为边的权值只关心从根到当前节点的路径上的边。

还原方式：

dfs 时，每个节点 $u$ 的 $diff_u$ 值就是其父边的最终权值增量。  

即：边 $(fa_u,u)$ 的权值增量为 $diff_u$。

## 习题
### T1 树的公共祖先(倍增LCA)
模板题。

```cpp line-numbers
#include<bits/stdc++.h>
using namespace std;
#define int long long
const int maxn=5e5+5;
int n,m,s,fa[maxn][25],dep[maxn];
bool vis[maxn];
vector<int> e[maxn];
void dfs(int u,int f) {
	fa[u][0]=f,dep[u]=dep[f]+1;
	for (auto v:e[u])
		if (v!=f) dfs(v,u);
}
int lca(int u,int v) {
	if (dep[u]<dep[v]) swap(u,v);
	for (int i=20;i>=0;i--)
		if (dep[fa[u][i]]>=dep[v]) u=fa[u][i];
	if (u==v) return u;
	for (int i=20;i>=0;i--)
		if (fa[u][i]!=fa[v][i]) u=fa[u][i],v=fa[v][i];
	return fa[u][0];
}
void init() {
	for (int j=1;(1<<j)<=n;j++)
		for (int i=1;i<=n;i++)
			fa[i][j]=fa[fa[i][j-1]][j-1];
}
signed main() {
	ios::sync_with_stdio(false),cin.tie(0),cout.tie(0);
	cin>>n>>m>>s;
	for (int i=1,x,y;i<n;i++)
		cin>>x>>y,e[x].push_back(y),e[y].push_back(x);
	dfs(s,0);
	init();
	for (int i=1,u,v;i<=m;i++)
		cin>>u>>v,cout<<lca(u,v)<<'\n';
	return 0;
}
```
### T2 大量的工作沟通
员工 $x$ 能管理员工 $y$，当且仅当 $x$ 是 $y$ 的**祖先**（包括自己）。

也就是说，管理关系构成一棵以 $0$ 为根的**树结构**。

所有 $a_i$ 的最近公共祖先是深度最深的公共祖先，但题目要求的是**编号最大的公共祖先**，不一定是 LCA。

然而注意，**所有公共祖先都在从 LCA 到根的路径上**。

所以，我们只需要在这条路径上找编号最大的节点即可。

设 $maxl_u$ 定义为从根到 $u$ 的路径上的最大编号。

那么，对于任意节点 $u$，它的所有祖先都在从 $u$ 到根的路径上，因此所有公共祖先的编号最大值就是 $maxl_{LCA}$。

因为 LCA 是最深的公共祖先，其到根的路径包含了所有公共祖先。

```cpp line-numbers
#include <bits/stdc++.h>
using namespace std;
#define int long long
const int maxn=1e5+5;
int n,q,a[maxn],fa[maxn][20],dep[maxn],maxl[maxn];
vector<int> e[maxn];
void dfs(int u,int f) {
	fa[u][0]=f,dep[u]=dep[f]+1,maxl[u]=max(u,maxl[f]);
	for (auto v:e[u])
		if (v!=f) dfs(v,u);
}
void init() {
	for (int j=1;j<20;j++)
		for (int i=0;i<n;i++)
			fa[i][j]=fa[fa[i][j-1]][j-1];
}
int lca(int u,int v) {
	if (dep[u]<dep[v]) swap(u,v);
	for (int j=19;j>=0;j--)
		if (dep[fa[u][j]]>=dep[v]) u=fa[u][j];
	if (u==v) return u;
	for (int j=19;j>=0;j--)
		if (fa[u][j]!=fa[v][j]) u=fa[u][j],v=fa[v][j];
	return fa[u][0];
}
signed main() {
	ios::sync_with_stdio(false),cin.tie(0),cout.tie(0);
	cin>>n;
	for (int i=1,x;i<n;i++)
		cin>>x,e[i].push_back(x),e[x].push_back(i);
	dfs(0,0);
	init();
	cin>>q;
	while (q--) {
		int m;
		cin>>m;
		for (int i=1;i<=m;i++)
			cin>>a[i];
		int ans=a[1];
		for (int i=2;i<=m;i++)
			ans=lca(ans,a[i]);
		cout<<maxl[ans]<<'\n';
	}
	return 0;
}
```

### T3 物流经理 panda 的运输路径流量问题
由于图是连通的且边数为 $N-1$，说明这是一个树结构。

对于每次运输任务 $(s_i,t_i) $，可以通过 LCA 找到路径 $s_i \to t_i$。

路径上的节点可以表示为：
  - 从 $s_i$ 到 $\text{LCA}(s_i,t_i)$；
  - 从 $\text{LCA}(s_i,t_i)$ 到 $t_i$。

可以使用**树上差分**的思想，在路径的起点和终点处标记，然后通过一次 dfs 统计每个节点的实际流量。

```cpp line-numbers
#include<bits/stdc++.h>
using namespace std;
#define int long long
const int maxn=5e5+5;
int n,k,fa[maxn][25],dep[maxn],cnt[maxn],ans;
vector<int> e[maxn];
void dfs(int u,int f) {
	fa[u][0]=f;
	dep[u]=dep[f]+1;
	for (auto v:e[u])
		if (v!=f) dfs(v,u);
}
void init() {
	for (int j=1;(1<<j)<=n;j++)
		for (int i=1;i<=n;i++)
			fa[i][j]=fa[fa[i][j-1]][j-1];
}
int lca(int u,int v) {
	if (dep[u]<dep[v]) swap(u,v);
	for (int i=20;i>=0;i--)
		if(dep[fa[u][i]]>=dep[v]) u=fa[u][i];
	if (u==v) return u;
	for (int i=20;i>=0;i--)
		if (fa[u][i]!=fa[v][i]) u=fa[u][i],v=fa[v][i];
	return fa[u][0];
}
void cha(int u,int v) {
	int t=lca(u,v);
	cnt[u]++,cnt[v]++,cnt[t]--;
	if (fa[t][0]!=0) cnt[fa[t][0]]--;
}
void dfss(int u,int f) {
	for (auto v:e[u])
		if (v!=f) dfss(v,u),cnt[u]+=cnt[v];
	ans=max(ans,cnt[u]);
}
signed main() {
	ios::sync_with_stdio(false),cin.tie(0),cout.tie(0);
	cin>>n>>k;
	for (int i=1,x,y;i<n;i++)
		cin>>x>>y,e[x].push_back(y),e[y].push_back(x);
	dfs(1,0);
	init();
	for (int i=1,s,t;i<=k;i++)
		cin>>s>>t,cha(s,t);
	dfss(1,0);
	cout<<ans;
	return 0;
}
```

### T4 小狐狸的树屋探险
~~话说跟小狐狸有什么关系？~~

每次从 $a_i \to a_{i+1}$ 是一条树上路径。

我们可以用**树上差分**来标记每条路径上的节点被经过的次数。


题目说明到达 $ _n$ 时不需要拿糖果，这意味着所有 $a_2, a_3, \dots, a_n$ 都是某次路径的终点或起点，它们会被重复经过。

但我们发现：

- 每个 $a_i(i \ge 2 )$ 都会作为一次路径的起点被进入一次；
- 但这个“进入”其实是上一次路径的“离开”；
- 所以我们对每个 $a_i(i \ge 2)$ 都要**减去一次计数**。

```cpp line-numbers
#include<bits/stdc++.h>
using namespace std;
#define int long long
const int maxn=3e5+10;
int n,a[maxn],fa[maxn][20],dep[maxn],cnt[maxn];
vector<int> e[maxn];
void dfs(int u,int f) {
	fa[u][0]=f,dep[u]=dep[f]+1;
	for (auto v:e[u]) 
		if (v!=f) dfs(v,u);
}
void init() {
	for (int j=1;j<20;j++)
		for (int i=1;i<=n;i++)
			fa[i][j]=fa[fa[i][j-1]][j-1];
}
int lca(int u,int v) {
	if (dep[u]<dep[v]) swap(u,v);
	for (int i=19;i>=0;i--)
		if (dep[fa[u][i]]>=dep[v]) u=fa[u][i];
	if (u==v) return u;
	for (int i=19;i>=0;i--)
		if (fa[u][i]!=fa[v][i]) u=fa[u][i],v=fa[v][i];
	return fa[u][0];
}
void cha(int u,int v) {
	int t=lca(u,v);
	cnt[u]++,cnt[v]++;
	cnt[t]--;
	if (fa[t][0]) cnt[fa[t][0]]--;
}
void dfss(int u,int f) {
	for (auto v:e[u]) 
		if (v!=f) dfss(v,u),cnt[u]+=cnt[v];
}
signed main() {
	ios::sync_with_stdio(false),cin.tie(0),cout.tie(0);
	cin>>n;
	for (int i=1;i<=n;i++)
		cin>>a[i];
	for (int i=1,u,v;i<n;i++)
		cin>>u>>v,e[u].push_back(v),e[v].push_back(u);
	dfs(1,0);
	init();
	for (int i=1;i<n;i++) 
		cha(a[i],a[i+1]);
	dfss(1,0);
	for (int i=2;i<=n;i++)
		cnt[a[i]]--;
	for (int i=1;i<=n;i++) 
		cout<<cnt[i]<<'\n';
	return 0;
}
```
### T5 割裂
对于好点对，删除的节点不能在任何好点对的路径上。即，删除的节点必须不是任何好点对的路径上的节点。

对于坏点对，删除的节点必须在坏点对的路径上。即，删除的节点必须是坏点对的路径上的节点。

因此，可删除的节点必须同时满足：
- 不在任何好点对的路径上。
- 在坏点对的路径上。

用差分数组标记节点是否在好点对的路径上：

对于每个好点对 $(u_i,v_i)$，路径上的所有节点的计数加 $1$。

最后统计计数为 $0$ 的节点，这些节点不在任何好点对的路径上。

检查坏点对的路径上的节点，哪些的计数为 $0$，即为可删除的节点。

时间复杂度为 $O(n \log n)$。

```cpp
#include<bits/stdc++.h>
using namespace std;
#define int long long
const int maxn=1e6+5;
int n,q,u,v,a[maxn],fa[maxn][25],dep[maxn];
bool vis[maxn];
vector<int> e[maxn];
void dfs(int u,int f) {
	fa[u][0]=f,dep[u]=dep[f]+1;
	for (auto v:e[u])
		if (v!=f) dfs(v,u);
}
void init() {
	for (int j=1;(1<<j)<=n;j++)
		for (int i=1;i<=n;i++)
			fa[i][j]=fa[fa[i][j-1]][j-1];
}
int lca(int u, int v) {
	if (dep[u]<dep[v]) swap(u,v);
	for (int i=20;i>=0;i--)
		if (dep[fa[u][i]]>=dep[v]) u=fa[u][i];
	if (u==v) return u;
	for (int i=20;i>=0;i--)
		if (fa[u][i]!=fa[v][i]) u=fa[u][i],v=fa[v][i];
	return fa[u][0];
}
void dfss(int u,int f) {
	for (auto v:e[u])
		if (v!=f) dfss(v,u),a[u]+=a[v];
}
signed main() {
	ios::sync_with_stdio(false),cin.tie(0),cout.tie(0);
	cin>>n>>q;
	for (int i=1;i<n;i++)
		cin>>u>>v,e[u].push_back(v),e[v].push_back(u);
	dfs(1,0);
	init();
	while (q--) {
		cin>>u>>v;
		int l=lca(u,v);
		a[u]++,a[v]++;
		a[l]--;
		if (fa[l][0]!=0) a[fa[l][0]]--;
	}
	dfss(1,0);
	cin>>u>>v;
	int l=lca(u,v),ans=0;
	int cur=u;
	while (cur!=l) {
		if (a[cur]==0) ans++;
		cur=fa[cur][0];
	}
	cur=v;
	while (cur!=l) {
		if (a[cur]==0) ans++;
		cur=fa[cur][0];
	}
	if (a[l]==0) ans++;
	cout<<ans;
	return 0;
}
```
