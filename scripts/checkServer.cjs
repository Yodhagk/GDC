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
set -e
APPDIR="${APPDIR}"
ZIP="${ZIP_REMOTE}"

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
npm install --omit=dev --no-optional 2>&1 | tail -5

echo "=== Generating Prisma client (Linux) ==="
npx prisma generate 2>&1 | tail -3

echo "=== Running DB migrations ==="
npx prisma migrate deploy 2>&1 | tail -3 || true

echo "=== Triggering LiteSpeed restart ==="
mkdir -p "$APPDIR/tmp"
touch "$APPDIR/tmp/restart.txt"

echo "=== Verifying deployed content ==="
grep -o "Immigration Services\\|Company Formation\\|USA VISA\\|IRS Compliance" "$APPDIR/.next/server/app/index.html" 2>/dev/null | head -5

rm -f "$ZIP"
echo "=== Deploy complete — restart app from hPanel with Node.js 18 ==="
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
