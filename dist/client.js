window.__ModuleLoader__.load({
	id: '@huzhaigong/dsh-usage-dashboard',
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
		var React = require('react');

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// lib/client.js
var client_exports = {};
__export(client_exports, {
  apply: () => apply,
  inject: () => inject,
  name: () => name
});
module.exports = __toCommonJS(client_exports);
var name = "@huzhaigong/dsh-usage-dashboard/client";
var inject = ["slots", "locale", "connection"];
var NS = "settings.usageStats";
var CSS = [
  ".uds-root{width:100%;max-width:760px;color:var(--dsw-alias-label-primary);display:flex;flex-direction:column;gap:16px;font-size:13px;line-height:20px}",
  ".uds-heading{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap}",
  ".uds-heading h3{margin:0;font-size:13px;font-weight:600;line-height:20px}",
  ".uds-caption{color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:18px}",
  ".uds-toolbar{display:flex;align-items:center;gap:8px}",
  ".uds-segmented{display:inline-flex;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);border-radius:8px;padding:2px;gap:2px}",
  ".uds-segmented button{border:0;background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:12px;line-height:18px;padding:3px 10px;border-radius:6px;cursor:pointer}",
  ".uds-segmented button:hover{color:var(--dsw-alias-label-primary)}",
  ".uds-segmented button[data-active=true]{background:var(--dsw-alias-bg-layer-3);color:var(--dsw-alias-label-primary);box-shadow:var(--dsw-shadow-lv1)}",
  ".uds-refresh{border:1px solid var(--dsw-alias-border-l2);background:transparent;color:var(--dsw-alias-label-primary);font:inherit;font-size:12px;line-height:18px;border-radius:6px;padding:3px 10px;cursor:pointer}",
  ".uds-refresh:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover)}",
  ".uds-refresh:disabled{opacity:.5;cursor:default}",
  ".uds-error{color:var(--dsw-alias-state-error-primary);font-size:13px;line-height:20px}",
  ".uds-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(132px,1fr));gap:10px}",
  ".uds-card{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-3);border-radius:10px;padding:12px 14px;display:flex;flex-direction:column;gap:4px;min-width:0}",
  ".uds-cardLabel{color:var(--dsw-alias-label-tertiary);font-size:11px;line-height:17px}",
  ".uds-cardValue{font-size:18px;font-weight:600;line-height:24px;font-variant-numeric:tabular-nums;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
  ".uds-cardSub{color:var(--dsw-alias-label-tertiary);font-size:11px;line-height:17px;font-variant-numeric:tabular-nums}",
  ".uds-chart{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-3);border-radius:10px;padding:14px;display:flex;flex-direction:column;gap:10px}",
  ".uds-bars{display:flex;align-items:flex-end;gap:4px;height:120px}",
  ".uds-barCol{flex:1;min-width:0;display:flex;flex-direction:column;gap:4px;height:100%}",
  ".uds-barInner{display:flex;flex-direction:column-reverse;flex:1;overflow:hidden;border-radius:4px;background:var(--dsw-alias-bg-layer-1)}",
  ".uds-seg{width:100%}",
  ".uds-segUncached{background:var(--dsw-alias-state-business-primary)}",
  ".uds-segCacheRead{background:color-mix(in srgb,var(--dsw-alias-state-business-primary) 30%,transparent)}",
  ".uds-segCacheWrite{background:color-mix(in srgb,var(--dsw-alias-state-success-primary) 55%,transparent)}",
  ".uds-segOutput{background:var(--dsw-alias-state-success-primary)}",
  ".uds-barLabel{color:var(--dsw-alias-label-tertiary);font-size:10px;line-height:14px;text-align:center;font-variant-numeric:tabular-nums}",
  ".uds-legend{display:flex;gap:12px;flex-wrap:wrap}",
  ".uds-legendItem{display:inline-flex;align-items:center;gap:5px;color:var(--dsw-alias-label-secondary);font-size:12px;line-height:18px}",
  ".uds-legendDot{width:8px;height:8px;border-radius:2px}",
  ".uds-sectionTitle{margin:0;font-size:13px;font-weight:600;line-height:20px}",
  ".uds-table{border:1px solid var(--dsw-alias-border-l2);border-radius:10px;overflow:hidden;background:var(--dsw-alias-bg-layer-3)}",
  ".uds-table table{width:100%;border-collapse:collapse;font-size:12px;line-height:18px}",
  ".uds-table th{color:var(--dsw-alias-label-tertiary);font-weight:500;font-size:11px;line-height:17px;text-align:left;padding:8px 12px;border-bottom:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1)}",
  ".uds-table td{padding:8px 12px;border-bottom:1px solid var(--dsw-alias-border-l2);font-variant-numeric:tabular-nums;white-space:nowrap}",
  ".uds-table tr:last-child td{border-bottom:0}",
  ".uds-num{font-family:var(--ds-font-family-code);font-size:12px;line-height:18px}",
  ".uds-cellMain{color:var(--dsw-alias-label-primary);max-width:220px;overflow:hidden;text-overflow:ellipsis}",
  ".uds-cellSub{color:var(--dsw-alias-label-tertiary);font-size:11px;margin-left:6px}",
  "@media (prefers-reduced-motion:no-preference){.uds-seg{transition:height .14s var(--ds-ease-in-out)}}"
].join("\n");
var dicts = {
  en: {
    nav: "Usage Stats",
    total: "Total tokens",
    cost: "Est. cost",
    calls: "Requests",
    sessions: "Sessions",
    hitRate: "Cache hit",
    refresh: "Refresh",
    refreshing: "Refreshing\u2026",
    scannedAt: "Last scanned",
    rangeAll: "All",
    rangeWeek: "7 days",
    rangeMonth: "30 days",
    legendUncached: "Uncached in",
    legendCacheRead: "Cache read",
    legendCacheWrite: "Cache write",
    legendOutput: "Output",
    empty: "No usage data yet.",
    tableSession: "Session",
    tableModel: "Model",
    tableTokens: "Tokens",
    tableCost: "Cost",
    tableActivity: "Last activity",
    subagent: "subagent",
    showAll: "Show all",
    collapse: "Collapse",
    unpriced: "unpriced models",
    loading: "Loading\u2026"
  },
  zh: {
    nav: "\u7528\u91CF\u7EDF\u8BA1",
    total: "\u603B tokens",
    cost: "\u4F30\u7B97\u82B1\u8D39",
    calls: "\u8BF7\u6C42\u6570",
    sessions: "\u4F1A\u8BDD\u6570",
    hitRate: "\u7F13\u5B58\u547D\u4E2D\u7387",
    refresh: "\u5237\u65B0",
    refreshing: "\u5237\u65B0\u4E2D\u2026",
    scannedAt: "\u6700\u540E\u626B\u63CF",
    rangeAll: "\u5168\u90E8",
    rangeWeek: "\u8FD1 7 \u5929",
    rangeMonth: "\u8FD1 30 \u5929",
    legendUncached: "\u672A\u7F13\u5B58\u8F93\u5165",
    legendCacheRead: "\u7F13\u5B58\u8BFB",
    legendCacheWrite: "\u7F13\u5B58\u5199",
    legendOutput: "\u8F93\u51FA",
    empty: "\u6682\u65E0\u7528\u91CF\u6570\u636E\u3002",
    tableSession: "\u4F1A\u8BDD",
    tableModel: "\u6A21\u578B",
    tableTokens: "Tokens",
    tableCost: "\u82B1\u8D39",
    tableActivity: "\u6700\u540E\u6D3B\u52A8",
    subagent: "\u5B50\u4EE3\u7406",
    showAll: "\u663E\u793A\u5168\u90E8",
    collapse: "\u6536\u8D77",
    unpriced: "\u4E2A\u6A21\u578B\u672A\u8BA1\u4EF7",
    loading: "\u52A0\u8F7D\u4E2D\u2026"
  }
};
function formatTokens(n) {
  const scaled = (v) => v >= 100 ? String(Math.round(v)) : String(Math.round(v * 10) / 10);
  if (n < 1e3) return String(n);
  if (n < 1e6) return scaled(n / 1e3) + "K";
  if (n < 1e9) return scaled(n / 1e6) + "M";
  return scaled(n / 1e9) + "B";
}
function formatCost(n) {
  if (n === null || n === void 0) return "\u2014";
  if (n >= 1e3) return "$" + (n / 1e3).toFixed(2) + "K";
  return "$" + n.toFixed(2);
}
function formatPct(rate) {
  if (rate === null || rate === void 0) return "\u2014";
  return String(Math.round(rate * 100)) + "%";
}
function shortId(id) {
  return id && id.length > 12 ? id.slice(0, 8) + "\u2026" + id.slice(-4) : id;
}
function formatTime(ms) {
  if (!ms) return "\u2014";
  const d = new Date(ms);
  const now = /* @__PURE__ */ new Date();
  return d.toDateString() === now.toDateString() ? d.toLocaleTimeString() : d.toLocaleDateString() + " " + d.toLocaleTimeString();
}
function sorted(list, sort) {
  const { key, dir } = sort;
  return [...list].sort((a, b) => {
    const av = a[key], bv = b[key];
    if (av == null) return 1;
    if (bv == null) return -1;
    return (av < bv ? -1 : av > bv ? 1 : 0) * dir;
  });
}
function SortTh({ label, sortKey, sort, onSort }) {
  const active = sort.key === sortKey;
  const arrow = active ? sort.dir > 0 ? " \u25B2" : " \u25BC" : "";
  return React.createElement("th", {
    onClick: () => onSort(sortKey),
    style: { cursor: "pointer", userSelect: "none" },
    title: "click to sort"
  }, label + arrow);
}
var CSS_TAG = "@huzhaigong/dsh-usage-dashboard/styles";
function injectStyles() {
  if (typeof document === "undefined") return;
  if (document.querySelector("style[data-plugin-css=" + JSON.stringify(CSS_TAG) + "]")) return;
  const tag = document.createElement("style");
  tag.dataset.plugin = "@huzhaigong/dsh-usage-dashboard";
  tag.dataset.pluginCss = CSS_TAG;
  tag.textContent = CSS;
  document.head.appendChild(tag);
}
function Card({ label, value, sub }) {
  return React.createElement(
    "div",
    { className: "uds-card" },
    React.createElement("div", { className: "uds-cardLabel" }, label),
    React.createElement("div", { className: "uds-cardValue" }, value),
    sub ? React.createElement("div", { className: "uds-cardSub" }, sub) : null
  );
}
var CHART_SEGMENTS = [
  { key: "uncachedInput", cls: "uds-segUncached" },
  { key: "cacheRead", cls: "uds-segCacheRead" },
  { key: "cacheWrite", cls: "uds-segCacheWrite" },
  { key: "output", cls: "uds-segOutput" }
];
function TrendChart({ buckets, t }) {
  if (!buckets || buckets.length === 0) return null;
  const max = Math.max.apply(null, buckets.map((b) => b.total));
  const bars = buckets.map((b) => {
    const parts = CHART_SEGMENTS.filter((s) => b[s.key] > 0).map((s) => React.createElement("div", {
      key: s.key,
      className: "uds-seg " + s.cls,
      style: { height: b[s.key] / b.total * 100 + "%" }
    }));
    const title = b.key + " \xB7 " + formatTokens(b.total) + " tokens";
    return React.createElement(
      "div",
      { key: b.key, className: "uds-barCol", title },
      React.createElement("div", { className: "uds-barInner", style: { height: b.total / max * 100 + "%" } }, parts),
      React.createElement("div", { className: "uds-barLabel" }, b.key.length === 16 ? b.key.slice(11) : b.key.length > 10 ? b.key.slice(5) : b.key)
    );
  });
  const legend = CHART_SEGMENTS.map((s) => React.createElement(
    "span",
    { key: s.key, className: "uds-legendItem" },
    React.createElement("span", { className: "uds-legendDot " + s.cls }),
    t("legend" + s.key[0].toUpperCase() + s.key.slice(1))
  ));
  return React.createElement(
    "div",
    { className: "uds-chart" },
    React.createElement("div", { className: "uds-bars" }, bars),
    React.createElement("div", { className: "uds-legend" }, legend)
  );
}
function SessionTable({ sessions, t, sort, onSort }) {
  const [showAll, setShowAll] = React.useState(false);
  const LIMIT = 15;
  const rows = sorted(sessions, sort).slice(0, showAll ? sessions.length : LIMIT).map((s) => React.createElement(
    "tr",
    { key: s.sessionId },
    React.createElement(
      "td",
      { className: "uds-cellMain", title: s.sessionId },
      shortId(s.sessionId),
      React.createElement(
        "span",
        { className: "uds-cellSub" },
        s.workspace + (s.delegationDepth > 0 ? " \xB7 " + t("subagent") : "")
      )
    ),
    React.createElement("td", null, String(s.calls)),
    React.createElement("td", { className: "uds-num" }, formatTokens(s.total)),
    React.createElement("td", null, formatCost(s.costEstimateUsd)),
    React.createElement("td", null, formatTime(s.lastActivityAt))
  ));
  return React.createElement(
    "div",
    { className: "uds-table" },
    React.createElement(
      "table",
      null,
      React.createElement("thead", null, React.createElement(
        "tr",
        null,
        React.createElement(SortTh, { label: t("tableSession"), sortKey: "lastActivityAt", sort, onSort }),
        React.createElement(SortTh, { label: t("calls"), sortKey: "calls", sort, onSort }),
        React.createElement(SortTh, { label: t("tableTokens"), sortKey: "total", sort, onSort }),
        React.createElement(SortTh, { label: t("tableCost"), sortKey: "costEstimateUsd", sort, onSort }),
        React.createElement(SortTh, { label: t("tableActivity"), sortKey: "lastActivityAt", sort, onSort })
      )),
      React.createElement("tbody", null, rows)
    ),
    sessions.length > LIMIT ? React.createElement(
      "button",
      { type: "button", className: "uds-refresh", style: { marginTop: 8 }, onClick: () => setShowAll(!showAll) },
      showAll ? t("collapse") : t("showAll") + " (" + sessions.length + ")"
    ) : null
  );
}
function ModelTable({ models, t, sort, onSort }) {
  const [showAll, setShowAll] = React.useState(false);
  const LIMIT = 10;
  const rows = sorted(models, sort).slice(0, showAll ? models.length : LIMIT).map((m) => React.createElement(
    "tr",
    { key: m.provider + "/" + m.model },
    React.createElement("td", { className: "uds-cellMain" }, m.model + " \xB7 " + m.provider),
    React.createElement("td", null, String(m.calls)),
    React.createElement("td", { className: "uds-num" }, formatTokens(m.total)),
    React.createElement("td", null, formatPct(m.cacheHitRate)),
    React.createElement("td", null, formatCost(m.costEstimateUsd))
  ));
  return React.createElement(
    "div",
    { className: "uds-table" },
    React.createElement(
      "table",
      null,
      React.createElement("thead", null, React.createElement(
        "tr",
        null,
        React.createElement(SortTh, { label: t("tableModel"), sortKey: "total", sort, onSort }),
        React.createElement(SortTh, { label: t("calls"), sortKey: "calls", sort, onSort }),
        React.createElement(SortTh, { label: t("tableTokens"), sortKey: "total", sort, onSort }),
        React.createElement(SortTh, { label: t("hitRate"), sortKey: "cacheHitRate", sort, onSort }),
        React.createElement(SortTh, { label: t("tableCost"), sortKey: "costEstimateUsd", sort, onSort })
      )),
      React.createElement("tbody", null, rows)
    ),
    models.length > LIMIT ? React.createElement(
      "button",
      { type: "button", className: "uds-refresh", style: { marginTop: 8 }, onClick: () => setShowAll(!showAll) },
      showAll ? t("collapse") : t("showAll") + " (" + models.length + ")"
    ) : null
  );
}
function UsageStatsSection(props) {
  const t = props.t;
  const fetchOverview = props.fetch;
  const refresh = props.refresh;
  const [range, setRange] = React.useState("all");
  const [state, setState] = React.useState({ status: "loading", data: null, error: null });
  const [refreshing, setRefreshing] = React.useState(false);
  const [sortSessions, setSortSessions] = React.useState({ key: "lastActivityAt", dir: -1 });
  const [sortModels, setSortModels] = React.useState({ key: "total", dir: -1 });
  const makeSorter = (setter) => (key) => setter((prev) => prev.key === key ? { key, dir: -prev.dir } : { key, dir: -1 });
  const seqRef = React.useRef(0);
  const load = React.useCallback(async (r) => {
    const seq = ++seqRef.current;
    try {
      const data = await fetchOverview(r);
      if (seqRef.current === seq) setState({ status: "ready", data, error: null });
    } catch (err) {
      if (seqRef.current === seq) setState({ status: "error", data: null, error: String(err && err.message || err) });
    }
  }, [fetchOverview]);
  React.useEffect(() => {
    load(range);
  }, [range, load]);
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refresh();
      await load(range);
    } catch (err) {
      setState({ status: "error", data: null, error: String(err && err.message || err) });
    } finally {
      setRefreshing(false);
    }
  };
  const s = state.data ? state.data.summary : null;
  return React.createElement(
    "div",
    { className: "uds-root" },
    React.createElement(
      "div",
      { className: "uds-heading" },
      React.createElement(
        "div",
        null,
        React.createElement("h3", null, t("nav")),
        React.createElement(
          "div",
          { className: "uds-caption" },
          t("scannedAt") + ": " + (s && s.scannedAt ? formatTime(s.scannedAt) : "\u2014")
        )
      ),
      React.createElement(
        "div",
        { className: "uds-toolbar" },
        React.createElement(
          "div",
          { className: "uds-segmented" },
          ["all", "week", "month"].map((r) => React.createElement("button", {
            key: r,
            type: "button",
            "data-active": range === r,
            onClick: () => setRange(r)
          }, t("range" + r[0].toUpperCase() + r.slice(1))))
        ),
        React.createElement("button", {
          type: "button",
          className: "uds-refresh",
          onClick: onRefresh,
          disabled: refreshing
        }, refreshing ? t("refreshing") : t("refresh"))
      )
    ),
    state.status === "error" ? React.createElement("div", { className: "uds-error" }, state.error) : state.status === "loading" ? React.createElement("div", { className: "uds-caption" }, t("loading")) : !s || s.calls === 0 ? React.createElement("div", { className: "uds-caption" }, t("empty")) : React.createElement(
      React.Fragment,
      null,
      React.createElement(
        "div",
        { className: "uds-cards" },
        React.createElement(Card, {
          label: t("total"),
          value: formatTokens(s.total),
          sub: "in " + formatTokens(s.uncachedInput) + " / out " + formatTokens(s.output)
        }),
        React.createElement(Card, { label: t("cost"), value: formatCost(s.costEstimateUsd) }),
        React.createElement(Card, { label: t("calls"), value: String(s.calls) }),
        React.createElement(Card, { label: t("sessions"), value: String(s.sessions) }),
        React.createElement(Card, { label: t("hitRate"), value: formatPct(s.cacheHitRate) })
      ),
      React.createElement(TrendChart, { buckets: state.data.buckets, t }),
      React.createElement("h4", { className: "uds-sectionTitle" }, t("tableSession")),
      React.createElement(SessionTable, { sessions: state.data.sessions, t, sort: sortSessions, onSort: makeSorter(setSortSessions) }),
      React.createElement("h4", { className: "uds-sectionTitle" }, t("tableModel")),
      s.unpricedModels > 0 ? React.createElement(
        "div",
        { className: "uds-caption", style: { marginBottom: 8 } },
        s.unpricedModels + " " + t("unpriced")
      ) : null,
      React.createElement(ModelTable, { models: state.data.models, t, sort: sortModels, onSort: makeSorter(setSortModels) })
    )
  );
}
function apply(ctx) {
  injectStyles();
  ctx.effect(() => ctx.locale.register(NS, dicts), "@huzhaigong/dsh-usage-dashboard: dictionaries");
  const t = ctx.locale.bind(NS);
  const rpc = ctx.connection.rpc;
  const call = async (method, argsObj) => {
    const payload = argsObj === void 0 ? { args: {} } : { args: { args: argsObj } };
    const result = await rpc.call("/api", "usageStats/" + method, payload);
    if (!result.ok) {
      const code = result.error && result.error.code;
      const message = result.error && result.error.message;
      throw new Error(method + " failed: " + code + ": " + message);
    }
    return result.value;
  };
  const fetch = (range) => call("overview", { range });
  const refresh = () => call("refresh");
  ctx.slots.inject("settings.section", () => ctx.slots.register(
    {
      name: "settings.section",
      id: "usage-stats",
      order: 25,
      label: () => t("nav"),
      locale: NS,
      inject: () => ({ t, fetch, refresh })
    },
    UsageStatsSection
  ));
}

		return module.exports;
	}
});

