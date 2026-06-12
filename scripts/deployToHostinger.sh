#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
#  Manual one-command deploy to Hostinger
#  Run from Git Bash / WSL / macOS Terminal:
#
#    bash scripts/deployToHostinger.sh
#    # or pass password as argument (overrides prompt):
#    bash scripts/deployToHostinger.sh deltaDragon@786
#
#  Requires: sshpass  (apt install sshpass  /  brew install hudochenkov/sshpass/sshpass)
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

SSH_HOST="5.183.10.106"
SSH_PORT="65002"
SSH_USER="u469500580"
APP_DIR="\$HOME/gdc-app"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# ── Resolve password ──────────────────────────────────────────────────────────
SSH_PASS="${1:-}"
if [[ -z "$SSH_PASS" ]]; then
  read -rsp "Hostinger SSH password: " SSH_PASS
  echo
fi
if [[ -z "$SSH_PASS" ]]; then
  echo "ERROR: password is required." >&2; exit 1
fi

# ── Check sshpass is installed ────────────────────────────────────────────────
if ! command -v sshpass &>/dev/null; then
  echo "ERROR: sshpass not found."
  echo "  Ubuntu/WSL: sudo apt install sshpass"
  echo "  macOS:      brew install hudochenkov/sshpass/sshpass"
  exit 1
fi

SSH_CMD="sshpass -p \"$SSH_PASS\" ssh -p $SSH_PORT -o StrictHostKeyChecking=no -o ConnectTimeout=20 $SSH_USER@$SSH_HOST"
SCP_CMD="sshpass -p \"$SSH_PASS\" scp -P $SSH_PORT -o StrictHostKeyChecking=no -o ConnectTimeout=20"

echo ""
echo "═══════════════════════════════════════════════"
echo "  GDC → Hostinger  $(date '+%Y-%m-%d %H:%M:%S')"
echo "═══════════════════════════════════════════════"

# ── Step 1: Build + package ───────────────────────────────────────────────────
echo ""
echo ">>> [1/3] Building & packaging..."
cd "$ROOT"
node scripts/createDeployment.cjs
echo "    ✓ gdc-deploy.zip ready"

# ── Step 2: Upload ────────────────────────────────────────────────────────────
echo ""
echo ">>> [2/3] Uploading to Hostinger..."
eval "$SCP_CMD gdc-deploy.zip $SSH_USER@$SSH_HOST:~/gdc-deploy.zip"
echo "    ✓ Upload complete"

# ── Step 3: Remote deploy ─────────────────────────────────────────────────────
echo ""
echo ">>> [3/3] Deploying on server..."
eval "$SSH_CMD" << REMOTE
set -e

APP_DIR="$APP_DIR"
ZIP="\$HOME/gdc-deploy.zip"

echo "  → Backing up current deployment..."
if [ -d "\$APP_DIR" ]; then
  rm -rf "\${APP_DIR}_bak"
  mv "\$APP_DIR" "\${APP_DIR}_bak"
fi

echo "  → Extracting new build..."
mkdir -p "\$APP_DIR"
unzip -o "\$ZIP" -d "\$APP_DIR"
cd "\$APP_DIR"

echo "  → Installing production packages..."
npm install --omit=dev --no-optional 2>&1 | tail -6

echo "  → Generating Prisma client..."
npx prisma generate 2>&1 | tail -3

echo "  → Running DB migrations..."
npx prisma migrate deploy 2>&1 | tail -3 || true

echo "  → Restarting app..."
if command -v pm2 &>/dev/null; then
  pm2 restart gdc 2>/dev/null || pm2 start npm --name gdc -- start
  pm2 save
else
  pkill -f "next start" 2>/dev/null || true
  sleep 1
  nohup npm start >> "\$HOME/gdc.log" 2>&1 &
  disown
fi

rm -f "\$ZIP"
echo "  ✓ Done"
REMOTE

echo ""
echo "═══════════════════════════════════════════════"
echo "  ✅  Deployment complete!"
echo "═══════════════════════════════════════════════"
echo ""
