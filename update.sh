#!/usr/bin/env bash
# Thin wrapper so the whole thing is one command with no environment setup.
# Everything lives in update.py; see `./update.sh --help`.
set -euo pipefail
cd "$(dirname "$0")"

if command -v uv >/dev/null 2>&1; then
  exec uv run update.py "$@"
fi

echo "uv not found; falling back to python3 (update.py has no dependencies)" >&2
exec python3 update.py "$@"
