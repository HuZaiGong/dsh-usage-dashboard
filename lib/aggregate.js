// aggregate.js — 纯函数：解析会话 JSONL，按 (turn, step) 去重，维度聚合。
// 已用真实 ~/.dsh/sessions 数据验证。
//
// 命中率口径与 DSH 官方 stats strip 对齐（dsh-client-ui-conversation）：
//   cacheHitRate = cacheRead / (uncachedInput + cacheRead + cacheWrite)

/** 解析一行 JSON，返回事件对象或 null。 */
function parseLine(line) {
  try { return JSON.parse(line) } catch { return null }
}

/**
 * 从单条日志提取该会话的用量记录：
 * - 同一 (turn, step) 后者覆盖前者（assistant/message 覆盖 assistant/chunk{type:usage}）
 * - compaction/summary 无 turn/step，以 compactionId 去重（压缩消耗单独计数）
 * - provider/model 取自 assistant/message 的 message.source 或 compaction 的 data 字段；
 *   chunk-only 记录继承日志中最近一次已知的 provider/model（消除 ?/? 桶）
 * 返回 [{ turn, step, provider, model, uncachedInput, cacheRead, cacheWrite, output, reasoning, atMs }]
 */
export function extractUsage(lines) {
  const last = new Map() // key: turn:step（compaction 用 compactionId）
  let lastProvider = null
  let lastModel = null
  for (const line of lines) {
    const ev = parseLine(line)
    if (!ev) continue
    const d = ev.data || {}
    let key = d.turn !== undefined && d.step !== undefined ? d.turn + ':' + d.step : null
    let usage = null
    if (ev.type === 'assistant/message' && d.usage) {
      usage = d.usage
      const src = d.message && d.message.source
      if (src) {
        if (src.provider) lastProvider = src.provider
        if (src.model) lastModel = src.model
      }
    } else if (ev.type === 'assistant/chunk' && d.chunk && d.chunk.type === 'usage' && d.chunk.usage) {
      usage = d.chunk.usage
    } else if (ev.type === 'compaction/summary' && d.usage) {
      // 上下文压缩消耗：无 turn/step，以 compactionId 去重，provider/model 从事件自带
      usage = d.usage
      if (d.provider) lastProvider = d.provider
      if (d.model) lastModel = d.model
      key = 'compaction:' + (d.compactionId || ev.seq || Math.random())
    }
    if (usage && key !== null) {
      last.set(key, {
        turn: d.turn,
        step: d.step,
        provider: lastProvider,
        model: lastModel,
        uncachedInput: usage.inputTokens ?? usage.uncachedInputTokens ?? 0,
        cacheRead: usage.cacheReadTokens ?? 0,
        cacheWrite: usage.cacheWriteTokens ?? 0,
        output: usage.outputTokens ?? 0,
        reasoning: usage.reasoningTokens ?? usage.reasoning ?? 0,
        atMs: ev.time ?? null,
      })
    }
  }
  return [...last.values()]
}

/** 从日志提取会话元信息（首个 session 事件）：delegationDepth>0 表示子代理会话。 */
export function sessionMeta(lines) {
  for (const line of lines) {
    const ev = parseLine(line)
    if (ev && ev.type === 'session') {
      return {
        delegationDepth: ev.delegationDepth ?? 0,
        agentPreset: ev.agentPreset ?? null,
        createdAt: ev.createdAt ?? null,
      }
    }
  }
  return { delegationDepth: 0, agentPreset: null, createdAt: null }
}

/** 聚合一组用量记录（单会话或全局）。 */
export function sumUsage(records) {
  const s = { calls: records.length, uncachedInput: 0, cacheRead: 0, cacheWrite: 0, output: 0, reasoning: 0 }
  for (const r of records) {
    s.uncachedInput += r.uncachedInput
    s.cacheRead += r.cacheRead
    s.cacheWrite += r.cacheWrite
    s.output += r.output
    s.reasoning += r.reasoning
  }
  s.total = s.uncachedInput + s.cacheRead + s.cacheWrite + s.output
  const billedInput = s.uncachedInput + s.cacheRead + s.cacheWrite
  s.cacheHitRate = billedInput > 0 ? s.cacheRead / billedInput : 0
  return s
}

/** 按天分桶（key = 本地时区日期 YYYY-MM-DD，排序输出）。 */
export function bucketByDay(records) {
  const buckets = new Map()
  const keyOf = (ms) => {
    const d = new Date(ms)
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return y + '-' + m + '-' + day
  }
  for (const r of records) {
    const key = r.atMs ? keyOf(r.atMs) : 'unknown'
    if (!buckets.has(key)) buckets.set(key, [])
    buckets.get(key).push(r)
  }
  return [...buckets.entries()]
    .map(([key, rs]) => ({ key, ...sumUsage(rs) }))
    .sort((a, b) => a.key.localeCompare(b.key))
}

/** 按小时分桶（key = 本地时区 YYYY-MM-DD HH:00，range=day 时使用）。 */
export function bucketByHour(records) {
  const buckets = new Map()
  const keyOf = (ms) => {
    const d = new Date(ms)
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const h = String(d.getHours()).padStart(2, '0')
    return y + '-' + m + '-' + day + ' ' + h + ':00'
  }
  for (const r of records) {
    const key = r.atMs ? keyOf(r.atMs) : 'unknown'
    if (!buckets.has(key)) buckets.set(key, [])
    buckets.get(key).push(r)
  }
  return [...buckets.entries()]
    .map(([key, rs]) => ({ key, ...sumUsage(rs) }))
    .sort((a, b) => a.key.localeCompare(b.key))
}

/** 按 provider/model 聚合。 */
export function groupByModel(records) {
  const g = new Map()
  for (const r of records) {
    const k = (r.provider || '?') + '/' + (r.model || '?')
    if (!g.has(k)) g.set(k, [])
    g.get(k).push(r)
  }
  return [...g.entries()].map(([key, rs]) => {
    const [provider, model] = key.split('/')
    return { provider, model, ...sumUsage(rs) }
  }).filter((s) => s.total > 0).sort((a, b) => b.total - a.total)
}

/** range → 起始时间戳（ms）；'all' 返回 null。 */
export function cutoffFor(range, now = Date.now()) {
  if (range === 'day') return now - 24 * 3600e3
  if (range === 'week') return now - 7 * 24 * 3600e3
  if (range === 'month') return now - 30 * 24 * 3600e3
  return null
}

/** 按 range 过滤记录（无 atMs 的记录只在 'all' 下保留）。 */
export function filterByRange(records, range, now = Date.now()) {
  const cutoff = cutoffFor(range, now)
  if (cutoff === null) return records
  return records.filter((r) => r.atMs != null && r.atMs >= cutoff)
}