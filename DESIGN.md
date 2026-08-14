# dsh-usage-dashboard — 设计文档（v0.1 雏形）

> 目标：一个 DSH 插件，把**整个 DSH 安装**（全部工作区 × 全部会话）的 LLM 用量聚合成一个可浏览的看板：
> 总 tokens（按输入/输出/缓存读/缓存写细分）、估算花费、请求数、缓存命中率、按会话/模型/日期排行。
> 社区插件（dsh-spend 等）多为单会话/单工作区粒度，本插件补上"全 DSH 总共"这一块。

## 1. 现状与依据（已核实）

| 事实 | 出处 |
|---|---|
| 官方内置 token-meter / session-stats 都是**按会话** fold，无全局汇总 | dsh-base / dsh-web-app 组合文件、README |
| 每个会话有 append-only JSONL：`$DSH_HOME/sessions/<workspace>/<sessionId>/session.jsonl.zstd`（zstd 压缩） | 本机 `~/.dsh/sessions` 实测 |
| 日志内含**提供方精确上报**的 usage：`inputTokens / outputTokens / cacheReadTokens / cacheWriteTokens`，同一 `(turn, step)` 后者覆盖前者 | 日志事件 `assistant/message`、`assistant/chunk{type:usage}` |
| Host→Client 数据通道：Host 提供 `TypertRemoteService` 子类（`super(ctx, key)` + `@Remote("method")`）。官方服务由 dsh-api-remotes 自动挂载 `remote.<ns>` 客户端面；**自定义服务不自动挂载**，本插件客户端改用 `ctx.connection.rpc.call('/api', 'usageStats/<method>', payload)` 直连，返回 `{ok, value}` 信封 | dsh-host-plugin-inventory / dsh-api-gateway client.js / dsh-client-connection |
| Client UI：settings 区注册（`settings.section` / `settings.<domain>.tab`），纯 JS（React.createElement），`inject: ["slots","locale","connection"]`（不经 `remote`，见上行） | dsh-client-ui-settings-plugin-inventory |
| Bundle 装配：npm 包声明 `dsh.bundle.patch` → `cordis.patch.yml` 插行；`dsh plugin --profile web add <path>` 追加进 profile 的 bundles 列表 | 官方"打包与安装插件"教程 |

## 2. 平面决策

聚合的是**跨会话、跨工作区**的机器级数据 → 属于 **host 组合层**（"anything crossing
sessions … stays host-side"），不放进任何 agent preset：
- 不随会话生命周期挂载/卸载（会话消失统计不能丢）
- 不占模型上下文、不进工具目录
- 一个进程一个实例，正好匹配 `TypertRemoteService` 的提供语义

装配顺序：`@deepseek-ai/dsh-base` → `@deepseek-ai/dsh-web-app` → **`dsh-usage-dashboard`** → profile 自己的 `cordis.patch.yml`。

## 3. 架构

```
┌─────────────── Browser (client) ────────────────────┐   ┌───────────── Host (node) ─────────────┐
│  Settings → "用量统计" 页 (lib/client.js)            │   │  dsh-usage-dashboard 插件行            │
│  ├─ 汇总卡片: tokens / 花费 / 请求数 / 会话数 / 命中率 │   │  lib/index.js: UsageStatsGateway       │
│  ├─ 趋势图: 按天堆叠柱（输入/输出/缓存读/缓存写）      │◄──│    extends TypertRemoteService         │
│  ├─ 排行: 按会话 / 按模型 / 按工作区                  │RPC│    super(ctx,'usageStats')              │
│  └─ 刷新按钮 + 最后扫描时间                          │   │  ┌─ lib/scan.js      扫描 $DSH_HOME/   │
│  ctx.connection.rpc.call('/api',                     │   │  │                  sessions/**/*.zstd  │
│    'usageStats/{overview,sessions,models,refresh}')  │   │  │                                 │
│    refresh}                                         │   │  ├─ lib/aggregate.js 解析+去重+维度聚合 │
└─────────────────────────────────────────────────────┘   │  ├─ lib/pricing.js  价格表/成本估算     │
                                                          │  └─ 内存 Store + 增量缓存(mtime/size)   │
                                                          └─────────────────────────────────────────┘
```

## 4. 模块结构

```
dsh-usage-dashboard/
├── package.json          # dsh.bundle 清单 + dsh.client 浏览器半声明
├── cordis.patch.yml      # 组合层：插入 usage-stats 行
├── lib/
│   ├── index.js          # Host 插件入口：UsageStatsGateway（remote 服务）
│   ├── scan.js           # 纯函数：扫描会话日志目录（zstd 解码 + mtime/size 增量）
│   ├── aggregate.js      # 纯函数：JSONL 解析、按 (turn,step) 去重、维度聚合
│   ├── pricing.js        # 价格表（官方定价常量 + 手动覆盖）
│   └── client.js         # Browser 半：Settings 用量统计页
├── scripts/build.mjs     # esbuild 构建（装饰器需要编译）
└── README.md
```

## 5. Remote API 契约（v0.1）

Host 注册 `usageStats`，全部返回 lossless JSON：

```ts
overview(range: 'all' | 'day' | 'week' | 'month') => {
  summary: {
    sessions, calls, turns,
    tokens: { uncachedInput, cacheRead, cacheWrite, output, reasoning, total },
    costEstimateUsd, cacheHitRate,           // 命中率 = cacheRead / (uncachedInput + cacheRead)
    firstActivityAt, lastActivityAt, scannedAt,
  },
  buckets: [{ key: 'YYYY-MM-DD', calls, tokens: {...} }],   // 按天桶（range=day 按小时）
  sessions: [{ sessionId, workspace, calls, tokens, costEstimateUsd, lastActivityAt }],
  models:   [{ provider, model, calls, tokens, costEstimateUsd }],
}
sessions() => SessionStat[]              // 全量会话明细（供展开/排序）
models()   => ModelStat[]                // 按 provider/model 聚合
refresh()  => { scanned, changed, ms }   // 强制重扫（增量）
```

## 6. 数据语义（关键决策）

1. **口径 = 账单口径**：每次请求的完整输入上下文都计入（跨请求重复计费属正常，与
   pi-session-stats 等工具一致）；不做"上下文增量"折算。
2. **去重**：同一 `(turn, step)` 取**最终** usage（`assistant/message` 覆盖
   `assistant/chunk`）；失败请求若已上报用量则保留（与 token-meter 投影一致）。
3. **子代理**：v0.1 扫描全部会话目录（含子代理嵌套会话），文档注明"父会话 toolResult
   可能重复携带子代理用量"的已知风险；v0.2 用 runId 映射去重。
4. **成本**：价格表驱动估算——内置 DeepSeek 官方定价常量（in/out/cache_read/cache_write
   四档），支持配置覆盖；`costEstimate` 明确标注为估算。
5. **性能**：首扫全量（实测 8 会话、~35M tokens 秒级）；之后按文件 mtime/size 增量；
   聚合结果常驻内存，必要时 JSON 检查点。
6. **实时性**：v0.1 打开页面/手动刷新时重扫；v0.2 监听 `session/*` 事件增量更新。

## 7. UI（Settings → 用量统计，已实现）

```
┌─ 用量统计 ────────────────────────────────────────────────┐
│ [全部 ▾] [刷新 ↻]  最后扫描: 14:03:22                      │
│ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌──────────┐  │
│ │ 总tokens│ │ 估算花费 │ │ 请求数  │ │ 会话数  │ │ 缓存命中率 │  │
│ │ 35.5M   │ │ $0.42  │ │ 385    │ │ 8      │ │ 97.9%    │  │
│ └────────┘ └────────┘ └────────┘ └────────┘ └──────────┘  │
│ ▓ 按天趋势（输入/输出/缓存读/缓存写 堆叠柱）                 │
│ █ 按会话排行  █ 按模型排行  █ 按工作区排行（可排序表格）       │
└───────────────────────────────────────────────────────────┘
```

## 8. 安装与装配

```bash
cd /root/DSH/plugins/dsh-usage-dashboard
pnpm install && pnpm build
dsh plugin --profile web add .          # 追加进 web profile 的 bundles
dsh --profile web --dump-config         # 验证 "dsh-usage-dashboard" 层生效
# 重启 dsh web 后生效（组合层静态装配）
```

## 9. 里程碑

- **M0 核心聚合库**（已完成大半）：scan.js + aggregate.js，CLI 自测通过
- **M1 Host 服务**：UsageStatsGateway + cordis.patch.yml + 安装进 web profile 验证装配
- **M2 Client 页 v0.1**：只读展示（卡片 + 趋势 + 排行），remote 直连
- **M3 增强**：增量刷新事件钩子、价格表/成本估算完善、排序筛选
- **M4 打磨**：多语言、主题适配、打包发布（`.dsh-plugin`）

## 10. 风险与待确认（构建前用 cordis_inspect 核实）

- [ ] `settings.section` 的注册协议/owner props（v0.1 可先挂 `settings.<domain>.tab`）
- [ ] bundle 内双面包（node + `dsh.client` 浏览器半）的确切解析方式
- [ ] `@Remote` 装饰器需构建步骤：esbuild（TC39 装饰器）或仓库同款 tsc 配置
- [ ] zstd 解码依赖系统 `zstd` 二进制（`zstd -dc`）；可换 wasm 绑定消除外部依赖
- [ ] 子代理用量重复计数口径（v0.2）
- [ ] client 端 styles 服务签名已在 client-runtime 核实（styles.insert(css)）

## 11. v0.1 改进记录（自检）

- 命中率口径对齐官方 stats strip：分母含 cacheWrite
- chunk-only 记录继承日志内最近 provider/model，消除 ?/? 桶
- diffChanged 返回 removed，删除的会话文件被清理出 store
- overview/sessions/models 支持 range（all/day/week/month）过滤
- 模型排行过滤零用量组（空流锚点不占排行，全局计数保留）
- client UI 从占位卡片升级为完整看板：卡片 + 堆叠趋势图 + 会话/模型排行表 + 范围切换 + 刷新，样式全部用 DSH 设计令牌