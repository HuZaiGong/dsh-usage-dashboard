// client.js — Browser 半：Settings → "用量统计" 全 DSH 用量可视化看板。
// 纯 JS（React.createElement），经 ctx.connection.rpc 直连 /api/usageStats/* 拉取 host 数据。
// 样式：DSH 设计令牌（--dsw-alias-* / --ds-font-family-code），经 styles.insert()
//       注入（与官方 client 插件同一机制，签名 styles.insert(css): () => void）。
//
// 槽位协议已核实（dsh-client-ui-settings-general / settings-plugin-inventory）：
//   ctx.slots.inject('settings.section', () => ctx.slots.register({ name, id, order,
//   label, locale, inject }, SectionComponent))

export const name = '@huzhaigong/dsh-usage-dashboard/client'

export const inject = ['slots', 'locale', 'connection']

const NS = 'settings.usageStats'

const CSS = [
'.uds-root{width:100%;max-width:760px;color:var(--dsw-alias-label-primary);display:flex;flex-direction:column;gap:16px;font-size:13px;line-height:20px}',
'.uds-heading{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap}',
'.uds-heading h3{margin:0;font-size:13px;font-weight:600;line-height:20px}',
'.uds-caption{color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:18px}',
'.uds-toolbar{display:flex;align-items:center;gap:8px}',
'.uds-segmented{display:inline-flex;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);border-radius:8px;padding:2px;gap:2px}',
'.uds-segmented button{border:0;background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:12px;line-height:18px;padding:3px 10px;border-radius:6px;cursor:pointer}',
'.uds-segmented button:hover{color:var(--dsw-alias-label-primary)}',
'.uds-segmented button[data-active=true]{background:var(--dsw-alias-bg-layer-3);color:var(--dsw-alias-label-primary);box-shadow:var(--dsw-shadow-lv1)}',
'.uds-refresh{border:1px solid var(--dsw-alias-border-l2);background:transparent;color:var(--dsw-alias-label-primary);font:inherit;font-size:12px;line-height:18px;border-radius:6px;padding:3px 10px;cursor:pointer}',
'.uds-refresh:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover)}',
'.uds-refresh:disabled{opacity:.5;cursor:default}',
'.uds-error{color:var(--dsw-alias-state-error-primary);font-size:13px;line-height:20px}',
'.uds-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(132px,1fr));gap:10px}',
'.uds-card{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-3);border-radius:10px;padding:12px 14px;display:flex;flex-direction:column;gap:4px;min-width:0}',
'.uds-cardLabel{color:var(--dsw-alias-label-tertiary);font-size:11px;line-height:17px}',
'.uds-cardValue{font-size:18px;font-weight:600;line-height:24px;font-variant-numeric:tabular-nums;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
'.uds-cardSub{color:var(--dsw-alias-label-tertiary);font-size:11px;line-height:17px;font-variant-numeric:tabular-nums}',
'.uds-chart{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-3);border-radius:10px;padding:14px;display:flex;flex-direction:column;gap:10px}',
'.uds-bars{display:flex;align-items:flex-end;gap:4px;height:120px}',
'.uds-barCol{flex:1;min-width:0;display:flex;flex-direction:column;gap:4px;height:100%}',
'.uds-barInner{display:flex;flex-direction:column-reverse;flex:1;overflow:hidden;border-radius:4px;background:var(--dsw-alias-bg-layer-1)}',
'.uds-seg{width:100%}',
'.uds-segUncached{background:var(--dsw-alias-state-business-primary)}',
'.uds-segCacheRead{background:color-mix(in srgb,var(--dsw-alias-state-business-primary) 30%,transparent)}',
'.uds-segCacheWrite{background:color-mix(in srgb,var(--dsw-alias-state-success-primary) 55%,transparent)}',
'.uds-segOutput{background:var(--dsw-alias-state-success-primary)}',
'.uds-barLabel{color:var(--dsw-alias-label-tertiary);font-size:10px;line-height:14px;text-align:center;font-variant-numeric:tabular-nums}',
'.uds-legend{display:flex;gap:12px;flex-wrap:wrap}',
'.uds-legendItem{display:inline-flex;align-items:center;gap:5px;color:var(--dsw-alias-label-secondary);font-size:12px;line-height:18px}',
'.uds-legendDot{width:8px;height:8px;border-radius:2px}',
'.uds-sectionTitle{margin:0;font-size:13px;font-weight:600;line-height:20px}',
'.uds-table{border:1px solid var(--dsw-alias-border-l2);border-radius:10px;overflow:hidden;background:var(--dsw-alias-bg-layer-3)}',
'.uds-table table{width:100%;border-collapse:collapse;font-size:12px;line-height:18px}',
'.uds-table th{color:var(--dsw-alias-label-tertiary);font-weight:500;font-size:11px;line-height:17px;text-align:left;padding:8px 12px;border-bottom:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1)}',
'.uds-table td{padding:8px 12px;border-bottom:1px solid var(--dsw-alias-border-l2);font-variant-numeric:tabular-nums;white-space:nowrap}',
'.uds-table tr:last-child td{border-bottom:0}',
'.uds-num{font-family:var(--ds-font-family-code);font-size:12px;line-height:18px}',
'.uds-cellMain{color:var(--dsw-alias-label-primary);max-width:220px;overflow:hidden;text-overflow:ellipsis}',
'.uds-cellSub{color:var(--dsw-alias-label-tertiary);font-size:11px;margin-left:6px}',
'@media (prefers-reduced-motion:no-preference){.uds-seg{transition:height .14s var(--ds-ease-in-out)}}',
].join('\n')

const dicts = {
  en: {
    nav: 'Usage Stats',
    total: 'Total tokens',
    cost: 'Est. cost',
    calls: 'Requests',
    sessions: 'Sessions',
    hitRate: 'Cache hit',
    refresh: 'Refresh',
    refreshing: 'Refreshing…',
    scannedAt: 'Last scanned',
    rangeAll: 'All',
    rangeWeek: '7 days',
    rangeMonth: '30 days',
    legendUncached: 'Uncached in',
    legendCacheRead: 'Cache read',
    legendCacheWrite: 'Cache write',
    legendOutput: 'Output',
    empty: 'No usage data yet.',
    tableSession: 'Session',
    tableModel: 'Model',
    tableTokens: 'Tokens',
    tableCost: 'Cost',
    tableActivity: 'Last activity',
    loading: 'Loading…',
  },
  zh: {
    nav: '用量统计',
    total: '总 tokens',
    cost: '估算花费',
    calls: '请求数',
    sessions: '会话数',
    hitRate: '缓存命中率',
    refresh: '刷新',
    refreshing: '刷新中…',
    scannedAt: '最后扫描',
    rangeAll: '全部',
    rangeWeek: '近 7 天',
    rangeMonth: '近 30 天',
    legendUncached: '未缓存输入',
    legendCacheRead: '缓存读',
    legendCacheWrite: '缓存写',
    legendOutput: '输出',
    empty: '暂无用量数据。',
    tableSession: '会话',
    tableModel: '模型',
    tableTokens: 'Tokens',
    tableCost: '花费',
    tableActivity: '最后活动',
    loading: '加载中…',
  },
}

// ── 格式化（tokens 与官方 stats strip 同款 K/M/B 缩写） ──
function formatTokens(n) {
  const scaled = (v) => (v >= 100 ? String(Math.round(v)) : String(Math.round(v * 10) / 10))
  if (n < 1e3) return String(n)
  if (n < 1e6) return scaled(n / 1e3) + 'K'
  if (n < 1e9) return scaled(n / 1e6) + 'M'
  return scaled(n / 1e9) + 'B'
}

function formatCost(n) {
  if (n === null || n === undefined) return '—'
  if (n >= 1e3) return '$' + (n / 1e3).toFixed(2) + 'K'
  return '$' + n.toFixed(2)
}

function formatPct(rate) {
  if (rate === null || rate === undefined) return '—'
  return String(Math.round(rate * 100)) + '%'
}

function shortId(id) {
  return id && id.length > 12 ? id.slice(0, 8) + '…' + id.slice(-4) : id
}

function formatTime(ms) {
  if (!ms) return '—'
  const d = new Date(ms)
  const now = new Date()
  return d.toDateString() === now.toDateString()
    ? d.toLocaleTimeString()
    : d.toLocaleDateString() + ' ' + d.toLocaleTimeString()
}

// ── CSS 注入：与官方 client 插件同机制（直接操作 DOM，带 data-plugin 标记，
//    client-modules 会按 data-plugin 认领样式）。dsh 没有 ctx.styles 服务。
const CSS_TAG = '@huzhaigong/dsh-usage-dashboard/styles'
function injectStyles() {
  if (typeof document === 'undefined') return
  if (document.querySelector('style[data-plugin-css=' + JSON.stringify(CSS_TAG) + ']')) return
  const tag = document.createElement('style')
  tag.dataset.plugin = '@huzhaigong/dsh-usage-dashboard'
  tag.dataset.pluginCss = CSS_TAG
  tag.textContent = CSS
  document.head.appendChild(tag)
}

// ── 组件 ───────────────────────────────────────────────────
function Card({ label, value, sub }) {
  return React.createElement('div', { className: 'uds-card' },
    React.createElement('div', { className: 'uds-cardLabel' }, label),
    React.createElement('div', { className: 'uds-cardValue' }, value),
    sub ? React.createElement('div', { className: 'uds-cardSub' }, sub) : null,
  )
}

const CHART_SEGMENTS = [
  { key: 'uncachedInput', cls: 'uds-segUncached' },
  { key: 'cacheRead', cls: 'uds-segCacheRead' },
  { key: 'cacheWrite', cls: 'uds-segCacheWrite' },
  { key: 'output', cls: 'uds-segOutput' },
]

function TrendChart({ buckets, t }) {
  if (!buckets || buckets.length === 0) return null
  const max = Math.max.apply(null, buckets.map((b) => b.total))
  const bars = buckets.map((b) => {
    const parts = CHART_SEGMENTS
      .filter((s) => b[s.key] > 0)
      .map((s) => React.createElement('div', {
        key: s.key,
        className: 'uds-seg ' + s.cls,
        style: { height: (b[s.key] / b.total) * 100 + '%' },
      }))
    const title = b.key + ' · ' + formatTokens(b.total) + ' tokens'
    return React.createElement('div', { key: b.key, className: 'uds-barCol', title: title },
      React.createElement('div', { className: 'uds-barInner', style: { height: (b.total / max) * 100 + '%' } }, parts),
      React.createElement('div', { className: 'uds-barLabel' }, b.key.slice(5)),
    )
  })
  const legend = CHART_SEGMENTS.map((s) => React.createElement('span', { key: s.key, className: 'uds-legendItem' },
    React.createElement('span', { className: 'uds-legendDot ' + s.cls }),
    t('legend' + s.key[0].toUpperCase() + s.key.slice(1)),
  ))
  return React.createElement('div', { className: 'uds-chart' },
    React.createElement('div', { className: 'uds-bars' }, bars),
    React.createElement('div', { className: 'uds-legend' }, legend),
  )
}

function SessionTable({ sessions, t }) {
  const rows = sessions.slice(0, 15).map((s) => React.createElement('tr', { key: s.sessionId },
    React.createElement('td', { className: 'uds-cellMain', title: s.sessionId },
      shortId(s.sessionId),
      React.createElement('span', { className: 'uds-cellSub' }, s.workspace),
    ),
    React.createElement('td', null, String(s.calls)),
    React.createElement('td', { className: 'uds-num' }, formatTokens(s.total)),
    React.createElement('td', null, formatCost(s.costEstimateUsd)),
    React.createElement('td', null, formatTime(s.lastActivityAt)),
  ))
  return React.createElement('div', { className: 'uds-table' },
    React.createElement('table', null,
      React.createElement('thead', null, React.createElement('tr', null,
        React.createElement('th', null, t('tableSession')),
        React.createElement('th', null, t('calls')),
        React.createElement('th', null, t('tableTokens')),
        React.createElement('th', null, t('tableCost')),
        React.createElement('th', null, t('tableActivity')),
      )),
      React.createElement('tbody', null, rows),
    ),
  )
}

function ModelTable({ models, t }) {
  const rows = models.slice(0, 10).map((m) => React.createElement('tr', { key: m.provider + '/' + m.model },
    React.createElement('td', { className: 'uds-cellMain' }, m.model + ' · ' + m.provider),
    React.createElement('td', null, String(m.calls)),
    React.createElement('td', { className: 'uds-num' }, formatTokens(m.total)),
    React.createElement('td', null, formatPct(m.cacheHitRate)),
    React.createElement('td', null, formatCost(m.costEstimateUsd)),
  ))
  return React.createElement('div', { className: 'uds-table' },
    React.createElement('table', null,
      React.createElement('thead', null, React.createElement('tr', null,
        React.createElement('th', null, t('tableModel')),
        React.createElement('th', null, t('calls')),
        React.createElement('th', null, t('tableTokens')),
        React.createElement('th', null, t('hitRate')),
        React.createElement('th', null, t('tableCost')),
      )),
      React.createElement('tbody', null, rows),
    ),
  )
}

function UsageStatsSection(props) {
  const t = props.t
  const fetchOverview = props.fetch
  const refresh = props.refresh
  const [range, setRange] = React.useState('all')
  const [state, setState] = React.useState({ status: 'loading', data: null, error: null })
  const [refreshing, setRefreshing] = React.useState(false)

  const seqRef = React.useRef(0)
  const load = React.useCallback(async (r) => {
    const seq = ++seqRef.current
    try {
      const data = await fetchOverview(r)
      if (seqRef.current === seq) setState({ status: 'ready', data: data, error: null })
    } catch (err) {
      if (seqRef.current === seq) setState({ status: 'error', data: null, error: String((err && err.message) || err) })
    }
  }, [fetchOverview])

  React.useEffect(() => { load(range) }, [range, load])

  const onRefresh = async () => {
    setRefreshing(true)
    try {
      await refresh()
      await load(range)
    } catch (err) {
      setState({ status: 'error', data: null, error: String((err && err.message) || err) })
    } finally {
      setRefreshing(false)
    }
  }

  const s = state.data ? state.data.summary : null
  return React.createElement('div', { className: 'uds-root' },
    React.createElement('div', { className: 'uds-heading' },
      React.createElement('div', null,
        React.createElement('h3', null, t('nav')),
        React.createElement('div', { className: 'uds-caption' },
          t('scannedAt') + ': ' + (s && s.scannedAt ? formatTime(s.scannedAt) : '—'),
        ),
      ),
      React.createElement('div', { className: 'uds-toolbar' },
        React.createElement('div', { className: 'uds-segmented' },
          ['all', 'week', 'month'].map((r) => React.createElement('button', {
            key: r,
            type: 'button',
            'data-active': range === r,
            onClick: () => setRange(r),
          }, t('range' + r[0].toUpperCase() + r.slice(1)))),
        ),
        React.createElement('button', {
          type: 'button',
          className: 'uds-refresh',
          onClick: onRefresh,
          disabled: refreshing,
        }, refreshing ? t('refreshing') : t('refresh')),
      ),
    ),
    state.status === 'error'
      ? React.createElement('div', { className: 'uds-error' }, state.error)
      : state.status === 'loading'
        ? React.createElement('div', { className: 'uds-caption' }, t('loading'))
        : !s || s.calls === 0
          ? React.createElement('div', { className: 'uds-caption' }, t('empty'))
          : React.createElement(React.Fragment, null,
              React.createElement('div', { className: 'uds-cards' },
                React.createElement(Card, {
                  label: t('total'),
                  value: formatTokens(s.total),
                  sub: 'in ' + formatTokens(s.uncachedInput) + ' / out ' + formatTokens(s.output),
                }),
                React.createElement(Card, { label: t('cost'), value: formatCost(s.costEstimateUsd) }),
                React.createElement(Card, { label: t('calls'), value: String(s.calls) }),
                React.createElement(Card, { label: t('sessions'), value: String(s.sessions) }),
                React.createElement(Card, { label: t('hitRate'), value: formatPct(s.cacheHitRate) }),
              ),
              React.createElement(TrendChart, { buckets: state.data.buckets, t: t }),
              React.createElement('h4', { className: 'uds-sectionTitle' }, t('tableSession')),
              React.createElement(SessionTable, { sessions: state.data.sessions, t: t }),
              React.createElement('h4', { className: 'uds-sectionTitle' }, t('tableModel')),
              React.createElement(ModelTable, { models: state.data.models, t: t }),
            ),
  )
}

export function apply(ctx) {
  injectStyles()
  ctx.effect(() => ctx.locale.register(NS, dicts), '@huzhaigong/dsh-usage-dashboard: dictionaries')
  const t = ctx.locale.bind(NS)

  const rpc = ctx.connection.rpc
  // usageStats 远程方法都只收一个名为 args 的对象参数（refresh 无参）；
  // wire 上 payload.args 按参数名映射，对象参数需包在 { args: {...} } 里。
  const call = async (method, argsObj) => {
    const payload = argsObj === undefined ? { args: {} } : { args: { args: argsObj } }
    const result = await rpc.call('/api', 'usageStats/' + method, payload)
    if (!result.ok) {
      const code = result.error && result.error.code
      const message = result.error && result.error.message
      throw new Error(method + ' failed: ' + code + ': ' + message)
    }
    return result.value
  }
  const fetch = (range) => call('overview', { range })
  const refresh = () => call('refresh')

  ctx.slots.inject('settings.section', () => ctx.slots.register(
    {
      name: 'settings.section',
      id: 'usage-stats',
      order: 25,
      label: () => t('nav'),
      locale: NS,
      inject: () => ({ t: t, fetch: fetch, refresh: refresh }),
    },
    UsageStatsSection,
  ))
}