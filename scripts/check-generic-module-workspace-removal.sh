#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if rg -n "GenericModuleWorkspace" src --glob '!**/*.bak' >/dev/null 2>&1; then
  echo "[FAIL] Se encontraron referencias a GenericModuleWorkspace"
  rg -n "GenericModuleWorkspace" src --glob '!**/*.bak'
  exit 1
fi

echo "[OK] No hay referencias a GenericModuleWorkspace en src"
