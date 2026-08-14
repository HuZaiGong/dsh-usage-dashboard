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
import { join as join3 } from "node:path";
import { Remote, TypertRemoteService } from "@deepseek-ai/dsh-typert-protocol";

// lib/scan.js
import { execFileSync } from "node:child_process";
import { readdirSync, statSync, readFileSync as readFileSync2 } from "node:fs";
import { join as join2 } from "node:path";

// node_modules/.pnpm/fzstd@0.1.1/node_modules/fzstd/esm/index.mjs
var ab = ArrayBuffer;
var u8 = Uint8Array;
var u16 = Uint16Array;
var i16 = Int16Array;
var i32 = Int32Array;
var slc = function(v, s, e) {
  if (u8.prototype.slice)
    return u8.prototype.slice.call(v, s, e);
  if (s == null || s < 0)
    s = 0;
  if (e == null || e > v.length)
    e = v.length;
  var n = new u8(e - s);
  n.set(v.subarray(s, e));
  return n;
};
var fill = function(v, n, s, e) {
  if (u8.prototype.fill)
    return u8.prototype.fill.call(v, n, s, e);
  if (s == null || s < 0)
    s = 0;
  if (e == null || e > v.length)
    e = v.length;
  for (; s < e; ++s)
    v[s] = n;
  return v;
};
var cpw = function(v, t, s, e) {
  if (u8.prototype.copyWithin)
    return u8.prototype.copyWithin.call(v, t, s, e);
  if (s == null || s < 0)
    s = 0;
  if (e == null || e > v.length)
    e = v.length;
  while (s < e) {
    v[t++] = v[s++];
  }
};
var ec = [
  "invalid zstd data",
  "window size too large (>2046MB)",
  "invalid block type",
  "FSE accuracy too high",
  "match distance too far back",
  "unexpected EOF"
];
var err = function(ind, msg, nt) {
  var e = new Error(msg || ec[ind]);
  e.code = ind;
  if (Error.captureStackTrace)
    Error.captureStackTrace(e, err);
  if (!nt)
    throw e;
  return e;
};
var rb = function(d, b, n) {
  var i = 0, o = 0;
  for (; i < n; ++i)
    o |= d[b++] << (i << 3);
  return o;
};
var b4 = function(d, b) {
  return (d[b] | d[b + 1] << 8 | d[b + 2] << 16 | d[b + 3] << 24) >>> 0;
};
var rzfh = function(dat, w) {
  var n3 = dat[0] | dat[1] << 8 | dat[2] << 16;
  if (n3 == 3126568 && dat[3] == 253) {
    var flg = dat[4];
    var ss = flg >> 5 & 1, cc = flg >> 2 & 1, df = flg & 3, fcf = flg >> 6;
    if (flg & 8)
      err(0);
    var bt = 6 - ss;
    var db = df == 3 ? 4 : df;
    var di = rb(dat, bt, db);
    bt += db;
    var fsb = fcf ? 1 << fcf : ss;
    var fss = rb(dat, bt, fsb) + (fcf == 1 && 256);
    var ws = fss;
    if (!ss) {
      var wb = 1 << 10 + (dat[5] >> 3);
      ws = wb + (wb >> 3) * (dat[5] & 7);
    }
    if (ws > 2145386496)
      err(1);
    var buf = new u8((w == 1 ? fss || ws : w ? 0 : ws) + 12);
    buf[0] = 1, buf[4] = 4, buf[8] = 8;
    return {
      b: bt + fsb,
      y: 0,
      l: 0,
      d: di,
      w: w && w != 1 ? w : buf.subarray(12),
      e: ws,
      o: new i32(buf.buffer, 0, 3),
      u: fss,
      c: cc,
      m: Math.min(131072, ws)
    };
  } else if ((n3 >> 4 | dat[3] << 20) == 25481893) {
    return b4(dat, 4) + 8;
  }
  err(0);
};
var msb = function(val) {
  var bits = 0;
  for (; 1 << bits <= val; ++bits)
    ;
  return bits - 1;
};
var rfse = function(dat, bt, mal) {
  var tpos = (bt << 3) + 4;
  var al = (dat[bt] & 15) + 5;
  if (al > mal)
    err(3);
  var sz = 1 << al;
  var probs = sz, sym = -1, re = -1, i = -1, ht = sz;
  var buf = new ab(512 + (sz << 2));
  var freq = new i16(buf, 0, 256);
  var dstate = new u16(buf, 0, 256);
  var nstate = new u16(buf, 512, sz);
  var bb1 = 512 + (sz << 1);
  var syms = new u8(buf, bb1, sz);
  var nbits = new u8(buf, bb1 + sz);
  while (sym < 255 && probs > 0) {
    var bits = msb(probs + 1);
    var cbt = tpos >> 3;
    var msk = (1 << bits + 1) - 1;
    var val = (dat[cbt] | dat[cbt + 1] << 8 | dat[cbt + 2] << 16) >> (tpos & 7) & msk;
    var msk1fb = (1 << bits) - 1;
    var msv = msk - probs - 1;
    var sval = val & msk1fb;
    if (sval < msv)
      tpos += bits, val = sval;
    else {
      tpos += bits + 1;
      if (val > msk1fb)
        val -= msv;
    }
    freq[++sym] = --val;
    if (val == -1) {
      probs += val;
      syms[--ht] = sym;
    } else
      probs -= val;
    if (!val) {
      do {
        var rbt = tpos >> 3;
        re = (dat[rbt] | dat[rbt + 1] << 8) >> (tpos & 7) & 3;
        tpos += 2;
        sym += re;
      } while (re == 3);
    }
  }
  if (sym > 255 || probs)
    err(0);
  var sympos = 0;
  var sstep = (sz >> 1) + (sz >> 3) + 3;
  var smask = sz - 1;
  for (var s = 0; s <= sym; ++s) {
    var sf = freq[s];
    if (sf < 1) {
      dstate[s] = -sf;
      continue;
    }
    for (i = 0; i < sf; ++i) {
      syms[sympos] = s;
      do {
        sympos = sympos + sstep & smask;
      } while (sympos >= ht);
    }
  }
  if (sympos)
    err(0);
  for (i = 0; i < sz; ++i) {
    var ns = dstate[syms[i]]++;
    var nb = nbits[i] = al - msb(ns);
    nstate[i] = (ns << nb) - sz;
  }
  return [tpos + 7 >> 3, {
    b: al,
    s: syms,
    n: nbits,
    t: nstate
  }];
};
var rhu = function(dat, bt) {
  var i = 0, wc = -1;
  var buf = new u8(292), hb = dat[bt];
  var hw = buf.subarray(0, 256);
  var rc = buf.subarray(256, 268);
  var ri = new u16(buf.buffer, 268);
  if (hb < 128) {
    var _a2 = rfse(dat, bt + 1, 6), ebt = _a2[0], fdt = _a2[1];
    bt += hb;
    var epos = ebt << 3;
    var lb = dat[bt];
    if (!lb)
      err(0);
    var st1 = 0, st2 = 0, btr1 = fdt.b, btr2 = btr1;
    var fpos = (++bt << 3) - 8 + msb(lb);
    for (; ; ) {
      fpos -= btr1;
      if (fpos < epos)
        break;
      var cbt = fpos >> 3;
      st1 += (dat[cbt] | dat[cbt + 1] << 8) >> (fpos & 7) & (1 << btr1) - 1;
      hw[++wc] = fdt.s[st1];
      fpos -= btr2;
      if (fpos < epos)
        break;
      cbt = fpos >> 3;
      st2 += (dat[cbt] | dat[cbt + 1] << 8) >> (fpos & 7) & (1 << btr2) - 1;
      hw[++wc] = fdt.s[st2];
      btr1 = fdt.n[st1];
      st1 = fdt.t[st1];
      btr2 = fdt.n[st2];
      st2 = fdt.t[st2];
    }
    if (++wc > 255)
      err(0);
  } else {
    wc = hb - 127;
    for (; i < wc; i += 2) {
      var byte = dat[++bt];
      hw[i] = byte >> 4;
      hw[i + 1] = byte & 15;
    }
    ++bt;
  }
  var wes = 0;
  for (i = 0; i < wc; ++i) {
    var wt = hw[i];
    if (wt > 11)
      err(0);
    wes += wt && 1 << wt - 1;
  }
  var mb = msb(wes) + 1;
  var ts = 1 << mb;
  var rem = ts - wes;
  if (rem & rem - 1)
    err(0);
  hw[wc++] = msb(rem) + 1;
  for (i = 0; i < wc; ++i) {
    var wt = hw[i];
    ++rc[hw[i] = wt && mb + 1 - wt];
  }
  var hbuf = new u8(ts << 1);
  var syms = hbuf.subarray(0, ts), nb = hbuf.subarray(ts);
  ri[mb] = 0;
  for (i = mb; i > 0; --i) {
    var pv = ri[i];
    fill(nb, i, pv, ri[i - 1] = pv + rc[i] * (1 << mb - i));
  }
  if (ri[0] != ts)
    err(0);
  for (i = 0; i < wc; ++i) {
    var bits = hw[i];
    if (bits) {
      var code = ri[bits];
      fill(syms, i, code, ri[bits] = code + (1 << mb - bits));
    }
  }
  return [bt, {
    n: nb,
    b: mb,
    s: syms
  }];
};
var dllt = rfse(/* @__PURE__ */ new u8([
  81,
  16,
  99,
  140,
  49,
  198,
  24,
  99,
  12,
  33,
  196,
  24,
  99,
  102,
  102,
  134,
  70,
  146,
  4
]), 0, 6)[1];
var dmlt = rfse(/* @__PURE__ */ new u8([
  33,
  20,
  196,
  24,
  99,
  140,
  33,
  132,
  16,
  66,
  8,
  33,
  132,
  16,
  66,
  8,
  33,
  68,
  68,
  68,
  68,
  68,
  68,
  68,
  68,
  36,
  9
]), 0, 6)[1];
var doct = rfse(/* @__PURE__ */ new u8([
  32,
  132,
  16,
  66,
  102,
  70,
  68,
  68,
  68,
  68,
  36,
  73,
  2
]), 0, 5)[1];
var b2bl = function(b, s) {
  var len = b.length, bl = new i32(len);
  for (var i = 0; i < len; ++i) {
    bl[i] = s;
    s += 1 << b[i];
  }
  return bl;
};
var llb = /* @__PURE__ */ new u8((/* @__PURE__ */ new i32([
  0,
  0,
  0,
  0,
  16843009,
  50528770,
  134678020,
  202050057,
  269422093
])).buffer, 0, 36);
var llbl = /* @__PURE__ */ b2bl(llb, 0);
var mlb = /* @__PURE__ */ new u8((/* @__PURE__ */ new i32([
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  16843009,
  50528770,
  117769220,
  185207048,
  252579084,
  16
])).buffer, 0, 53);
var mlbl = /* @__PURE__ */ b2bl(mlb, 3);
var dhu = function(dat, out, hu) {
  var len = dat.length, ss = out.length, lb = dat[len - 1], msk = (1 << hu.b) - 1, eb = -hu.b;
  if (!lb)
    err(0);
  var st = 0, btr = hu.b, pos = (len << 3) - 8 + msb(lb) - btr, i = -1;
  for (; pos > eb && i < ss; ) {
    var cbt = pos >> 3;
    var val = (dat[cbt] | dat[cbt + 1] << 8 | dat[cbt + 2] << 16) >> (pos & 7);
    st = (st << btr | val) & msk;
    out[++i] = hu.s[st];
    pos -= btr = hu.n[st];
  }
  if (pos != eb || i + 1 != ss)
    err(0);
};
var dhu4 = function(dat, out, hu) {
  var bt = 6;
  var ss = out.length, sz1 = ss + 3 >> 2, sz2 = sz1 << 1, sz3 = sz1 + sz2;
  dhu(dat.subarray(bt, bt += dat[0] | dat[1] << 8), out.subarray(0, sz1), hu);
  dhu(dat.subarray(bt, bt += dat[2] | dat[3] << 8), out.subarray(sz1, sz2), hu);
  dhu(dat.subarray(bt, bt += dat[4] | dat[5] << 8), out.subarray(sz2, sz3), hu);
  dhu(dat.subarray(bt), out.subarray(sz3), hu);
};
var rzb = function(dat, st, out) {
  var _a2;
  var bt = st.b;
  var b0 = dat[bt], btype = b0 >> 1 & 3;
  st.l = b0 & 1;
  var sz = b0 >> 3 | dat[bt + 1] << 5 | dat[bt + 2] << 13;
  var ebt = (bt += 3) + sz;
  if (btype == 1) {
    if (bt >= dat.length)
      return;
    st.b = bt + 1;
    if (out) {
      fill(out, dat[bt], st.y, st.y += sz);
      return out;
    }
    return fill(new u8(sz), dat[bt]);
  }
  if (ebt > dat.length)
    return;
  if (btype == 0) {
    st.b = ebt;
    if (out) {
      out.set(dat.subarray(bt, ebt), st.y);
      st.y += sz;
      return out;
    }
    return slc(dat, bt, ebt);
  }
  if (btype == 2) {
    var b3 = dat[bt], lbt = b3 & 3, sf = b3 >> 2 & 3;
    var lss = b3 >> 4, lcs = 0, s4 = 0;
    if (lbt < 2) {
      if (sf & 1)
        lss |= dat[++bt] << 4 | (sf & 2 && dat[++bt] << 12);
      else
        lss = b3 >> 3;
    } else {
      s4 = sf;
      if (sf < 2)
        lss |= (dat[++bt] & 63) << 4, lcs = dat[bt] >> 6 | dat[++bt] << 2;
      else if (sf == 2)
        lss |= dat[++bt] << 4 | (dat[++bt] & 3) << 12, lcs = dat[bt] >> 2 | dat[++bt] << 6;
      else
        lss |= dat[++bt] << 4 | (dat[++bt] & 63) << 12, lcs = dat[bt] >> 6 | dat[++bt] << 2 | dat[++bt] << 10;
    }
    ++bt;
    var buf = out ? out.subarray(st.y, st.y + st.m) : new u8(st.m);
    var spl = buf.length - lss;
    if (lbt == 0)
      buf.set(dat.subarray(bt, bt += lss), spl);
    else if (lbt == 1)
      fill(buf, dat[bt++], spl);
    else {
      var hu = st.h;
      if (lbt == 2) {
        var hud = rhu(dat, bt);
        lcs += bt - (bt = hud[0]);
        st.h = hu = hud[1];
      } else if (!hu)
        err(0);
      (s4 ? dhu4 : dhu)(dat.subarray(bt, bt += lcs), buf.subarray(spl), hu);
    }
    var ns = dat[bt++];
    if (ns) {
      if (ns == 255)
        ns = (dat[bt++] | dat[bt++] << 8) + 32512;
      else if (ns > 127)
        ns = ns - 128 << 8 | dat[bt++];
      var scm = dat[bt++];
      if (scm & 3)
        err(0);
      var dts = [dmlt, doct, dllt];
      for (var i = 2; i > -1; --i) {
        var md = scm >> (i << 1) + 2 & 3;
        if (md == 1) {
          var rbuf = new u8([0, 0, dat[bt++]]);
          dts[i] = {
            s: rbuf.subarray(2, 3),
            n: rbuf.subarray(0, 1),
            t: new u16(rbuf.buffer, 0, 1),
            b: 0
          };
        } else if (md == 2) {
          _a2 = rfse(dat, bt, 9 - (i & 1)), bt = _a2[0], dts[i] = _a2[1];
        } else if (md == 3) {
          if (!st.t)
            err(0);
          dts[i] = st.t[i];
        }
      }
      var _b = st.t = dts, mlt = _b[0], oct = _b[1], llt = _b[2];
      var lb = dat[ebt - 1];
      if (!lb)
        err(0);
      var spos = (ebt << 3) - 8 + msb(lb) - llt.b, cbt = spos >> 3, oubt = 0;
      var lst = (dat[cbt] | dat[cbt + 1] << 8) >> (spos & 7) & (1 << llt.b) - 1;
      cbt = (spos -= oct.b) >> 3;
      var ost = (dat[cbt] | dat[cbt + 1] << 8) >> (spos & 7) & (1 << oct.b) - 1;
      cbt = (spos -= mlt.b) >> 3;
      var mst = (dat[cbt] | dat[cbt + 1] << 8) >> (spos & 7) & (1 << mlt.b) - 1;
      for (++ns; --ns; ) {
        var llc = llt.s[lst];
        var lbtr = llt.n[lst];
        var mlc = mlt.s[mst];
        var mbtr = mlt.n[mst];
        var ofc = oct.s[ost];
        var obtr = oct.n[ost];
        cbt = (spos -= ofc) >> 3;
        var ofp = 1 << ofc;
        var off = ofp + ((dat[cbt] | dat[cbt + 1] << 8 | dat[cbt + 2] << 16 | dat[cbt + 3] << 24) >>> (spos & 7) & ofp - 1);
        cbt = (spos -= mlb[mlc]) >> 3;
        var ml = mlbl[mlc] + ((dat[cbt] | dat[cbt + 1] << 8 | dat[cbt + 2] << 16) >> (spos & 7) & (1 << mlb[mlc]) - 1);
        cbt = (spos -= llb[llc]) >> 3;
        var ll = llbl[llc] + ((dat[cbt] | dat[cbt + 1] << 8 | dat[cbt + 2] << 16) >> (spos & 7) & (1 << llb[llc]) - 1);
        cbt = (spos -= lbtr) >> 3;
        lst = llt.t[lst] + ((dat[cbt] | dat[cbt + 1] << 8) >> (spos & 7) & (1 << lbtr) - 1);
        cbt = (spos -= mbtr) >> 3;
        mst = mlt.t[mst] + ((dat[cbt] | dat[cbt + 1] << 8) >> (spos & 7) & (1 << mbtr) - 1);
        cbt = (spos -= obtr) >> 3;
        ost = oct.t[ost] + ((dat[cbt] | dat[cbt + 1] << 8) >> (spos & 7) & (1 << obtr) - 1);
        if (off > 3) {
          st.o[2] = st.o[1];
          st.o[1] = st.o[0];
          st.o[0] = off -= 3;
        } else {
          var idx = off - (ll != 0);
          if (idx) {
            off = idx == 3 ? st.o[0] - 1 : st.o[idx];
            if (idx > 1)
              st.o[2] = st.o[1];
            st.o[1] = st.o[0];
            st.o[0] = off;
          } else
            off = st.o[0];
        }
        for (var i = 0; i < ll; ++i) {
          buf[oubt + i] = buf[spl + i];
        }
        oubt += ll, spl += ll;
        var stin = oubt - off;
        if (stin < 0) {
          var len = -stin;
          var bs = st.e + stin;
          if (len > ml)
            len = ml;
          for (var i = 0; i < len; ++i) {
            buf[oubt + i] = st.w[bs + i];
          }
          oubt += len, ml -= len, stin = 0;
        }
        for (var i = 0; i < ml; ++i) {
          buf[oubt + i] = buf[stin + i];
        }
        oubt += ml;
      }
      if (oubt != spl) {
        while (spl < buf.length) {
          buf[oubt++] = buf[spl++];
        }
      } else
        oubt = buf.length;
      if (out)
        st.y += oubt;
      else
        buf = slc(buf, 0, oubt);
    } else if (out) {
      st.y += lss;
      if (spl) {
        for (var i = 0; i < lss; ++i) {
          buf[i] = buf[spl + i];
        }
      }
    } else if (spl)
      buf = slc(buf, spl);
    st.b = ebt;
    return buf;
  }
  err(2);
};
var cct = function(bufs, ol) {
  if (bufs.length == 1)
    return bufs[0];
  var buf = new u8(ol);
  for (var i = 0, b = 0; i < bufs.length; ++i) {
    var chk = bufs[i];
    buf.set(chk, b);
    b += chk.length;
  }
  return buf;
};
function decompress(dat, buf) {
  var bufs = [], nb = +!buf;
  var bt = 0, ol = 0;
  for (; dat.length; ) {
    var st = rzfh(dat, nb || buf);
    if (typeof st == "object") {
      if (nb) {
        buf = null;
        if (st.w.length == st.u) {
          bufs.push(buf = st.w);
          ol += st.u;
        }
      } else {
        bufs.push(buf);
        st.e = 0;
      }
      for (; !st.l; ) {
        var blk = rzb(dat, st, buf);
        if (!blk)
          err(5);
        if (buf)
          st.e = st.y;
        else {
          bufs.push(blk);
          ol += blk.length;
          cpw(st.w, 0, blk.length);
          st.w.set(blk, st.w.length - blk.length);
        }
      }
      bt = st.b + st.c * 4;
    } else
      bt = st;
    dat = dat.subarray(bt);
  }
  return cct(bufs, ol);
}

// lib/scan.js
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
      const p = join2(dir, e.name);
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
    if (ws.isDirectory()) walk(join2(sessionsRoot, ws.name), ws.name);
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
function readSessionLogJs(file, onLine) {
  const out = decompress(new Uint8Array(readFileSync2(file)));
  const text = Buffer.from(out).toString("utf8");
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
function bucketByHour(records) {
  const buckets = /* @__PURE__ */ new Map();
  const keyOf = (ms) => {
    const d = new Date(ms);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const h = String(d.getHours()).padStart(2, "0");
    return y + "-" + m + "-" + day + " " + h + ":00";
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
function sortedEntries(table) {
  return Object.entries(table).sort((a, b) => b[0].length - a[0].length);
}
function lookupPrice(model, table = DEFAULT_PRICES) {
  if (!model) return null;
  const m = model.toLowerCase();
  for (const [key, price] of sortedEntries(table)) {
    if (m.includes(key)) return price;
  }
  return null;
}
function mergePrices(...tables) {
  return Object.assign({}, ...tables.filter(Boolean));
}
function loadConfigPrices(home) {
  try {
    const raw = JSON.parse(readFileSync(join(home, "usage-prices.json"), "utf8"));
    const out = {};
    for (const [key, v] of Object.entries(raw)) {
      const row = {
        uncachedInput: Number(v.uncachedInput ?? v.input ?? 0),
        cacheRead: Number(v.cacheRead ?? v.cache_read ?? 0),
        cacheWrite: Number(v.cacheWrite ?? v.cache_write ?? 0),
        output: Number(v.output ?? 0)
      };
      if (row.uncachedInput || row.cacheRead || row.cacheWrite || row.output) out[key.toLowerCase()] = row;
    }
    return out;
  } catch {
    return {};
  }
}
async function fetchModelsDev(timeoutMs = 5e3) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch("https://models.dev/api.json", { signal: ctrl.signal });
    if (!res.ok) return null;
    const data = await res.json();
    const table = {};
    for (const [id, m] of Object.entries(data)) {
      const c = m && m.cost;
      if (!c) continue;
      const row = {
        uncachedInput: Number(c.input ?? 0),
        cacheRead: Number(c.cache_read ?? 0),
        cacheWrite: Number(c.cache_write ?? 0),
        output: Number(c.output ?? 0)
      };
      if (row.uncachedInput || row.cacheRead || row.cacheWrite || row.output) table[id.toLowerCase()] = row;
    }
    return table;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
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
    const home = process.env.DSH_HOME || join3(homedir(), ".dsh");
    this.sessionsRoot = join3(home, "sessions");
    this.configPrices = loadConfigPrices(home);
    this.priceTable = mergePrices(DEFAULT_PRICES, this.configPrices);
    this.priceMeta = { source: Object.keys(this.configPrices).length ? "builtin+config" : "builtin", updatedAt: null };
    this._syncModelsDev().catch(() => {
    });
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
    this.ready = Promise.resolve().then(() => this.scan()).catch((err2) => ({ scanned: 0, changed: 0, removed: 0, ms: 0, error: String(err2 && err2.message || err2) }));
  }
  /** 扫描目录：增量重读变化文件、清理已删除会话。返回 { scanned, changed, removed, ms }。 */
  async scan() {
    const t0 = Date.now();
    const useCli = zstdAvailable();
    const readLog = useCli ? readSessionLog : readSessionLogJs;
    let files;
    try {
      files = discoverSessions(this.sessionsRoot);
    } catch (err2) {
      return { scanned: 0, changed: 0, removed: 0, ms: Date.now() - t0, error: String(err2 && err2.message || err2) };
    }
    const { changed, next, removed } = diffChanged(files, this.cache);
    for (const f of changed) {
      const lines = [];
      try {
        readLog(f.path, (line) => lines.push(line));
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
    return { scanned: files.length, changed: changed.length, removed: removed.length, ms: Date.now() - t0, decoder: useCli ? "cli" : "js" };
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
    const costUsd = all.reduce((acc, r) => acc + (estimateCost(r, r.model, this.priceTable) || 0), 0);
    const times = all.map((r) => r.atMs).filter(Boolean);
    const unpriced = /* @__PURE__ */ new Set();
    for (const r of all) {
      if (r.model && !lookupPrice(r.model, this.priceTable)) unpriced.add(r.model);
    }
    const sessionsList = this.sessionsList(range, now);
    return {
      range,
      summary: {
        sessions: sessionsList.length,
        subagentSessions: sessionsList.filter((s) => s.delegationDepth > 0).length,
        ...summary,
        costEstimateUsd: costUsd,
        unpricedModels: unpriced.size,
        priceSource: this.priceMeta.source,
        firstActivityAt: times.length ? Math.min(...times) : null,
        lastActivityAt: times.length ? Math.max(...times) : null,
        scannedAt: this.scannedAt
      },
      buckets: range === "day" ? bucketByHour(all) : bucketByDay(all),
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
    const price = await this._syncModelsDev();
    return { ...await this.scan(), price };
  }
  /** 后台拉取 models.dev 价格表；失败静默保留现有表。 */
  async _syncModelsDev() {
    const remote = await fetchModelsDev();
    if (remote && Object.keys(remote).length) {
      this.priceTable = mergePrices(DEFAULT_PRICES, remote, this.configPrices);
      this.priceMeta = { source: "models.dev", updatedAt: Date.now(), models: Object.keys(remote).length };
    }
    return this.priceMeta;
  }
  sessionsList(range = "all", now = Date.now()) {
    return [...this.sessions.entries()].map(([sessionId, { meta, records }]) => {
      const delegationDepth = meta.delegationDepth || 0;
      const rs = range && range !== "all" ? filterByRange(records, range, now) : records;
      const s = sumUsage(rs);
      const costUsd = rs.reduce((acc, r) => acc + (estimateCost(r, r.model, this.priceTable) || 0), 0);
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
var name = "@huzaigong/dsh-usage-dashboard";
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
