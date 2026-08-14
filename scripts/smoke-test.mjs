// smoke-test.mjs — 纯函数冒烟测试（CI 用）：不依赖 dsh 安装，不读真实会话。
// 覆盖：JSONL 解析、(turn,step) 去重、sumUsage 聚合、价格表成本估算。
import { extractUsage, sumUsage, bucketByDay } from '../lib/aggregate.js'
import { estimateCost } from '../lib/pricing.js'

let failures = 0
function eq(actual, expected, label) {
  if (actual !== expected) {
    failures++
    console.error('FAIL ' + label + ': expected ' + expected + ', got ' + actual)
  } else {
    console.log('ok   ' + label)
  }
}

const lines = [
  JSON.stringify({ type: 'assistant/message', time: 1700000000000, data: { turn: 0, step: 0, message: { source: { provider: 'deepseek', model: 'deepseek-v4' } }, usage: { inputTokens: 100, cacheReadTokens: 900, cacheWriteTokens: 0, outputTokens: 50 } } }),
  // 同一 (turn,step) 的 usage chunk 应覆盖前一条（后者胜出）
  JSON.stringify({ type: 'assistant/chunk', time: 1700000000001, data: { turn: 0, step: 0, chunk: { type: 'usage', usage: { inputTokens: 200, cacheReadTokens: 800, outputTokens: 60 } } } }),
  JSON.stringify({ type: 'assistant/message', time: 1700000000002, data: { turn: 1, step: 0, message: { source: { provider: 'deepseek', model: 'deepseek-v4' } }, usage: { inputTokens: 0, cacheReadTokens: 500, cacheWriteTokens: 100, outputTokens: 30 } } }),
  'not-json',
]

const records = extractUsage(lines)
eq(records.length, 2, 'dedup keeps 2 records (turn:0 step:0 overridden by chunk)')
eq(records[0].uncachedInput, 200, 'overridden uncachedInput=200')
eq(records[0].cacheRead, 800, 'overridden cacheRead=800')
eq(records[0].provider, 'deepseek', 'provider inherited from message.source')

const s = sumUsage(records)
eq(s.calls, 2, 'sum calls=2')
eq(s.uncachedInput, 200, 'sum uncachedInput=200')
eq(s.cacheRead, 1300, 'sum cacheRead=1300')
eq(s.cacheWrite, 100, 'sum cacheWrite=100')
eq(s.output, 90, 'sum output=90')

const cost = estimateCost(s, 'deepseek-v4')
const expect = (200 * 2.0 + 1300 * 0.5 + 100 * 2.5 + 90 * 8.0) / 1e6
eq(Math.abs(cost - expect) < 1e-12, true, 'cost estimate = ' + expect.toFixed(6) + ' USD')

const buckets = bucketByDay(records)
eq(buckets.length, 1, 'single-day bucketing')
eq(buckets[0].total, s.calls === 2 ? s.uncachedInput + s.cacheRead + s.cacheWrite + s.output : -1, 'bucket total matches')

if (failures > 0) {
  console.error(failures + ' failure(s)')
  process.exit(1)
}
console.log('smoke test passed')
