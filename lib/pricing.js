// pricing.js — 成本估算：价格表驱动（USD / 百万 tokens，四档）。
// v0.1 内置 DeepSeek 官方定价常量；后续支持配置覆盖 + 可选 models.dev 拉取。
// costEstimate 是估算，明确标注：不是计费记录。

export const DEFAULT_PRICES = {
  // 模型名子串 -> { uncachedInput, cacheRead, cacheWrite, output }（$ / M tokens）
  'deepseek-v4':  { uncachedInput: 2.0,  cacheRead: 0.5, cacheWrite: 2.5, output: 8.0 },
  'deepseek-v3':  { uncachedInput: 2.0,  cacheRead: 0.5, cacheWrite: 2.5, output: 8.0 },
}

/** 按 key 长度降序的条目列表（长 key 优先匹配，避免 deepseek-v4 抢占 deepseek-v4-flash）。 */
export function sortedEntries(table) {
  return Object.entries(table).sort((a, b) => b[0].length - a[0].length)
}

/** 查找某模型的价格表项；未知名返回 null（不计费）。 */
export function lookupPrice(model, table = DEFAULT_PRICES) {
  if (!model) return null
  const m = model.toLowerCase()
  for (const [key, price] of sortedEntries(table)) {
    if (m.includes(key)) return price
  }
  return null
}

/** 合并多张价格表（后者覆盖前者同名 key）。 */
export function mergePrices(...tables) {
  return Object.assign({}, ...tables.filter(Boolean))
}

/** 读取 $DSH_HOME/usage-prices.json 用户覆盖表（不存在返回空表）。 */
export function loadConfigPrices(home) {
  try {
    const raw = JSON.parse(readFileSync(join(home, 'usage-prices.json'), 'utf8'))
    const out = {}
    for (const [key, v] of Object.entries(raw)) {
      const row = {
        uncachedInput: Number(v.uncachedInput ?? v.input ?? 0),
        cacheRead: Number(v.cacheRead ?? v.cache_read ?? 0),
        cacheWrite: Number(v.cacheWrite ?? v.cache_write ?? 0),
        output: Number(v.output ?? 0),
      }
      if (row.uncachedInput || row.cacheRead || row.cacheWrite || row.output) out[key.toLowerCase()] = row
    }
    return out
  } catch {
    return {}
  }
}

/**
 * 拉取 models.dev 全量价格（$ / M tokens）。网络不可达/超时返回 null（调用方静默回退）。
 * models.dev api.json 结构：{ [modelId]: { cost: { input, output, cache_read, cache_write } } }
 */
export async function fetchModelsDev(timeoutMs = 5000) {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), timeoutMs)
  try {
    const res = await fetch('https://models.dev/api.json', { signal: ctrl.signal })
    if (!res.ok) return null
    const data = await res.json()
    const table = {}
    for (const [id, m] of Object.entries(data)) {
      const c = m && m.cost
      if (!c) continue
      const row = {
        uncachedInput: Number(c.input ?? 0),
        cacheRead: Number(c.cache_read ?? 0),
        cacheWrite: Number(c.cache_write ?? 0),
        output: Number(c.output ?? 0),
      }
      if (row.uncachedInput || row.cacheRead || row.cacheWrite || row.output) table[id.toLowerCase()] = row
    }
    return table
  } catch {
    return null
  } finally {
    clearTimeout(timer)
  }
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