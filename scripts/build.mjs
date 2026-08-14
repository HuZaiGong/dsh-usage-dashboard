// build.mjs — esbuild 构建：host 半（node）与 client 半（browser）。
// @Remote 装饰器（TC39）由 esbuild 原生支持；构建前先安装 esbuild。
import { build } from 'esbuild'
import { mkdirSync } from 'node:fs'

mkdirSync(new URL('../dist/', import.meta.url), { recursive: true })

await build({
  entryPoints: [new URL('../lib/index.js', import.meta.url).pathname],
  outfile: new URL('../dist/index.js', import.meta.url).pathname,
  bundle: true,             // 打包内部模块（scan/aggregate/pricing）
  external: ['@deepseek-ai/dsh-typert-protocol'],
  format: 'esm',
  platform: 'node',
  target: 'node20',
  logLevel: 'info',
})

// client 半：dsh 的 client bundle 必须是 __ModuleLoader__.load 包装的 CJS factory。
// factory 内声明 var React = require('react')，让 lib/client.js 的裸 React 引用
// 在运行时由 __ModuleLoader__ 解析（react 是平台 seed 词，官方 client 插件同款用法）。
const clientBanner = `window.__ModuleLoader__.load({
	id: '@huzaigong/dsh-usage-dashboard',
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
		var React = require('react');
`

const clientFooter = `
		return module.exports;
	}
});
`

await build({
  entryPoints: [new URL('../lib/client.js', import.meta.url).pathname],
  outfile: new URL('../dist/client.js', import.meta.url).pathname,
  bundle: true,            // client 半需要打包（浏览器无 node 模块解析）
  format: 'cjs',           // factory 形式，exports 由 __ModuleLoader__ 物化时消费
  platform: 'browser',
  target: 'es2022',
  external: ['react'],     // react 由运行时模块表提供，不打进 bundle
  banner: { js: clientBanner },
  footer: { js: clientFooter },
  logLevel: 'info',
})

console.log('built dist/index.js + dist/client.js')
