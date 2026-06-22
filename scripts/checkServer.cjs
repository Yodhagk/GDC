'use strict';
/**
 * Uploads gdc-deploy.zip via SFTP and deploys to the correct Hostinger nodejs dir.
 */
const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');

const APPDIR = '/home/u469500580/domains/goldendollarconsulting.com/nodejs';
const ZIP_LOCAL  = path.join(__dirname, '..', 'gdc-deploy.zip');
const ZIP_REMOTE = '/home/u469500580/gdc-deploy.zip';

const conn = new Client();

conn.on('ready', () => {
  console.log('✓ SSH connected — uploading ZIP via SFTP...');

  conn.sftp((err, sftp) => {
    if (err) { console.error('SFTP error:', err.message); conn.end(); return; }

    const readStream  = fs.createReadStream(ZIP_LOCAL);
    const writeStream = sftp.createWriteStream(ZIP_REMOTE);

    writeStream.on('close', () => {
      console.log('✓ ZIP uploaded — running deploy script...');
      sftp.end();
      runDeploy();
    });
    writeStream.on('error', e => { console.error('Upload error:', e.message); conn.end(); });
    readStream.pipe(writeStream);

    // Show progress
    const total = fs.statSync(ZIP_LOCAL).size;
    let sent = 0;
    readStream.on('data', chunk => {
      sent += chunk.length;
      process.stdout.write(`\r  Uploading... ${(sent/1024).toFixed(0)}/${(total/1024).toFixed(0)} KB`);
    });
    readStream.on('end', () => process.stdout.write('\n'));
  });
});

function runDeploy() {
  const script = `
APPDIR="${APPDIR}"
ZIP="${ZIP_REMOTE}"

# ── Resolve npm/npx — Hostinger uses NVM ────────────────────────────────────
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" 2>/dev/null || true
# Activate the default/installed node version
nvm use default 2>/dev/null || nvm use node 2>/dev/null || true
# Add NVM bin path explicitly
NVM_NODE_PATH=$(ls -d "$NVM_DIR/versions/node/"*/bin 2>/dev/null | sort -V | tail -1 || true)
[ -n "$NVM_NODE_PATH" ] && export PATH="$NVM_NODE_PATH:$PATH"
NPM_BIN=$(command -v npm 2>/dev/null || true)
NPX_BIN=$(command -v npx 2>/dev/null || true)
NODE_BIN=$(command -v node 2>/dev/null || true)
echo "node: $NODE_BIN | npm: $NPM_BIN | npx: $NPX_BIN"

set -e

echo "=== Preserving .env files ==="
mkdir -p /tmp/gdc-env-bak
cp "$APPDIR/.env"       /tmp/gdc-env-bak/ 2>/dev/null || true
cp "$APPDIR/.env.local" /tmp/gdc-env-bak/ 2>/dev/null || true

echo "=== Extracting new ZIP into $APPDIR ==="
mkdir -p "$APPDIR"
unzip -o "$ZIP" -d "$APPDIR"

echo "=== Restoring .env files ==="
cp /tmp/gdc-env-bak/.env       "$APPDIR/" 2>/dev/null || true
cp /tmp/gdc-env-bak/.env.local "$APPDIR/" 2>/dev/null || true
rm -rf /tmp/gdc-env-bak

echo "=== Installing Linux packages ==="
cd "$APPDIR"
if [ -n "$NPM_BIN" ]; then
  "$NPM_BIN" install --omit=dev --no-optional 2>&1 | tail -5
else
  echo "WARN: npm not found — skipping npm install (node_modules must already exist)"
fi

echo "=== Generating Prisma client (Linux) ==="
PRISMA_BIN="$APPDIR/node_modules/.bin/prisma"
if [ -n "$NODE_BIN" ] && [ -f "$PRISMA_BIN" ]; then
  "$NODE_BIN" "$PRISMA_BIN" generate 2>&1 | tail -3
elif [ -n "$NPX_BIN" ]; then
  "$NPX_BIN" prisma generate 2>&1 | tail -3 || true
else
  echo "WARN: skipping prisma generate (node not in PATH)"
fi

echo "=== Triggering LiteSpeed restart ==="
mkdir -p "$APPDIR/tmp"
touch "$APPDIR/tmp/restart.txt"

echo "=== Verifying deployed content ==="
grep -o "Immigration\\|Tax\\|Global Partner\\|Success" "$APPDIR/.next/server/app/\\(marketing\\)/page.html" 2>/dev/null | head -5 || \
grep -o "Tax\\|Immigration" "$APPDIR/.next/server/app/index.html" 2>/dev/null | head -5 || \
echo "(page HTML not found — dynamic render)"

rm -f "$ZIP"
echo "=== Deploy complete — check hPanel: Node.js app should be running ==="
`;

  conn.exec(`bash -c '${script.replace(/'/g, "'\\''")}'`, (err, stream) => {
    if (err) { console.error('exec error:', err.message); conn.end(); return; }
    stream.on('data', d => process.stdout.write(d.toString()));
    stream.stderr.on('data', d => process.stdout.write('[E] ' + d.toString()));
    stream.on('close', () => { console.log('\nDone.'); conn.end(); });
  });
}

conn.on('error', e => { console.error('Connection error:', e.message); process.exit(1); });

conn.connect({
  host: '5.183.10.106', port: 65002,
  username: 'u469500580', password: 'deltaDragon@786',
  readyTimeout: 30000,
});
