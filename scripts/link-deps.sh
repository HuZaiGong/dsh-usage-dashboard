#!/usr/bin/env bash
# Recreate the two critical module symlinks required for @Remote discovery.
#
# Why: the host-side api-gateway resolves remote methods through a private
# marker WeakMap owned by the *dsh installation's* copy of
# @deepseek-ai/dsh-typert-protocol, and cordis Service symbols must also come
# from the same cordis instance. A plain `pnpm install` in this directory
# replaces these symlinks with local pnpm copies, which breaks host-side
# discovery (the gateway sees zero methods). Re-run this script after every
# `pnpm install` (or `pnpm run link-deps`).
#
# It locates the dsh package root via `command -v dsh`; override with
# DSH_TREE=<path-to-dsh-package-root> if dsh is not on PATH.
set -euo pipefail
cd "$(dirname "$0")/.."

if [ -n "${DSH_TREE:-}" ]; then
  DSH_ROOT="$DSH_TREE"
else
  DSH_BIN="$(command -v dsh || true)"
  if [ -z "$DSH_BIN" ]; then
    echo "error: 'dsh' not on PATH — set DSH_TREE to the dsh package root" >&2
    exit 1
  fi
  DSH_REAL="$(readlink -f "$DSH_BIN")"
  DSH_ROOT="$(dirname "$(dirname "$DSH_REAL")")"
fi

SRC="$DSH_ROOT/node_modules/@deepseek-ai"
DST="node_modules/@deepseek-ai"
mkdir -p "$DST"

for pkg in cordis dsh-typert-protocol; do
  if [ ! -e "$SRC/$pkg" ]; then
    echo "error: $SRC/$pkg not found — wrong DSH_TREE?" >&2
    exit 1
  fi
  rm -rf "$DST/$pkg"
  ln -s "$SRC/$pkg" "$DST/$pkg"
  echo "linked $pkg -> $SRC/$pkg"
done

echo "ok: run 'pnpm build' (if needed) and restart dsh web"
