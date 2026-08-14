// scan.js — 纯函数：发现并读取会话日志。
// 日志位置: $DSH_HOME/sessions/<workspace>/<sessionId>/session.jsonl.zstd
// 增量策略: 按 (path, mtimeMs, size) 缓存，只重读变化过的文件。
//
// zstd 解码: 默认调用系统 zstd CLI（zstd -dc，外部依赖，见 DESIGN.md 风险项）；
// 提供 injectZstd() 可替换为 wasm/原生绑定实现。

import { execFileSync } from 'node:child_process'
import { readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const SESSION_FILE = 'session.jsonl.zstd'

/** 递归找出所有会话日志文件，返回 [{ path, workspace, sessionId, mtimeMs, size }] */
export function discoverSessions(sessionsRoot) {
  const out = []
  const walk = (dir, workspace) => {
    let entries
    try {
      entries = readdirSync(dir, { withFileTypes: true })
    } catch {
      return
    }
    for (const e of entries) {
      const p = join(dir, e.name)
      if (e.isDirectory()) walk(p, workspace)
      else if (e.isFile() && e.name === SESSION_FILE) {
        const st = statSync(p)
        out.push({
          path: p,
          workspace,
          sessionId: dir.slice(dir.lastIndexOf('/') + 1),
          mtimeMs: st.mtimeMs,
          size: st.size,
        })
      }
    }
  }
  for (const ws of readdirSync(sessionsRoot, { withFileTypes: true })) {
    if (ws.isDirectory()) walk(join(sessionsRoot, ws.name), ws.name)
  }
  return out
}

/** 与上次扫描比对：返回需要重读的文件（首次全量）与已消失的路径。 */
export function diffChanged(files, cache = {}) {
  const changed = []
  const next = {}
  for (const f of files) {
    const prev = cache[f.path]
    if (!prev || prev.mtimeMs !== f.mtimeMs || prev.size !== f.size) changed.push(f)
    next[f.path] = { mtimeMs: f.mtimeMs, size: f.size }
  }
  const present = new Set(files.map((f) => f.path))
  const removed = Object.keys(cache).filter((p) => !present.has(p))
  return { changed, next, removed }
}

/** 探测系统 zstd CLI 是否可用（scan 前调用，避免每个文件都抛 ENOENT）。 */
export function zstdAvailable() {
  try {
    execFileSync('zstd', ['--version'], { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

/** 解压并逐行回调；返回行数。 */
export function readSessionLog(file, onLine) {
  const text = execFileSync('zstd', ['-dc', file], { maxBuffer: 512 * 1024 * 1024 }).toString('utf8')
  let n = 0
  for (const line of text.split('\n')) {
    if (line.length > 0) { onLine(line); n++ }
  }
  return n
}