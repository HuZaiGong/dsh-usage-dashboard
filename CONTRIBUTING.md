# 贡献指南

欢迎为 **@huzaigong/dsh-usage-dashboard** 贡献代码、文档或想法！请先阅读 [README](./README.md) 和 [DESIGN](./DESIGN.md) 了解项目目标与架构。

## 开发环境

前置要求：

- 已安装的 **dsh**（v0.1.0-rc.6+），`dsh` 在 PATH 上
- **pnpm**（v11+）与 Node.js 20+

> ⚠️ 本项目依赖**与 dsh 安装树共享同一模块实例**的 `@deepseek-ai/dsh-typert-protocol` 与
> `cordis`（见 README「依赖链接」一节）。**每次 `pnpm install` 后必须重跑**：

```bash
pnpm install          # 安装 esbuild 等构建依赖
pnpm run link-deps    # 重建指向 dsh 安装树的符号链接（install 会覆盖它们）
pnpm build            # 产出 dist/index.js + dist/client.js
node scripts/smoke-test.mjs   # 纯函数冒烟测试（CI 同款）
```

## 代码规范

- **纯 JS**：仓库不引入 TypeScript 编译链；装饰器（@Remote）由 esbuild 构建时编译
- **客户端无 JSX**：一律用 `React.createElement`（与官方 client 插件一致）
- **DSH 设计令牌**：UI 样式只使用 `--dsw-alias-*` / `--ds-font-family-code` 等 DSH 令牌
- **职责分层**：`lib/scan.js`（读日志）、`lib/aggregate.js`（解析/聚合）、`lib/pricing.js`（价格）
  保持纯函数、无状态，便于单测；`lib/index.js` 只做 Host 服务编排
- 聚合核心（scan/aggregate/pricing）的新逻辑尽量在 `scripts/smoke-test.mjs` 里补断言

## 提交与 PR

1. 从 `main` 切分支：`git checkout -b feat/xxx`
2. 提交信息用语义化前缀：`feat:` / `fix:` / `docs:` / `refactor:` / `test:`
3. 本地跑通：`pnpm build` + `node scripts/smoke-test.mjs`
4. 推送分支并开 PR，描述清楚**动机**和**验证方式**；CI（build workflow）必须通过
5. 不要提交 `node_modules/`（含本机符号链接）；`dist/` 随改动一起提交（发布/直接安装依赖它）

## 目录速览

```
lib/index.js        # Host：usageStats remote 服务（TypertRemoteService）
lib/scan.js         # 扫描 $DSH_HOME/sessions/**/session.jsonl.zstd（增量）
lib/aggregate.js    # JSONL 解析、(turn,step) 去重、维度聚合
lib/pricing.js      # 价格表驱动成本估算
lib/client.js       # Browser：Settings「用量统计」看板
scripts/build.mjs   # esbuild 构建（host + client 双 bundle）
scripts/link-deps.sh# 重建 dsh 安装树符号链接
scripts/smoke-test.mjs  # CI 冒烟测试
```

## 问题反馈

- Bug / 功能建议走 [Issues](https://github.com/HuZaiGong/dsh-usage-dashboard/issues/new/choose)（有模板）
- 安全问题请走 [SECURITY.md](./SECURITY.md) 的私有报告通道，勿开公开 issue
