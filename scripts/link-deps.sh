#!/usr/bin/env bash
# OPTIONAL — link @deepseek-ai/dsh-typert-protocol (and cordis) from the running
# dsh installation tree into this checkout's node_modules.
#
# The plugin no longer needs this to work: @deepseek-ai/dsh-typert-protocol is a
# peerDependency, and dsh's profile resolution supplies the running installation's
# own module instance for every bare name declared as a peer. A plain
# `pnpm install` therefore installs no local copy that could shadow it (the repo
# sets autoInstallPeers: false).
#
# Keep using this script only when you load lib/index.js with plain Node outside
# dsh (debugging), where the dsh resolver is not in play.
#
# Note: this cannot work on the packaged desktop build — its dsh tree lives inside
# app.asar, and a symlink target inside an asar cannot be traversed by the OS.
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
