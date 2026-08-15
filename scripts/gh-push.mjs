// gh-push.mjs — 可靠的 push 通道：github.com 直连可用时用 git push；不可达时自动改用
// gh api Git Data API 推送（api.github.com 通常可达，无需 github.com 网络）。
// 用法：
//   node scripts/gh-push.mjs                 # 提交所有未提交改动并推送（默认 message）
//   node scripts/gh-push.mjs "feat: xxx"     # 指定 commit message
// 前置：gh 已认证（gh auth status）。
import { readFileSync, existsSync } from 'node:fs'
import { execFileSync } from 'node:child_process'

const run = (cmd, args, opts = {}) => {
  try {
    const out = execFileSync(cmd, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], ...opts, timeout: opts.timeout || 15000 })
    return { ok: true, out: out.trim() }
  } catch (e) {
    return { ok: false, out: String(e.stderr || e.message).trim() }
  }
}

// 从 origin 推导 owner/repo（支持 https://github.com/x/y.git 与代理前缀）
const origin = run('git', ['remote', 'get-url', 'origin']).out
const m = origin.match(/(?:github\.com\/)([^/]+)\/([^/]+?)(?:\.git)?$/)
if (!m) { console.error('cannot parse origin:', origin); process.exit(1) }
const REPO = m[1] + '/' + m[2]
const message = process.argv[2] || 'chore: update'

// 1) 提交改动
const status = run('git', ['status', '--porcelain']).out
if (status) {
  run('git', ['add', '-A'])
  const cm = run('git', ['commit', '-m', message])
  if (!cm.ok) { console.error('commit failed:', cm.out); process.exit(1) }
  console.log('committed:', cm.out.split('\n')[0])
} else {
  console.log('no working-tree changes')
}

// 2) 本地是否领先远端
const ahead = run('git', ['rev-list', '--count', 'origin/main..HEAD']).out
if (ahead === '0') { console.log('already up to date'); process.exit(0) }
const localSha = run('git', ['rev-parse', 'HEAD']).out
console.log('local HEAD:', localSha, '(ahead', ahead + ')')

// 3) 先试直连 push（github.com 可达时最简）
const direct = run('git', ['push', 'origin', 'HEAD:main'], { timeout: 20000 })
if (direct.ok) { console.log('pushed via git:', direct.out.split('\n').pop()); process.exit(0) }
console.log('direct push unavailable, falling back to gh api:', direct.out.slice(0, 120))

// 4) 变更文件集合：本地领先 commit 的 diff（覆盖已提交未推送的 commit；工作区改动已在上一步提交）
const baseExists = run('git', ['rev-parse', '--verify', 'origin/main']).ok
let diffFiles = []
if (baseExists) {
  const diff = run('git', ['diff', '--name-status', 'origin/main..HEAD']).out
  diffFiles = diff.split('\\n').filter(Boolean).map((l) => l.split(/\t/).slice(-1)[0])
}
if (diffFiles.length === 0) {
  console.error('no file changes to push (diff origin/main..HEAD empty)')
  process.exit(1)
}
console.log('pushing', diffFiles.length, 'files via gh api')

// 5) gh api Git Data API 推送（api.github.com 可达即可）
const hostsFile = process.env.HOME + '/.config/gh/hosts.yml'
if (!existsSync(hostsFile)) { console.error('gh not authenticated'); process.exit(1) }
const tok = readFileSync(hostsFile, 'utf8').match(/oauth_token:\s*(\S+)/)?.[1]
if (!tok) { console.error('no oauth_token in gh hosts'); process.exit(1) }
const H = { Authorization: 'Bearer ' + tok, 'Content-Type': 'application/json', Accept: 'application/vnd.github+json' }
const api = async (method, path, body) => {
  const res = await fetch('https://api.github.com' + path, { method, headers: H, body: body ? JSON.stringify(body) : undefined })
  if (!res.ok) throw new Error(method + ' ' + path + ' -> ' + res.status + ': ' + (await res.text()).slice(0, 160))
  return res.json()
}

const files = diffFiles // 来自 diff origin/main..HEAD（覆盖已提交未推送的 commit）
const modeOf = (path) => {
  const ls = run('git', ['ls-files', '-s', path]).out
  const mm = ls.match(/^1\d{5}/)
  return mm ? (parseInt(mm[0], 8) & 0o111 ? '100755' : '100644') : '100644'
}
const baseRef = await api('GET', '/repos/' + REPO + '/git/ref/heads/main')
const baseCommit = await api('GET', '/repos/' + REPO + '/git/commits/' + baseRef.object.sha)
const tree = []
for (const p of files) {
  if (!p) continue
  if (existsSync(p)) {
    const blob = await api('POST', '/repos/' + REPO + '/git/blobs', { content: readFileSync(p).toString('base64'), encoding: 'base64' })
    tree.push({ path: p, mode: modeOf(p), type: 'blob', sha: blob.sha })
  } else {
    tree.push({ path: p, sha: null }) // 删除
  }
}
const newTree = await api('POST', '/repos/' + REPO + '/git/trees', { base_tree: baseCommit.tree.sha, tree })
const commit = await api('POST', '/repos/' + REPO + '/git/commits', { message, tree: newTree.sha, parents: [baseRef.object.sha] })
await api('PATCH', '/repos/' + REPO + '/git/refs/heads/main', { sha: commit.sha })
console.log('pushed via gh api:', commit.sha)
console.log('note: local and remote now diverge; run: git fetch && git reset --hard origin/main (when github.com reachable, or: git fetch https://gh-proxy.com/https://github.com/' + REPO + '.git origin/main)')