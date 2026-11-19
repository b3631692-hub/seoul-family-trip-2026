#!/bin/zsh
cd "$(dirname "$0")" || exit 1
open "http://localhost:4173"
if command -v node >/dev/null 2>&1; then
  exec node server.mjs
elif command -v python3 >/dev/null 2>&1; then
  exec python3 -m http.server 4173
else
  echo "請先安裝 Node.js 或 Python 3。"
  read -k 1
fi
