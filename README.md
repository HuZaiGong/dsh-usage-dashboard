# @huzaigong/dsh-usage-dashboard

![build](https://github.com/HuZaiGong/dsh-usage-dashboard/actions/workflows/build.yml/badge.svg) ![license](https://img.shields.io/badge/license-MIT-blue.svg) ![dsh](https://img.shields.io/badge/dsh-%3E%3D0.1.7--rc.2%20%3C0.3.0-blueviolet)

全 DSH 用量汇总插件：把**所有工作区 × 所有会话**的 LLM 用量聚合成看板，
展示在 Web Settings 的"用量统计"页。

## 功能

- 全局汇总卡片：总 tokens（输入/输出细分）、估算花费、请求数、会话数、缓存命中率
- 按天堆叠趋势图（未缓存输入 / 缓存读 / 缓存写 / 输出）；**悬停柱子显示该时间段用量细分浮窗**（24h 与 30d 均支持）
- 排行表：按会话（含工作区）、按模型（provider/model），**表头点击排序** + **一键展开全部**（默认截断 15/10 行）
- 时间范围切换：全部 / 近 7 天 / 近 30 天（柱状图按天）；**近 24 小时按小时桶**
- 子代理会话自动标记（delegationDepth>0）；上下文压缩（compaction）用量纳入统计
- 增量实时：监听会话事件，有活动时自动重扫（无需手动刷新）
- 手动刷新（增量重扫）
- 命中率口径与官方 stats strip 一致：cacheRead / (uncached + cacheRead + cacheWrite)
- 风格使用 DSH 设计令牌（--dsw-alias-* / --ds-font-family-code），styles.insert() 注入

设计文档见 [DESIGN.md](./DESIGN.md)。

## 社区

- [贡献指南](./CONTRIBUTING.md) · [行为准则](./CODE_OF_CONDUCT.md) · [安全策略](./SECURITY.md) · [AGENTS.md](./AGENTS.md)（AI 代理项目指导）
- [提交 Issue](https://github.com/HuZaiGong/dsh-usage-dashboard/issues/new/choose)（Bug / 功能建议有模板）

## 结构

- `lib/scan.js` — 扫描 `$DSH_HOME/sessions/**/session.jsonl.zstd`，mtime/size 增量，清理已删除会话
- `lib/aggregate.js` — 解析 + 按 (turn, step) 去重 + 维度聚合（含 range 过滤）
- `lib/pricing.js` — 价格表驱动成本估算（内置 + models.dev + 配置文件覆盖）
- `lib/index.js` — Host：`usageStats` remote 服务（TypertRemoteService）
- `lib/client.js` — Browser：Settings 用量统计页（DSH 风格可视化看板）
- `scripts/build.mjs` — esbuild 构建（host + client 双 bundle）
- `scripts/link-deps.sh` — 直连 `lib/index.js` 调试时的依赖链接（可选；正常安装不需要）
- `scripts/smoke-test.mjs` — 聚合核心冒烟测试（CI 同款）
- `scripts/gh-push.mjs` — 双通道推送（直连 git push / gh api Git Data API 回退）

## 模块实例一致性（重要）

宿主侧的 @Remote 发现要求插件与 dsh 的 api-gateway 使用**同一个**
`@deepseek-ai/dsh-typert-protocol` 模块实例：gateway 读取的 Remote 标记，必须正是插件
装饰器写入的那一份（0.1.0-rc.6 写在模块私有的 WeakMap 里；0.2.0-rc.2 起写在类原型上的
公开字符串描述符上）。副本会导致网关发现 **0 个方法**、RPC 404，且**没有任何报错日志**。

因此本包把它声明为 **peerDependency**，而不是普通依赖（同时声明 dsh 运行时下限，
见下节）：

```json
"peerDependencies": {
  "@deepseek-ai/dsh": ">=0.1.7-rc.2 <0.3.0",
  "@deepseek-ai/dsh-typert-protocol": ">=0.1.0-rc.6 <0.3.0"
}
```

dsh 的 profile 模块解析会为**声明为 peer 的名字**提供运行时的那个实例，所以：

- 不需要符号链接、不需要 `link-deps`；`pnpm install` 也没有东西可覆盖
- 本地开发由 `pnpm-workspace.yaml` 的 `autoInstallPeers: false` 保证不会拉一个会遮蔽
  运行时的本地副本 —— dsh 初始化 profile 时自己就会写入这个设置

> **历史与打包版差异**：0.1.4 及更早把该包放在 `dependencies`，并用
> `scripts/link-deps.sh` 建符号链接指向 dsh 安装树。该做法在**打包桌面版不可用**——
> dsh 树位于 `app.asar` 内，符号链接目标无法穿越 asar。peer 声明是 dsh 的官方机制，
> 源码树与打包版两种形态都适用。

## 兼容性（重要）

dsh 的插件 API 仍在 rc 阶段，跨版本存在破坏性变化。本插件依赖**两项自
`dsh 0.1.7-rc.2` 才引入**的机制：

1. profile 插件解析：为声明为 peer 的名字提供运行时实例
2. 启动时的 `peerDependencies` 版本门控（校验 `@deepseek-ai/dsh*`）

因此本包声明了明确的运行时区间：

| dsh 版本 | 状态 |
|---|---|
| `>= 0.1.7-rc.2`，`< 0.3.0` | ✅ 支持 —— `0.2.0-rc.2`（Windows 打包桌面版）已端到端验证 |
| `0.1.6-alpha.x` | ⚠️ 机制不完整，未验证 |
| `<= 0.1.5-rc.3` | ❌ 无运行时解析机制，peer 无法解析 → 加载失败。旧版请用 `scripts/link-deps.sh` 建立指向 dsh 安装树的符号链接 |
| `>= 0.3.0` | ⛔ 默认拒绝（区间上界）。确需使用时按 dsh 提示执行 `dsh plugin allow-version ... --accept-risk` 显式豁免 |

被门控拒绝时 dsh 会打印**可操作**的信息（包名、版本、运行时版本、`allow-version`
命令），而不是静默失败。

会话日志解析目前只验证过 **session format v4**（`session.v4.jsonl.zstd`，dsh 0.2.0-rc.2）。
`scan.js` 的文件名正则会同时接受 `session.jsonl.zstd` 与 `session.<tag>.jsonl.zstd`，
但更早的 v0–v3 事件结构是否同样带 `assistant/message` + `data.usage` **未验证**。

## 安装方式

**方式 A：npm 安装（推荐）**

```bash
pnpm add @huzaigong/dsh-usage-dashboard
# 装到 web profile：
dsh plugin --profile web add @huzaigong/dsh-usage-dashboard
# 重启 dsh web 后生效
```

**方式 B：从源码（仓库开发）**

```bash
cd plugins/dsh-usage-dashboard
pnpm install          # 安装 esbuild 等
pnpm build            # 产出 dist/
dsh plugin --profile web add .
dsh --profile web --dump-config   # 验证装配层
# 重启 dsh web 后生效
```

## CLI 自测（不经 dsh，直接验证聚合核心）

推荐直接跑冒烟测试：

```bash
node scripts/smoke-test.mjs
```

也可用下面这段直接读真实会话验证聚合（需系统 `zstd` CLI；缺失时插件会自动用纯 JS 解码，但本命令仍走 CLI）：

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
- [x] v0.2 增量事件钩子（订阅 session/event，节流合并重扫）
- [x] v0.2 排序筛选（会话/模型表头点击排序）
- [x] v0.2 compaction/summary 压缩用量纳入统计
- [x] v0.2 子代理会话识别（delegationDepth 标记）
- [x] v0.2 zstd 缺失探测与友好报错
- [x] 成本价格表：内置 DeepSeek 常量 + models.dev 动态拉取（超时静默回退）+ `$DSH_HOME/usage-prices.json` 配置覆盖；未计价模型在 UI 提示
- [x] zstd 解码回退：系统 zstd 缺失时自动改用纯 JS（fzstd）解码（完整流与 CLI 一致）
- [x] 0.1.2 图表 hover 浮窗（24h/30d 柱上悬停看细分用量）
- [x] 0.1.3 安全修复（esbuild 升级 GHSA-67mh-4wv8-2f99、依赖版本锁定、fzstd 解码大小守卫）
- [x] 已发布 npm（0.1.x，组织 @huzaigong 归属）；GitHub Actions 自动构建 + 发布
- [x] 安装进 web profile 实测（Host RPC + Settings 看板均已在运行实例验证）
- [x] 0.1.5 兼容 dsh 0.2.0-rc.2：`@deepseek-ai/dsh-typert-protocol` 改为 peerDependency，
      移除对符号链接（`link-deps`）的依赖，打包桌面版（dsh 树在 `app.asar` 内）同样适用
- [x] 0.1.5 兼容 dsh 0.2.0-rc.2 会话格式 v4：日志名为 `session.v4.jsonl.zstd`（原来只认
      `session.jsonl.zstd`，导致扫不到会话、看板空白且不报错）；同时修复 Windows 下
      `sessionId` 取值错误与 `build.mjs` 的 `URL.pathname` 构建失败
- [x] 0.1.6 声明运行时区间 `@deepseek-ai/dsh: >=0.1.7-rc.2 <0.3.0`：把「profile peer 解析 +
      版本门控」这两项机制的存在范围变成显式契约，不支持的版本由 dsh 给出可操作提示；
      清掉 `dsh.client.inject` 中自 0.1.0 起就不存在、也从未存在的 `dsh-client-runtime`