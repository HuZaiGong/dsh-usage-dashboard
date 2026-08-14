## 变更内容

<!-- 简述本次改动解决了什么问题、改了什么 -->

## 动机与背景

<!-- 关联的 Issue：#123；或说明为什么需要这个改动 -->

## 验证方式

- [ ] `pnpm build` 通过
- [ ] `node scripts/smoke-test.mjs` 通过
- [ ] CI（build workflow）通过
- [ ] （如涉及 UI/装配）本地 dsh web 实测说明

## 检查清单

- [ ] 未提交 `node_modules/`（含本机符号链接）
- [ ] 若新增聚合逻辑，已在 smoke-test 补断言
- [ ] 提交信息使用语义化前缀（`feat:` / `fix:` / `docs:` …）
