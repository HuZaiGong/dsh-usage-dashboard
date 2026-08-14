// pricing.js — 成本估算：价格表驱动（USD / 百万 tokens，四档）。
// v0.1 内置 DeepSeek 官方定价常量；后续支持配置覆盖 + 可选 models.dev 拉取。
// costEstimate 是估算，明确标注：不是计费记录。

export const DEFAULT_PRICES = {
  // 模型名子串 -> { uncachedInput, cacheRead, cacheWrite, output }（$ / M tokens）
  'deepseek-v4':  { uncachedInput: 2.0,  cacheRead: 0.5, cacheWrite: 2.5, output: 8.0 },
  'deepseek-v3':  { uncachedInput: 2.0,  cacheRead: 0.5, cacheWrite: 2.5, output: 8.0 },
}

/** 查找某模型的价格表项；未知名返回 null（不计费）。 */
export function lookupPrice(model, table = DEFAULT_PRICES) {
  if (!model) return null
  const m = model.toLowerCase()
  for (const [key, price] of Object.entries(table)) {
    if (m.includes(key)) return price
  }
  return null
}

/** 按用量估算花费（USD）。 */
export function estimateCost(usage, model, table = DEFAULT_PRICES) {
  const price = lookupPrice(model, table)
  if (!price) return null
  return (
    (usage.uncachedInput * price.uncachedInput +
      usage.cacheRead * price.cacheRead +
      usage.cacheWrite * price.cacheWrite +
      usage.output * price.output) / 1e6
  )
}
