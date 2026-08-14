var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __knownSymbol = (name2, symbol) => (symbol = Symbol[name2]) ? symbol : Symbol.for("Symbol." + name2);
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __decoratorStart = (base) => [, , , __create(base?.[__knownSymbol("metadata")] ?? null)];
var __decoratorStrings = ["class", "method", "getter", "setter", "accessor", "field", "value", "get", "set"];
var __expectFn = (fn) => fn !== void 0 && typeof fn !== "function" ? __typeError("Function expected") : fn;
var __decoratorContext = (kind, name2, done, metadata, fns) => ({ kind: __decoratorStrings[kind], name: name2, metadata, addInitializer: (fn) => done._ ? __typeError("Already initialized") : fns.push(__expectFn(fn || null)) });
var __decoratorMetadata = (array, target) => __defNormalProp(target, __knownSymbol("metadata"), array[3]);
var __runInitializers = (array, flags, self, value) => {
  for (var i = 0, fns = array[flags >> 1], n = fns && fns.length; i < n; i++) flags & 1 ? fns[i].call(self) : value = fns[i].call(self, value);
  return value;
};
var __decorateElement = (array, flags, name2, decorators, target, extra) => {
  var fn, it, done, ctx, access, k = flags & 7, s = !!(flags & 8), p = !!(flags & 16);
  var j = k > 3 ? array.length + 1 : k ? s ? 1 : 2 : 0, key = __decoratorStrings[k + 5];
  var initializers = k > 3 && (array[j - 1] = []), extraInitializers = array[j] || (array[j] = []);
  var desc = k && (!p && !s && (target = target.prototype), k < 5 && (k > 3 || !p) && __getOwnPropDesc(k < 4 ? target : { get [name2]() {
    return __privateGet(this, extra);
  }, set [name2](x) {
    return __privateSet(this, extra, x);
  } }, name2));
  k ? p && k < 4 && __name(extra, (k > 2 ? "set " : k > 1 ? "get " : "") + name2) : __name(target, name2);
  for (var i = decorators.length - 1; i >= 0; i--) {
    ctx = __decoratorContext(k, name2, done = {}, array[3], extraInitializers);
    if (k) {
      ctx.static = s, ctx.private = p, access = ctx.access = { has: p ? (x) => __privateIn(target, x) : (x) => name2 in x };
      if (k ^ 3) access.get = p ? (x) => (k ^ 1 ? __privateGet : __privateMethod)(x, target, k ^ 4 ? extra : desc.get) : (x) => x[name2];
      if (k > 2) access.set = p ? (x, y) => __privateSet(x, target, y, k ^ 4 ? extra : desc.set) : (x, y) => x[name2] = y;
    }
    it = (0, decorators[i])(k ? k < 4 ? p ? extra : desc[key] : k > 4 ? void 0 : { get: desc.get, set: desc.set } : target, ctx), done._ = 1;
    if (k ^ 4 || it === void 0) __expectFn(it) && (k > 4 ? initializers.unshift(it) : k ? p ? extra = it : desc[key] = it : target = it);
    else if (typeof it !== "object" || it === null) __typeError("Object expected");
    else __expectFn(fn = it.get) && (desc.get = fn), __expectFn(fn = it.set) && (desc.set = fn), __expectFn(fn = it.init) && initializers.unshift(fn);
  }
  return k || __decoratorMetadata(array, target), desc && __defProp(target, name2, desc), p ? k ^ 4 ? extra : desc : target;
};
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateIn = (member, obj) => Object(obj) !== obj ? __typeError('Cannot use the "in" operator on this value') : member.has(obj);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);

// lib/index.js
import { homedir } from "node:os";
import { join as join2 } from "node:path";
import { Remote, TypertRemoteService } from "@deepseek-ai/dsh-typert-protocol";

// lib/scan.js
import { execFileSync } from "node:child_process";
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
var SESSION_FILE = "session.jsonl.zstd";
function discoverSessions(sessionsRoot) {
  const out = [];
  const walk = (dir, workspace) => {
    let entries;
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      const p = join(dir, e.name);
      if (e.isDirectory()) walk(p, workspace);
      else if (e.isFile() && e.name === SESSION_FILE) {
        const st = statSync(p);
        out.push({
          path: p,
          workspace,
          sessionId: dir.slice(dir.lastIndexOf("/") + 1),
          mtimeMs: st.mtimeMs,
          size: st.size
        });
      }
    }
  };
  for (const ws of readdirSync(sessionsRoot, { withFileTypes: true })) {
    if (ws.isDirectory()) walk(join(sessionsRoot, ws.name), ws.name);
  }
  return out;
}
function diffChanged(files, cache = {}) {
  const changed = [];
  const next = {};
  for (const f of files) {
    const prev = cache[f.path];
    if (!prev || prev.mtimeMs !== f.mtimeMs || prev.size !== f.size) changed.push(f);
    next[f.path] = { mtimeMs: f.mtimeMs, size: f.size };
  }
  const present = new Set(files.map((f) => f.path));
  const removed = Object.keys(cache).filter((p) => !present.has(p));
  return { changed, next, removed };
}
function zstdAvailable() {
  try {
    execFileSync("zstd", ["--version"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}
function readSessionLog(file, onLine) {
  const text = execFileSync("zstd", ["-dc", file], { maxBuffer: 512 * 1024 * 1024 }).toString("utf8");
  let n = 0;
  for (const line of text.split("\n")) {
    if (line.length > 0) {
      onLine(line);
      n++;
    }
  }
  return n;
}

// lib/aggregate.js
function parseLine(line) {
  try {
    return JSON.parse(line);
  } catch {
    return null;
  }
}
function extractUsage(lines) {
  const last = /* @__PURE__ */ new Map();
  let lastProvider = null;
  let lastModel = null;
  for (const line of lines) {
    const ev = parseLine(line);
    if (!ev) continue;
    const d = ev.data || {};
    let key = d.turn !== void 0 && d.step !== void 0 ? d.turn + ":" + d.step : null;
    let usage = null;
    if (ev.type === "assistant/message" && d.usage) {
      usage = d.usage;
      const src = d.message && d.message.source;
      if (src) {
        if (src.provider) lastProvider = src.provider;
        if (src.model) lastModel = src.model;
      }
    } else if (ev.type === "assistant/chunk" && d.chunk && d.chunk.type === "usage" && d.chunk.usage) {
      usage = d.chunk.usage;
    } else if (ev.type === "compaction/summary" && d.usage) {
      usage = d.usage;
      if (d.provider) lastProvider = d.provider;
      if (d.model) lastModel = d.model;
      key = "compaction:" + (d.compactionId || ev.seq || Math.random());
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
        atMs: ev.time ?? null
      });
    }
  }
  return [...last.values()];
}
function sessionMeta(lines) {
  for (const line of lines) {
    const ev = parseLine(line);
    if (ev && ev.type === "session") {
      return {
        delegationDepth: ev.delegationDepth ?? 0,
        agentPreset: ev.agentPreset ?? null,
        createdAt: ev.createdAt ?? null
      };
    }
  }
  return { delegationDepth: 0, agentPreset: null, createdAt: null };
}
function sumUsage(records) {
  const s = { calls: records.length, uncachedInput: 0, cacheRead: 0, cacheWrite: 0, output: 0, reasoning: 0 };
  for (const r of records) {
    s.uncachedInput += r.uncachedInput;
    s.cacheRead += r.cacheRead;
    s.cacheWrite += r.cacheWrite;
    s.output += r.output;
    s.reasoning += r.reasoning;
  }
  s.total = s.uncachedInput + s.cacheRead + s.cacheWrite + s.output;
  const billedInput = s.uncachedInput + s.cacheRead + s.cacheWrite;
  s.cacheHitRate = billedInput > 0 ? s.cacheRead / billedInput : 0;
  return s;
}
function bucketByDay(records) {
  const buckets = /* @__PURE__ */ new Map();
  const keyOf = (ms) => {
    const d = new Date(ms);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return y + "-" + m + "-" + day;
  };
  for (const r of records) {
    const key = r.atMs ? keyOf(r.atMs) : "unknown";
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key).push(r);
  }
  return [...buckets.entries()].map(([key, rs]) => ({ key, ...sumUsage(rs) })).sort((a, b) => a.key.localeCompare(b.key));
}
function groupByModel(records) {
  const g = /* @__PURE__ */ new Map();
  for (const r of records) {
    const k = (r.provider || "?") + "/" + (r.model || "?");
    if (!g.has(k)) g.set(k, []);
    g.get(k).push(r);
  }
  return [...g.entries()].map(([key, rs]) => {
    const [provider, model] = key.split("/");
    return { provider, model, ...sumUsage(rs) };
  }).filter((s) => s.total > 0).sort((a, b) => b.total - a.total);
}
function cutoffFor(range, now = Date.now()) {
  if (range === "day") return now - 24 * 36e5;
  if (range === "week") return now - 7 * 24 * 36e5;
  if (range === "month") return now - 30 * 24 * 36e5;
  return null;
}
function filterByRange(records, range, now = Date.now()) {
  const cutoff = cutoffFor(range, now);
  if (cutoff === null) return records;
  return records.filter((r) => r.atMs != null && r.atMs >= cutoff);
}

// lib/pricing.js
var DEFAULT_PRICES = {
  // 模型名子串 -> { uncachedInput, cacheRead, cacheWrite, output }（$ / M tokens）
  "deepseek-v4": { uncachedInput: 2, cacheRead: 0.5, cacheWrite: 2.5, output: 8 },
  "deepseek-v3": { uncachedInput: 2, cacheRead: 0.5, cacheWrite: 2.5, output: 8 }
};
function lookupPrice(model, table = DEFAULT_PRICES) {
  if (!model) return null;
  const m = model.toLowerCase();
  for (const [key, price] of Object.entries(table)) {
    if (m.includes(key)) return price;
  }
  return null;
}
function estimateCost(usage, model, table = DEFAULT_PRICES) {
  const price = lookupPrice(model, table);
  if (!price) return null;
  return (usage.uncachedInput * price.uncachedInput + usage.cacheRead * price.cacheRead + usage.cacheWrite * price.cacheWrite + usage.output * price.output) / 1e6;
}

// lib/index.js
var _refresh_dec, _models_dec, _sessions_dec, _overview_dec, _a, _init;
var UsageStatsGateway = class extends (_a = TypertRemoteService, _overview_dec = [Remote("overview")], _sessions_dec = [Remote("sessions")], _models_dec = [Remote("models")], _refresh_dec = [Remote("refresh")], _a) {
  constructor(ctx) {
    super(ctx, "usageStats");
    __runInitializers(_init, 5, this);
    const home = process.env.DSH_HOME || join2(homedir(), ".dsh");
    this.sessionsRoot = join2(home, "sessions");
    this.cache = {};
    this.sessions = /* @__PURE__ */ new Map();
    this.scannedAt = null;
    this._eventDirty = false;
    this._eventTimer = null;
    ctx.effect(() => ctx.on("session/event", (store) => {
      if (!store || !store.id) return;
      this._eventDirty = true;
      if (this._eventTimer !== null) return;
      this._eventTimer = setTimeout(() => {
        this._eventTimer = null;
        if (!this._eventDirty) return;
        this._eventDirty = false;
        this.scan().catch(() => {
        });
      }, 800);
    }));
    this.ready = Promise.resolve().then(() => this.scan()).catch((err) => ({ scanned: 0, changed: 0, removed: 0, ms: 0, error: String(err && err.message || err) }));
  }
  /** 扫描目录：增量重读变化文件、清理已删除会话。返回 { scanned, changed, removed, ms }。 */
  async scan() {
    const t0 = Date.now();
    if (!zstdAvailable()) {
      return { scanned: 0, changed: 0, removed: 0, ms: Date.now() - t0, error: "zstd CLI not found \u2014 install zstd (e.g. apt install zstd) or provide injectZstd()" };
    }
    let files;
    try {
      files = discoverSessions(this.sessionsRoot);
    } catch (err) {
      return { scanned: 0, changed: 0, removed: 0, ms: Date.now() - t0, error: String(err && err.message || err) };
    }
    const { changed, next, removed } = diffChanged(files, this.cache);
    for (const f of changed) {
      const lines = [];
      try {
        readSessionLog(f.path, (line) => lines.push(line));
      } catch {
        delete next[f.path];
        continue;
      }
      const records = extractUsage(lines);
      this.sessions.set(f.sessionId, { meta: { ...f, ...sessionMeta(lines) }, records });
    }
    const removedBySessionId = /* @__PURE__ */ new Set();
    for (const p of removed) {
      const sid = p.split(/[\\/]/).slice(-2, -1)[0] || null;
      if (sid) removedBySessionId.add(sid);
    }
    for (const sid of removedBySessionId) this.sessions.delete(sid);
    this.cache = next;
    this.scannedAt = Date.now();
    return { scanned: files.length, changed: changed.length, removed: removed.length, ms: Date.now() - t0 };
  }
  /** 全部记录（可选 range 过滤）。 */
  _allRecords(range, now) {
    const out = [];
    for (const { records } of this.sessions.values()) out.push(...records);
    return range && range !== "all" ? filterByRange(out, range, now) : out;
  }
  async overview(args) {
    await this.ready;
    const now = Date.now();
    const range = args && args.range || "all";
    const all = this._allRecords(range, now);
    const summary = { ...sumUsage(all) };
    const costUsd = all.reduce((acc, r) => acc + (estimateCost(r, r.model) || 0), 0);
    const times = all.map((r) => r.atMs).filter(Boolean);
    return {
      range,
      summary: {
        sessions: this.sessionsList(range, now).length,
        subagentSessions: this.sessionsList(range, now).filter((s) => s.delegationDepth > 0).length,
        ...summary,
        costEstimateUsd: costUsd,
        firstActivityAt: times.length ? Math.min(...times) : null,
        lastActivityAt: times.length ? Math.max(...times) : null,
        scannedAt: this.scannedAt
      },
      buckets: bucketByDay(all),
      sessions: this.sessionsList(range, now),
      models: groupByModel(all)
    };
  }
  async sessions(args) {
    await this.ready;
    return this.sessionsList(args && args.range || "all");
  }
  async models(args) {
    await this.ready;
    return groupByModel(this._allRecords(args && args.range || "all"));
  }
  async refresh() {
    await this.ready;
    return this.scan();
  }
  sessionsList(range = "all", now = Date.now()) {
    return [...this.sessions.entries()].map(([sessionId, { meta, records }]) => {
      const delegationDepth = meta.delegationDepth || 0;
      const rs = range && range !== "all" ? filterByRange(records, range, now) : records;
      const s = sumUsage(rs);
      const costUsd = rs.reduce((acc, r) => acc + (estimateCost(r, r.model) || 0), 0);
      const times = rs.map((r) => r.atMs).filter(Boolean);
      return {
        sessionId,
        workspace: meta.workspace,
        delegationDepth,
        ...s,
        costEstimateUsd: costUsd,
        lastActivityAt: times.length ? Math.max(...times) : null
      };
    }).filter((s) => s.calls > 0).sort((a, b) => (b.lastActivityAt || 0) - (a.lastActivityAt || 0));
  }
};
_init = __decoratorStart(_a);
__decorateElement(_init, 1, "overview", _overview_dec, UsageStatsGateway);
__decorateElement(_init, 1, "sessions", _sessions_dec, UsageStatsGateway);
__decorateElement(_init, 1, "models", _models_dec, UsageStatsGateway);
__decorateElement(_init, 1, "refresh", _refresh_dec, UsageStatsGateway);
__decoratorMetadata(_init, UsageStatsGateway);
__publicField(UsageStatsGateway, "inject", []);
var name = "@huzhaigong/dsh-usage-dashboard";
var inject = [];
function apply(ctx) {
  new UsageStatsGateway(ctx);
}
var index_default = { name, inject, apply };
export {
  UsageStatsGateway,
  apply,
  index_default as default,
  inject,
  name
};
