# AGENTS.md — dsh-usage-dashboard

> 本文件是给 AI 编码代理（dsh agent）的项目指导。dsh 会在会话启动时自动加载
> 本文件（$DSH_HOME/AGENTS.md 为全局，本项目为项目级），并随文件变化实时更新。
> 修改本文件后，进行中的会话会在下一次工具调用后看到变更。

## 1. 项目是什么

全 DSH（DeepSeek Harness）**用量汇总插件**：把机器上所有工作区 × 所有会话的
LLM token 用量/花费聚合成一个看板，展示在 Web Settings 的「用量统计」页。

- npm 包：`@huzaigong/dsh-usage-dashboard`（已发布 0.1.x，注意 scope 是 `huzaigong`，**没有第二个 h**）
- GitHub：`HuZaiGong/dsh-usage-dashboard`（public）
- 形态：Cordis 插件（host 半 = remote 服务；client 半 = 浏览器 bundle）

## 2. 架构与数据流

```
Browser (client)                          Host (node, 组合层)
Settings 用量统计页  ──RPC──▶  /api/usageStats/{overview,sessions,models,refresh}
lib/client.js                  lib/index.js: UsageStatsGateway extends TypertRemoteService
  ctx.connection.rpc.call          ├─ lib/scan.js      扫描 $DSH_HOME/sessions/**/session.jsonl.zstd
  ('/api','usageStats/x')          ├─ lib/aggregate.js 解析+去重+维度聚合
                                   ├─ lib/pricing.js   价格表/成本估算
                                   └─ 内存 Store + mtime/size 增量缓存
```

- **host 半**（lib/index.js）：组合层插件（跨会话、跨工作区的机器级数据），进程单实例。
- **client 半**（lib/client.js）：不依赖 `ctx.remote`（自定义服务不自动挂载 remote 面），
  用 `ctx.connection.rpc.call('/api', 'usageStats/<method>', payload)` 直连。
  payload 格式：`{args:{}}`（无参）或 `{args:{args:{...}}}`（对象参数）。
- **装配**：`cordis.patch.yml` 在 web profile 的 bundles 里插入一行（id: usage-stats）。

## 3. ⚠️ 最关键的三条警告（违反会导致静默故障）

1. **符号链接（模块实例一致性）**：
   `node_modules/@deepseek-ai/{cordis,dsh-typert-protocol}` 必须是指向 **dsh 安装树**
   （`/usr/local/lib/node_modules/@deepseek-ai/dsh/node_modules/@deepseek-ai/`）的符号链接，
   不能是 pnpm 本地副本。@Remote 发现的私有 marker WeakMap 与 cordis Service 符号
   **按模块实例隔离**——副本会导致网关发现 0 个方法、RPC 404，且无报错日志。
   **每次 `pnpm install` / `pnpm add` / profile install 之后必须重跑 `pnpm run link-deps`**。

2. **@Remote 方法签名（SRC 校验）**：参数必须是唯一标识符——
   **不能有默认值、解构、rest**（写 `overview(args)`，不要写 `overview(args = {})`）。
   默认值只允许出现在非 remote 方法（如 `sessionsList(range='all')`）。

3. **验证 remoteMethods 要从 dsh 树导入 typert-protocol**：
   `import {remoteMethods} from '/usr/local/lib/node_modules/@deepseek-ai/dsh/node_modules/@deepseek-ai/dsh-typert-protocol/lib/index.js'`
   从 profile 的副本导入会得到假阴性（[]）。实例化需要完整 ctx 桩（含 `reflect.provide`）。

## 4. 构建与测试

```bash
pnpm install           # 之后必须：pnpm run link-deps
pnpm run link-deps     # 重建指向 dsh 安装树的符号链接（关键！）
pnpm build             # esbuild → dist/index.js + dist/client.js
node scripts/smoke-test.mjs   # 聚合核心冒烟测试（CI 同款）
```

- **`node --check` 不支持 @Remote 装饰器**（报 SyntaxError）——语法验证以 `pnpm build` 为准。
- CI（`.github/workflows/build.yml`）用 **Node 24 + pnpm 11**（pnpm 11 要求 Node ≥22.13，
  Node 20 会让 setup-node 的 pnpm 缓存步骤崩溃）。改 workflow 时保持这个组合。
- 冒烟测试在 `scripts/smoke-test.mjs`；新增聚合逻辑必须补断言（dedup/compaction/时区桶）。

## 5. 目录结构

```
lib/index.js        # Host：UsageStatsGateway（TypertRemoteService，@Remote 方法）
lib/scan.js         # discoverSessions / diffChanged / readSessionLog(CLI) / readSessionLogJs(fzstd) / zstdAvailable
lib/aggregate.js    # parseLine / extractUsage / sumUsage / bucketByDay / bucketByHour / groupByModel / sessionMeta / filterByRange
lib/pricing.js      # DEFAULT_PRICES / lookupPrice / mergePrices / loadConfigPrices / normalizeModelsDevTable / fetchModelsDev
lib/client.js       # Browser：Settings「用量统计」看板（纯 React.createElement）
scripts/build.mjs   # esbuild 双 bundle（client 用 __ModuleLoader__.load 包装，id = 包名）
scripts/link-deps.sh# 重建符号链接（README「依赖链接」）
scripts/smoke-test.mjs  # 冒烟测试
scripts/gh-push.mjs     # 双通道 push（直连 git push / gh api Git Data API 回退）
cordis.patch.yml    # 组合层插行（name 必须是当前包名 @huzaigong/dsh-usage-dashboard）
```

## 6. 代码规范

- **纯 JS**：无 TypeScript 编译链；装饰器由 esbuild 构建时编译。
- **client 无 JSX**：一律 `React.createElement`；React 由运行时模块表提供（external）。
- **UI 只用 DSH 设计令牌**：`--dsw-alias-*`、`--ds-font-family-code`、`--dsw-shadow-lv1`；
  样式经 `injectStyles()` 注入 `<style data-plugin-css>`（带 data-plugin 标记）。
- **聚合核心保持纯函数**（scan/aggregate/pricing），无状态、可单测；index.js 只做编排。
- **命中率口径**（与官方对齐）：`cacheRead / (uncachedInput + cacheRead + cacheWrite)`。
- **分桶用本地时区**：`bucketByDay`/`bucketByHour` 用 `getFullYear/getMonth/getDate/getHours`，
  **不要用 `toISOString()`**（UTC 会误导中国用户晚 8 点后的数据归属）。
- **客户端异步**：range 切换竞态用 `seqRef` 序号保护；`onRefresh` 必须 catch 错误显示到页面。
- **scan 并发**：`scan()` 有互斥锁（重叠排队），事件钩子/手动刷新/overview 并发安全。

## 7. 数据语义（务必保持）

- **去重**：同一 `(turn, step)` 后者覆盖前者（`assistant/message` 覆盖 `assistant/chunk{type:usage}`）。
- **compaction/summary**：`data.usage` 顶层字段携带压缩消耗（无 turn/step），
  以 `compactionId` 去重后计入——**必须统计**（实测单次可达 77k input tokens）。
- **子代理**：`session` 事件的 `delegationDepth > 0` 标记子代理会话（UI 显示「子代理」徽标，
  overview 返回 `subagentSessions`）。
- **增量实时**：`ctx.on('session/event')`（组合层根 ctx 冒泡可达）→ 节流 800ms → 增量重扫。
- **zstd 解码**：系统 CLI 优先（快）；缺失时 fzstd 纯 JS 回退（完整流与 CLI 100% 一致；
  写入中的不完整流少尾部数据，靠 scan 失败重试逻辑下次补齐）。
- **价格表优先级**：`$DSH_HOME/usage-prices.json` 配置覆盖 > models.dev 动态拉取 > 内置常量。
  models.dev 5s 超时静默回退（本机不可达是常态）；key 长优先匹配 + provider 前缀剥离。
  未计价模型在 UI 提示（`unpricedModels`）。

## 8. 发布流程（重要）

```bash
node scripts/gh-push.mjs "feat: xxx"    # 提交全部改动并推送（自动选通道）
git tag v0.1.x && node scripts/gh-push.mjs   # 打 tag（直连不通时用 gh api 建 ref）
```

- **gh-push.mjs 双通道**：github.com 直连可用 → `git push`；不可达（ETIMEDOUT）→
  自动改用 gh api Git Data API（只依赖 api.github.com，通常稳定）。
- **网络事实**：`github.com` 间歇性不可达（git push 会挂起直到超时）；`api.github.com` 稳定；
  `gh-proxy.com` 只读可用（fetch/clone 加速，**不支持 push**）；`gh.1s.fan` 本机不可达。
  只读对齐：`git fetch 'https://gh-proxy.com/https://github.com/HuZaiGong/dsh-usage-dashboard.git' 'main:refs/remotes/origin/main'`。
- **npm 发布**：打 `v*` tag → GitHub Actions（publish.yml）自动构建 + 冒烟测试 + `pnpm publish`。
  仓库 secret：`NPM_TOKEN`。发版 = push main + push tag，**不需要手动操作 npm**。
- 版本号在 `package.json`；发版前 bump（`sed -i 's/"version": "0.1.x"/"version": "0.1.y"/'`）。
- 发布内容由 `files` 控制（dist + cordis.patch.yml + README + scripts/link-deps.sh；LICENSE 自动含）。

## 9. 环境事实（本机）

- dsh 安装：`/usr/local/lib/node_modules/@deepseek-ai/dsh/`
- dsh web：`http://127.0.0.1:3080`（重启保持 URL；重启脚本 `/tmp/restart-dsh.sh` 延迟 4-5s）
- 日志：`/tmp/dsh-web.log`；重启记录：`/tmp/dsh-web-restart.log`
- 会话数据：`$DSH_HOME/sessions/<workspace>/<sessionId>/session.jsonl.zstd`（zstd 压缩 JSONL）
- web profile：`/root/.dsh/profiles/web/`（依赖键是 `@huzaigong/dsh-usage-dashboard: link:/root/DSH/plugins/dsh-usage-dashboard`）
- 宿主 RPC 探针（验证用）：
  ```bash
  curl -s -X POST http://127.0.0.1:3080/api/usageStats/overview -H 'content-type: application/json' \
    -d '{"type":"client-request","rpcId":"probe","method":"usageStats/overview","payload":{"args":{"args":{"range":"all"}}}}'
  ```
- 客户端 bundle 每请求读盘（no-cache）——**client 改动只需浏览器强刷，无需重启**；
  host（lib/index.js）改动需重启 dsh web。

## 10. 常见故障速查

| 症状 | 原因 | 处理 |
|---|---|---|
| RPC 404 "not found"、remoteMethods=[] | 符号链接被 pnpm install 覆盖 | `pnpm run link-deps` + 重启 |
| SRC method ... must use unique identifier parameters | @Remote 方法带默认参数 | 去掉默认值/解构 |
| CI setup-node 崩（ERR_UNKNOWN_BUILTIN_MODULE） | Node 20 + pnpm 11 | workflow 用 Node 24 |
| npm publish 403/404 | 2FA 未绕过 / scope 拼写 | Automation token / 检查 `huzaigong` 拼写 |
| 数据里未计价的模型 | 内置表无该模型 + models.dev 不可达 | 加 `$DSH_HOME/usage-prices.json` 覆盖 |
