// index.js — Host 插件入口：usageStats remote 服务（TypertRemoteService）。
// 装配后 Client 侧经 ctx.connection.rpc 直连 /api/usageStats/* 调用（自定义服务不自动挂载 remote 面）。
//
// 平面：host（跨会话、跨工作区的机器级数据），进程单实例。
// 用法：class 即插件（Cordis service plugin），loader 以 ctx 构造本类，
//       Service 基类在 super(ctx, 'usageStats') 中完成注册。

import { homedir } from 'node:os'
import { join } from 'node:path'
import { Remote, TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol'
import { discoverSessions, diffChanged, readSessionLog, zstdAvailable } from './scan.js'
import { extractUsage, sumUsage, bucketByDay, groupByModel, filterByRange, sessionMeta } from './aggregate.js'
import { estimateCost } from './pricing.js'

export class UsageStatsGateway extends TypertRemoteService {
  static inject = []

  constructor(ctx) {
    super(ctx, 'usageStats')
    const home = process.env.DSH_HOME || join(homedir(), '.dsh')
    this.sessionsRoot = join(home, 'sessions')
    this.cache = {}        // path -> { mtimeMs, size }
    this.sessions = new Map() // sessionId -> { meta, records }
    this.scannedAt = null
    this._eventDirty = false
    this._eventTimer = null
    // v0.2 增量事件钩子：会话事件（含本进程其它会话）冒泡到组合层根 ctx，
    // 合并节流后触发一次增量重扫（diff 只重读变化文件，成本低）
    ctx.effect(() => ctx.on('session/event', (store) => {
      if (!store || !store.id) return
      this._eventDirty = true
      if (this._eventTimer !== null) return
      this._eventTimer = setTimeout(() => {
        this._eventTimer = null
        if (!this._eventDirty) return
        this._eventDirty = false
        this.scan().catch(() => {})
      }, 800)
    }))
    // 首次扫描（异步，不阻塞装配）
    this.ready = Promise.resolve().then(() => this.scan())
      .catch((err) => ({ scanned: 0, changed: 0, removed: 0, ms: 0, error: String((err && err.message) || err) }))
  }

  /** 扫描目录：增量重读变化文件、清理已删除会话。返回 { scanned, changed, removed, ms }。 */
  async scan() {
    const t0 = Date.now()
    if (!zstdAvailable()) {
      return { scanned: 0, changed: 0, removed: 0, ms: Date.now() - t0, error: 'zstd CLI not found — install zstd (e.g. apt install zstd) or provide injectZstd()' }
    }
    let files
    try {
      files = discoverSessions(this.sessionsRoot)
    } catch (err) {
      return { scanned: 0, changed: 0, removed: 0, ms: Date.now() - t0, error: String((err && err.message) || err) }
    }
    const { changed, next, removed } = diffChanged(files, this.cache)
    for (const f of changed) {
      const lines = []
      try {
        readSessionLog(f.path, (line) => lines.push(line))
      } catch {
        // 日志可能正被写入或损坏：不更新缓存，下次扫描视为 changed 重试
        delete next[f.path]
        continue
      }
      const records = extractUsage(lines)
      this.sessions.set(f.sessionId, { meta: { ...f, ...sessionMeta(lines) }, records })
    }
    const removedBySessionId = new Set()
    for (const p of removed) {
      const sid = p.split(/[\\/]/).slice(-2, -1)[0] || null
      if (sid) removedBySessionId.add(sid)
    }
    for (const sid of removedBySessionId) this.sessions.delete(sid)
    this.cache = next
    this.scannedAt = Date.now()
    return { scanned: files.length, changed: changed.length, removed: removed.length, ms: Date.now() - t0 }
  }

  /** 全部记录（可选 range 过滤）。 */
  _allRecords(range, now) {
    const out = []
    for (const { records } of this.sessions.values()) out.push(...records)
    return range && range !== 'all' ? filterByRange(out, range, now) : out
  }

  /** 汇总 + 分桶 + 会话/模型排行。range: all | day | week | month */
  @Remote('overview')
  async overview(args) {
    await this.ready // 首扫未完成时先等，避免返回空数据
    const now = Date.now()
    const range = (args && args.range) || 'all'
    const all = this._allRecords(range, now)
    const summary = { ...sumUsage(all) }
    const costUsd = all.reduce((acc, r) => acc + (estimateCost(r, r.model) || 0), 0)
    const times = all.map((r) => r.atMs).filter(Boolean)
    return {
      range,
      summary: {
        sessions: this.sessionsList(range, now).length,
        subagentSessions: this.sessionsList(range, now).filter((s) => s.delegationDepth > 0).length,
        ...summary,
        costEstimateUsd: costUsd,
        firstActivityAt: times.length ? Math.min(...times) : null,
        lastActivityAt: times.length ? Math.max(...times) : null,
        scannedAt: this.scannedAt,
      },
      buckets: bucketByDay(all),
      sessions: this.sessionsList(range, now),
      models: groupByModel(all),
    }
  }

  /** 按会话明细（排序）。 */
  @Remote('sessions')
  async sessions(args) {
    await this.ready
    return this.sessionsList((args && args.range) || 'all')
  }

  /** 按 provider/model 排行。 */
  @Remote('models')
  async models(args) {
    await this.ready
    return groupByModel(this._allRecords((args && args.range) || 'all'))
  }

  /** 强制增量重扫。 */
  @Remote('refresh')
  async refresh() {
    await this.ready
    return this.scan()
  }

  sessionsList(range = 'all', now = Date.now()) {
    return [...this.sessions.entries()]
      .map(([sessionId, { meta, records }]) => {
        const delegationDepth = meta.delegationDepth || 0
        const rs = range && range !== 'all' ? filterByRange(records, range, now) : records
        const s = sumUsage(rs)
        const costUsd = rs.reduce((acc, r) => acc + (estimateCost(r, r.model) || 0), 0)
        const times = rs.map((r) => r.atMs).filter(Boolean)
        return {
          sessionId,
          workspace: meta.workspace,
          delegationDepth,
          ...s,
          costEstimateUsd: costUsd,
          lastActivityAt: times.length ? Math.max(...times) : null,
        }
      })
      .filter((s) => s.calls > 0)
      .sort((a, b) => (b.lastActivityAt || 0) - (a.lastActivityAt || 0))
  }
}

// Cordis 插件包装：dsh loader 要求包默认导出 { name, inject, apply }。
// apply 里构造 UsageStatsGateway，super(ctx, 'usageStats') 即把服务注册到 ctx。
export const name = '@huzhaigong/dsh-usage-dashboard'
export const inject = []

export function apply(ctx) {
  new UsageStatsGateway(ctx)
}

export default { name, inject, apply }