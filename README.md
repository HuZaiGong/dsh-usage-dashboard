# @huzhaigong/dsh-usage-dashboard（雏形）

全 DSH 用量汇总插件：把**所有工作区 × 所有会话**的 LLM 用量聚合成看板，
展示在 Web Settings 的"用量统计"页。

## 功能

- 全局汇总卡片：总 tokens（输入/输出细分）、估算花费、请求数、会话数、缓存命中率
- 按天堆叠趋势图（未缓存输入 / 缓存读 / 缓存写 / 输出）
- 排行表：按会话（含工作区）、按模型（provider/model）
- 时间范围切换：全部 / 近 7 天 / 近 30 天；手动刷新（增量重扫）
- 命中率口径与官方 stats strip 一致：cacheRead / (uncached + cacheRead + cacheWrite)
- 风格使用 DSH 设计令牌（--dsw-alias-* / --ds-font-family-code），styles.insert() 注入

设计文档见 [DESIGN.md](./DESIGN.md)。

## 结构

- `lib/scan.js` — 扫描 `$DSH_HOME/sessions/**/session.jsonl.zstd`，mtime/size 增量，清理已删除会话
- `lib/aggregate.js` — 解析 + 按 (turn, step) 去重 + 维度聚合（含 range 过滤）
- `lib/pricing.js` — 价格表驱动的成本估算
- `lib/index.js` — Host：`usageStats` remote 服务（TypertRemoteService）
- `lib/client.js` — Browser：Settings 用量统计页（DSH 风格可视化看板）

## 依赖链接（重要）

宿主侧的 @Remote 发现依赖**同一个** `@deepseek-ai/dsh-typert-protocol` 与 `cordis`
模块实例（私有 marker WeakMap / Service 符号按实例隔离）。因此本目录下
`node_modules/@deepseek-ai/{cordis,dsh-typert-protocol}` 必须是指向**正在运行的 dsh
安装树**的符号链接，而不能是 pnpm 本地副本：

```bash
pnpm run link-deps   # 每次 pnpm install 之后都要重跑（install 会覆盖符号链接）
```

## 快速开始

```bash
cd plugins/dsh-usage-dashboard
pnpm install          # 安装 esbuild 等
pnpm build            # 产出 dist/
dsh plugin --profile web add .
dsh --profile web --dump-config   # 验证装配层
# 重启 dsh web 后生效
```

## CLI 自测（不经 dsh，直接验证聚合核心）

```bash
node -e '
import("./lib/scan.js").then(async (scan) => {
  const agg = await import("./lib/aggregate.js")
  const files = scan.discoverSessions(process.env.HOME + "/.dsh/sessions")
  let all = []
  for (const f of files) {
    const lines = []
    scan.readSessionLog(f.path, (l) => lines.push(l))
    all.push(...agg.extractUsage(lines))
  }
  console.log(agg.sumUsage(all))
})
'
```

## 状态

- [x] M0 聚合核心（scan + aggregate + pricing）
- [x] M1 Host remote 服务 + range 过滤 + 会话清理（已冒烟验证）
- [x] M2 Settings 页面（DSH 风格可视化看板，已构建验证）
- [ ] M3 增量事件钩子 / 排序筛选 / 成本表完善（models.dev）
- [x] 安装进 web profile 实测（Host RPC + Settings 看板均已在运行实例验证）